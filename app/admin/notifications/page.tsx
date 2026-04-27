"use client";

import { useCallback } from "react";
import {
  Bell, CheckCheck, RefreshCw, AlertCircle,
  Loader2, BellOff, Info, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { useNotificationContext } from "@/app/lib/NotificationContext";
import type { NotificationType, NotificationResponseDto } from "@/app/lib/types";

// ─── Icon & colour per notification type ─────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; bg: string; color: string; label: string }
> = {
  ISSUE_CREATED:   { icon: <Bell size={18} />,         bg: "bg-blue-50",    color: "text-blue-600",    label: "New Issue"     },
  ISSUE_COMMENTED: { icon: <Info size={18} />,         bg: "bg-violet-50",  color: "text-violet-600",  label: "Comment"       },
  ISSUE_RESOLVED:  { icon: <CheckCircle2 size={18} />, bg: "bg-emerald-50", color: "text-emerald-600", label: "Resolved"      },
  ISSUE_ASSIGNED:  { icon: <AlertCircle size={18} />,  bg: "bg-amber-50",   color: "text-amber-600",   label: "Assigned"      },
  ISSUE_RESENT:    { icon: <RefreshCw size={18} />,    bg: "bg-orange-50",  color: "text-orange-600",  label: "Resent"        },
  GENERAL:         { icon: <AlertTriangle size={18} />,bg: "bg-[#21130D]/10",color:"text-[#21130D]",   label: "General Alert" },
};

function fmt(dateStr: string) {
  const d = new Date(dateStr);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60_000)  return "Just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Single notification row ──────────────────────────────────────────────────

function NotifRow({
  notif,
  onRead,
}: {
  notif: NotificationResponseDto;
  onRead: (id: number) => void;
}) {
  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.GENERAL;

  return (
    <div
      onClick={() => !notif.isRead && onRead(notif.id)}
      className={`group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm ${
        notif.isRead
          ? "border-transparent bg-white opacity-70"
          : "border-[var(--accent)]/20 bg-[var(--accent)]/[0.03] hover:border-[var(--accent)]/30"
      }`}
    >
      {/* Icon */}
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ${cfg.color}`}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
              {cfg.label}
            </span>
            <p className={`mt-0.5 text-sm font-bold leading-snug ${notif.isRead ? "text-[var(--muted)]" : "text-[var(--foreground)]"}`}>
              {notif.message}
            </p>
          </div>
          {!notif.isRead && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
          )}
        </div>
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
          {fmt(notif.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminNotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markRead,
    markAllRead,
    refetch,
  } = useNotificationContext();

  const handleMarkAll = useCallback(async () => {
    await markAllRead();
  }, [markAllRead]);

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl">

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-[var(--foreground)]">Notifications</h2>
            {unreadCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-xs font-black text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            {isLoading
              ? "Loading…"
              : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""} · ${unreadCount} unread`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
          <button
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={refetch} className="rounded-lg bg-white px-3 py-1 text-xs shadow-sm transition hover:bg-red-50">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-4">
              <div className="h-11 w-11 animate-pulse rounded-xl bg-[var(--border)]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-[var(--border)]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--border)]" />
                <div className="h-2.5 w-20 animate-pulse rounded bg-[var(--border)]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && notifications.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--muted)]">
            <BellOff size={28} />
          </div>
          <p className="text-[15px] font-black text-[var(--foreground)]">All caught up!</p>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">No notifications at this time.</p>
        </div>
      )}

      {/* Unread group */}
      {!isLoading && notifications.some((n) => !n.isRead) && (
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
            Unread · {unreadCount}
          </p>
          <div className="space-y-2">
            {notifications
              .filter((n) => !n.isRead)
              .map((n) => (
                <NotifRow key={n.id} notif={n} onRead={markRead} />
              ))}
          </div>
        </div>
      )}

      {/* Read group */}
      {!isLoading && notifications.some((n) => n.isRead) && (
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
            Earlier
          </p>
          <div className="space-y-2">
            {notifications
              .filter((n) => n.isRead)
              .map((n) => (
                <NotifRow key={n.id} notif={n} onRead={markRead} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useCallback } from "react";
import {
  Bell, Clock, CheckCircle2, X, RefreshCw,
  Info, AlertCircle, AlertTriangle, Loader2
} from "lucide-react";
import { useNotificationContext } from "@/app/lib/NotificationContext";
import type { NotificationType, NotificationResponseDto } from "@/app/lib/types";
import IssueDetailModal from "@/app/components/IssueDetailModal";

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

function extractIssueId(msg: string): number | null {
  const match = msg.match(/#(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const {
    notifications,
    unreadCount,
    isLoading,
    markRead,
    markAllRead,
    refetch,
  } = useNotificationContext();

  const filtered = activeTab === "all"
    ? notifications
    : notifications.filter((n) => !n.isRead);

  const handleMarkAll = useCallback(async () => {
    await markAllRead();
  }, [markAllRead]);

  return (
    <section className="animate-fade-in rounded-3xl border border-[var(--border)] bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Notifications</h2>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            Stay updated on your issue submissions and status changes.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--background)] px-4 py-2.5 text-sm font-bold text-[var(--foreground)] transition-all hover:bg-[var(--border)]"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex gap-1">
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 pb-3 text-sm font-black capitalize transition-all ${
                activeTab === tab
                  ? "text-[var(--accent)] after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:rounded-t-full after:bg-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab === "all" ? "All" : "Unread"}
              <span className={`ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-black ${activeTab === tab ? "bg-[var(--accent)] text-white" : "bg-[var(--background)] text-[var(--muted)]"}`}>
                {tab === "all" ? notifications.length : unreadCount}
              </span>
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="mb-3 text-xs font-black text-[var(--accent)] transition-all hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="mt-8 flex flex-col gap-4">
        {isLoading && notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--accent)]" size={40} />
            <p className="mt-4 text-sm font-bold text-[var(--muted)]">Syncing notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-[var(--border)] py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--muted)]">
              <Bell size={32} />
            </div>
            <p className="text-lg font-black text-[var(--foreground)]">No notifications here</p>
            <p className="mt-1 text-sm font-bold text-[var(--muted)]">
              {activeTab === "unread" ? "You've read all your messages!" : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.GENERAL;
            return (
              <div
                key={n.id}
                onClick={() => {
                  const id = extractIssueId(n.message);
                  if (id) setSelectedIssueId(id);
                  if (!n.isRead) markRead(n.id);
                }}
                className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition-all hover:shadow-md ${
                  n.isRead
                    ? "border-transparent bg-[var(--background)]/50 opacity-75"
                    : "border-[var(--accent)]/20 bg-[var(--accent)]/[0.03] hover:border-[var(--accent)]/30"
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ${cfg.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
                    </div>
                    <h3 className={`text-[15px] font-black leading-tight ${n.isRead ? "text-[var(--muted)]" : "text-[var(--foreground)]"}`}>
                      {n.message}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] opacity-70">
                      {fmt(n.createdAt)}
                    </p>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[var(--muted)] shadow-sm transition hover:text-[var(--accent)] hover:shadow"
                    title="Mark as read"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {selectedIssueId && (
        <IssueDetailModal 
          issueId={selectedIssueId} 
          onClose={() => setSelectedIssueId(null)} 
        />
      )}
    </section>
  );
}

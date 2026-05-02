"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Bell, CheckCheck, RefreshCw, AlertCircle,
  Loader2, BellOff, Info, AlertTriangle, CheckCircle2,
  X, Send, MessageCircle,
} from "lucide-react";
import { useNotificationContext } from "@/app/lib/NotificationContext";
import { fetchIssueThread, commentOnIssue, resolveIssue } from "@/app/lib/api";
import type { NotificationType, NotificationResponseDto, IssueThreadResponse } from "@/app/lib/types";

// ─── Notification type config ─────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; bg: string; color: string; label: string }
> = {
  ISSUE_CREATED:              { icon: <Bell size={18} />,         bg: "bg-blue-50",      color: "text-blue-600",    label: "New Issue"        },
  ISSUE_UPDATED:              { icon: <RefreshCw size={18} />,    bg: "bg-sky-50",       color: "text-sky-600",     label: "Updated"          },
  ISSUE_COMMENTED:            { icon: <Info size={18} />,         bg: "bg-violet-50",    color: "text-violet-600",  label: "Comment"          },
  ISSUE_RESOLVED:             { icon: <CheckCircle2 size={18} />, bg: "bg-emerald-50",   color: "text-emerald-600", label: "Resolved"         },
  ISSUE_ASSIGNED:             { icon: <AlertCircle size={18} />,  bg: "bg-amber-50",     color: "text-amber-600",   label: "Assigned"         },
  PRIORITY_OVERDUE:           { icon: <AlertTriangle size={18} />,bg: "bg-red-50",       color: "text-red-600",     label: "Priority Overdue" },
  PENDING_THRESHOLD_EXCEEDED: { icon: <AlertTriangle size={18} />,bg: "bg-orange-50",    color: "text-orange-600",  label: "Threshold Alert"  },
};

function fmt(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  if (diff < 60_000)    return "Just now";
  if (diff < 3600_000)  return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function extractIssueId(msg: string): number | null {
  const match = msg.match(/#(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// ─── Issue Thread Modal ───────────────────────────────────────────────────────

function IssueModal({
  issueId,
  onClose,
  onSuccess,
}: {
  issueId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [thread,     setThread]     = useState<IssueThreadResponse | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [tab,        setTab]        = useState<"comment" | "resolve">("comment");
  const [content,    setContent]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load thread on mount
  const load = useCallback(() => {
    setLoading(true);
    fetchIssueThread(issueId)
      .then(setThread)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load issue."))
      .finally(() => setLoading(false));
  }, [issueId]);

  // Run once on mount
  useEffect(() => { load(); }, [load]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (tab === "comment") {
        await commentOnIssue(issueId, { message: content });
      } else {
        await resolveIssue(issueId, { resolutionMessage: content });
      }
      onSuccess();
      onClose();
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl max-h-[90vh]">
        <div className="flex items-start justify-between border-b border-[var(--border)] p-6 shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Issue #{issueId}</p>
            {thread && <h3 className="mt-1 text-lg font-black text-[var(--foreground)]">{thread.issue.title}</h3>}
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 rounded-full p-2 text-[var(--muted)] hover:bg-[var(--background)]">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[var(--accent)]" size={28} /></div>}
          {error && <p className="text-sm font-bold text-red-500">{error}</p>}

          {thread && (
            <>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Description</p>
                <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">{thread.issue.description}</p>
              </div>

              {thread.comments.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-2">Comments</p>
                  <div className="space-y-2">
                    {thread.comments.map((c) => (
                      <div key={c.id} className="rounded-xl border border-[var(--border)] bg-white p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-[var(--foreground)]">{c.createdByEmail}</span>
                          <span className="text-[10px] font-bold text-[var(--muted)]">{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{c.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {thread.issue.status !== "RESOLVED" && (
                <>
                  <div className="flex gap-2">
                    <button onClick={() => setTab("comment")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${tab === "comment" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-[var(--background)]"}`}>
                      <MessageCircle size={13} /> Comment
                    </button>
                    <button onClick={() => setTab("resolve")}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${tab === "resolve" ? "bg-emerald-600 text-white" : "text-[var(--muted)] hover:bg-[var(--background)]"}`}>
                      <CheckCircle2 size={13} /> Mark Resolved
                    </button>
                  </div>
                  <textarea
                    value={content} onChange={(e) => setContent(e.target.value)} rows={3}
                    placeholder={tab === "comment" ? "Write a comment…" : "Describe the resolution…"}
                    className="w-full rounded-xl border border-[var(--border)] p-3 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10"
                  />
                  {submitError && <p className="text-xs font-bold text-red-500">{submitError}</p>}
                </>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3 border-t border-[var(--border)] p-4 shrink-0">
          {thread && thread.issue.status !== "RESOLVED" && (
            <button onClick={handleSubmit} disabled={submitting || !content.trim()}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition disabled:opacity-50 ${tab === "resolve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[var(--accent)] hover:opacity-90"}`}>
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {submitting ? "Submitting…" : tab === "comment" ? "Post Comment" : "Mark Resolved"}
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Notification row ─────────────────────────────────────────────────────────

function NotifRow({
  notif, onRead, onOpenIssue,
}: {
  notif: NotificationResponseDto;
  onRead: (id: number) => void;
  onOpenIssue: (id: number) => void;
}) {
  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.ISSUE_CREATED;
  return (
    <div
      onClick={() => {
        const id = extractIssueId(notif.message);
        if (id) onOpenIssue(id);
        if (!notif.isRead) onRead(notif.id);
      }}
      className={`group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all hover:shadow-sm ${
        notif.isRead
          ? "border-transparent bg-white opacity-70"
          : "border-[var(--accent)]/20 bg-[var(--accent)]/[0.03] hover:border-[var(--accent)]/30"
      }`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ${cfg.color}`}>
        {cfg.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
            <p className={`mt-0.5 text-sm font-bold leading-snug ${notif.isRead ? "text-[var(--muted)]" : "text-[var(--foreground)]"}`}>
              {notif.message}
            </p>
          </div>
          {!notif.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />}
        </div>
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{fmt(notif.createdAt)}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminNotificationsPage() {
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const {
    notifications, unreadCount, isLoading, error,
    markRead, markAllRead, refetch,
  } = useNotificationContext();

  const handleMarkAll = useCallback(async () => { await markAllRead(); }, [markAllRead]);

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl">
      {/* Header */}
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
            {isLoading ? "Loading…" : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""} · ${unreadCount} unread`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={handleMarkAll}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
          <button onClick={refetch} disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40">
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={refetch} className="rounded-lg bg-white px-3 py-1 text-xs shadow-sm">Retry</button>
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

      {/* Unread */}
      {!isLoading && notifications.some((n) => !n.isRead) && (
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Unread · {unreadCount}</p>
          <div className="space-y-2">
            {notifications.filter((n) => !n.isRead).map((n) => (
              <NotifRow key={n.id} notif={n} onRead={markRead} onOpenIssue={setSelectedIssueId} />
            ))}
          </div>
        </div>
      )}

      {/* Read */}
      {!isLoading && notifications.some((n) => n.isRead) && (
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Earlier</p>
          <div className="space-y-2">
            {notifications.filter((n) => n.isRead).map((n) => (
              <NotifRow key={n.id} notif={n} onRead={markRead} onOpenIssue={setSelectedIssueId} />
            ))}
          </div>
        </div>
      )}

      {selectedIssueId && (
        <IssueModal
          issueId={selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}

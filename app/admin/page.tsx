"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Activity, TrendingUp, ArrowUpRight, Clock,
  ListChecks, ShieldAlert, Megaphone, MessageCircle,
  RefreshCw, Loader2, X, CheckCircle2, Send,
} from "lucide-react";
import ActivityCalendar from "./components/ActivityCalendar";
import { useDashboard } from "@/app/lib/hooks";
import { useNotificationContext } from "@/app/lib/NotificationContext";
import { commentOnIssue, resolveIssue, fetchBroadcastFeed } from "@/app/lib/api";
import type {
  IssueResponseDto, IssuePriority, IssueStatus, NotificationResponseDto,
} from "@/app/lib/types";

// ─── Priority / Status helpers ────────────────────────────────────────────────

const PRIORITY_BADGE: Record<IssuePriority, string> = {
  LOW:      "bg-slate-100 text-slate-600",
  MEDIUM:   "bg-amber-100 text-amber-700",
  HIGH:     "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

const STATUS_BADGE: Record<IssueStatus, { cls: string; label: string }> = {
  PENDING:     { cls: "bg-amber-100 text-amber-700",   label: "Pending"     },
  IN_PROGRESS: { cls: "bg-blue-100 text-blue-700",     label: "In Progress" },
  RESOLVED:    { cls: "bg-emerald-100 text-emerald-700",label: "Resolved"   },
};

// ─── Manage Issue Modal ───────────────────────────────────────────────────────

interface ManageModalProps {
  issue: IssueResponseDto;
  onClose: () => void;
  onSuccess: () => void;
}

function ManageModal({ issue, onClose, onSuccess }: ManageModalProps) {
  const [tab, setTab]         = useState<"comment" | "resolve">("comment");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (tab === "comment") {
        await commentOnIssue(issue.id, { content });
      } else {
        await resolveIssue(issue.id, { resolutionMessage: content });
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Action failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [tab, content, issue.id, onSuccess, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border)] p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Issue #{issue.id} &bull; {issue.category}
            </p>
            <h3 className="mt-1 text-lg font-black text-[var(--foreground)] leading-snug">
              {issue.title}
            </h3>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 rounded-full p-2 text-[var(--muted)] hover:bg-[var(--background)]">
            <X size={18} />
          </button>
        </div>

        {/* Issue info bar */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-3">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${PRIORITY_BADGE[issue.priority]}`}>
            {issue.priority}
          </span>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${STATUS_BADGE[issue.status].cls}`}>
            {STATUS_BADGE[issue.status].label}
          </span>
          <span className="ml-auto text-[10px] font-bold text-[var(--muted)]">
            By {issue.createdByEmail}
          </span>
        </div>

        {/* Description */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-sm text-[var(--muted)] leading-relaxed italic">
            &ldquo;{issue.description || issue.title}&rdquo;
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-3">
          <button
            onClick={() => setTab("comment")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${tab === "comment" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-[var(--background)]"}`}
          >
            <MessageCircle size={13} /> Add Comment
          </button>
          {issue.status !== "RESOLVED" && (
            <button
              onClick={() => setTab("resolve")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${tab === "resolve" ? "bg-emerald-600 text-white" : "text-[var(--muted)] hover:bg-[var(--background)]"}`}
            >
              <CheckCircle2 size={13} /> Mark Resolved
            </button>
          )}
        </div>

        {/* Text area */}
        <div className="px-6 pb-2 pt-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder={tab === "comment" ? "Write your comment or action plan..." : "Describe how this issue was resolved..."}
            className="w-full rounded-xl border border-[var(--border)] p-3 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10"
          />
          {error && <p className="mt-1 text-xs font-bold text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-[var(--border)] p-6 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition disabled:opacity-50 ${tab === "resolve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[var(--accent)] hover:opacity-90"}`}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
            {loading ? "Submitting…" : tab === "comment" ? "Post Comment" : "Mark as Resolved"}
          </button>
          <button onClick={onClose} className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Widget ──────────────────────────────────────────────────────────────

interface StatWidgetProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: "emerald" | "amber" | "blue" | "indigo" | "rose";
  isLoading: boolean;
}

const COLOR_MAP: Record<StatWidgetProps["color"], string> = {
  emerald: "bg-emerald-50 text-emerald-600",
  amber:   "bg-amber-50  text-amber-600",
  indigo:  "bg-indigo-50 text-indigo-600",
  blue:    "bg-[#21130D]/10 text-[#21130D]",
  rose:    "bg-rose-50   text-rose-600",
};

function StatWidget({ label, value, icon, color, isLoading }: StatWidgetProps) {
  return (
    <article className="flex flex-1 items-center justify-between rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${COLOR_MAP[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-tight text-[var(--muted)]">{label}</p>
          {isLoading
            ? <div className="mt-1 h-5 w-10 animate-pulse rounded bg-[var(--border)]" />
            : <p className="mt-0.5 text-lg font-black text-[var(--foreground)]">{value}</p>
          }
        </div>
      </div>
    </article>
  );
}

// ─── Broadcast Card ───────────────────────────────────────────────────────────

function BroadcastCard({ issue, onSelect }: { issue: IssueResponseDto; onSelect: (i: IssueResponseDto) => void }) {
  return (
    <div className="group relative rounded-xl border border-dashed border-[var(--border)] p-3 transition-all hover:border-purple-200 hover:bg-purple-50/50">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className={`inline-block rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${PRIORITY_BADGE[issue.priority]}`}>
            {issue.priority}
          </span>
          <h4 className="mt-1.5 line-clamp-2 text-xs font-bold text-[var(--foreground)] leading-snug">{issue.title}</h4>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-tighter text-[var(--muted)]">
            {new Date(issue.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => onSelect(issue)}
          className="flex shrink-0 flex-col items-center gap-1 rounded-lg p-1.5 text-[var(--muted)] transition hover:bg-white hover:text-[var(--accent)]"
        >
          <MessageCircle size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Notification Feed Item ───────────────────────────────────────────────────

function NotifItem({ notif, onRead }: { notif: NotificationResponseDto; onRead: (id: number) => void }) {
  return (
    <div
      onClick={() => !notif.isRead && onRead(notif.id)}
      className={`cursor-pointer rounded-xl p-3 text-xs transition-all hover:bg-[var(--background)] ${notif.isRead ? "opacity-60" : "border border-[var(--accent)]/20 bg-[var(--accent)]/5"}`}
    >
      <p className={`font-bold ${notif.isRead ? "text-[var(--muted)]" : "text-[var(--foreground)]"}`}>
        {notif.message}
      </p>
      <p className="mt-1 text-[9px] font-medium uppercase tracking-wider text-[var(--muted)]">
        {new Date(notif.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard();
  const {
    notifications, unreadCount, isLoading: notifsLoading, markRead, refetch: refetchNotifs,
  } = useNotificationContext(); // no auto-poll on dashboard; layout already polls

  // Broadcast issues state
  const [broadcasts, setBroadcasts]             = useState<IssueResponseDto[]>([]);
  const [broadcastLoading, setBroadcastLoading] = useState(true);
  const [broadcastError, setBroadcastError]     = useState<string | null>(null);

  // Modals
  const [selectedIssue,     setSelectedIssue]     = useState<IssueResponseDto | null>(null);
  const [selectedBroadcast, setSelectedBroadcast] = useState<IssueResponseDto | null>(null);

  // Fetch broadcasts once on mount
  React.useEffect(() => {
    fetchBroadcastFeed()
      .then(setBroadcasts)
      .catch((e) => setBroadcastError(e instanceof Error ? e.message : "Failed to load broadcasts"))
      .finally(() => setBroadcastLoading(false));
  }, []);

  // Derived stats from DashboardResponse field names
  const stats = useMemo(() => ({
    resolved:   data?.totalResolved   ?? 0,
    inProgress: data?.totalInProgress ?? 0,
    pending:    data?.totalPending    ?? 0,
    received:   data?.totalReceived   ?? 0,
    submitted:  data?.totalSubmitted  ?? 0,
  }), [data]);

  // Most recent received issues for the urgent table
  const recentReceived = useMemo(() => (data?.recentIssues ?? []).slice(0, 5), [data]);

  const handleTakeAction = () => {
    const firstUrgent =
      recentReceived.find((i) => (i.priority === "HIGH" || i.priority === "CRITICAL") && i.status !== "RESOLVED") ??
      recentReceived[0];
    if (firstUrgent) setSelectedIssue(firstUrgent);
  };

  if (isLoading && !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--accent)]" />
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">Gathering intelligence…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative animate-fade-in space-y-8">

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          <p>Failed to load dashboard data.</p>
          <button onClick={refetch} className="flex items-center gap-2 rounded-lg bg-white px-3 py-1 shadow-sm transition hover:bg-red-50">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* ── Row 1: Recent Issues | Live Notifications | Stat Column ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* 1 — Recent Received Issues */}
        <section className="flex flex-col rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black leading-none text-[var(--foreground)]">Recent Reports</h3>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Issues sent to you</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refetch} disabled={isLoading} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:text-[var(--accent)] disabled:opacity-40">
                <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
              </button>
              <Link href="/admin/manage-issues">
                <button className="flex items-center gap-1 text-xs font-bold text-[var(--accent)] transition hover:scale-105">
                  View All <ArrowUpRight size={13} />
                </button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-2">
                  <div className="h-4 flex-1 animate-pulse rounded bg-[var(--border)]" />
                  <div className="h-6 w-16 animate-pulse rounded-lg bg-[var(--border)]" />
                </div>
              ))}
            </div>
          ) : recentReceived.length === 0 ? (
            <p className="py-10 text-center text-xs font-bold uppercase text-[var(--muted)]">No issues received yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                    <th className="pb-3">Issue</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {recentReceived.map((issue) => (
                    <tr key={issue.id} className="group transition-colors hover:bg-[var(--background)]">
                      <td className="py-3">
                        <p className="line-clamp-1 text-xs font-bold text-[var(--foreground)]">{issue.title}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${PRIORITY_BADGE[issue.priority]}`}>
                            {issue.priority}
                          </span>
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${STATUS_BADGE[issue.status].cls}`}>
                            {STATUS_BADGE[issue.status].label}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="rounded-lg border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 2 — Live Broadcast Feed */}
        <section className="flex flex-col rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                <Megaphone size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black leading-none text-[var(--foreground)]">Broadcast Feed</h3>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Public issues &amp; announcements</p>
              </div>
            </div>
            <Link href="/student/dashboard/public">
              <button className="flex items-center gap-1 text-xs font-bold text-[var(--accent)] transition hover:scale-105">
                View All <ArrowUpRight size={13} />
              </button>
            </Link>
          </div>

          {broadcastLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-[var(--border)]" />
              ))}
            </div>
          ) : broadcastError ? (
            <p className="py-10 text-center text-xs font-bold text-red-500">{broadcastError}</p>
          ) : broadcasts.length === 0 ? (
            <p className="py-10 text-center text-xs font-bold uppercase text-[var(--muted)]">No broadcast issues</p>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto">
              {broadcasts.slice(0, 4).map((bc) => (
                <BroadcastCard key={bc.id} issue={bc} onSelect={setSelectedBroadcast} />
              ))}
            </div>
          )}
        </section>

        {/* 3 — Stat Widgets Column */}
        <div className="flex flex-col gap-3">
          <StatWidget label="Resolved Issues"  value={stats.resolved}   icon={<CheckCircle2 size={20} />} color="emerald" isLoading={isLoading} />
          <StatWidget label="In Progress"       value={stats.inProgress} icon={<RefreshCw    size={20} />} color="blue"    isLoading={isLoading} />
          <StatWidget label="Pending"           value={stats.pending}    icon={<Clock        size={20} />} color="amber"   isLoading={isLoading} />
          <StatWidget label="Total Received"    value={stats.received}   icon={<Activity     size={20} />} color="indigo"  isLoading={isLoading} />
        </div>
      </div>

      {/* ── Row 2: Activity Calendar | Notifications Feed | Action Card ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* 4 — System Activity Calendar */}
        <section className="lg:col-span-2 flex min-h-[400px] flex-col rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black leading-none text-[var(--foreground)]">System Activity</h3>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Annual resolution tracker</p>
              </div>
            </div>
            <div className="flex gap-4">
              {[["emerald-500","Resolved"],["blue-400","In Progress"],["red-400","Pending"]].map(([col, label]) => (
                <div key={label} className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[var(--muted)]">
                  <span className={`h-2 w-2 rounded-full bg-${col}`} />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <ActivityCalendar />
          </div>
        </section>

        {/* 5 — Live Notifications + Action Card stacked */}
        <div className="flex flex-col gap-6">

          {/* Live Notifications */}
          <section className="flex flex-col rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-[var(--foreground)]">Live Alerts</h3>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Link href="/admin/notifications">
                <button className="text-[10px] font-bold text-[var(--accent)] hover:underline">View all</button>
              </Link>
            </div>

            {notifsLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-[var(--border)]" />)}
              </div>
            ) : notifications.length === 0 ? (
              <p className="py-6 text-center text-xs font-bold uppercase text-[var(--muted)]">No notifications</p>
            ) : (
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <NotifItem key={n.id} notif={n} onRead={markRead} />
                ))}
              </div>
            )}
          </section>

          {/* Action Card */}
          <div className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-[var(--accent)] p-6 text-white shadow-xl">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
            <div className="relative z-10">
              <div className="mb-3 inline-flex rounded-xl bg-white/10 p-3 backdrop-blur-md">
                <TrendingUp size={22} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Priority Action</p>
              <h4 className="mt-2 text-xl font-black leading-tight">
                {stats.pending > 0 ? `${stats.pending} Pending Issue${stats.pending !== 1 ? "s" : ""}` : "All Clear!"}
              </h4>
              <p className="mt-3 text-xs font-medium opacity-80 leading-relaxed">
                {stats.pending > 0
                  ? "There are pending issues requiring immediate attention or assignment."
                  : "No pending issues at the moment. Great work!"}
              </p>
              {stats.pending > 0 && (
                <button
                  onClick={handleTakeAction}
                  className="mt-5 flex w-full items-center justify-center rounded-xl bg-white py-3 text-sm font-black text-[var(--accent)] shadow-xl transition hover:scale-[1.02] active:scale-95"
                >
                  Take Action Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Manage Issue Modal ── */}
      {selectedIssue && (
        <ManageModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onSuccess={refetch}
        />
      )}

      {/* ── Broadcast Manage Modal (reuse ManageModal for commenting) ── */}
      {selectedBroadcast && (
        <ManageModal
          issue={selectedBroadcast}
          onClose={() => setSelectedBroadcast(null)}
          onSuccess={() => {
            fetchBroadcastFeed().then(setBroadcasts).catch(() => {});
          }}
        />
      )}
    </div>
  );
}

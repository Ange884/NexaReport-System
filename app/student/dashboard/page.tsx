"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Clock, AlertCircle, CheckCircle2, FileText,
  ArrowUpRight, Loader2, RefreshCw, MessageCircle, X,
} from "lucide-react";
import Link from "next/link";
import { fetchMyIssues, fetchIssueThread } from "@/app/lib/api";
import type {
  IssueDashboardResponse, IssueResponseDto, IssueStatus, IssueThreadResponse,
} from "@/app/lib/types";

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<IssueStatus, { label: string; cls: string }> = {
  PENDING:     { label: "Pending",     cls: "bg-amber-100 text-amber-600"   },
  IN_PROGRESS: { label: "In Progress", cls: "bg-violet-100 text-violet-600" },
  RESOLVED:    { label: "Resolved",    cls: "bg-emerald-100 text-emerald-600" },
};

function StatusBadge({ status }: { status: IssueStatus }) {
  const { label, cls } = statusConfig[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return <span className={`rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${cls}`}>{label}</span>;
}

// ─── Thread Modal ─────────────────────────────────────────────────────────────

function ThreadModal({ issue, onClose }: { issue: IssueResponseDto; onClose: () => void }) {
  const [thread,  setThread]  = useState<IssueThreadResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetchIssueThread(issue.id)
      .then(setThread)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load thread."))
      .finally(() => setLoading(false));
  }, [issue.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border)] p-6 shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Issue #{issue.id} &bull; {issue.category}
            </p>
            <h3 className="mt-1 text-lg font-black text-[var(--foreground)]">{issue.title}</h3>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 rounded-full p-2 text-[var(--muted)] hover:bg-[var(--background)]">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[var(--accent)]" size={28} />
            </div>
          )}
          {error && <p className="text-sm font-bold text-red-500">{error}</p>}
          {thread && (
            <>
              {/* Description */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Description</p>
                <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">{thread.issue.description}</p>
              </div>

              {/* Comments */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-3">
                  Comments ({thread.comments.length})
                </p>
                {thread.comments.length === 0 ? (
                  <p className="text-sm font-bold text-[var(--muted)] text-center py-4">No comments yet.</p>
                ) : (
                  <div className="space-y-3">
                    {thread.comments.map((c) => (
                      <div key={c.id} className="rounded-xl border border-[var(--border)] bg-white p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-[var(--foreground)]">{c.createdByEmail}</span>
                          <span className="text-[10px] font-bold text-[var(--muted)]">
                            {new Date(c.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{c.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border)] p-4 shrink-0">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-[var(--border)] py-2.5 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Priority colours ─────────────────────────────────────────────────────────

const priorityColors: Record<string, string> = {
  LOW: "text-slate-400", MEDIUM: "text-blue-500", HIGH: "text-orange-500", CRITICAL: "text-red-600",
};

// ─── KPI card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string; value: number; icon: React.ElementType;
  iconBg: string; iconColor: string; topColor: string; isLoading: boolean;
}

function KpiCard({ label, value, icon: Icon, iconBg, iconColor, topColor, isLoading }: KpiCardProps) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className={`absolute left-0 right-0 top-0 h-[3px] rounded-t-xl ${topColor}`} />
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        <Icon size={22} strokeWidth={2} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">{label}</p>
      {isLoading
        ? <div className="mt-1 h-8 w-14 animate-pulse rounded-lg bg-[var(--border)]" />
        : <p className="mt-1 text-[2rem] font-black leading-none tracking-tight text-[var(--foreground)]">{value}</p>
      }
    </article>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const [data,          setData]          = useState<IssueDashboardResponse | null>(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssueResponseDto | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await fetchMyIssues());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load your issues.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const kpiCards = [
    { label: "Total Issues", value: data?.total ?? 0,      icon: FileText,     iconBg: "bg-[#21130D]/10", iconColor: "text-[#21130D]",   topColor: "bg-[var(--accent)]" },
    { label: "Pending",      value: data?.pending ?? 0,    icon: Clock,        iconBg: "bg-amber-50",     iconColor: "text-amber-500",   topColor: "bg-amber-400"       },
    { label: "In Progress",  value: data?.inProgress ?? 0, icon: AlertCircle,  iconBg: "bg-violet-50",    iconColor: "text-violet-500",  topColor: "bg-violet-500"      },
    { label: "Resolved",     value: data?.resolved ?? 0,   icon: CheckCircle2, iconBg: "bg-emerald-50",   iconColor: "text-emerald-500", topColor: "bg-emerald-500"     },
  ];

  const recentIssues: IssueResponseDto[] = data?.issues.slice(0, 5) ?? [];

  return (
    <div className="relative animate-fade-in">

      {/* KPI Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => <KpiCard key={card.label} {...card} isLoading={isLoading} />)}
      </div>

      {/* Error banner */}
      {error && !isLoading && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
          <AlertCircle size={18} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={load} className="flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-black text-red-600 transition hover:bg-red-200">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* Recent Issues */}
      <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--foreground)] leading-none">Recent Issues</h3>
              <p className="mt-1 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Your latest submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} disabled={isLoading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40">
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>
            <Link href="/student/dashboard/issues">
              <button className="flex items-center gap-1 text-xs font-bold text-[var(--accent)] transition-all hover:scale-105">
                View All <ArrowUpRight size={14} />
              </button>
            </Link>
          </div>
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl p-3">
                <div className="h-4 flex-1 animate-pulse rounded bg-[var(--border)]" />
                <div className="h-4 w-20 animate-pulse rounded bg-[var(--border)]" />
                <div className="h-6 w-20 animate-pulse rounded-lg bg-[var(--border)]" />
                <div className="h-4 w-20 animate-pulse rounded bg-[var(--border)]" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && recentIssues.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
              <FileText size={28} strokeWidth={1.75} />
            </div>
            <p className="text-[15px] font-black text-[var(--foreground)]">No issues reported yet</p>
            <p className="mt-1 text-sm font-bold text-[var(--muted)]">Start by submitting your first issue</p>
            <Link href="/student/dashboard/submit">
              <button className="mt-5 rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-black text-white shadow-sm transition hover:brightness-110">
                Submit an Issue
              </button>
            </Link>
          </div>
        )}

        {/* Table */}
        {!isLoading && recentIssues.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                  <th className="pb-4 pr-4">Issue</th>
                  <th className="pb-4 pr-4">Category</th>
                  <th className="pb-4 pr-4">Priority</th>
                  <th className="pb-4 pr-4">Status</th>
                  <th className="pb-4 pr-4">Date</th>
                  <th className="pb-4 text-right">Thread</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recentIssues.map((issue) => (
                  <tr key={issue.id} className="group transition-colors hover:bg-[var(--background)]">
                    <td className="py-4 pr-4">
                      <span className="text-sm font-bold text-[var(--foreground)] line-clamp-1">{issue.title}</span>
                    </td>
                    <td className="py-4 pr-4 text-xs font-bold text-[var(--muted)] capitalize">{issue.category}</td>
                    <td className={`py-4 pr-4 text-xs font-black ${priorityColors[issue.priority] ?? ""}`}>{issue.priority}</td>
                    <td className="py-4 pr-4"><StatusBadge status={issue.status} /></td>
                    <td className="py-4 pr-4 text-xs font-bold text-[var(--muted)]">
                      {new Date(issue.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] ml-auto"
                      >
                        <MessageCircle size={12} /> Comments
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/student/dashboard/submit">
          <div className="group flex cursor-pointer items-center gap-4 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#21130D]/20 hover:shadow-md">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#21130D] text-white shadow-md transition group-hover:scale-105">
              <FileText size={20} />
            </div>
            <div>
              <p className="font-black text-[var(--foreground)]">Submit New Issue</p>
              <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">Report a problem to staff</p>
            </div>
            <ArrowUpRight size={16} className="ml-auto text-[var(--muted)] transition group-hover:text-[var(--accent)]" />
          </div>
        </Link>
        <Link href="/student/dashboard/issues">
          <div className="group flex cursor-pointer items-center gap-4 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#21130D]/20 hover:shadow-md">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] transition group-hover:bg-[var(--accent)] group-hover:text-white group-hover:scale-105">
              <Loader2 size={20} />
            </div>
            <div>
              <p className="font-black text-[var(--foreground)]">Track My Issues</p>
              <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">View status of all submissions</p>
            </div>
            <ArrowUpRight size={16} className="ml-auto text-[var(--muted)] transition group-hover:text-[var(--accent)]" />
          </div>
        </Link>
      </section>

      {/* Thread modal */}
      {selectedIssue && <ThreadModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />}
    </div>
  );
}

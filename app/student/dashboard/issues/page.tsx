"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDown, FolderOpen, RefreshCw, AlertCircle,
  Filter, MessageCircle, X, Loader2, CheckCircle2,
} from "lucide-react";
import { fetchMyIssues, fetchIssueThread } from "@/app/lib/api";
import type {
  IssueResponseDto, IssueStatus, IssuePriority, IssueThreadResponse,
} from "@/app/lib/types";

// ─── Badge helpers ────────────────────────────────────────────────────────────

const STATUS_CLS: Record<IssueStatus, string> = {
  PENDING:     "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED:    "bg-emerald-100 text-emerald-700",
};
const STATUS_LABEL: Record<IssueStatus, string> = {
  PENDING: "Pending", IN_PROGRESS: "In Progress", RESOLVED: "Resolved",
};
const PRIORITY_CLS: Record<IssuePriority, string> = {
  LOW: "bg-slate-100 text-slate-600", MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-orange-100 text-orange-700", CRITICAL: "bg-red-100 text-red-700",
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(date: string) {
  return new Date(date).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

// ─── Thread Modal ─────────────────────────────────────────────────────────────

function ThreadModal({ issue, onClose }: { issue: IssueResponseDto; onClose: () => void }) {
  const [thread, setThread]   = useState<IssueThreadResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

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
            <h3 className="mt-1 text-lg font-black text-[var(--foreground)] leading-snug">{issue.title}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${PRIORITY_CLS[issue.priority]}`}>
                {issue.priority}
              </span>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${STATUS_CLS[issue.status]}`}>
                {STATUS_LABEL[issue.status]}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 rounded-full p-2 text-[var(--muted)] hover:bg-[var(--background)]">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {thread && (
            <>
              {/* Description */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-2">Description</p>
                <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">{thread.issue.description}</p>
                <p className="mt-2 text-[10px] font-bold text-[var(--muted)]">Submitted {fmt(thread.issue.createdAt)}</p>
              </div>

              {/* Comments */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-3">
                  Comments ({thread.comments.length})
                </p>
                {thread.comments.length === 0 ? (
                  <p className="text-sm font-bold text-[var(--muted)] text-center py-6">No comments yet.</p>
                ) : (
                  <div className="space-y-3">
                    {thread.comments.map((c) => (
                      <div key={c.id} className="rounded-xl border border-[var(--border)] bg-white p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-[var(--foreground)]">{c.createdByEmail}</span>
                          <span className="text-[10px] font-bold text-[var(--muted)]">{fmtTime(c.createdAt)}</span>
                        </div>
                        <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">{c.message}</p>
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

// ─── Issue Card ───────────────────────────────────────────────────────────────

function IssueCard({ issue, onViewThread }: { issue: IssueResponseDto; onViewThread: (i: IssueResponseDto) => void }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-black text-[var(--foreground)] leading-snug">{issue.title}</h3>
            <span className="text-xs font-bold text-[var(--muted)]">#{issue.id}</span>
          </div>
          {issue.description && (
            <p className="mt-1 line-clamp-1 text-sm font-medium text-[var(--muted)]">{issue.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[var(--background)] px-2.5 py-1 text-xs font-bold capitalize text-[var(--muted)]">
              {issue.category.toLowerCase()}
            </span>
            <span className={`rounded-md px-2.5 py-1 text-xs font-black ${PRIORITY_CLS[issue.priority]}`}>
              {issue.priority} Priority
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Submitted {fmt(issue.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider ${STATUS_CLS[issue.status]}`}>
            {STATUS_LABEL[issue.status]}
          </span>
          <button
            onClick={() => onViewThread(issue)}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <MessageCircle size={13} /> Comments
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyIssuesPage() {
  const [issues,  setIssues]  = useState<IssueResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [selected, setSelected] = useState<IssueResponseDto | null>(null);

  const [keyword,  setKeyword]  = useState("");
  const [status,   setStatus]   = useState<IssueStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<IssuePriority | "ALL">("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyIssues();
      setIssues(data.issues);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load your issues.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const kw = keyword.toLowerCase();
    return issues.filter((i) => {
      const matchKw = !kw || i.title.toLowerCase().includes(kw) || i.description?.toLowerCase().includes(kw) || String(i.id).includes(kw);
      const matchStatus   = status   === "ALL" || i.status   === status;
      const matchPriority = priority === "ALL" || i.priority === priority;
      return matchKw && matchStatus && matchPriority;
    });
  }, [issues, keyword, status, priority]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">My Issues</h2>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            {loading ? "Loading…" : `${filtered.length} issue${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={load} className="rounded-lg bg-white px-3 py-1 text-xs shadow-sm transition hover:bg-red-50">Retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[180px]">
          <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={14} />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search by title or ID…"
            className="w-full rounded-xl border border-[var(--border)] py-2.5 pl-9 pr-4 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10" />
        </div>
        {([
          { value: status, onChange: (v: string) => setStatus(v as IssueStatus | "ALL"),
            options: [{ value: "ALL", label: "All Statuses" }, { value: "PENDING", label: "Pending" }, { value: "IN_PROGRESS", label: "In Progress" }, { value: "RESOLVED", label: "Resolved" }] },
          { value: priority, onChange: (v: string) => setPriority(v as IssuePriority | "ALL"),
            options: [{ value: "ALL", label: "All Priorities" }, { value: "LOW", label: "Low" }, { value: "MEDIUM", label: "Medium" }, { value: "HIGH", label: "High" }, { value: "CRITICAL", label: "Critical" }] },
        ] as { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }[]).map((sel, i) => (
          <div key={i} className="relative min-w-[150px]">
            <select value={sel.value} onChange={(e) => sel.onChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 pr-9 text-sm font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]">
              {sel.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={14} />
          </div>
        ))}
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-[var(--border)]" />)}
        </div>
      )}

      {!loading && filtered.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#21130D]/10 text-[#21130D]">
            <FolderOpen size={28} strokeWidth={1.75} />
          </div>
          <p className="text-[15px] font-black text-[var(--foreground)]">No issues found</p>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            {issues.length === 0 ? "You haven't submitted any issues yet." : "No issues match your current filters."}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-4">
          {filtered.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onViewThread={setSelected} />
          ))}
        </div>
      )}

      {selected && <ThreadModal issue={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

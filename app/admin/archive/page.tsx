"use client";

import { useCallback, useEffect, useState } from "react";
import { Archive, RefreshCw, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { fetchResolvedIssues } from "@/app/lib/api";
import type { IssueResponseDto, IssuePriority } from "@/app/lib/types";

const PRIORITY_CLS: Record<IssuePriority, string> = {
  LOW:      "bg-slate-100 text-slate-600",
  MEDIUM:   "bg-amber-100 text-amber-700",
  HIGH:     "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function ArchivePage() {
  const [issues,  setIssues]  = useState<IssueResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchResolvedIssues();
      setIssues(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load archived issues.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">Issue Archive</h2>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            {loading ? "Loading…" : `${issues.length} resolved issue${issues.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={load} className="rounded-lg bg-white px-3 py-1 text-xs shadow-sm transition hover:bg-red-50">
            Retry
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-[var(--border)]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--border)]" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--border)]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && issues.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
            <Archive size={28} />
          </div>
          <p className="text-[15px] font-black text-[var(--foreground)]">No archived issues yet</p>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">Resolved issues will appear here.</p>
        </div>
      )}

      {/* Issues list */}
      {!loading && issues.length > 0 && (
        <div className="flex flex-col gap-4">
          {issues.map((issue) => (
            <article
              key={issue.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15px] font-black text-[var(--foreground)]">{issue.title}</h3>
                    <span className="text-xs font-bold text-[var(--muted)]">#{issue.id}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[var(--background)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--muted)] capitalize">
                      {issue.category.toLowerCase()}
                    </span>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${PRIORITY_CLS[issue.priority]}`}>
                      {issue.priority}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--muted)]">
                      Resolved · {fmt(issue.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-emerald-100 px-3 py-1 text-[13px] font-black uppercase tracking-wider text-emerald-700">
                  Archived
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

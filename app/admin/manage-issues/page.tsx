"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown, Send, MessageSquare, X, Loader2,
  RefreshCw, AlertCircle, CheckCircle2, Filter,
} from "lucide-react";
import {
  fetchReceivedIssues,
  commentOnIssue,
  resolveIssue,
} from "@/app/lib/api";
import type {
  IssueResponseDto, IssueStatus, IssuePriority,
} from "@/app/lib/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PRIORITY_CLS: Record<IssuePriority, string> = {
  LOW:      "bg-slate-100 text-slate-600",
  MEDIUM:   "bg-amber-100 text-amber-700",
  HIGH:     "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

const STATUS_CLS: Record<IssueStatus, string> = {
  PENDING:     "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED:    "bg-emerald-100 text-emerald-700",
};

const STATUS_LABEL: Record<IssueStatus, string> = {
  PENDING:     "Pending",
  IN_PROGRESS: "In Progress",
  RESOLVED:    "Resolved",
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── Respond / Resolve Modal ──────────────────────────────────────────────────

function IssueModal({
  issue,
  onClose,
  onSuccess,
}: {
  issue: IssueResponseDto;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [tab, setTab]         = useState<"comment" | "resolve">("comment");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const submit = useCallback(async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      if (tab === "comment") {
        await commentOnIssue(issue.id, { message: content });
      } else {
        await resolveIssue(issue.id, { resolutionMessage: content });
      }
      onSuccess();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setLoading(false);
    }
  }, [tab, content, issue.id, onClose, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border)] p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Issue #{issue.id} &bull; {issue.category}
            </p>
            <h3 className="mt-1 text-lg font-black leading-snug text-[var(--foreground)]">
              {issue.title}
            </h3>
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 rounded-full p-2 text-[var(--muted)] hover:bg-[var(--background)]">
            <X size={18} />
          </button>
        </div>

        {/* Meta bar */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-3">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${PRIORITY_CLS[issue.priority]}`}>
            {issue.priority}
          </span>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${STATUS_CLS[issue.status]}`}>
            {STATUS_LABEL[issue.status]}
          </span>
          <span className="ml-auto text-[10px] font-bold text-[var(--muted)]">
            By {issue.createdByEmail}
          </span>
        </div>

        {/* Description */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-sm italic leading-relaxed text-[var(--muted)]">
            &ldquo;{issue.description || issue.title}&rdquo;
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-3">
          <button
            onClick={() => setTab("comment")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${tab === "comment" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-[var(--background)]"}`}
          >
            <MessageSquare size={13} /> Comment
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

        {/* Textarea */}
        <div className="px-6 pb-2 pt-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder={
              tab === "comment"
                ? "Write your comment or action plan…"
                : "Describe how this issue was resolved…"
            }
            className="w-full rounded-xl border border-[var(--border)] p-3 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10"
          />
          {error && <p className="mt-1 text-xs font-bold text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-[var(--border)] p-6 pt-4">
          <button
            onClick={submit}
            disabled={loading || !content.trim()}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition disabled:opacity-50 ${tab === "resolve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[var(--accent)] hover:opacity-90"}`}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
            {loading ? "Submitting…" : tab === "comment" ? "Post Comment" : "Mark as Resolved"}
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Issue Card ───────────────────────────────────────────────────────────────

function IssueCard({
  issue,
  onRespond,
}: {
  issue: IssueResponseDto;
  onRespond: (i: IssueResponseDto) => void;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-black text-[var(--foreground)]">{issue.title}</h3>
            <span className="text-xs font-bold text-[var(--muted)]">#{issue.id}</span>
          </div>
          <p className="mt-1 line-clamp-1 text-sm font-medium text-[var(--muted)]">
            {issue.description || "No description provided."}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[var(--background)] px-2.5 py-1 text-xs font-bold text-[var(--muted)] capitalize">
              {issue.category.toLowerCase()}
            </span>
            <span className={`rounded-md px-2.5 py-1 text-xs font-black ${PRIORITY_CLS[issue.priority]}`}>
              {issue.priority} Priority
            </span>
            <span className="text-[10px] font-bold text-[var(--muted)]">
              by {issue.createdByEmail}
            </span>
          </div>
        </div>
        <span className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider ${STATUS_CLS[issue.status]}`}>
          {STATUS_LABEL[issue.status]}
        </span>
      </div>

      <div className="h-px w-full bg-[var(--border)]" />

      {/* Bottom row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
          Created {fmt(issue.createdAt)}
        </span>
        <button
          onClick={() => onRespond(issue)}
          className="flex items-center gap-2 rounded-xl bg-[var(--accent-soft)] px-5 py-2 text-[13px] font-black text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
        >
          <MessageSquare size={15} />
          Respond
        </button>
      </div>
    </article>
  );
}

// ─── Inner page (needs Suspense for useSearchParams) ─────────────────────────

function ManageIssuesContent() {
  const searchParams = useSearchParams();
  const urlQuery     = searchParams.get("q") ?? "";

  const [issues,   setIssues]   = useState<IssueResponseDto[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [selected, setSelected] = useState<IssueResponseDto | null>(null);

  // Filters
  const [keyword,  setKeyword]  = useState(urlQuery);
  const [status,   setStatus]   = useState<IssueStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<IssuePriority | "ALL">("ALL");
  const [category, setCategory] = useState("ALL");

  useEffect(() => { if (urlQuery) setKeyword(urlQuery); }, [urlQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReceivedIssues();
      setIssues(data.issues);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load issues.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Dynamic category list from the data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(issues.map((i) => i.category)));
    return ["ALL", ...cats];
  }, [issues]);

  const filtered = useMemo(() => {
    const kw = keyword.toLowerCase();
    return issues.filter((issue) => {
      const matchKw = !kw ||
        issue.title.toLowerCase().includes(kw) ||
        issue.description?.toLowerCase().includes(kw) ||
        String(issue.id).includes(kw) ||
        issue.createdByEmail.toLowerCase().includes(kw);
      const matchStatus   = status === "ALL"   || issue.status === status;
      const matchPriority = priority === "ALL" || issue.priority === priority;
      const matchCat      = category === "ALL" || issue.category === category;
      return matchKw && matchStatus && matchPriority && matchCat;
    });
  }, [issues, keyword, status, priority, category]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">Manage Issues</h2>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            {loading ? "Loading…" : `${filtered.length} issue${filtered.length !== 1 ? "s" : ""} found`}
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={14} />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by title, email, ID…"
            className="w-full rounded-xl border border-[var(--border)] py-2.5 pl-9 pr-4 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10"
          />
        </div>

        {([
          {
            value: status, onChange: (v: string) => setStatus(v as IssueStatus | "ALL"),
            options: [
              { value: "ALL", label: "All Statuses" },
              { value: "PENDING",     label: "Pending"     },
              { value: "IN_PROGRESS", label: "In Progress" },
              { value: "RESOLVED",    label: "Resolved"    },
            ],
          },
          {
            value: priority, onChange: (v: string) => setPriority(v as IssuePriority | "ALL"),
            options: [
              { value: "ALL",      label: "All Priorities" },
              { value: "LOW",      label: "Low"            },
              { value: "MEDIUM",   label: "Medium"         },
              { value: "HIGH",     label: "High"           },
              { value: "CRITICAL", label: "Critical"       },
            ],
          },
          {
            value: category, onChange: (v: string) => setCategory(v),
            options: categories.map((c) => ({ value: c, label: c === "ALL" ? "All Categories" : c })),
          },
        ] as { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }[]).map((sel, i) => (
          <div key={i} className="relative min-w-[150px]">
            <select
              value={sel.value}
              onChange={(e) => sel.onChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 pr-9 text-sm font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              {sel.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={14} />
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-[var(--border)]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-[15px] font-bold text-[var(--muted)]">
            {issues.length === 0 ? "No issues have been sent to you yet." : "No issues match your filters."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onRespond={setSelected} />
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <IssueModal
          issue={selected}
          onClose={() => setSelected(null)}
          onSuccess={load}
        />
      )}
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function ManageIssuesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
        </div>
      }
    >
      <ManageIssuesContent />
    </Suspense>
  );
}

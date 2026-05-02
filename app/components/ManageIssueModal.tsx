import React, { useState, useCallback, useEffect } from "react";
import { X, Loader2, CheckCircle2, Send, MessageCircle, ListChecks } from "lucide-react";
import { commentOnIssue, resolveIssue, fetchIssueThread } from "@/app/lib/api";
import type { IssueResponseDto, IssuePriority, IssueStatus, IssueThreadResponse } from "@/app/lib/types";

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

interface ManageIssueModalProps {
  issueId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ManageIssueModal({ issueId, onClose, onSuccess }: ManageIssueModalProps) {
  const [thread, setThread] = useState<IssueThreadResponse | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const [tab, setTab]         = useState<"comment" | "resolve" | "view_comments">("comment");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    setInitLoading(true);
    fetchIssueThread(issueId)
      .then((t) => {
        setThread(t);
        setTab(t.issue.status === "PENDING" ? "comment" : "view_comments");
      })
      .catch(() => setInitError("Failed to load issue details."))
      .finally(() => setInitLoading(false));
  }, [issueId]);

  const handleSubmit = useCallback(async () => {
    if (!content.trim() || tab === "view_comments" || !thread) return;
    setLoading(true);
    setError(null);
    try {
      if (tab === "comment") {
        await commentOnIssue(issueId, { message: content });
      } else if (tab === "resolve") {
        await resolveIssue(issueId, { resolutionMessage: content });
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Action failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [tab, content, issueId, onSuccess, onClose, thread]);

  if (initLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-12 flex justify-center">
          <Loader2 size={32} className="animate-spin text-[var(--muted)]" />
        </div>
      </div>
    );
  }

  if (initError || !thread) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-12 text-center">
          <p className="text-red-500 font-bold">{initError || "Issue not found"}</p>
          <button onClick={onClose} className="mt-4 rounded-xl border border-[var(--border)] px-5 py-2 text-sm font-bold text-[var(--muted)]">Close</button>
        </div>
      </div>
    );
  }

  const issue = thread.issue;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border)] p-6 shrink-0">
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
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-3 shrink-0">
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
        <div className="px-6 pt-4 pb-2 shrink-0">
          <p className="text-sm text-[var(--muted)] leading-relaxed italic">
            &ldquo;{issue.description || issue.title}&rdquo;
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-3 shrink-0">
          <button
            onClick={() => setTab("view_comments")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${tab === "view_comments" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-[var(--background)]"}`}
          >
            <ListChecks size={13} /> View Comments
          </button>
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

        {/* Content Area */}
        <div className="px-6 pb-2 pt-3 overflow-y-auto">
          {tab === "view_comments" ? (
            <div className="min-h-[120px]">
              {thread.comments && thread.comments.length > 0 ? (
                <div className="space-y-3">
                  {thread.comments.map((c) => (
                    <div key={c.id} className="rounded-xl bg-[var(--background)] p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-[var(--foreground)]">{c.createdByEmail}</span>
                        <span className="text-[9px] font-medium text-[var(--muted)]">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-[var(--muted)]">{c.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-24 text-xs font-bold text-[var(--muted)]">
                  No comments yet.
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder={tab === "comment" ? "Write your comment or action plan..." : "Describe how this issue was resolved..."}
              className="w-full rounded-xl border border-[var(--border)] p-3 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10 shrink-0"
            />
          )}
          {error && <p className="mt-1 text-xs font-bold text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-[var(--border)] p-6 pt-4 shrink-0">
          {tab !== "view_comments" && (
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition disabled:opacity-50 ${tab === "resolve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[var(--accent)] hover:opacity-90"}`}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
              {loading ? "Submitting…" : tab === "comment" ? "Post Comment" : "Mark as Resolved"}
            </button>
          )}
          <button onClick={onClose} className="rounded-xl flex-1 border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
            {tab === "view_comments" ? "Close" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

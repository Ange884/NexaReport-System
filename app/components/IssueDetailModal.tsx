import React, { useEffect, useState } from "react";
import { X, Loader2, MessageCircle } from "lucide-react";
import { fetchIssueThread } from "@/app/lib/api";
import type { IssueThreadResponse, IssuePriority, IssueStatus } from "@/app/lib/types";

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

interface IssueDetailModalProps {
  issueId: number;
  onClose: () => void;
}

export default function IssueDetailModal({ issueId, onClose }: IssueDetailModalProps) {
  const [thread, setThread] = useState<IssueThreadResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchIssueThread(issueId)
      .then(setThread)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load issue details."))
      .finally(() => setLoading(false));
  }, [issueId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="flex w-full max-w-lg flex-col max-h-[90vh] rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border)] p-6 shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Issue #{issueId} {thread?.issue?.category ? `• ${thread.issue.category}` : ""}
            </p>
            {loading ? (
              <div className="mt-1 h-6 w-48 animate-pulse rounded bg-[var(--border)]" />
            ) : (
              <h3 className="mt-1 text-lg font-black text-[var(--foreground)] leading-snug">
                {thread?.issue.title || "Unknown Issue"}
              </h3>
            )}
          </div>
          <button onClick={onClose} className="ml-4 shrink-0 rounded-full p-2 text-[var(--muted)] hover:bg-[var(--background)]">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 shrink-0">
            <Loader2 size={32} className="animate-spin text-[var(--muted)]" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-sm font-bold text-red-500">
            {error}
          </div>
        ) : thread ? (
          <>
            {/* Info bar */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-6 py-3 shrink-0">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${PRIORITY_BADGE[thread.issue.priority]}`}>
                {thread.issue.priority}
              </span>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${STATUS_BADGE[thread.issue.status].cls}`}>
                {STATUS_BADGE[thread.issue.status].label}
              </span>
              <span className="ml-auto text-[10px] font-bold text-[var(--muted)]">
                {new Date(thread.issue.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Description */}
              <div>
                <h4 className="mb-2 text-xs font-black uppercase tracking-widest text-[var(--muted)]">Description</h4>
                <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">
                  {thread.issue.description || <span className="italic text-[var(--muted)]">No description provided.</span>}
                </p>
              </div>

              {/* Comments Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle size={14} className="text-[var(--muted)]" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Comments & Updates</h4>
                </div>
                
                {thread.comments && thread.comments.length > 0 ? (
                  <div className="space-y-3">
                    {thread.comments.map((c) => (
                      <div key={c.id} className="rounded-xl bg-[var(--background)] p-3 border border-[var(--border)]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-[var(--foreground)]">{c.createdByEmail}</span>
                          <span className="text-[9px] font-medium text-[var(--muted)]">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs font-medium text-[var(--foreground)]">{c.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center">
                    <p className="text-xs font-bold text-[var(--muted)]">No comments or updates yet.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}

        {/* Footer */}
        <div className="border-t border-[var(--border)] p-6 shrink-0">
          <button onClick={onClose} className="w-full rounded-xl bg-[var(--background)] px-5 py-3 text-sm font-bold text-[var(--foreground)] transition hover:bg-[#e2e8f0]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

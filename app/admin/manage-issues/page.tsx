"use client";
import { useMemo, useState, useEffect } from "react";
import { ChevronDown, Send, MessageSquare, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

type IssueStatus = "Pending" | "In Progress" | "Resolved";
type IssuePriority = "High" | "Medium" | "Low";
type IssueCategory = "Maintenance" | "ICT" | "Academic" | "Other";

type AdminIssue = {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  assignedTo: string;
  createdAt: string;
  comments: { author: string; text: string; timestamp: string }[];
};

const staticIssues: AdminIssue[] = [
  {
    id: "1",
    trackingId: "ISS-2026-0001",
    title: "Dorm corridor light not working",
    description: "Second floor corridor has no light for 3 days.",
    category: "Maintenance",
    priority: "High",
    status: "In Progress",
    assignedTo: "Facilities Team",
    createdAt: "2026-04-17",
    comments: [],
  },
];

const categories: (IssueCategory | "All")[] = [
  "All",
  "Maintenance",
  "ICT",
  "Academic",
  "Other",
];
const priorities: (IssuePriority | "All")[] = ["All", "High", "Medium", "Low"];
const statuses: (IssueStatus | "All")[] = [
  "All",
  "Pending",
  "In Progress",
  "Resolved",
];

const priorityClasses: Record<IssuePriority, string> = {
  High: "border-red-300 bg-red-50 text-red-700",
  Medium: "border-amber-300 bg-amber-50 text-amber-700",
  Low: "border-emerald-300 bg-emerald-50 text-emerald-700",
};

export default function ManageIssuesPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [keyword, setKeyword] = useState(q);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [issues, setIssues] = useState<AdminIssue[]>(staticIssues);
  
  // Response modal state
  const [selectedIssue, setSelectedIssue] = useState<AdminIssue | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (q) setKeyword(q);
  }, [q]);

  const handleRespond = (issue: AdminIssue) => {
    setSelectedIssue(issue);
    setAdminResponse("");
  };

  const handleUpdate = (id: string, updatedStatus: IssueStatus, assignTo: string) => {
    setIssues((prev) => 
      prev.map((issue) =>
        issue.id === id ? { ...issue, status: updatedStatus, assignedTo: assignTo } : issue
      )
    );
  };

  const submitResponse = () => {
    if (!selectedIssue || !adminResponse.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIssues(prev => prev.map(issue => 
        issue.id === selectedIssue.id 
          ? { 
              ...issue, 
              status: 'In Progress', 
              comments: [...issue.comments, { author: 'Admin', text: adminResponse, timestamp: 'Just now' }] 
            }
          : issue
      ));
      setSelectedIssue(null);
      setIsSubmitting(false);
    }, 1000);
  };

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const keywordMatch =
        issue.title.toLowerCase().includes(keyword.toLowerCase()) ||
        issue.description.toLowerCase().includes(keyword.toLowerCase()) ||
        issue.trackingId.toLowerCase().includes(keyword.toLowerCase());
      const categoryMatch = category === "All" || issue.category === category;
      const priorityMatch = priority === "All" || issue.priority === priority;
      const statusMatch = status === "All" || issue.status === status;
      return keywordMatch && categoryMatch && priorityMatch && statusMatch;
    });
  }, [issues, keyword, category, priority, status]);

  function updateIssue(id: string, updatedStatus: IssueStatus, 
    assignTo: string) {
    setIssues((prev) => {
      const updated = prev.map((issue) =>
        issue.id === id
          ? {
              ...issue,
              status: updatedStatus,
              assignedTo: assignTo,
            }
          : issue,
      );
      // saveIssues(updated); // Backend/Storage removed
      return updated;
    });
  }

  return (
    <section className="card p-8 rounded-3xl border border-[var(--border)] shadow-sm bg-[#f8f9fc]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">Manage Issues</h2>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            Search, filter, and resolve student concerns efficiently.
          </p>
        </div>
      </div>

      {/* import { ChevronDown } from "lucide-react"; */}

<div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4 bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">

  {/* Search */}
  <input
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    placeholder="Search keyword or ID..."
    className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-[15px] font-medium outline-none transition focus:border-[var(--accent)] md:col-span-2"
  />

  {/* Category */}
  <div className="relative w-full">
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value as typeof category)}
      className="appearance-none w-full rounded-xl border border-[var(--border)] px-4 pr-10 py-2.5 text-[15px] text-gray-500 font-medium outline-none transition focus:border-[var(--accent)]"
    >
      {categories.map((c) => (
        <option key={c} className="text-gray-500">{c}</option>
      ))}
    </select>

    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
  </div>

  {/* Priority + Status */}
  <div className="grid grid-cols-2 gap-4">

    {/* Priority */}
    <div className="relative w-full">
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as typeof priority)}
        className="appearance-none w-full rounded-xl border border-[var(--border)] px-4 pr-10 py-2.5 text-gray-500 text-[15px] font-medium outline-none transition focus:border-[var(--accent)]"
      >
        {priorities.map((p) => (
          <option key={p} className="text-gray-500">{p}</option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
    </div>

    {/* Status */}
    <div className="relative w-full">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as typeof status)}
        className="appearance-none w-full rounded-xl border border-[var(--border)] px-4 pr-10 py-2.5 text-gray-500 text-[15px] font-medium outline-none transition focus:border-[var(--accent)]"
      >
        {statuses.map((s) => (
          <option key={s} className="text-gray-500">
            {s}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
    </div>

  </div>
</div>

      <div className="mt-6 flex flex-col gap-4">
        {filteredIssues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--muted)]">
            <span className="text-[15px] font-bold">No issues found matching your filters.</span>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <article
              key={issue.id}
              className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              {/* Top Row: Title, ID, and Badges */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-black text-[var(--foreground)]">{issue.title}</h3>
                      <span className="text-xs font-bold text-gray-400">({issue.trackingId})</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-[var(--muted)] line-clamp-1">{issue.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-gray-600">
                        {issue.category}
                      </span>
                      <span className={`rounded-md px-2.5 py-1 ${priorityClasses[issue.priority]}`}>
                        {issue.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center">
                  <span className={`rounded-lg px-3 py-1 font-black text-[13px] uppercase tracking-wider ${
                    issue.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' :
                    issue.status === 'In Progress' ? 'bg-[#21130D]/10 text-[#21130D]' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              </div>

              <div className="h-[1px] w-full bg-gray-100"></div>

              {/* Bottom Row: Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Admin Selectors */}
                <div className="flex flex-wrap gap-3">
                  <select
                    defaultValue={issue.status}
                    onChange={(e) =>
                      handleUpdate(
                        issue.id,
                        e.target.value as IssueStatus,
                        issue.assignedTo,
                      )
                    }
                    className="h-10 rounded-xl border border-[var(--border)] px-4 bg-gray-50 text-[13px] font-bold outline-none transition focus:border-[var(--accent)] hover:border-[var(--accent)]"
                  >
                    {statuses
                      .filter((item): item is IssueStatus => item !== "All")
                      .map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                  </select>
                  <input
                    onBlur={(e) => handleUpdate(issue.id, issue.status, e.target.value)}
                    placeholder="Assign to team..."
                    className="h-10 w-48 rounded-xl border border-[var(--border)] px-4 bg-gray-50 text-[13px] font-medium outline-none transition focus:border-[var(--accent)]-500 hover:border-[var(--accent)]"
                  />
                  <button 
                    onClick={() => handleRespond(issue)}
                    className="flex h-10 items-center gap-2 rounded-xl bg-[var(--accent-soft)] px-5 text-[13px] font-black text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
                  >
                    <MessageSquare size={16} />
                    Respond
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Created {issue.createdAt}
                  </span>
                  <button className="h-10 rounded-xl bg-[var(--accent)] px-6 text-[13px] font-black text-white hover:brightness-125 transition shadow-sm">
                    Update Status
                  </button>
                </div>
              </div>

              {/* Admin Comments */}
              {issue.comments.length > 0 && (
                <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] p-4">
                  <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[var(--muted)] mb-2">
                    <MessageSquare size={12} />
                    Admin Responses
                  </p>
                  <div className="space-y-3">
                    {issue.comments.map((comment, idx) => (
                      <div key={idx} className="bg-white/50 rounded-lg p-3 border border-white">
                        <p className="text-[13px] font-bold text-[var(--foreground)]">
                          <span className="text-[#21130D] font-black">{comment.author}:</span> {comment.text}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{comment.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-scale-in">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{selectedIssue.trackingId}</p>
                <h3 className="text-xl font-black text-[var(--foreground)] mt-1">Respond to Issue</h3>
              </div>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="mb-6 rounded-2xl bg-gray-50 p-5 border border-[var(--border)]">
              <p className="text-sm font-bold text-[var(--foreground)] mb-1">{selectedIssue.title}</p>
              <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                {selectedIssue.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--foreground)] mb-2">Your Answer</label>
                <textarea 
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Type your official response to the student..."
                  className="min-h-[140px] w-full rounded-2xl border border-[var(--border)] p-4 text-[15px] font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/20"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={submitResponse}
                  disabled={isSubmitting || !adminResponse.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3.5 text-sm font-black text-white shadow-lg shadow-[#21130D]/30 transition-all hover:brightness-125 hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                >
                  <Send size={18} />
                  {isSubmitting ? 'Sending...' : 'Send Response'}
                </button>
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="flex-1 rounded-xl border border-[var(--border)] py-3.5 text-sm font-bold text-[var(--muted)] transition-all hover:bg-gray-50"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

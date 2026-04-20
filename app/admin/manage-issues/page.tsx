"use client";

import { useMemo, useState } from "react";

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
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [issues, setIssues] = useState<AdminIssue[]>(staticIssues);

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

  function updateIssue(id: string, updatedStatus: IssueStatus, assignTo: string) {
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

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4 bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search keyword or ID..."
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-[15px] font-medium outline-none transition focus:border-blue-500 md:col-span-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-[15px] font-medium outline-none transition focus:border-blue-500"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as typeof priority)}
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-[15px] font-medium outline-none transition focus:border-blue-500"
          >
            {priorities.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-[15px] font-medium outline-none transition focus:border-blue-500"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
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
                    issue.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
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
                      updateIssue(
                        issue.id,
                        e.target.value as IssueStatus,
                        issue.assignedTo,
                      )
                    }
                    className="h-10 rounded-xl border border-[var(--border)] px-4 bg-gray-50 text-[13px] font-bold outline-none transition focus:border-blue-500"
                  >
                    {statuses
                      .filter((item): item is IssueStatus => item !== "All")
                      .map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                  </select>
                  <input
                    defaultValue={issue.assignedTo}
                    onBlur={(e) => updateIssue(issue.id, issue.status, e.target.value)}
                    placeholder="Assign to team..."
                    className="h-10 w-48 rounded-xl border border-[var(--border)] px-4 bg-gray-50 text-[13px] font-medium outline-none transition focus:border-blue-500"
                  />
                  <button className="h-10 rounded-xl bg-[var(--accent)] px-5 text-[13px] font-black text-white hover:bg-blue-700 transition">
                    Update
                  </button>
                </div>

                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Created {issue.createdAt}
                </span>
              </div>

              {/* Admin Comments */}
              {issue.comments.length > 0 && (
                <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] p-4">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[var(--muted)]">
                    Admin Responses
                  </p>
                  {issue.comments.map((comment, idx) => (
                    <p key={idx} className="mt-1 text-[13px] font-bold text-[var(--foreground)]">
                      <span className="text-blue-600">{comment.author}:</span> {comment.text}
                    </p>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

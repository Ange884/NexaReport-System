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
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[var(--accent)]">Manage Issues</h2>
        <p className="text-sm text-[var(--muted)]">
          Search, filter, update status, and assign by category.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by keyword or tracking ID"
          className="rounded-lg border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)] md:col-span-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="rounded-lg border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as typeof priority)}
            className="rounded-lg border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
          >
            {priorities.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-lg border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted)]">
            No issues found with current filters.
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <article
              key={issue.id}
              className="rounded-xl border border-[var(--border)] bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-[var(--accent)]">{issue.title}</h3>
                <span className="text-xs font-semibold text-[var(--muted)]">
                  {issue.trackingId}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{issue.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[var(--accent)]">
                  {issue.category}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 ${priorityClasses[issue.priority]}`}
                >
                  {issue.priority}
                </span>
                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--muted)]">
                  {issue.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
                <select
                  defaultValue={issue.status}
                  onChange={(e) =>
                    updateIssue(
                      issue.id,
                      e.target.value as IssueStatus,
                      issue.assignedTo,
                    )
                  }
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
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
                  placeholder="Assign to team"
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                />
                <button className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
                  Save Action
                </button>
              </div>

              {issue.comments.length > 0 && (
                <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--accent-soft)] p-3">
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    Admin Comments / Responses
                  </p>
                  {issue.comments.map((comment, idx) => (
                    <p key={idx} className="mt-1 text-sm text-[var(--accent)]">
                      {comment.author}: {comment.text}
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

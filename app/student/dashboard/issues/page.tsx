"use client";

import React, { useState } from "react";
import { ChevronDown, FolderOpen } from "lucide-react";

type IssueStatus = "Pending" | "In Progress" | "Resolved";
type IssueCategory = "Academic" | "Infrastructure" | "Administrative" | "Technical";

const categories: ("All" | IssueCategory)[] = ["All", "Academic", "Infrastructure", "Administrative", "Technical"];
const statuses: ("All" | IssueStatus)[] = ["All", "Pending", "In Progress", "Resolved"];

const myIssues: any[] = [];

export default function MyIssues() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");

  const filtered = myIssues.filter((issue) => {
    const kw = issue.title?.toLowerCase().includes(keyword.toLowerCase()) || issue.trackingId?.toLowerCase().includes(keyword.toLowerCase());
    const cat = category === "All" || issue.category === category;
    const st = status === "All" || issue.status === status;
    return kw && cat && st;
  });

  return (
    <section className="card rounded-3xl border border-[var(--border)] bg-[#f8f9fc] p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">My Issues</h2>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            View and track all your submitted issues.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by title or tracking ID..."
          className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-[15px] font-medium outline-none transition focus:border-[var(--accent)] md:col-span-2"
        />

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className="w-full appearance-none rounded-xl border border-[var(--border)] px-4 py-2.5 pr-10 text-[15px] font-medium text-gray-500 outline-none transition focus:border-[var(--accent)]"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="w-full appearance-none rounded-xl border border-[var(--border)] px-4 py-2.5 pr-10 text-[15px] font-medium text-gray-500 outline-none transition focus:border-[var(--accent)]"
          >
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Issues list */}
      <div className="mt-6 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
              <FolderOpen size={28} strokeWidth={1.75} />
            </div>
            <p className="text-[15px] font-black text-[var(--foreground)]">No issues found</p>
            <p className="mt-1 text-sm font-bold text-[var(--muted)]">You haven&apos;t submitted any issues yet.</p>
          </div>
        ) : (
          filtered.map((issue: any) => (
            <article key={issue.id} className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-black text-[var(--foreground)]">{issue.title}</h3>
                    <span className="text-xs font-bold text-gray-400">({issue.trackingId})</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-gray-600">{issue.category}</span>
                  </div>
                </div>
                <span className={`rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                  issue.status === "Resolved" ? "bg-emerald-100 text-emerald-600" :
                  issue.status === "In Progress" ? "bg-[#21130D]/10 text-[#21130D]" :
                  "bg-amber-100 text-amber-600"
                }`}>{issue.status}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

const staticResolved = [
  { id: "4", trackingId: "ISS-2026-0004", title: "Water dispenser leak", category: "Other", priority: "Low", status: "Resolved", createdAt: "2026-04-12" },
];

export default function ArchivePage() {
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    setIssues(staticResolved);
  }, []);

  const resolved = useMemo(
    () => issues.filter((issue) => issue.status === "Resolved"),
    [issues],
  );

  return (
    <section className="card p-8 rounded-3xl border border-[var(--border)] shadow-sm bg-[#f8f9fc]">
      <h2 className="text-2xl font-black text-[var(--foreground)]">Issue Archive</h2>
      <p className="mt-1 text-sm font-bold text-[var(--muted)]">
        A complete log of all resolved and closed concerns.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {resolved.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--muted)]">
            <span className="text-[15px] font-bold">No archived issues found yet.</span>
          </div>
        ) : (
          resolved.map((issue) => (
            <article
              key={issue.id}
              className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-black text-[var(--foreground)]">{issue.title}</h3>
                    <span className="text-xs font-bold text-gray-400">({issue.trackingId})</span>
                  </div>
                  <p className="text-sm font-bold text-[var(--muted)] mt-0.5">
                    {issue.category} • Resolved on {issue.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="rounded-lg bg-emerald-100 px-3 py-1 font-black text-[13px] uppercase tracking-wider text-emerald-600">
                  Archived
                </span>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

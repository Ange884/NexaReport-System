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
    <section className="card p-8 rounded-3xl border border-[var(--border)] shadow-sm">
      <h2 className="text-2xl font-black text-[var(--foreground)]">Issue Archive</h2>
      <p className="mt-1 text-sm font-bold text-[var(--muted)]">
        A complete log of all resolved and closed concerns.
      </p>

      <div className="mt-5 space-y-3">
        {resolved.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--muted)]">
            No archived issues yet.
          </div>
        ) : (
          resolved.map((issue) => (
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
              <p className="mt-1 text-sm text-[var(--muted)]">
                {issue.category} • {issue.priority} • Resolved on {issue.createdAt}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

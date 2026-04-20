"use client";

import { useEffect, useMemo, useState } from "react";

export default function NotificationsPage() {
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    setIssues([]); // No issues for now
  }, []);

  const computedNotifications = [
    "New issue reported in ICT category.",
    "High-priority maintenance issue detected.",
    "ISS-2026-0003 marked as Resolved.",
    `Open high-priority issues: 0`,
    `Total resolved issues in archive: 1`,
  ];

  return (
    <section className="card p-5">
      <h2 className="text-2xl font-bold text-[var(--accent)]">Notifications</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Dashboard alerts for new issues and high-priority signals.
      </p>

      <div className="mt-5 space-y-3">
        {computedNotifications.map((notice) => (
          <div
            key={notice}
            className="rounded-xl border border-[var(--border)] bg-white p-4"
          >
            <p className="font-semibold text-[var(--accent)]">{notice}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    title: "New issue reported in ICT category",
    date: "20 August 2026",
    status: "Pending",
    iconBg: "bg-[#21130D]/10",
    iconColor: "text-[#21130D]",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
    ),
  },
  {
    id: 2,
    title: "High-priority maintenance issue detected",
    date: "25 September 2026",
    status: "Urgent",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    ),
  },
  {
    id: 3,
    title: "ISS-2026-0003 marked as Resolved",
    date: "10 April 2026",
    status: "Resolved",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    ),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <section className="card p-8 rounded-3xl border border-[var(--border)] shadow-sm bg-[#f8f9fc]">
      <h2 className="text-2xl font-black text-[var(--foreground)]">Notifications</h2>
      <p className="mt-1 text-sm font-bold text-[var(--muted)]">
        Recent system alerts and important priority updates.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {notifications.length === 0 ? (
          <p className="text-center font-bold text-[var(--muted)] py-8">
            No new notifications.
          </p>
        ) : (
          notifications.map((notice) => (
            <div
              key={notice.id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${notice.iconBg} ${notice.iconColor}`}>
                  {notice.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-[var(--foreground)]">{notice.title}</h3>
                  <p className="text-sm font-bold text-[#a0a5b1] mt-0.5">{notice.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <span className="text-[15px] font-black text-[var(--foreground)] min-w-[80px] text-right">
                  {notice.status}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#21130D]/10 text-[#21130D] transition hover:bg-[#21130D]/20"
                    title="Mark as Read"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  </button>
                  <button 
                    onClick={() => dismissNotification(notice.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    title="Dismiss"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

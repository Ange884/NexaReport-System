"use client";

import React, { useState } from "react";
import { Bell, Clock, CheckCircle2, X } from "lucide-react";

type Notification = {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "status_update",
    title: "Issue Status Updated",
    description: "Your issue 'Broken classroom projector' is now in progress.",
    time: "1 day ago",
    iconBg: "bg-[#21130D]/10",
    iconColor: "text-[#21130D]",
    icon: <Clock size={20} strokeWidth={2} />,
  },
  {
    id: 2,
    type: "resolution",
    title: "Issue Resolved",
    description: "Your issue 'Slow WiFi connection' has been resolved.",
    time: "2 days ago",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    icon: <CheckCircle2 size={20} strokeWidth={2} />,
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const dismiss = (id: number) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <section className="card rounded-3xl border border-[var(--border)] bg-[#f8f9fc] p-8 shadow-sm">
      <h2 className="text-2xl font-black text-[var(--foreground)]">Notifications</h2>
      <p className="mt-1 text-sm font-bold text-[var(--muted)]">
        Stay updated on your issue submissions and status changes.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex items-center justify-between border-b border-[var(--border)] pb-0">
        <div className="flex gap-1">
          {(["all", "unread"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 pb-3 text-sm font-bold capitalize transition-all ${
                activeTab === tab
                  ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab === "all" ? `All (${notifications.length})` : `Unread (${notifications.length})`}
            </button>
          ))}
        </div>
        <button className="mb-3 text-xs font-bold text-[var(--muted)] transition hover:text-[var(--accent)]">
          Mark all as read
        </button>
      </div>

      {/* List */}
      <div className="mt-6 flex flex-col gap-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
              <Bell size={28} strokeWidth={1.75} />
            </div>
            <p className="text-[15px] font-black text-[var(--foreground)]">No new notifications</p>
            <p className="mt-1 text-sm font-bold text-[var(--muted)]">You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${n.iconBg} ${n.iconColor}`}>
                  {n.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-[var(--foreground)]">{n.title}</h3>
                  <p className="mt-0.5 text-sm font-medium text-[var(--muted)]">{n.description}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#a0a5b1]">{n.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#21130D]/10 text-[#21130D] transition hover:bg-[#21130D]/20" title="Mark as read">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                </button>
                <button
                  onClick={() => dismiss(n.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  title="Dismiss"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

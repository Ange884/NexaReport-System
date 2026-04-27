"use client";

import React, { useState } from "react";
import { Bell, Clock, CheckCircle2, X } from "lucide-react";

type Notification = {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "status_update",
    title: "Issue Status Updated",
    description: "Your issue 'Broken classroom projector' is now in progress.",
    time: "1 day ago",
    icon: <Clock size={20} strokeWidth={2.5} className="text-blue-400" />,
  },
  {
    id: 2,
    type: "resolution",
    title: "Issue Resolved",
    description: "Your issue 'Slow WiFi connection' has been resolved.",
    time: "2 days ago",
    icon: <CheckCircle2 size={20} strokeWidth={2.5} className="text-emerald-400" />,
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const dismiss = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[rgba(33,19,13,0.06)] text-[#21130D] shadow-[inset_0_2px_8px_rgba(33,19,13,0.08)] ring-1 ring-[rgba(33,19,13,0.06)]">
            <Bell size={28} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-[2.25rem] font-black leading-tight tracking-tight text-[#1a202c]">
              Notifications
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-full bg-[#21130D] px-3 py-0.5 text-[0.75rem] font-black text-white shadow-[0_4px_12px_rgba(33,19,13,0.25)]">
                {notifications.length} new
              </span>
            </div>
          </div>
        </div>
        <button className="self-start rounded-2xl border border-[#e2e8f0] px-5 py-2.5 text-[0.875rem] font-bold text-[#718096] transition-all duration-300 hover:border-[rgba(33,19,13,0.2)] hover:bg-[rgba(33,19,13,0.03)] hover:text-[#21130D] sm:self-auto">
          Mark all as read
        </button>
      </div>

      <p className="mb-8 mt-3 text-[0.9375rem] font-semibold leading-relaxed text-[#718096]">
        Stay updated on your issue submissions and status changes.
      </p>

      {/* Tabs */}
      <div className="mb-6 flex gap-1.5 rounded-2xl border border-[#e2e8f0] bg-[rgba(33,19,13,0.02)] p-1.5 shadow-[0_2px_8px_rgba(33,19,13,0.04)]">
        {(["all", "unread"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-xl px-5 py-2.5 text-[0.9rem] font-bold capitalize transition-all duration-300 ${
              activeTab === tab
                ? "bg-white text-[#21130D] shadow-[0_4px_16px_rgba(33,19,13,0.1)] ring-1 ring-[rgba(33,19,13,0.06)]"
                : "text-[#718096] hover:text-[#1a202c]"
            }`}
          >
            {tab === "all"
              ? `All (${notifications.length})`
              : `Unread (${notifications.length})`}
          </button>
        ))}
      </div>

      {/* Notification cards */}
      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-[#e2e8f0] bg-white px-8 py-20 text-center shadow-[0_4px_24px_rgba(33,19,13,0.05)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[rgba(33,19,13,0.05)] text-[#718096] ring-8 ring-[rgba(33,19,13,0.02)]">
              <Bell size={36} strokeWidth={1.75} />
            </div>
            <div className="space-y-1.5">
              <p className="text-[1.25rem] font-black text-[#1a202c]">All caught up!</p>
              <p className="text-[0.95rem] font-semibold text-[#718096]">No notifications right now.</p>
            </div>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="group relative flex items-start justify-between gap-4 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_12px_rgba(33,19,13,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(33,19,13,0.12)] hover:shadow-[0_16px_40px_rgba(33,19,13,0.08)]"
            >
              {/* Left accent bar */}
              <div className="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl bg-[#21130D] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Icon + text */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#21130D] shadow-[0_6px_20px_rgba(33,19,13,0.2),inset_0_1px_0_rgba(255,255,255,0.12)]">
                  {n.icon}
                </div>
                <div className="pt-0.5">
                  <p className="text-[1rem] font-extrabold leading-snug text-[#1a202c]">{n.title}</p>
                  <p className="mt-1 text-[0.9rem] font-medium leading-relaxed text-[#718096]">
                    {n.description}
                  </p>
                  <p className="mt-2 text-[0.8rem] font-bold text-[#a0aec0]">{n.time}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-shrink-0 flex-col items-end gap-3">
                <button
                  onClick={() => dismiss(n.id)}
                  aria-label="Dismiss"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#718096] transition-all duration-200 hover:rotate-90 hover:bg-[rgba(33,19,13,0.06)] hover:text-[#1a202c]"
                >
                  <X size={17} strokeWidth={2.5} />
                </button>
                <button className="rounded-lg px-2.5 py-1 text-[0.8rem] font-bold text-[#718096] transition-all duration-200 hover:bg-[rgba(33,19,13,0.05)] hover:text-[#21130D]">
                  Mark as read
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

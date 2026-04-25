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
    icon: <Clock size={20} strokeWidth={2.5} className="text-blue-500" />,
  },
  {
    id: 2,
    type: "resolution",
    title: "Issue Resolved",
    description: "Your issue 'Slow WiFi connection' has been resolved.",
    time: "2 days ago",
    icon: (
      <CheckCircle2 size={20} strokeWidth={2.5} className="text-emerald-500" />
    ),
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const dismiss = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="flex items-center gap-3 text-[1.875rem] font-black tracking-tight text-[#1a202c]">
            <Bell size={32} strokeWidth={2.5} />
            Notifications
          </h1>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600">
            {notifications.length} new
          </span>
        </div>
        <button className="text-sm font-bold text-[#21130D] underline underline-offset-2 hover:opacity-70">
          Mark all as read
        </button>
      </div>

      <p className="mb-6 text-[0.9375rem] font-semibold text-[#718096]">
        Stay updated on your issue submissions and status changes.
      </p>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-[#e2e8f0]">
        {(["all", "unread"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 pb-3 text-sm font-bold capitalize transition-all ${
              activeTab === tab
                ? "border-b-2 border-[#21130D] text-[#21130D]"
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
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-8 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(33,19,13,0.06)] text-[#718096]">
              <Bell size={32} strokeWidth={2} />
            </div>
            <p className="font-extrabold text-[#1a202c]">All caught up!</p>
            <p className="text-sm font-semibold text-[#718096]">
              No notifications right now.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              {/* Icon + text */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#f0f4f8]">
                  {n.icon}
                </div>
                <div>
                  <p className="font-extrabold text-[#1a202c]">{n.title}</p>
                  <p className="mt-0.5 text-sm font-medium text-[#718096]">
                    {n.description}
                  </p>
                  <p className="mt-1.5 text-xs font-bold text-[#a0aec0]">
                    {n.time}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-shrink-0 flex-col items-end gap-2">
                <button
                  onClick={() => dismiss(n.id)}
                  aria-label="Dismiss"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[#718096] transition hover:bg-[#f0f4f8] hover:text-[#1a202c]"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
                <button className="text-xs font-bold text-[#21130D] underline underline-offset-2 hover:opacity-70">
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

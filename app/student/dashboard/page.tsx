"use client";

import React from "react";
import { Clock, AlertCircle, CheckCircle2, FileText } from "lucide-react";

const kpiCards = [
  {
    type: "total",
    label: "Total Issues",
    value: 0,
    icon: FileText,
    topColor: "bg-[#21130D]",
    iconBg: "bg-[rgba(33,19,13,0.08)]",
    iconColor: "text-[#21130D]",
  },
  {
    type: "pending",
    label: "Pending",
    value: 0,
    icon: Clock,
    topColor: "bg-amber-400",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    type: "progress",
    label: "In Progress",
    value: 0,
    icon: AlertCircle,
    topColor: "bg-violet-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    type: "resolved",
    label: "Resolved",
    value: 0,
    icon: CheckCircle2,
    topColor: "bg-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
];

export default function StudentDashboard() {
  return (
    <>
      <h1 className="text-[1.875rem] font-black tracking-tight text-[#1a202c]">
        Dashboard
      </h1>
      <p className="mb-8 mt-1 text-[0.9375rem] font-semibold text-[#718096]">
        Welcome back! Here&apos;s your overview.
      </p>

      {/* KPI Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.type}
              className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]"
            >
              {/* Colored top bar */}
              <div
                className={`absolute left-0 right-0 top-0 h-[3px] rounded-t-2xl ${card.topColor}`}
              />
              <div
                className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
              >
                <Icon size={26} strokeWidth={2} />
              </div>
              <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.08em] text-[#718096]">
                {card.label}
              </p>
              <p className="mt-1 text-[2rem] font-black leading-none tracking-tight text-[#1a202c]">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
        <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
          <h2 className="text-sm font-black uppercase tracking-[0.05em] text-[#1a202c]">
            Recent Activity
          </h2>
        </div>
        {/* Empty state */}
        <div className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(33,19,13,0.06)] text-[#718096]">
            <FileText size={32} strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-extrabold text-[#1a202c]">
            No issues reported yet
          </h3>
          <p className="text-[0.9375rem] font-semibold text-[#718096]">
            Start by submitting your first issue
          </p>
        </div>
      </div>
    </>
  );
}

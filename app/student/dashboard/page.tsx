"use client";

import React from "react";
import { Clock, AlertCircle, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

const kpiCards = [
  {
    type: "total",
    label: "Total Issues",
    value: 0,
    icon: FileText,
    topColor: "bg-[#21130D]",
    iconBg: "bg-[rgba(33,19,13,0.07)]",
    iconColor: "text-[#21130D]",
    valueColor: "text-[#1a202c]",
  },
  {
    type: "pending",
    label: "Pending",
    value: 0,
    icon: Clock,
    topColor: "bg-amber-400",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    valueColor: "text-amber-500",
  },
  {
    type: "progress",
    label: "In Progress",
    value: 0,
    icon: AlertCircle,
    topColor: "bg-violet-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    valueColor: "text-violet-500",
  },
  {
    type: "resolved",
    label: "Resolved",
    value: 0,
    icon: CheckCircle2,
    topColor: "bg-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    valueColor: "text-emerald-500",
  },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="mb-1 text-[0.75rem] font-extrabold uppercase tracking-[0.12em] text-[#718096]">
            Overview
          </p>
          <h1 className="text-[2.25rem] font-black leading-tight tracking-tight text-[#1a202c]">
            Dashboard
          </h1>
          <p className="mt-1.5 text-[1rem] font-medium text-[#718096]">
            Welcome back! Here&apos;s a summary of your activity.
          </p>
        </div>
        <Link
          href="/student/dashboard/submit"
          className="hidden items-center gap-2 rounded-2xl bg-[#21130D] px-6 py-3 text-[0.875rem] font-black text-white shadow-[0_6px_20px_rgba(33,19,13,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(33,19,13,0.32)] active:scale-[0.97] sm:flex"
        >
          <FileText size={16} strokeWidth={2.5} />
          Submit Issue
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.type}
              className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(33,19,13,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(33,19,13,0.08)] hover:border-[rgba(33,19,13,0.1)]"
            >
              {/* Colored top bar */}
              <div className={`absolute left-0 right-0 top-0 h-[3px] rounded-t-2xl ${card.topColor}`} />
              {/* Subtle corner decoration */}
              <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[rgba(33,19,13,0.02)] transition-transform duration-500 group-hover:scale-[2.5]" />

              <div className={`relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} shadow-sm`}>
                <Icon size={24} strokeWidth={2} />
              </div>
              <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#718096]">
                {card.label}
              </p>
              <p className={`mt-1.5 text-[2.25rem] font-black leading-none tracking-tight ${card.valueColor}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(33,19,13,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(33,19,13,0.07)]">
        {/* Card header */}
        <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[rgba(33,19,13,0.015)] px-7 py-5">
          <div>
            <h2 className="text-[0.8rem] font-extrabold uppercase tracking-[0.1em] text-[#1a202c]">
              Recent Activity
            </h2>
            <p className="mt-0.5 text-[0.8rem] font-medium text-[#718096]">
              Your latest submitted issues
            </p>
          </div>
          <Link
            href="/student/dashboard/issues"
            className="flex items-center gap-1.5 rounded-xl border border-[#e2e8f0] px-4 py-2 text-[0.8rem] font-bold text-[#718096] transition-all duration-200 hover:border-[rgba(33,19,13,0.2)] hover:text-[#21130D]"
          >
            View all
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Empty state */}
        <div className="relative flex flex-col items-center justify-center gap-5 px-8 py-20 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(33,19,13,0.02)_0%,transparent_65%)]" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[rgba(33,19,13,0.05)] text-[#718096] ring-8 ring-[rgba(33,19,13,0.02)]">
            <FileText size={36} strokeWidth={1.75} />
          </div>
          <div className="relative space-y-2">
            <h3 className="text-[1.25rem] font-black text-[#1a202c]">
              No issues reported yet
            </h3>
            <p className="text-[0.9375rem] font-semibold text-[#718096]">
              Start by submitting your first issue
            </p>
          </div>
          <Link
            href="/student/dashboard/submit"
            className="relative mt-2 flex items-center gap-2 overflow-hidden rounded-2xl bg-[#21130D] px-7 py-3 text-[0.875rem] font-black text-white shadow-[0_6px_20px_rgba(33,19,13,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(33,19,13,0.3)] active:scale-[0.97]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
            <FileText size={15} strokeWidth={2.5} className="relative" />
            <span className="relative">Submit your first issue</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

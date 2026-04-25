"use client";

import React from "react";
import { Sparkles, Filter, Shield, ShieldCheck } from "lucide-react";

const statCards = [
  { label: "Maintenance", dotColor: "#fbc02d", dotShadow: "rgba(251,192,45,0.6)" },
  { label: "ICT", dotColor: "#1976d2", dotShadow: "rgba(25,118,210,0.6)" },
  { label: "Academic", dotColor: "#388e3c", dotShadow: "rgba(56,142,60,0.6)" },
  { label: "Other", dotColor: "#9e9e9e", dotShadow: "rgba(158,158,158,0.6)" },
];

export default function PublicFeed() {
  return (
    <>
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[rgba(33,19,13,0.08)] text-[#21130D]">
          <Sparkles size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-[1.875rem] font-black tracking-tight text-[#1a202c]">
            Public Issue Feed
          </h1>
          <p className="mt-1 text-[0.9375rem] font-semibold text-[#718096]">
            View anonymized issues from the community. Your identity is always
            protected.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mt-10 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h4 className="flex items-center gap-2 text-sm font-extrabold text-[#1a202c]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: s.dotColor,
                  boxShadow: `0 0 8px ${s.dotShadow}`,
                }}
              />
              {s.label}
            </h4>
            <p className="mt-3 text-3xl font-black text-[#1a202c]">0</p>
            <p className="mt-0.5 text-xs font-semibold text-[#718096]">
              issues reported
            </p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="mt-6 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-[#1a202c]">
          <Filter size={20} />
          <h3 className="font-extrabold">Filter Issues</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {["All Categories", "All Statuses", "All Priorities"].map((ph) => (
            <select
              key={ph}
              className="rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#fafafa] px-3 py-2.5 text-sm font-semibold text-[#718096] outline-none transition focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(33,19,13,0.08)]"
            >
              <option>{ph}</option>
            </select>
          ))}
        </div>
      </div>

      {/* Issues card */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="border-b border-[#e2e8f0] px-6 py-4">
          <h3 className="font-extrabold text-[#1a202c]">Recent Issues (0)</h3>
        </div>
        {/* Empty state */}
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[rgba(33,19,13,0.06)] text-[#718096]">
            <Shield size={42} strokeWidth={2} />
          </div>
          <h3 className="text-lg font-extrabold text-[#1a202c]">
            No issues found
          </h3>
          <p className="text-[0.9375rem] font-semibold text-[#718096]">
            Try adjusting your filters
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 flex items-start gap-4 rounded-2xl border border-[#e2e8f0] bg-[rgba(33,19,13,0.04)] p-5">
        <ShieldCheck size={26} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-[#21130D]" />
        <div>
          <h4 className="font-extrabold text-[#1a202c]">Privacy Notice</h4>
          <p className="mt-1 text-sm font-medium leading-relaxed text-[#718096]">
            This feed shows anonymized issue data from all students. No personal
            information, names, or detailed descriptions are displayed to protect
            everyone&apos;s privacy.
          </p>
        </div>
      </div>
    </>
  );
}

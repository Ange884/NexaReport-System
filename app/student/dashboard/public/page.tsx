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
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex items-start gap-5">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[rgba(33,19,13,0.06)] text-[#21130D] shadow-[inset_0_2px_8px_rgba(33,19,13,0.08)] ring-1 ring-[rgba(33,19,13,0.06)]">
          <Sparkles size={28} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-[2.25rem] font-black leading-tight tracking-tight text-[#1a202c]">
            Public Issue Feed
          </h1>
          <p className="mt-1.5 text-[1.05rem] font-medium leading-relaxed text-[#718096]">
            View anonymized issues from the community. Your identity is always protected.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mt-10 grid grid-cols-2 gap-5 xl:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_20px_rgba(33,19,13,0.04),0_1px_4px_rgba(33,19,13,0.03)] transition-all duration-500 hover:-translate-y-2 hover:border-[rgba(33,19,13,0.1)] hover:shadow-[0_20px_50px_rgba(33,19,13,0.09)]"
          >
            {/* Decorative corner blob */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[rgba(33,19,13,0.025)] transition-transform duration-500 group-hover:scale-[2]" />
            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 h-[3px] w-0 rounded-b-3xl transition-all duration-500 group-hover:w-full"
              style={{ background: s.dotColor }}
            />
            <h4 className="flex items-center gap-2.5 text-[0.9rem] font-extrabold text-[#1a202c]">
              <span
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{
                  background: s.dotColor,
                  boxShadow: `0 0 10px ${s.dotShadow}`,
                }}
              />
              {s.label}
            </h4>
            <p className="mt-4 text-[2.75rem] font-black leading-none tracking-tight text-[#1a202c]">
              0
            </p>
            <p className="mt-2 text-[0.75rem] font-extrabold uppercase tracking-[0.1em] text-[#718096]">
              Issues Reported
            </p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_24px_rgba(33,19,13,0.05)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(33,19,13,0.08)] sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5 text-[#21130D] sm:mr-4">
          <Filter size={18} strokeWidth={2.5} />
          <h3 className="text-[0.95rem] font-black">Filter Feed</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {["All Categories", "All Statuses", "All Priorities"].map((ph) => (
            <div key={ph} className="relative">
              <select className="appearance-none rounded-2xl border-[1.5px] border-[#e2e8f0] bg-[rgba(33,19,13,0.02)] py-2.5 pl-4 pr-9 text-[0.875rem] font-bold text-[#718096] outline-none transition-all duration-300 hover:border-[rgba(33,19,13,0.2)] hover:bg-white focus:border-[#21130D] focus:bg-white focus:text-[#21130D] focus:shadow-[0_0_0_5px_rgba(33,19,13,0.06)]">
                <option>{ph}</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#718096]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues card */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-[0_4px_24px_rgba(33,19,13,0.05)] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(33,19,13,0.08)]">
        <div className="border-b border-[#e2e8f0] bg-[linear-gradient(to_right,rgba(33,19,13,0.02),transparent)] px-8 py-5">
          <h3 className="text-[1.1rem] font-black tracking-tight text-[#1a202c]">
            Recent Issues <span className="font-bold text-[#718096]">(0)</span>
          </h3>
        </div>
        {/* Empty state */}
        <div className="relative flex flex-col items-center justify-center gap-6 px-8 py-28 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(33,19,13,0.02)_0%,transparent_65%)]" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-[rgba(33,19,13,0.05)] text-[#21130D] shadow-[0_8px_28px_rgba(33,19,13,0.07),inset_0_1px_0_rgba(255,255,255,0.8)] ring-8 ring-[rgba(33,19,13,0.03)]">
            <Shield size={42} strokeWidth={1.75} />
          </div>
          <div className="relative z-10 space-y-2">
            <h3 className="text-[1.5rem] font-black tracking-tight text-[#1a202c]">
              No issues found
            </h3>
            <p className="text-[1rem] font-semibold text-[#718096]">
              Try adjusting your filters to see more results.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="group mt-8 flex items-start gap-5 overflow-hidden rounded-3xl border border-[#e2e8f0] bg-[rgba(33,19,13,0.015)] p-6 shadow-[0_2px_12px_rgba(33,19,13,0.04)] transition-all duration-300 hover:translate-x-1.5 hover:border-[rgba(33,19,13,0.1)] hover:shadow-[0_8px_28px_rgba(33,19,13,0.07)] relative">
        <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-3xl bg-[#21130D] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-[#21130D] shadow-[0_4px_16px_rgba(33,19,13,0.1)] ring-1 ring-[rgba(33,19,13,0.06)]">
          <ShieldCheck size={24} strokeWidth={2.5} />
        </div>
        <div className="pt-0.5">
          <h4 className="text-[1.05rem] font-black text-[#1a202c]">Privacy Notice</h4>
          <p className="mt-1.5 text-[0.9rem] font-semibold leading-relaxed text-[#718096]">
            This feed shows anonymized issue data from all students. No personal
            information, names, or detailed descriptions are displayed to protect
            everyone&apos;s privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

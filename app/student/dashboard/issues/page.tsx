"use client";

import React from "react";
import { Search, FolderOpen, Filter } from "lucide-react";

export default function MyIssues() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-10 flex items-start gap-5">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[rgba(33,19,13,0.06)] text-[#21130D] shadow-[inset_0_2px_8px_rgba(33,19,13,0.08)] ring-1 ring-[rgba(33,19,13,0.06)]">
          <FolderOpen size={28} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-[2.25rem] font-black leading-tight tracking-tight text-[#1a202c]">
            My Issues
          </h1>
          <p className="mt-1.5 text-[1.05rem] font-medium leading-relaxed text-[#718096]">
            Keep track of all the issues you&apos;ve submitted and monitor their progress.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_24px_rgba(33,19,13,0.05),0_1px_4px_rgba(33,19,13,0.04)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(33,19,13,0.08)] sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#718096] opacity-70"
          />
          <input
            type="text"
            placeholder="Search by title or tracking ID..."
            className="w-full rounded-2xl border-[1.5px] border-[#e2e8f0] bg-[rgba(33,19,13,0.02)] py-3.5 pl-11 pr-5 text-[0.95rem] font-medium text-[#1a202c] outline-none transition-all duration-300 placeholder:text-[#a0aec0] focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_5px_rgba(33,19,13,0.06),0_4px_16px_rgba(33,19,13,0.06)]"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          {[
            { placeholder: "All Categories", options: ["Academic", "Infrastructure", "Administrative"] },
            { placeholder: "All Statuses", options: ["Pending", "In Progress", "Resolved"] },
          ].map((f) => (
            <div key={f.placeholder} className="relative">
              <select className="appearance-none rounded-2xl border-[1.5px] border-[#e2e8f0] bg-[rgba(33,19,13,0.02)] py-3.5 pl-4 pr-10 text-[0.875rem] font-bold text-[#718096] outline-none transition-all duration-300 hover:border-[rgba(33,19,13,0.2)] hover:bg-white focus:border-[#21130D] focus:bg-white focus:text-[#21130D] focus:shadow-[0_0_0_5px_rgba(33,19,13,0.06)]">
                <option>{f.placeholder}</option>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718096]">
                <Filter size={14} strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      <div className="relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white px-8 py-32 text-center shadow-[0_8px_40px_rgba(33,19,13,0.05)] transition-shadow duration-300 hover:shadow-[0_16px_56px_rgba(33,19,13,0.08)]">
        {/* Decorative radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(33,19,13,0.03)_0%,transparent_65%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(33,19,13,0.02)] blur-3xl" />

        <div className="relative flex h-28 w-28 animate-[float_4s_ease-in-out_infinite] items-center justify-center rounded-[2rem] bg-[rgba(33,19,13,0.05)] text-[#21130D] shadow-[0_8px_32px_rgba(33,19,13,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] ring-8 ring-[rgba(33,19,13,0.03)]">
          <FolderOpen size={52} strokeWidth={1.75} />
        </div>

        <div className="relative z-10 mt-2 space-y-2">
          <h3 className="text-[1.75rem] font-black tracking-tight text-[#1a202c]">
            No issues found
          </h3>
          <p className="text-[1.05rem] font-semibold text-[#718096]">
            You haven&apos;t submitted any issues yet.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

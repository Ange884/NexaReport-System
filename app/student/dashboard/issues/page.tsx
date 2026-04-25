"use client";

import React from "react";
import { Search, FileText } from "lucide-react";

export default function MyIssues() {
  return (
    <>
      <div>
        <h1 className="text-[1.875rem] font-black tracking-tight text-[#1a202c]">
          My Issues
        </h1>
        <p className="mb-8 mt-1 text-[0.9375rem] font-semibold text-[#718096]">
          View and track all your submitted issues.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={20}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]"
          />
          <input
            type="text"
            placeholder="Search by title or tracking ID..."
            className="w-full rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#fafafa] py-2.5 pl-10 pr-4 text-sm font-medium text-[#1a202c] outline-none transition-all focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(33,19,13,0.08)]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex gap-3">
          <select className="rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#fafafa] px-3 py-2.5 text-sm font-semibold text-[#718096] outline-none transition-all focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(33,19,13,0.08)]">
            <option>All Categories</option>
            <option>Academic</option>
            <option>Infrastructure</option>
            <option>Administrative</option>
          </select>
          <select className="rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#fafafa] px-3 py-2.5 text-sm font-semibold text-[#718096] outline-none transition-all focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(33,19,13,0.08)]">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#e2e8f0] bg-white px-8 py-20 text-center shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[rgba(33,19,13,0.06)] text-[#718096]">
          <FileText size={42} strokeWidth={2} />
        </div>
        <h3 className="text-[1.125rem] font-extrabold text-[#1a202c]">
          No issues found
        </h3>
        <p className="text-[0.9375rem] font-semibold text-[#718096]">
          You haven&apos;t submitted any issues yet
        </p>
      </div>
    </>
  );
}

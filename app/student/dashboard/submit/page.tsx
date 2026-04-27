"use client";

import React from "react";
import { Send, FileSignature } from "lucide-react";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-[#e2e8f0] bg-[rgba(33,19,13,0.02)] px-5 py-4 text-[1rem] font-medium text-[#1a202c] outline-none transition-all duration-300 placeholder:text-[#a0aec0] focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_5px_rgba(33,19,13,0.06)]";

const selectClass =
  "w-full appearance-none rounded-2xl border-[1.5px] border-[#e2e8f0] bg-[rgba(33,19,13,0.02)] px-5 py-4 pr-11 text-[1rem] font-medium text-[#1a202c] outline-none transition-all duration-300 focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_5px_rgba(33,19,13,0.06)]";

const labelClass =
  "flex items-center gap-1.5 text-[0.8rem] font-extrabold uppercase tracking-[0.1em] text-[#718096]";

export default function SubmitIssue() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-10 flex items-start gap-5">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[rgba(33,19,13,0.06)] text-[#21130D] shadow-[inset_0_2px_8px_rgba(33,19,13,0.08)] ring-1 ring-[rgba(33,19,13,0.06)]">
          <FileSignature size={28} strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-[2.25rem] font-black leading-tight tracking-tight text-[#1a202c]">
            Submit New Issue
          </h1>
          <p className="mt-1.5 text-[1.05rem] font-medium leading-relaxed text-[#718096]">
            Provide detailed information so we can track and resolve it swiftly.
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-[0_8px_40px_rgba(33,19,13,0.06)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(33,19,13,0.09)]">
        {/* Top accent bar */}
        <div className="absolute left-0 top-0 h-1 w-full bg-[#21130D]" />
        {/* Corner glow */}
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[rgba(33,19,13,0.025)] blur-3xl" />

        <div className="relative z-10 p-8 sm:p-12">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">

            {/* Title */}
            <div className="flex flex-col gap-2.5">
              <label className={labelClass}>
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Broken projector in Room 402"
                required
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2.5">
              <label className={labelClass}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe what happened, where it is, and any other relevant details..."
                required
                rows={6}
                className={`${inputClass} resize-y`}
              />
            </div>

            {/* Category + Priority */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2.5">
                <label className={labelClass}>
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select required defaultValue="" className={selectClass}>
                    <option value="" disabled>Select category</option>
                    <option value="academic">Academic</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="administrative">Administrative</option>
                    <option value="technical">Technical</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#718096]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className={labelClass}>
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select required defaultValue="" className={selectClass}>
                    <option value="" disabled>Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#718096]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[rgba(33,19,13,0.06)] pt-2" />

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-[#21130D] px-10 py-4 text-[1rem] font-black text-white shadow-[0_8px_24px_rgba(33,19,13,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(33,19,13,0.35)] active:scale-[0.97]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                <span className="relative">Submit Issue</span>
                <Send size={18} strokeWidth={2.5} className="relative" />
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

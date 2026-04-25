"use client";

import React from "react";
import { Send } from "lucide-react";

export default function SubmitIssue() {
  return (
    <>
      <div>
        <h1 className="text-[1.875rem] font-black tracking-tight text-[#1a202c]">
          Submit New Issue
        </h1>
        <p className="mb-8 mt-1 text-[0.9375rem] font-semibold text-[#718096]">
          Report an issue and we&apos;ll track it for you.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-[0.8125rem] font-extrabold uppercase tracking-[0.07em] text-[#718096]">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Brief title describing the issue"
              required
              className="w-full rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#fafafa] px-4 py-3 text-[0.9375rem] font-medium text-[#1a202c] outline-none transition-all focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(33,19,13,0.08)]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[0.8125rem] font-extrabold uppercase tracking-[0.07em] text-[#718096]">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Provide detailed information about the issue..."
              required
              rows={5}
              className="w-full resize-y rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#fafafa] px-4 py-3 text-[0.9375rem] font-medium text-[#1a202c] outline-none transition-all focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(33,19,13,0.08)]"
            />
          </div>

          {/* Category + Priority row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-extrabold uppercase tracking-[0.07em] text-[#718096]">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                defaultValue=""
                className="w-full rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#fafafa] px-4 py-3 text-[0.9375rem] font-medium text-[#1a202c] outline-none transition-all focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(33,19,13,0.08)]"
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="academic">Academic</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="administrative">Administrative</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-extrabold uppercase tracking-[0.07em] text-[#718096]">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                required
                defaultValue=""
                className="w-full rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#fafafa] px-4 py-3 text-[0.9375rem] font-medium text-[#1a202c] outline-none transition-all focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_4px_rgba(33,19,13,0.08)]"
              >
                <option value="" disabled>
                  Select priority
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#21130D] px-8 py-3.5 text-[0.9375rem] font-black text-white shadow-[0_4px_14px_rgba(33,19,13,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(33,19,13,0.4)] active:scale-[0.97]"
            >
              <span>Submit Issue</span>
              <Send size={18} strokeWidth={2.5} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

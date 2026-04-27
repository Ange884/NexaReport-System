"use client";

import React from "react";
import { Send, FileSignature, ChevronDown } from "lucide-react";

export default function SubmitIssue() {
  return (
    <section className="card rounded-3xl border border-[var(--border)] bg-[#f8f9fc] p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">Submit New Issue</h2>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            Report an issue and we&apos;ll track it for you.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
          <FileSignature size={20} />
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--muted)]">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Brief title describing the issue"
              required
              className="rounded-xl border border-[var(--border)] px-4 py-3 text-[15px] font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--muted)]">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Provide detailed information about the issue..."
              required
              rows={5}
              className="resize-y rounded-xl border border-[var(--border)] px-4 py-3 text-[15px] font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10"
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--muted)]">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select required defaultValue="" className="w-full appearance-none rounded-xl border border-[var(--border)] px-4 py-3 pr-10 text-[15px] font-medium text-gray-500 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10">
                  <option value="" disabled>Select category</option>
                  <option value="academic">Academic</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="administrative">Administrative</option>
                  <option value="technical">Technical</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black uppercase tracking-[0.1em] text-[var(--muted)]">
                Priority <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select required defaultValue="" className="w-full appearance-none rounded-xl border border-[var(--border)] px-4 py-3 pr-10 text-[15px] font-medium text-gray-500 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/10">
                  <option value="" disabled>Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[var(--border)]" />

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-3 text-sm font-black text-white shadow-sm transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <Send size={16} strokeWidth={2.5} />
              Submit Issue
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

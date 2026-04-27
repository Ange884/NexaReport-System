"use client";

import React from "react";
import { Sparkles, ChevronDown, Shield, ShieldCheck } from "lucide-react";

const statCards = [
  { label: "Maintenance", dotColor: "#fbc02d", dotShadow: "rgba(251,192,45,0.6)", iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  { label: "ICT", dotColor: "#1976d2", dotShadow: "rgba(25,118,210,0.6)", iconBg: "bg-blue-50", iconColor: "text-blue-500" },
  { label: "Academic", dotColor: "#388e3c", dotShadow: "rgba(56,142,60,0.6)", iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
  { label: "Other", dotColor: "#9e9e9e", dotShadow: "rgba(158,158,158,0.6)", iconBg: "bg-gray-50", iconColor: "text-gray-400" },
];

export default function PublicFeed() {
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header card */}
      <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[var(--foreground)]">Public Issue Feed</h2>
            <p className="mt-0.5 text-sm font-bold text-[var(--muted)]">
              View anonymized issues from the community. Your identity is always protected.
            </p>
          </div>
        </div>
      </section>

      {/* Stat widgets */}
      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {statCards.map((s) => (
          <article
            key={s.label}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}>
                <span className="h-3 w-3 rounded-full" style={{ background: s.dotColor, boxShadow: `0 0 8px ${s.dotShadow}` }} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tight text-[var(--muted)]">{s.label}</p>
                <p className="mt-0.5 text-lg font-black text-[var(--foreground)]">0</p>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 px-2 py-0.5 text-[9px] font-black text-gray-400">issues</div>
          </article>
        ))}
      </div>

      {/* Filter + Issues card */}
      <section className="card rounded-3xl border border-[var(--border)] bg-[#f8f9fc] p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div>
            <h3 className="text-xl font-black text-[var(--foreground)]">Recent Issues</h3>
            <p className="mt-1 text-sm font-bold text-[var(--muted)]">Anonymized community reports</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm md:grid-cols-3">
          {["All Categories", "All Statuses", "All Priorities"].map((ph) => (
            <div key={ph} className="relative">
              <select className="w-full appearance-none rounded-xl border border-[var(--border)] px-4 py-2.5 pr-10 text-[15px] font-medium text-gray-500 outline-none transition focus:border-[var(--accent)]">
                <option>{ph}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
            <Shield size={28} strokeWidth={1.75} />
          </div>
          <p className="text-[15px] font-black text-[var(--foreground)]">No issues found</p>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">Try adjusting your filters.</p>
        </div>
      </section>

      {/* Privacy notice */}
      <div className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black text-[var(--foreground)]">Privacy Notice</h4>
          <p className="mt-1 text-sm font-bold text-[var(--muted)] leading-relaxed">
            This feed shows anonymized issue data from all students. No personal information, names, or detailed descriptions are displayed to protect everyone&apos;s privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

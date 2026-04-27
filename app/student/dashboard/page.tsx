"use client";

import React from "react";
import { Clock, AlertCircle, CheckCircle2, FileText, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const kpiCards = [
  { label: "Total Issues", value: 0, icon: FileText, iconBg: "bg-[#21130D]/10", iconColor: "text-[#21130D]", topColor: "bg-[var(--accent)]" },
  { label: "Pending", value: 0, icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-500", topColor: "bg-amber-400" },
  { label: "In Progress", value: 0, icon: AlertCircle, iconBg: "bg-violet-50", iconColor: "text-violet-500", topColor: "bg-violet-500" },
  { label: "Resolved", value: 0, icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-500", topColor: "bg-emerald-500" },
];

const recentIssues: any[] = [];

export default function StudentDashboard() {
  return (
    <div className="relative animate-fade-in">

      {/* KPI Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`absolute left-0 right-0 top-0 h-[3px] rounded-t-xl ${card.topColor}`} />
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}>
                <Icon size={22} strokeWidth={2} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">{card.label}</p>
              <p className="mt-1 text-[2rem] font-black leading-none tracking-tight text-[var(--foreground)]">{card.value}</p>
            </article>
          );
        })}
      </div>

      {/* Recent Issues */}
      <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--foreground)] leading-none">Recent Issues</h3>
              <p className="mt-1 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Your latest submissions</p>
            </div>
          </div>
          <Link href="/student/dashboard/issues">
            <button className="flex items-center gap-1 text-xs font-bold text-[var(--accent)] transition-all hover:scale-105">
              View All <ArrowUpRight size={14} />
            </button>
          </Link>
        </div>

        {recentIssues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
              <FileText size={28} strokeWidth={1.75} />
            </div>
            <p className="text-[15px] font-black text-[var(--foreground)]">No issues reported yet</p>
            <p className="mt-1 text-sm font-bold text-[var(--muted)]">Start by submitting your first issue</p>
            <Link href="/student/dashboard/submit">
              <button className="mt-5 rounded-xl bg-[var(--accent)] px-6 py-2.5 text-sm font-black text-white shadow-sm transition hover:brightness-110">
                Submit an Issue
              </button>
            </Link>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                <th className="pb-4">Issue</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentIssues.map((issue: any) => (
                <tr key={issue.id} className="transition-colors hover:bg-[var(--background)]">
                  <td className="py-4 text-sm font-bold text-[var(--foreground)]">{issue.title}</td>
                  <td className="py-4 text-xs font-bold text-[var(--muted)]">{issue.category}</td>
                  <td className="py-4">
                    <span className={`rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${
                      issue.status === "Resolved" ? "bg-emerald-100 text-emerald-600" :
                      issue.status === "In Progress" ? "bg-[#21130D]/10 text-[#21130D]" :
                      "bg-amber-100 text-amber-600"
                    }`}>{issue.status}</span>
                  </td>
                  <td className="py-4 text-right text-xs font-bold text-[var(--muted)]">{issue.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

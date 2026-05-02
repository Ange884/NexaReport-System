"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Sparkles, ChevronDown, Shield, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { fetchBroadcastFeed } from "@/app/lib/api";
import type { IssueResponseDto, IssueStatus, IssuePriority } from "@/app/lib/types";
import IssueDetailModal from "@/app/components/IssueDetailModal";

// ─── Badge helpers ────────────────────────────────────────────────────────────

const STATUS_CLS: Record<IssueStatus, string> = {
  PENDING:     "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED:    "bg-emerald-100 text-emerald-700",
};
const STATUS_LABEL: Record<IssueStatus, string> = {
  PENDING: "Pending", IN_PROGRESS: "In Progress", RESOLVED: "Resolved",
};
const PRIORITY_CLS: Record<IssuePriority, string> = {
  LOW: "bg-slate-100 text-slate-600", MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-orange-100 text-orange-700", CRITICAL: "bg-red-100 text-red-700",
};

const CATEGORY_COLORS: Record<string, { dotColor: string; dotShadow: string; iconBg: string; iconColor: string }> = {
  Maintenance:  { dotColor: "#fbc02d", dotShadow: "rgba(251,192,45,0.6)",  iconBg: "bg-amber-50",   iconColor: "text-amber-500"   },
  ICT:          { dotColor: "#1976d2", dotShadow: "rgba(25,118,210,0.6)",  iconBg: "bg-blue-50",    iconColor: "text-blue-500"    },
  Academic:     { dotColor: "#388e3c", dotShadow: "rgba(56,142,60,0.6)",   iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
  Technical:    { dotColor: "#7b1fa2", dotShadow: "rgba(123,31,162,0.6)",  iconBg: "bg-purple-50",  iconColor: "text-purple-500"  },
  Health:       { dotColor: "#e53935", dotShadow: "rgba(229,57,53,0.6)",   iconBg: "bg-red-50",     iconColor: "text-red-500"     },
  Infrastructure: { dotColor: "#f57c00", dotShadow: "rgba(245,124,0,0.6)", iconBg: "bg-orange-50",  iconColor: "text-orange-500"  },
  Administrative: { dotColor: "#0288d1", dotShadow: "rgba(2,136,209,0.6)", iconBg: "bg-sky-50",     iconColor: "text-sky-500"     },
  Other:        { dotColor: "#9e9e9e", dotShadow: "rgba(158,158,158,0.6)", iconBg: "bg-gray-50",    iconColor: "text-gray-400"    },
};

function getCategoryStyle(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.Other;
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Issue Card ───────────────────────────────────────────────────────────────

function BroadcastCard({ issue, onClick }: { issue: IssueResponseDto; onClick: () => void }) {
  return (
    <article 
      onClick={onClick}
      className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:shadow-md cursor-pointer hover:border-[#21130D]/20"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-black text-[var(--foreground)] leading-snug">{issue.title}</h3>
          {issue.description && (
            <p className="mt-1 line-clamp-2 text-sm font-medium text-[var(--muted)]">{issue.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[var(--background)] px-2.5 py-1 text-xs font-bold capitalize text-[var(--muted)]">
              {issue.category}
            </span>
            <span className={`rounded-md px-2.5 py-1 text-xs font-black ${PRIORITY_CLS[issue.priority]}`}>
              {issue.priority} Priority
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              {fmt(issue.createdAt)}
            </span>
          </div>
        </div>
        <span className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wider ${STATUS_CLS[issue.status]}`}>
          {STATUS_LABEL[issue.status]}
        </span>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicFeed() {
  const [issues,  setIssues]  = useState<IssueResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus,   setFilterStatus]   = useState<IssueStatus | "ALL">("ALL");
  const [filterPriority, setFilterPriority] = useState<IssuePriority | "ALL">("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setIssues(await fetchBroadcastFeed());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load public feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Derive unique categories from data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(issues.map((i) => i.category)));
    return cats.sort();
  }, [issues]);

  const filtered = useMemo(() => {
    return issues.filter((i) => {
      const matchCat  = filterCategory === "ALL" || i.category === filterCategory;
      const matchStat = filterStatus   === "ALL" || i.status   === filterStatus;
      const matchPri  = filterPriority === "ALL" || i.priority === filterPriority;
      return matchCat && matchStat && matchPri;
    });
  }, [issues, filterCategory, filterStatus, filterPriority]);

  // Category counts for stat widgets
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    issues.forEach((i) => { counts[i.category] = (counts[i.category] ?? 0) + 1; });
    return counts;
  }, [issues]);

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header card */}
      <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
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
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={load} className="rounded-lg bg-white px-3 py-1 text-xs shadow-sm transition hover:bg-red-50">Retry</button>
        </div>
      )}

      {/* Stat widgets */}
      {topCategories.length > 0 && (
        <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
          {topCategories.map(([cat, count]) => {
            const s = getCategoryStyle(cat);
            return (
              <article
                key={cat}
                onClick={() => setFilterCategory(filterCategory === cat ? "ALL" : cat)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${filterCategory === cat ? "border-[var(--accent)]" : "border-[var(--border)]"}`}
              >
                <div className="flex gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}>
                    <span className="h-3 w-3 rounded-full" style={{ background: s.dotColor, boxShadow: `0 0 8px ${s.dotShadow}` }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-[var(--muted)]">{cat}</p>
                    <p className="mt-0.5 text-lg font-black text-[var(--foreground)]">{count}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 px-2 py-0.5 text-[9px] font-black text-gray-400">issues</div>
              </article>
            );
          })}
        </div>
      )}

      {/* Filter + Issues card */}
      <section className="card rounded-3xl border border-[var(--border)] bg-[#f8f9fc] p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div>
            <h3 className="text-xl font-black text-[var(--foreground)]">Recent Issues</h3>
            <p className="mt-1 text-sm font-bold text-[var(--muted)]">
              {loading ? "Loading…" : `${filtered.length} issue${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm md:grid-cols-3">
          {/* Category */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[var(--border)] px-4 py-2.5 pr-10 text-[15px] font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as IssueStatus | "ALL")}
              className="w-full appearance-none rounded-xl border border-[var(--border)] px-4 py-2.5 pr-10 text-[15px] font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Priority */}
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as IssuePriority | "ALL")}
              className="w-full appearance-none rounded-xl border border-[var(--border)] px-4 py-2.5 pr-10 text-[15px] font-medium text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-[var(--border)]" />)}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && !error && (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
              <Shield size={28} strokeWidth={1.75} />
            </div>
            <p className="text-[15px] font-black text-[var(--foreground)]">No issues found</p>
            <p className="mt-1 text-sm font-bold text-[var(--muted)]">
              {issues.length === 0 ? "No broadcast issues yet." : "Try adjusting your filters."}
            </p>
          </div>
        )}

        {/* List */}
        {!loading && filtered.length > 0 && (
          <div className="mt-6 flex flex-col gap-4">
            {filtered.map((issue) => <BroadcastCard key={issue.id} issue={issue} onClick={() => setSelectedIssueId(issue.id)} />)}
          </div>
        )}
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

      {selectedIssueId && (
        <IssueDetailModal 
          issueId={selectedIssueId} 
          onClose={() => setSelectedIssueId(null)} 
        />
      )}
    </div>
  );
}

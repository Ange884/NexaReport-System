"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Activity, RefreshCw, AlertCircle, Loader2,
  CheckCircle2, ShieldAlert, Clock, TrendingUp,
} from "lucide-react";
import ActivityCalendar from "@/app/admin/components/ActivityCalendar";
import { fetchSystemActivity, fetchPrioritySummary, type SystemActivityItem, type PrioritySummary } from "@/app/lib/api";

// ─── Bar chart ────────────────────────────────────────────────────────────────

function ActivityBarChart({ data }: { data: SystemActivityItem[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm font-bold text-[var(--muted)]">
        No activity data yet.
      </div>
    );
  }

  // Show last 30 days
  const recent = [...data].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  const max = Math.max(...recent.map((d) => d.resolvedCount), 1);

  return (
    <div className="flex h-40 items-end gap-1 overflow-x-auto pb-1">
      {recent.map((d) => {
        const pct = (d.resolvedCount / max) * 100;
        return (
          <div key={d.date} className="group relative flex flex-1 min-w-[10px] flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm bg-[var(--accent)] transition-all duration-300 group-hover:brightness-125"
              style={{ height: `${Math.max(pct, 2)}%` }}
            />
            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full mb-1 hidden rounded-lg bg-[var(--accent)] px-2 py-1 text-[9px] font-black text-white shadow-lg group-hover:block whitespace-nowrap z-10">
              {d.date}<br />{d.resolvedCount} resolved
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SystemActivityPage() {
  const [activity,        setActivity]        = useState<SystemActivityItem[]>([]);
  const [summary,         setSummary]         = useState<PrioritySummary | null>(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [act, sum] = await Promise.all([
        fetchSystemActivity(),
        fetchPrioritySummary(),
      ]);
      setActivity(act);
      setSummary(sum);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load system activity.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Total resolved across all time
  const totalResolved = activity.reduce((s, d) => s + d.resolvedCount, 0);

  // Best day
  const bestDay = activity.reduce<SystemActivityItem | null>(
    (best, d) => (!best || d.resolvedCount > best.resolvedCount ? d : best),
    null
  );

  // Active days (days with at least 1 resolution)
  const activeDays = activity.filter((d) => d.resolvedCount > 0).length;

  return (
    <div className="animate-fade-in space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">System Activity</h2>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">
            Resolution performance and priority issue tracking
          </p>
        </div>
        <button
          onClick={load} disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={load} className="rounded-lg bg-white px-3 py-1 text-xs shadow-sm transition hover:bg-red-50">Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
        </div>
      )}

      {!loading && (
        <>
          {/* ── KPI row ── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                label: "Total Resolved",
                value: totalResolved,
                icon: <CheckCircle2 size={20} />,
                bg: "bg-emerald-50", color: "text-emerald-600",
              },
              {
                label: "Active Days",
                value: activeDays,
                icon: <Activity size={20} />,
                bg: "bg-[#21130D]/10", color: "text-[#21130D]",
              },
              {
                label: "Priority Unresolved",
                value: summary?.priorityUnresolvedTotal ?? "—",
                icon: <ShieldAlert size={20} />,
                bg: "bg-orange-50", color: "text-orange-600",
              },
              {
                label: "Overdue Priority",
                value: summary?.overduePriorityTotal ?? "—",
                icon: <Clock size={20} />,
                bg: "bg-red-50", color: "text-red-600",
              },
            ].map((card) => (
              <article
                key={card.label}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{card.label}</p>
                  <p className="mt-0.5 text-2xl font-black text-[var(--foreground)]">{card.value}</p>
                </div>
              </article>
            ))}
          </div>

          {/* ── Bar chart + best day ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2 rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--foreground)]">Resolution Trend</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Last 30 days</p>
                </div>
              </div>
              <ActivityBarChart data={activity} />
            </section>

            <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-base font-black text-[var(--foreground)]">Highlights</h3>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Best Day</p>
                {bestDay ? (
                  <>
                    <p className="mt-1 text-lg font-black text-[var(--foreground)]">{bestDay.resolvedCount} resolved</p>
                    <p className="text-xs font-bold text-[var(--muted)]">{bestDay.date}</p>
                  </>
                ) : (
                  <p className="mt-1 text-sm font-bold text-[var(--muted)]">No data yet</p>
                )}
              </div>

              {summary && (
                <>
                  <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Priority Unresolved</p>
                    <p className="mt-1 text-2xl font-black text-orange-700">{summary.priorityUnresolvedTotal}</p>
                    <p className="text-[11px] font-bold text-orange-500">HIGH + CRITICAL issues</p>
                  </div>

                  <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-600">Overdue (&gt;2 days)</p>
                    <p className="mt-1 text-2xl font-black text-red-700">{summary.overduePriorityTotal}</p>
                    <p className="text-[11px] font-bold text-red-500">Need immediate attention</p>
                  </div>
                </>
              )}
            </section>
          </div>

          {/* ── Calendar ── */}
          <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[var(--foreground)]">Resolution Calendar</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Daily resolution heatmap</p>
              </div>
            </div>
            <ActivityCalendar data={activity} />
          </section>
        </>
      )}
    </div>
  );
}

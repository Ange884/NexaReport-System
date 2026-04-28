"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, CalendarDays } from "lucide-react";

export interface ActivityDay {
  date: string;       // "YYYY-MM-DD"
  resolvedCount: number;
}

interface Props {
  data?: ActivityDay[];
}

export default function ActivityCalendar({ data = [] }: Props) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build a lookup map from the real data
  const dataMap = React.useMemo(() => {
    const m: Record<string, number> = {};
    data.forEach((d) => { m[d.date] = d.resolvedCount; });
    return m;
  }, [data]);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Max resolved in current month for intensity scaling
  const maxResolved = React.useMemo(() => {
    let max = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      max = Math.max(max, dataMap[key] ?? 0);
    }
    return max || 1;
  }, [currentDate, daysInMonth, dataMap]);

  const days: React.ReactNode[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`e-${i}`} className="h-10 w-10" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const resolved = dataMap[dateKey] ?? 0;
    const isSelected = selectedDate === dateKey;
    const intensity = resolved > 0 ? Math.max(0.15, resolved / maxResolved) : 0;

    days.push(
      <div
        key={d}
        onClick={() => setSelectedDate(dateKey)}
        className={`group relative h-10 w-10 cursor-pointer rounded-lg transition-all duration-200 flex items-center justify-center ${
          isSelected
            ? "bg-[var(--accent)] shadow-lg shadow-[#21130D]/20 scale-110 z-10"
            : "bg-white border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-sm"
        }`}
        style={!isSelected && resolved > 0 ? { backgroundColor: `rgba(33,19,13,${intensity * 0.18})` } : undefined}
      >
        <span className={`text-[11px] font-bold transition-colors ${
          isSelected ? "text-white" : resolved > 0 ? "text-[var(--accent)]" : "text-[var(--muted)]"
        }`}>
          {d}
        </span>

        {resolved > 0 && !isSelected && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-emerald-500" />
        )}

        {/* Tooltip */}
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-xl bg-[var(--accent)] p-3 text-[10px] text-white shadow-xl group-hover:block z-20 whitespace-nowrap">
          <div className="font-black mb-1 text-[11px]">{monthNames[currentDate.getMonth()]} {d}, {currentDate.getFullYear()}</div>
          <div className="flex items-center justify-between gap-4">
            <span className="opacity-70">Resolved</span>
            <span className="font-black">{resolved}</span>
          </div>
        </div>
      </div>
    );
  }

  const selectedResolved = selectedDate ? (dataMap[selectedDate] ?? 0) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-full">
      {/* Calendar grid */}
      <div className="md:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-black text-[var(--accent)] uppercase tracking-widest">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="rounded-lg border border-[var(--border)] p-1 hover:bg-gray-50 transition-colors">
              <ChevronLeft size={16} className="text-[var(--accent)]" />
            </button>
            <button onClick={nextMonth} className="rounded-lg border border-[var(--border)] p-1 hover:bg-gray-50 transition-colors">
              <ChevronRight size={16} className="text-[var(--accent)]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map((day) => (
            <div key={day} className="text-center text-[10px] font-black text-[var(--muted)] uppercase tracking-tighter">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">{days}</div>
      </div>

      {/* Selected day stats */}
      <div className="md:col-span-2 flex flex-col justify-center gap-4 rounded-2xl bg-gray-50/50 p-5 border border-dashed border-gray-200">
        {selectedDate !== null ? (
          <>
            <div className="border-b border-gray-200 pb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Activity for</p>
              <h5 className="text-sm font-black text-[var(--accent)] mt-1">{selectedDate}</h5>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-xs font-bold text-[var(--muted)]">Issues Resolved</span>
              </div>
              <span className="text-sm font-black text-[var(--foreground)]">{selectedResolved}</span>
            </div>
            <p className="text-center text-[10px] font-bold text-[var(--muted)] italic">
              {(selectedResolved ?? 0) > 5 ? "🔥 High resolution day!" : (selectedResolved ?? 0) > 0 ? "Steady progress." : "No resolutions recorded."}
            </p>
          </>
        ) : (
          <div className="text-center py-10">
            <CalendarDays size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-xs font-bold text-[var(--muted)]">Select a date to view<br />resolution activity</p>
          </div>
        )}
      </div>
    </div>
  );
}

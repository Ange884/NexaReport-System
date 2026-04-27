"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, PlayCircle, CalendarDays } from "lucide-react";

// Mock data generator for the calendar
const generateMockData = () => {
  const data: Record<string, { resolved: number; pending: number; inProgress: number }> = {};
  const year = 2026;
  
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      // Random activity
      const seed = Math.random();
      if (seed > 0.3) {
        data[dateKey] = {
          resolved: Math.floor(Math.random() * 15),
          pending: Math.floor(Math.random() * 5),
          inProgress: Math.floor(Math.random() * 8),
        };
      }
    }
  }
  return data;
};

const activityData = generateMockData();

export default function ActivityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-gray-50";
    if (count < 5) return "bg-[#21130D]/20";
    if (count < 10) return "bg-[#21130D]/50";
    return "bg-[#21130D]";
  };

  const days = [];
  // Empty slots for days of the week before the 1st
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayData = activityData[dateKey] || { resolved: 0, pending: 0, inProgress: 0 };
    const isSelected = selectedDate === dateKey;

    days.push(
      <div 
        key={d} 
        onClick={() => setSelectedDate(dateKey)}
        className={`group relative h-10 w-10 cursor-pointer rounded-lg transition-all duration-200 hover:ring-2 hover:ring-[var(--accent)] hover:ring-offset-2 ${getIntensity(dayData.resolved)} ${isSelected ? 'ring-2 ring-[var(--accent)] ring-offset-2 scale-110 z-10 shadow-lg' : ''}`}
      >
        <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${dayData.resolved > 8 ? 'text-white' : 'text-[var(--accent)]'} transition-opacity group-hover:opacity-100 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
          {d}
        </span>
        
        {/* Status indicators */}
        <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
          {dayData.pending > 0 && <div className="h-1 w-1 rounded-full bg-red-400"></div>}
          {dayData.inProgress > 0 && <div className="h-1 w-1 rounded-full bg-blue-400"></div>}
        </div>

        {/* Tooltip on Hover */}
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg bg-[var(--accent)] p-2 text-[10px] text-white shadow-xl group-hover:block z-20 whitespace-nowrap">
          <div className="font-black mb-1">{monthNames[currentDate.getMonth()]} {d}, {currentDate.getFullYear()}</div>
          <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-white"></div> Resolved: {dayData.resolved}</div>
          <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-red-400"></div> Pending: {dayData.pending}</div>
          <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div> Progress: {dayData.inProgress}</div>
        </div>
      </div>
    );
  }

  const selectedData = selectedDate ? activityData[selectedDate] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-full">
      {/* Calendar Grid */}
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
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-[10px] font-black text-[var(--muted)] uppercase tracking-tighter">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>

      {/* Selected Day Stats */}
      <div className="md:col-span-2 flex flex-col justify-center gap-4 rounded-2xl bg-gray-50/50 p-5 border border-dashed border-gray-200">
        {selectedData ? (
          <>
            <div className="border-b border-gray-200 pb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Activity for</p>
              <h5 className="text-sm font-black text-[var(--accent)] mt-1">{selectedDate}</h5>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-xs font-bold text-[var(--muted)]">Resolved</span>
                </div>
                <span className="text-sm font-black text-[var(--foreground)]">{selectedData.resolved}</span>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                    <PlayCircle size={16} />
                  </div>
                  <span className="text-xs font-bold text-[var(--muted)]">In Progress</span>
                </div>
                <span className="text-sm font-black text-[var(--foreground)]">{selectedData.inProgress}</span>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-500">
                    <Clock size={16} />
                  </div>
                  <span className="text-xs font-bold text-[var(--muted)]">Pending</span>
                </div>
                <span className="text-sm font-black text-[var(--foreground)]">{selectedData.pending}</span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <p className="text-[10px] font-bold text-[var(--muted)] leading-tight italic">
                {selectedData.resolved > 10 ? "🔥 Peak resolution performance!" : "Steady progress maintained."}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <CalendarDays size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-xs font-bold text-[var(--muted)]">Select a date to view<br/>detailed activity</p>
          </div>
        )}
      </div>
    </div>
  );
}

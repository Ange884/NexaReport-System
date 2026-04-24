"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  Zap, 
  ListChecks,
  ShieldAlert,
  CalendarDays,
  Megaphone,
  MessageCircle,
  RefreshCw
} from "lucide-react";

const staticBroadcasts = [
  { id: "b1", title: "Water maintenance in Block B this Saturday", type: "Announcement", date: "Today", priority: "Low", comments: [] },
  { id: "b2", title: "General system update scheduled for 10 PM", type: "System", date: "Yesterday", priority: "Medium", comments: [{ author: 'User 1', text: 'Will the power also be affected?', timestamp: '2h ago' }] },
  { id: "b3", title: "New security protocols in effect for labs", type: "Security", date: "2 days ago", priority: "High", comments: [] },
];

const staticIssues = [
  { id: "1", trackingId: "ISS-2026-0001", title: "Dorm corridor light not working", category: "Maintenance", priority: "High", status: "In Progress", reporter: "Monitor A", date: "Apr 18" },
  { id: "2", trackingId: "ISS-2026-0002", title: "Lab internet unstable", category: "ICT", priority: "High", status: "Pending", reporter: "Monitor B", date: "Apr 19" },
  { id: "3", trackingId: "ISS-2026-0003", title: "Need extra revision slot", category: "Academic", priority: "Medium", status: "Resolved", reporter: "Leader C", date: "Apr 15" },
];

const dailyActivity = [
  { day: "Mon", resolved: 12, pending: 5, volume: 17 },
  { day: "Tue", resolved: 18, pending: 8, volume: 26 },
  { day: "Wed", resolved: 15, pending: 12, volume: 27 },
  { day: "Thu", resolved: 25, pending: 4, volume: 29 },
  { day: "Fri", resolved: 20, pending: 6, volume: 26 },
  { day: "Sat", resolved: 10, pending: 2, volume: 12 },
  { day: "Sun", resolved: 8, pending: 3, volume: 11 },
];

export default function AdminDashboardPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [selectedBroadcast, setSelectedBroadcast] = useState<any | null>(null);
  const [activeDay, setActiveDay] = useState<number>(3); // Default to Thursday
  const [response, setResponse] = useState("");
  const [broadcastComment, setBroadcastComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIssues(staticIssues);
    setBroadcasts(staticBroadcasts);
  }, []);

  const handleManage = (issue: any) => {
    setSelectedIssue(issue);
    setResponse("");
  };

  const handleTakeAction = () => {
    const urgentIssue = issues.find(i => i.priority === 'High' && i.status !== 'Resolved') || issues[0];
    if (urgentIssue) {
      setSelectedIssue(urgentIssue);
      setResponse("");
    }
  };

  const submitResponse = () => {
    if (!selectedIssue || !response.trim()) return;
    
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIssues(prev => prev.map(issue => 
        issue.id === selectedIssue.id 
          ? { ...issue, status: 'In Progress', comments: [...(issue.comments || []), { author: 'Admin', text: response, timestamp: 'Just now' }] }
          : issue
      ));
      setSelectedIssue(null);
      setIsUpdating(false);
    }, 1000);
  };

  const submitBroadcastComment = () => {
    if (!selectedBroadcast || !broadcastComment.trim()) return;
    
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setBroadcasts(prev => prev.map(bc => 
        bc.id === selectedBroadcast.id 
          ? { ...bc, comments: [...(bc.comments || []), { author: 'Admin', text: broadcastComment, timestamp: 'Just now' }] }
          : bc
      ));
      // Update the local selectedBroadcast to show the new comment immediately in the modal
      setSelectedBroadcast((prev: any) => ({
        ...prev,
        comments: [...(prev.comments || []), { author: 'Admin', text: broadcastComment, timestamp: 'Just now' }]
      }));
      setBroadcastComment("");
      setIsUpdating(false);
    }, 800);
  };

  return (
    <div className="relative animate-fade-in">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Row 1: Urgent Reports, Broadcast Feed, and Stats */}
        
        {/* 1. Urgent Reports Card */}
        <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:shadow-md flex flex-col h-full">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--foreground)] leading-none">Urgent Reports</h3>
                <p className="mt-1 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest text-nowrap">High priority pending</p>
              </div>
            </div>
            <Link href="/admin/manage-issues" className="transition-all shrink-0">
              <button className="flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:scale-105 hover:cursor-pointer">
                View All <ArrowUpRight size={14} />
              </button>
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                  <th className="pb-4">Issue</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {issues.map((issue) => (
                  <tr key={issue.id} className="group transition-colors hover:bg-[var(--background)]">
                    <td className="py-4 font-bold text-[var(--foreground)]">
                      <p className="text-xs line-clamp-1">{issue.title}</p>
                      <p className="text-[9px] text-[var(--muted)] uppercase tracking-tighter">{issue.date} • {issue.reporter}</p>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleManage(issue)}
                        className="rounded-lg border border-[var(--border)] px-3 py-1 text-[10px] font-bold text-[var(--muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-white"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Broadcast Portal Card */}
        <section className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:shadow-md flex flex-col h-full">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                <Megaphone size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--foreground)] leading-none">Broadcast Feed</h3>
                <p className="mt-1 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Public announcements</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:scale-105 hover:cursor-pointer transition-all shrink-0">
               Post <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="flex-1 space-y-4">
            {broadcasts.map((bc) => (
              <div key={bc.id} className="group relative rounded-xl border border-dashed border-[var(--border)] p-3 transition-all hover:bg-purple-50/50 hover:border-purple-200">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded ${
                      bc.priority === 'High' ? 'bg-red-100 text-red-600' : 
                      bc.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-[#21130D]/10 text-[#21130D]'
                    }`}>
                      {bc.type}
                    </span>
                    <h4 className="mt-1.5 text-xs font-bold text-[var(--foreground)] leading-snug line-clamp-2">{bc.title}</h4>
                    <p className="mt-1 text-[9px] text-[var(--muted)] font-medium uppercase tracking-tighter">{bc.date}</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedBroadcast(bc); setBroadcastComment(""); }}
                    className="flex flex-col items-center gap-1 rounded-lg p-1.5 transition-all hover:bg-white text-[var(--muted)] hover:text-[var(--accent)]"
                  >
                    <MessageCircle size={14} />
                    <span className="text-[9px] font-black">{bc.comments?.length || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Stat Widgets Column */}
        <div className="flex flex-col gap-3 h-full justify-between">
          <StatWidget label="Resolved Issues" value="124" trend="+12%" icon={<ListChecks size={20} />} color="emerald" />
          <StatWidget label="In Progress" value="18" trend="+5" icon={<RefreshCw size={20} />} color="blue" />
          <StatWidget label="Pending Actions" value="12" trend="-2" icon={<Clock size={20} />} color="amber" />
          <StatWidget label="Avg Resolution" value="2.4d" trend="-0.5" icon={<Zap size={20} />} color="indigo" />
        </div>

        {/* Row 2: System Activity and Action Card */}

        {/* 4. System Activity Chart */}
        <section className="lg:col-span-2 flex flex-col rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm min-h-[400px]">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D]/10 text-[#21130D]">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-[var(--foreground)] leading-none">System Activity</h3>
                <p className="mt-1 text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Weekly Report Volume</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span> Resolved
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                <span className="h-2 w-2 rounded-full bg-red-400"></span> Pending
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1">
            <div className="md:col-span-3 flex items-end gap-3 px-4 pb-2 h-48 md:h-full">
              {dailyActivity.map((data, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveDay(i)}
                  className="group relative flex-1 cursor-pointer"
                >
                  <div className="flex h-full flex-col justify-end gap-1">
                    <div 
                      className={`w-full rounded-t-xl transition-all duration-300 relative ${activeDay === i ? 'bg-[var(--accent)] shadow-lg' : 'bg-gray-100 group-hover:bg-[#21130D]/10'}`} 
                      style={{ height: `${(data.volume / 30) * 100}%` }}
                    >
                      {/* Visual indicator for resolved portion */}
                      <div 
                        className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-300 ${activeDay === i ? 'bg-white/20' : 'bg-[#21130D]/20'}`}
                        style={{ height: `${(data.resolved / data.volume) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className={`mt-3 text-center text-[10px] font-bold uppercase tracking-tighter ${activeDay === i ? 'text-[var(--accent)] font-black' : 'text-[var(--muted)]'}`}>
                    {data.day}
                  </p>
                </div>
              ))}
            </div>

            {/* Day Details Info Box */}
            <div className="rounded-2xl bg-gray-50 p-5 flex flex-col justify-center border border-dashed border-gray-200">
              <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                 <CalendarDays size={14} className="text-[var(--accent)]" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]">{dailyActivity[activeDay].day}'s Performance</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-xs font-bold text-[var(--muted)]">Resolved</span>
                  </div>
                  <span className="text-sm font-black text-[var(--foreground)]">{dailyActivity[activeDay].resolved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-red-400" />
                    <span className="text-xs font-bold text-[var(--muted)]">Pending</span>
                  </div>
                  <span className="text-sm font-black text-[var(--foreground)]">{dailyActivity[activeDay].pending}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--foreground)]">Total Load</span>
                  <span className="text-lg font-black text-[var(--accent)]">{dailyActivity[activeDay].volume}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Action Card */}
        <div className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-[var(--accent)] p-6 text-white shadow-xl h-full min-h-[300px]">
           <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
           <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>
           
          <div className="relative z-10">
            <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3 backdrop-blur-md">
              <TrendingUp size={22} className="text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Upcoming Action</p>
            <h4 className="mt-2 text-2xl font-black leading-tight">Clear Maintenance Queue</h4>
            <p className="mt-4 text-xs font-medium opacity-80 leading-relaxed"> You have 5 high-priority maintenance issues requiring immediate assignment to staff.</p>
            <button 
              onClick={handleTakeAction}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-white py-3.5 text-sm font-black text-[var(--accent)] transition-all hover:scale-[1.02] shadow-xl active:scale-95"
            >
              Take Action Now
            </button>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-scale-in">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{selectedIssue.trackingId}</p>
                <h3 className="text-xl font-black text-[var(--foreground)] mt-1">{selectedIssue.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="mb-6 rounded-2xl bg-gray-50 p-4 border border-[var(--border)]">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-[var(--muted)]">Reporter: <span className="text-[var(--foreground)]">{selectedIssue.reporter}</span></span>
                <span className={`px-2 py-0.5 rounded-md ${selectedIssue.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-[#21130D]/10 text-[#21130D]'}`}>
                  {selectedIssue.priority} Priority
                </span>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed italic">
                "{selectedIssue.title}"
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-[var(--foreground)]">Admin Response</label>
              <textarea 
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response or action plan here..."
                className="min-h-[120px] w-full rounded-2xl border border-[var(--border)] p-4 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/20"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={submitResponse}
                  disabled={isUpdating || !response.trim()}
                  className="flex-1 rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white transition-all hover:translate-y-[-2px] hover:brightness-125 hover:shadow-xl hover:shadow-black/30 active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Submit Action'}
                </button>
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="flex-1 rounded-xl border border-[var(--border)] py-3 text-sm font-bold text-[var(--muted)] transition-all hover:translate-y-[-2px] hover:border-[var(--accent)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Comment Modal */}
      {selectedBroadcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-fade-in p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-scale-in">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                  <Megaphone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{selectedBroadcast.type} • {selectedBroadcast.date}</p>
                  <h3 className="text-xl font-black text-[var(--foreground)] mt-1">{selectedBroadcast.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedBroadcast(null)}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="mb-6 max-h-[200px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {selectedBroadcast.comments?.length > 0 ? (
                selectedBroadcast.comments.map((c: any, i: number) => (
                  <div key={i} className="rounded-2xl bg-gray-50 p-4 border border-[var(--border)]">
                    <div className="flex justify-between text-[10px] font-black mb-1">
                      <span className="text-[var(--accent)]">{c.author}</span>
                      <span className="text-[var(--muted)]">{c.timestamp}</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-3xl">
                   <p className="text-xs font-bold text-[var(--muted)]">No comments yet. Be the first to reply!</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-[var(--foreground)]">Add Comment</label>
              <div className="relative">
                <textarea 
                  value={broadcastComment}
                  onChange={(e) => setBroadcastComment(e.target.value)}
                  placeholder="Share your thoughts or ask a question..."
                  className="min-h-[100px] w-full rounded-2xl border border-[var(--border)] p-4 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[#21130D]/20 pr-12"
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={submitBroadcastComment}
                  disabled={isUpdating || !broadcastComment.trim()}
                  className="flex-1 rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white transition-all hover:translate-y-[-2px] hover:bg-[var(--accent)] hover:shadow-xl hover:shadow-[#21130D]/40 disabled:opacity-50"
                >
                  {isUpdating ? 'Posting...' : 'Post Comment'}
                </button>
                <button 
                  onClick={() => setSelectedBroadcast(null)}
                  className="flex-1 rounded-xl border border-[var(--border)] py-3 text-sm font-bold text-[var(--muted)] transition-all hover:translate-y-[-2px] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatWidget({ label, value, trend, icon, color }: { label: string, value: string, trend: string, icon: React.ReactNode, color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-[#21130D]/10 text-[#21130D]",
  };

  return (
    <article className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex-1">
      <div className="flex gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorMap[color]} font-bold`}>
          {React.cloneElement(icon as React.ReactElement)}
        </div>
        <div>
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tight">{label}</p>
          <p className="text-lg font-black text-[var(--foreground)] mt-0.5">{value}</p>
        </div>
      </div>
      <div className={`rounded-lg px-2 py-0.5 text-[9px] font-black ${trend.startsWith('+') || trend.startsWith('-0') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
        {trend}
      </div>
    </article>
  );
}

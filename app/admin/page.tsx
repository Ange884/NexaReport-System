"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const staticIssues = [
  { id: "1", trackingId: "ISS-2026-0001", title: "Dorm corridor light not working", category: "Maintenance", priority: "High", status: "In Progress", reporter: "Monitor A", date: "Apr 18" },
  { id: "2", trackingId: "ISS-2026-0002", title: "Lab internet unstable", category: "ICT", priority: "High", status: "Pending", reporter: "Monitor B", date: "Apr 19" },
  { id: "3", trackingId: "ISS-2026-0003", title: "Need extra revision slot", category: "Academic", priority: "Medium", status: "Resolved", reporter: "Leader C", date: "Apr 15" },
];

export default function AdminDashboardPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [response, setResponse] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIssues(staticIssues);
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

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Data Tables and Primary Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Urgent Reports Card */}
          <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-black text-[var(--foreground)]">Urgent Reports</h3>
                <Link href="/admin/manage-issues" className="transition-all">
                  <button className="text-sm font-bold text-[var(--accent)] hover:scale-105 hover:cursor-pointer">View All</button>
                </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                    <th className="pb-4">Issue</th>
                    <th className="pb-4">Reporter</th>
                    <th className="pb-4">Priority</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {issues.map((issue) => (
                    <tr key={issue.id} className="group transition-colors hover:bg-[var(--background)]">
                      <td className="py-4 font-bold text-[var(--foreground)]">
                        <p className="text-sm">{issue.title}</p>
                        <p className="text-[10px] text-[var(--muted)] uppercase tracking-tighter">{issue.trackingId}</p>
                      </td>
                      <td className="py-4 text-sm text-[var(--muted)] font-medium">{issue.reporter}</td>
                      <td className="py-4">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          issue.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleManage(issue)}
                          className="rounded-lg border border-[var(--border)] px-4 py-1.5 text-xs font-bold text-[var(--muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-white"
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

          {/* System Activity Chart Placeholder */}
          <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-black text-[var(--foreground)]">System Activity</h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span> Resolved
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                  <span className="h-2 w-2 rounded-full bg-red-400"></span> Pending
                </span>
              </div>
            </div>
            <div className="flex h-48 items-end gap-3 px-4">
              {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                <div key={i} className="group relative flex-1">
                  <div 
                    className="w-full rounded-t-xl bg-[var(--accent-soft)] transition-all duration-500 group-hover:bg-[var(--accent)]" 
                    style={{ height: `${h}%` }}
                  ></div>
                  <p className="mt-3 text-center text-[10px] font-bold text-[var(--muted)]">Day {i+1}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Statistics Widgets */}
        <div className="space-y-6">
          <StatWidget label="Resolved Issues" value="124" trend="+12%" icon="✓" color="emerald" />
          <StatWidget label="Pending Actions" value="12" trend="-2" icon="!" color="amber" />
          <StatWidget label="Avg Resolution" value="2.4d" trend="-0.5" icon="⚡" color="indigo" />

          {/* Action Card */}
          <div className="relative mt-4 overflow-hidden rounded-3xl  bg-[var(--accent)] p-6 text-white shadow-xl">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Upcoming Action</p>
              <h4 className="mt-2 text-2xl font-black leading-tight">Resolve Maintenance Queue</h4>
              <p className="mt-4 text-xs font-medium opacity-90 leading-relaxed"> There are currently 5 high-priority maintenance issues requiring immediate assignment.</p>
              <button 
                onClick={handleTakeAction}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-white/20 py-3 text-sm font-bold backdrop-blur-md transition-all hover:bg-white/30"
              >
                Take Action Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
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
                <span className={`px-2 py-0.5 rounded-md ${selectedIssue.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
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
                className="min-h-[120px] w-full rounded-2xl border border-[var(--border)] p-4 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-blue-100"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={submitResponse}
                  disabled={isUpdating || !response.trim()}
                  className="flex-1 rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Submit Action'}
                </button>
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="flex-1 rounded-xl border border-[var(--border)] py-3 text-sm font-bold text-[var(--muted)] transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatWidget({ label, value, trend, icon, color }: { label: string, value: string, trend: string, icon: string, color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <article className="flex items-center justify-between rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorMap[color]} text-xl font-bold`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--muted)]">{label}</p>
          <p className="text-xl font-black text-[var(--foreground)] mt-0.5">{value}</p>
        </div>
      </div>
      <div className={`rounded-lg px-2 py-1 text-[10px] font-black ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
        {trend}
      </div>
    </article>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, MessageCircle } from "lucide-react";

const staticBroadcasts = [
  { id: "b1", title: "Water maintenance in Block B this Saturday", type: "Announcement", date: "Today", priority: "Low", comments: [], description: "Scheduled maintenance will affect water supply between 8 AM and 12 PM. Plan accordingly." },
  { id: "b2", title: "General system update scheduled for 10 PM", type: "System", date: "Yesterday", priority: "Medium", comments: [{ author: 'User 1', text: 'Will the power also be affected?', timestamp: '2h ago' }], description: "The system will be undergoing routine maintenance. Expect minor downtime." },
  { id: "b3", title: "New security protocols in effect for labs", type: "Security", date: "2 days ago", priority: "High", comments: [], description: "All students must sign in at the front desk before entering any computer lab after 6 PM." },
];

export default function Home() {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [selectedBroadcast, setSelectedBroadcast] = useState<any | null>(null);
  const [broadcastComment, setBroadcastComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setBroadcasts(staticBroadcasts);
  }, []);

  const submitBroadcastComment = () => {
    if (!selectedBroadcast || !broadcastComment.trim()) return;
    
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setBroadcasts(prev => prev.map(bc => 
        bc.id === selectedBroadcast.id 
          ? { ...bc, comments: [...(bc.comments || []), { author: 'Guest', text: broadcastComment, timestamp: 'Just now' }] }
          : bc
      ));
      setSelectedBroadcast((prev: any) => ({
        ...prev,
        comments: [...(prev.comments || []), { author: 'Guest', text: broadcastComment, timestamp: 'Just now' }]
      }));
      setBroadcastComment("");
      setIsUpdating(false);
    }, 800);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f0f4f8] p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px]"></div>
      </div>
      
      <section className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[40px] bg-white p-12 text-center shadow-2xl border border-white mb-12">
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-xl shadow-blue-200 animate-fade-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        <p className="text-sm font-black tracking-[0.3em] text-[var(--accent)] uppercase">
          NexaReport System
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-gray-900 leading-tight">
          Modern Control for <br />
          <span className="text-[var(--accent)]">Issue Resolution</span>
        </h1>
        <p className="mt-6 text-lg font-bold text-gray-500 leading-relaxed max-w-xl mx-auto">
          The all-in-one administrative suite for tracking, managing, and resolving facility concerns with efficiency and transparency.
        </p>
        
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-2xl bg-[var(--accent)] px-8 py-4 font-black text-white shadow-xl shadow-blue-200 transition-all hover:bg-[var(--accent)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Access Dashboard
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4 transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/signup"
            className="rounded-2xl border-2 border-gray-100 bg-gray-50 px-8 py-4 font-black text-gray-900 transition-all hover:bg-white hover:border-gray-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-16 flex justify-center items-center gap-8 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-gray-900 rounded-full"></div>
            <span className="text-xs font-black uppercase tracking-tighter">Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-gray-900 rounded-full"></div>
            <span className="text-xs font-black uppercase tracking-tighter">Real-time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-gray-900 rounded-full"></div>
            <span className="text-xs font-black uppercase tracking-tighter">Efficient</span>
          </div>
        </div>
      </section>

      {/* Public Broadcast Section */}
      <section className="relative z-10 w-full max-w-3xl mb-12">
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-8 bg-[var(--accent)] rounded-full"></div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Public Broadcasts</h2>
          </div>
          <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[var(--accent)] uppercase tracking-widest">Live Updates</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {broadcasts.map((bc) => (
            <div key={bc.id} className="group flex flex-col rounded-3xl bg-white p-6 shadow-xl shadow-blue-900/5 border border-white transition-all hover:-translate-y-1 hover:shadow-2xl">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg ${
                  bc.priority === 'High' ? 'bg-red-50 text-red-500' : 
                  bc.priority === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  {bc.type}
                </span>
                <button 
                  onClick={() => { setSelectedBroadcast(bc); setBroadcastComment(""); }}
                  className="flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                >
                  <MessageCircle size={14} />
                  <span className="text-[10px] font-black">{bc.comments?.length || 0}</span>
                </button>
              </div>
              <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-[var(--accent)] transition-colors">{bc.title}</h3>
              <p className="mt-2 text-sm font-medium text-gray-500 line-clamp-2">{bc.description}</p>
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{bc.date}</span>
                <button 
                  onClick={() => { setSelectedBroadcast(bc); setBroadcastComment(""); }}
                  className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[var(--accent)] group-hover:text-white transition-all shadow-sm"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{selectedBroadcast.type} • {selectedBroadcast.date}</p>
                  <h3 className="text-xl font-black text-gray-900 mt-1">{selectedBroadcast.title}</h3>
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
                  <div key={i} className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                    <div className="flex justify-between text-[10px] font-black mb-1">
                      <span className="text-[var(--accent)]">{c.author}</span>
                      <span className="text-gray-400">{c.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-3xl">
                   <p className="text-xs font-bold text-gray-400">No comments yet. Be the first to reply!</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-900">Add Comment</label>
              <textarea 
                value={broadcastComment}
                onChange={(e) => setBroadcastComment(e.target.value)}
                placeholder="Share your thoughts or ask a question..."
                className="min-h-[100px] w-full rounded-2xl border border-gray-200 p-4 text-sm font-medium outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-blue-100"
              />
              
              <div className="flex gap-3">
                <button 
                  onClick={submitBroadcastComment}
                  disabled={isUpdating || !broadcastComment.trim()}
                  className="flex-1 rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Posting...' : 'Post Comment'}
                </button>
                <button 
                  onClick={() => setSelectedBroadcast(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500 transition-all hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

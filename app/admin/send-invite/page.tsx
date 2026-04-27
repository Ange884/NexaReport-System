"use client";

import React, { useState } from "react";
import { Mail, User, ShieldCheck, Send, Info, CheckCircle2 } from "lucide-react";

export default function SendInvitePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Staff",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    // Simulate API call
    setTimeout(() => {
      setSuccessMsg(`Invitation successfully sent to ${formData.email}`);
      setFormData({ fullName: "", email: "", role: "Staff" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-[var(--accent)]">Send Invitation</h1>
        <p className="mt-1 text-[10px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] opacity-70">
          Admin Member Management
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Form Area */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex-1 rounded-[1.5rem] bg-white p-8 border border-[var(--border)] shadow-xl shadow-[var(--accent)]/5">
            {successMsg && (
              <div className="mb-6 rounded-xl bg-[var(--accent)] p-3 flex items-center gap-3 animate-fade-in">
                <CheckCircle2 size={16} className="text-white" />
                <p className="text-[12px] font-bold text-white">{successMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] opacity-60">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Enter full name"
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-10 pr-4 text-[13px] font-bold transition-all focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/5 outline-none placeholder:text-[var(--muted)]/40"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] opacity-60">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" size={16} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-10 pr-4 text-[13px] font-bold transition-all focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/5 outline-none placeholder:text-[var(--muted)]/40"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-[var(--accent)] opacity-60">Assigned Role</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" size={16} />
                  <select
                    className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-10 pr-10 text-[13px] font-bold transition-all focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/5 outline-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Admin">System Administrator</option>
                    <option value="Moderator">Content Moderator</option>
                    <option value="Staff">Operations Staff</option>
                    <option value="Reporter">Field Reporter</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--accent)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[var(--accent)] py-4 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-[var(--accent)]/20"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <span>Send Official Invite</span>
                      <Send size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Information Sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full">
          <div className="flex-1 rounded-[1.5rem] bg-[var(--accent)] p-6 text-white shadow-xl shadow-[var(--accent)]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                <Info size={18} />
              </div>
              <h3 className="text-lg font-black tracking-tight">Role Guide</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                <p className="text-[12px] leading-relaxed"><strong className="block text-[13px] mb-0.5">Administrator</strong> Full system control and user management.</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                <p className="text-[12px] leading-relaxed"><strong className="block text-[13px] mb-0.5">Moderator</strong> Handles triage and task assignments.</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                <p className="text-[12px] leading-relaxed"><strong className="block text-[13px] mb-0.5">Staff</strong> Internal members for executing tasks.</p>
              </div>
              <div className="flex gap-3">
                <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                <p className="text-[12px] leading-relaxed"><strong className="block text-[13px] mb-0.5">Reporter</strong> Restrict to submitting field issues.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-black text-[var(--accent)] mb-2">Security Protocol</h3>
            <p className="text-[11px] font-bold text-[var(--muted)] leading-relaxed">
              Invitations expire in <span className="text-[var(--accent)]">24 hours</span>. Links are single-use only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

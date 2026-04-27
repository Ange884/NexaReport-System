"use client";

import React, { useState } from "react";
import { Mail, User, ShieldCheck, Send, Info } from "lucide-react";

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
      setSuccessMsg(`An invitation has been successfully sent to ${formData.email}.`);
      setFormData({ fullName: "", email: "", role: "Staff" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[var(--foreground)]">Send Invitation</h1>
        <p className="mt-2 text-[var(--muted)] font-medium">
          Invite new members to the NexaReport system and assign their roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="md:col-span-2">
          <div className="rounded-2xl bg-white p-8 border border-[var(--border)] shadow-sm">
            {successMsg && (
              <div className="mb-6 rounded-xl bg-green-50 p-4 border border-green-200 flex items-start gap-3">
                <div className="text-green-500 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <div>
                  <h4 className="font-bold text-green-800 text-sm">Success</h4>
                  <p className="text-xs text-green-700 font-medium mt-1">{successMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[var(--foreground)]">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 text-sm font-medium transition-all focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/5 outline-none placeholder:text-[var(--muted)]/60"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[var(--foreground)]">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                  <input
                    type="email"
                    placeholder="e.g. jane@example.com"
                    required
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 text-sm font-medium transition-all focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/5 outline-none placeholder:text-[var(--muted)]/60"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[var(--foreground)]">System Role</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" size={18} />
                  <select
                    className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-10 text-sm font-medium transition-all focus:border-[var(--accent)] focus:bg-white focus:ring-4 focus:ring-[var(--accent)]/5 outline-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Admin">Administrator</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Staff">Staff</option>
                    <option value="Reporter">Reporter</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3.5 text-sm font-bold text-white transition-all hover:opacity-95 hover:shadow-lg hover:shadow-[var(--accent)]/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      Send Invitation Link
                      <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Information Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-2xl bg-[var(--accent-soft)] p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Info size={16} />
              </div>
              <h3 className="font-bold text-[var(--foreground)]">Role Guide</h3>
            </div>
            <ul className="space-y-3 text-sm text-[var(--muted)] font-medium">
              <li><strong className="text-[var(--foreground)]">Administrator:</strong> Full access to system settings, user management, and all reports.</li>
              <li><strong className="text-[var(--foreground)]">Moderator:</strong> Can manage issues, assign tasks, and moderate comments.</li>
              <li><strong className="text-[var(--foreground)]">Staff:</strong> Internal members who handle tasks and view internal reports.</li>
              <li><strong className="text-[var(--foreground)]">Reporter:</strong> External or field agents who can only submit and track their own issues.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-[var(--border)]">
            <h3 className="font-bold text-[var(--foreground)] mb-2">Important Notice</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Invitations are sent via email and contain a secure, one-time link. 
              The link will expire after <strong>24 hours</strong> for security purposes. 
              If the link expires, you will need to send a new invitation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

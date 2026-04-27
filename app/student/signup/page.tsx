"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from "lucide-react";

const fieldClass =
  "w-full rounded-2xl border-[1.5px] border-[#e2e8f0] bg-[rgba(33,19,13,0.02)] py-4 pl-12 pr-5 text-[0.95rem] font-medium text-[#1a202c] outline-none transition-all duration-300 placeholder:text-[#a0aec0] focus:border-[#21130D] focus:bg-white focus:shadow-[0_0_0_5px_rgba(33,19,13,0.06),0_4px_16px_rgba(33,19,13,0.05)]";

export default function StudentSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/student/dashboard");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right,rgba(33,19,13,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(33,19,13,0.04) 1px,transparent 1px)",
        }}
      />
      {/* Blobs */}
      <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(33,19,13,0.06)_0%,rgba(255,255,255,0)_70%)] blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(33,19,13,0.06)_0%,rgba(255,255,255,0)_70%)] blur-[60px]" />

      <div className="relative z-10 flex w-full max-w-5xl items-center justify-between gap-16 px-8 py-10 md:px-12">

        {/* Left showcase */}
        <div className="hidden flex-1 flex-col justify-center md:flex">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(33,19,13,0.1)] bg-[rgba(33,19,13,0.03)] px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#21130D] opacity-60" />
            <span className="text-[0.8rem] font-bold uppercase tracking-[0.12em] text-[#21130D] opacity-70">Student Portal</span>
          </div>
          <h1
            className="mb-6 text-[5rem] leading-[1.05] tracking-wide text-[#21130D]"
            style={{ fontFamily: "'Creepster', cursive", textShadow: "2px 2px 4px rgba(33,19,13,0.1)" }}
          >
            Speak Up!
          </h1>
          <p className="max-w-[80%] text-xl font-medium leading-relaxed text-[#21130D] opacity-80">
            A fast, secure, and hassle-free platform for students to report
            issues easily to the staff. Your voice matters here.
          </p>
          {/* Decorative divider */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-[rgba(33,19,13,0.08)]" />
            <span className="text-[0.75rem] font-bold uppercase tracking-widest text-[#21130D] opacity-40">Trusted & Secure</span>
            <div className="h-px flex-1 bg-[rgba(33,19,13,0.08)]" />
          </div>
        </div>

        {/* Auth card */}
        <div className="relative w-full max-w-[480px] overflow-hidden rounded-3xl border border-[rgba(33,19,13,0.08)] bg-white/98 px-10 py-12 shadow-[0_32px_80px_rgba(33,19,13,0.12),0_4px_16px_rgba(33,19,13,0.06)] backdrop-blur-xl">
          {/* Top accent bar */}
          <div className="absolute left-0 top-0 h-1 w-full bg-[#21130D]" />
          {/* Corner glow */}
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-[rgba(33,19,13,0.03)] blur-3xl" />

          {/* Logo + Brand */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D] text-white shadow-[0_4px_16px_rgba(33,19,13,0.3)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[1.35rem] font-black tracking-[0.08em] text-[#21130D]">NEXA</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(33,19,13,0.05)] text-[#21130D] ring-1 ring-[rgba(33,19,13,0.06)]">
              <UserPlus size={28} strokeWidth={2} />
            </div>
            <h2 className="text-[1.875rem] font-black tracking-tight text-[#21130D]">
              Create Account
            </h2>
            <p className="mt-1.5 text-[0.9rem] font-medium text-[#718096]">
              Join the student portal to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[0.78rem] font-extrabold uppercase tracking-[0.1em] text-[#718096]">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#718096] opacity-70" size={18} />
                <input type="text" placeholder="John Doe" required className={fieldClass} />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[0.78rem] font-extrabold uppercase tracking-[0.1em] text-[#718096]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#718096] opacity-70" size={18} />
                <input type="email" placeholder="student@university.edu" autoComplete="email" required className={fieldClass} />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[0.78rem] font-extrabold uppercase tracking-[0.1em] text-[#718096]">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#718096] opacity-70" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  className={`${fieldClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg p-1.5 text-[#718096] transition-all duration-200 hover:bg-[rgba(33,19,13,0.06)] hover:text-[#21130D]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="pt-1">
              <button
                type="submit"
                className="relative w-full overflow-hidden rounded-2xl bg-[#21130D] py-4 text-[1rem] font-black text-white shadow-[0_8px_24px_rgba(33,19,13,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(33,19,13,0.35)] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_60%)]" />
                <span className="relative">Register Now</span>
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-[rgba(33,19,13,0.06)] pt-6 text-center text-[0.875rem] font-medium text-[#718096]">
            Already have an account?{" "}
            <Link href="/student/login" className="font-extrabold text-[#21130D] transition-opacity hover:opacity-70">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Creepster&display=swap');`}</style>
    </main>
  );
}

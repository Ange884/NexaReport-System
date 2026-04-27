"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/student/dashboard");
  }

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
      <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[600px] w-[600px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(33,19,13,0.06)_0%,rgba(255,255,255,0)_70%)] blur-[40px]" />
      <div className="pointer-events-none absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(33,19,13,0.06)_0%,rgba(255,255,255,0)_70%)] blur-[40px]" />

      <div className="relative z-10 flex w-full max-w-5xl items-center justify-between gap-16 px-8 py-10 md:px-12">
        {/* Left showcase */}
        <div className="hidden flex-1 flex-col justify-center md:flex">
          <h1
            className="mb-6 text-[5rem] leading-[1.1] tracking-wide text-[#21130D]"
            style={{ fontFamily: "'Creepster', cursive", textShadow: "2px 2px 4px rgba(33,19,13,0.1)" }}
          >
            Speak Up!
          </h1>
          <p className="max-w-[80%] text-xl font-medium leading-relaxed text-[#21130D] opacity-80">
            A fast, secure, and hassle-free platform for students to report
            issues easily to the staff. Your voice matters here.
          </p>
        </div>

        {/* Login card */}
        <div className="relative w-full max-w-[480px] overflow-hidden rounded-lg border border-[rgba(33,19,13,0.08)] bg-white/95 px-14 py-14 shadow-[0_24px_60px_rgba(33,19,13,0.12)] backdrop-blur-xl">
          {/* Top accent bar */}
          <div className="absolute left-0 top-0 h-1.5 w-full bg-[#21130D]" />

          {/* Logo + Brand */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#21130D] text-white shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[1.4rem] font-black tracking-[0.08em] text-[#21130D]">NEXA</span>
          </div>

          <h2 className="text-center text-2xl font-extrabold tracking-tight text-[#21130D]">
            Sign In
          </h2>
          <p className="mt-1 text-center text-sm text-[#718096]">
            Access your student portal.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#21130D]">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-4 text-[#718096]" size={18} />
                <input
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#e2e8f0] bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-[#1a202c] outline-none transition focus:border-[#21130D] focus:ring-4 focus:ring-[rgba(33,19,13,0.08)]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#21130D]">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="pointer-events-none absolute left-4 text-[#718096]" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#e2e8f0] bg-white py-2.5 pl-10 pr-12 text-sm font-medium text-[#1a202c] outline-none transition focus:border-[#21130D] focus:ring-4 focus:ring-[rgba(33,19,13,0.08)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 flex items-center justify-center rounded-lg p-1 text-[#718096] transition hover:bg-[rgba(33,19,13,0.05)] hover:text-[#21130D]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-[#718096]">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-[#e2e8f0] accent-[#21130D]"
                />
                Remember me
              </label>
              <Link href="#" className="text-sm font-bold text-[#21130D] hover:opacity-70">
                Forgot Password
              </Link>
            </div>

            <button
              type="submit"
              className="mt-2 block w-full rounded-xl bg-[#21130D] py-3 text-center font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#718096]">
            Don&apos;t have an account?{" "}
            <Link href="/student/signup" className="font-bold text-[#21130D] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Creepster&display=swap');`}</style>
    </main>
  );
}

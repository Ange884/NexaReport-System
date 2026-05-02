"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, CheckCircle, Shield, Zap, Bell, FileText,
  Users, Lock, ChevronDown, Menu, X, Star, TrendingUp,
} from "lucide-react";
import { fetchPublicStats } from "@/app/lib/api";
import type { PublicStatsResponse } from "@/app/lib/types";

function useCounter(target: number, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = target / (duration / 16);
      const t = setInterval(() => {
        start += step;
        if (start >= target) { setVal(target); clearInterval(t); }
        else setVal(Math.floor(start));
      }, 16);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

const steps = [
  { n: "01", title: "Submit Your Issue", body: "Log in to your student portal and fill out a simple form — title, description, category, and priority. Takes under 60 seconds.", icon: FileText },
  { n: "02", title: "Instant Tracking", body: "Your issue is assigned a unique tracking ID the moment it's submitted. Monitor its status in real time from your dashboard.", icon: TrendingUp },
  { n: "03", title: "Admin Review", body: "Our administrators receive an instant alert, triage the issue, assign it to the right team, and post an official response.", icon: Users },
  { n: "04", title: "Resolution & Closure", body: "Once resolved, you're notified immediately. Every issue is archived for full transparency and accountability.", icon: CheckCircle },
];

const features = [
  { icon: Shield, title: "Anonymous Public Feed", body: "Browse community issues without exposing anyone's identity. Privacy is built in, not bolted on." },
  { icon: Bell, title: "Real-Time Notifications", body: "Get instant alerts when your issue status changes — from submission to resolution." },
  { icon: Zap, title: "Priority Triage", body: "Issues are automatically ranked by urgency so critical problems never get buried." },
  { icon: Lock, title: "Secure & Private", body: "End-to-end data protection. Your personal information is never shared with other students." },
  { icon: FileText, title: "Full Audit Trail", body: "Every action is logged. Admins and students both have a transparent record of every interaction." },
  { icon: TrendingUp, title: "Analytics Dashboard", body: "Admins track resolution rates, category trends, and response times to continuously improve." },
];

const faqs = [
  { q: "Who can submit an issue?", a: "Any registered student with a valid portal account can submit issues. Class monitors and leaders have additional privileges." },
  { q: "How long does resolution take?", a: "Our average resolution time is under 2.4 days. High-priority issues are escalated within the hour." },
  { q: "Is my identity protected?", a: "Yes. The public feed shows only anonymized data. Your name and personal details are never visible to other students." },
  { q: "Can I track my issue after submitting?", a: "Absolutely. Every issue gets a unique tracking ID and you can monitor its status live from your dashboard." },
  { q: "What categories of issues can I report?", a: "Academic, Infrastructure, ICT, Administrative, and more. If your issue doesn't fit a category, use 'Other'." },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const [stats, setStats] = useState<PublicStatsResponse>({
    totalIssues: 0,
    resolvedIssues: 0,
    resolvedPercentage: 0
  });

  useEffect(() => {
    fetchPublicStats()
      .then(setStats)
      .catch(() => {}); // Fallback to defaults if API fails
  }, []);

  const issues = useCounter(stats.totalIssues);
  const resolved = useCounter(Math.round(stats.resolvedPercentage));
  const days = useCounter(24, 1200);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#1a202c]" style={{ fontFamily: "var(--font-urbanist), sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#e2e8f0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#21130D] shadow-[0_4px_12px_rgba(33,19,13,0.3)]">
              <img src="/nexa.png" alt="Logo" className="h-10 w-10" />
            </div>
            <span className="text-lg font-black tracking-tight text-[#21130D]">VEXA</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {["Features", "How It Works", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-bold text-[#718096] transition hover:text-[#21130D]">
                {l}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-full border border-[#e2e8f0] px-5 py-2 text-sm font-bold text-[#718096] transition hover:bg-[#21130D] hover:text-[#fff]">
              Go to Login →
            </Link>
            {/* <Link href="/admin/login" className="rounded-full bg-[#21130D] px-5 py-2 text-sm font-black text-white shadow-[0_4px_14px_rgba(33,19,13,0.25)] transition hover:opacity-90">
              Admin Portal 
            </Link> */}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2e8f0] text-[#718096] md:hidden">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-[#e2e8f0] bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {["Features", "How It Works", "FAQ"].map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)} className="text-sm font-bold text-[#718096] transition hover:text-[#21130D]">
                  {l}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-[#e2e8f0] pt-4">
                <Link href="/login" className="rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-center text-sm font-bold text-[#1a202c]">Student Login</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-white pt-16">
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 z-0" style={{
          backgroundSize: "48px 48px",
          backgroundImage: "linear-gradient(to right,rgba(33,19,13,0.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(33,19,13,0.03) 1px,transparent 1px)",
        }} />
        {/* Soft radial tint — chocolate used sparingly */}
        <div className="pointer-events-none absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(33,19,13,0.04)_0%,transparent_70%)] blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(33,19,13,0.03)_0%,transparent_70%)] blur-3xl" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 py-24 lg:grid-cols-2">

          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f0f4f8] px-4 py-1.5">
              <Star size={12} className="text-[#21130D]" fill="currentColor" />
              <span className="text-[0.72rem] font-black uppercase tracking-[0.15em] text-[#718096]">Student Issue Reporting System</span>
            </div>

            <h1 className="mb-6 leading-[1.05]">
              <span className="block text-[3.5rem] font-black tracking-tight text-[#1a202c] lg:text-[4.75rem]">
                Your voice,
              </span>
              <span className="block text-[3.5rem] font-black italic tracking-tight text-[#21130D] lg:text-[4.75rem]">
                finally heard.
              </span>
            </h1>

            <p className="mb-10 max-w-[480px] text-[1.1rem] font-medium leading-relaxed text-[#718096]">
               Vexa is the fast, secure, and transparent platform that connects students directly to the staff who can fix things. Submit an issue in under 60 seconds — we handle the rest.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/login" className="group flex items-center gap-2.5 rounded-full bg-[#21130D] px-7 py-3.5 text-[0.95rem] font-black text-white shadow-[0_8px_28px_rgba(33,19,13,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(33,19,13,0.35)]">
                Get Started
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="#how-it-works" className="flex items-center gap-2 text-sm font-bold text-[#718096] transition hover:text-[#21130D]">
                See how it works <ChevronDown size={16} />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-[#e2e8f0] pt-8">
              {[["100%", "Secure"], ["< 2.4d", "Avg. Resolution"], ["24/7", "Monitoring"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-xl font-black text-[#21130D]">{v}</p>
                  <p className="text-[0.72rem] font-bold uppercase tracking-widest text-[#a0aec0]">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mock dashboard */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 rounded-3xl bg-[rgba(33,19,13,0.03)] blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-1 shadow-[0_32px_80px_rgba(33,19,13,0.1)]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 border-b border-[#e2e8f0] bg-[#f8f9fc] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-[0.7rem] font-bold text-[#a0aec0]">VEXA — Student Portal</span>
                <span className="ml-auto flex items-center gap-1.5 text-[0.65rem] font-black text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[0.7rem] font-black uppercase tracking-widest text-[#a0aec0]">Issue Resolution Rate</span>
                    <span className="text-[0.7rem] font-black text-emerald-500">97%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#f0f4f8]">
                    <div className="h-full w-[97%] rounded-full bg-[#21130D]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fc] p-4">
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#a0aec0]">Issues Submitted</p>
                    <p ref={issues.ref} className="mt-1 text-2xl font-black text-[#1a202c]">{issues.val.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl border border-[#e2e8f0] bg-[#f8f9fc] p-4">
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#a0aec0]">Resolved</p>
                    <p ref={resolved.ref} className="mt-1 text-2xl font-black text-emerald-500">{resolved.val}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#f8f9fc] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(33,19,13,0.06)] text-[#21130D]">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-[0.8rem] font-black text-[#1a202c]">Broken projector — Room 402</p>
                      <p className="text-[0.65rem] font-bold text-[#a0aec0]">ISS-2026-0041 • Maintenance</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[0.65rem] font-black text-amber-600">Pending</span>
                </div>

                <div className="flex items-end justify-between rounded-xl border border-[rgba(33,19,13,0.08)] bg-[rgba(33,19,13,0.03)] px-5 py-4">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#a0aec0]">Avg. Resolution</p>
                    <p ref={days.ref} className="mt-1 text-3xl font-black text-[#21130D]">{(days.val / 10).toFixed(1)}<span className="text-lg">d</span></p>
                  </div>
                  <span className="text-[0.7rem] font-black text-emerald-500">↓ Faster Resolution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative overflow-hidden bg-[#f8f9fc] py-28">
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundSize: "40px 40px",
          backgroundImage: "linear-gradient(to right,rgba(33,19,13,0.025) 1px,transparent 1px),linear-gradient(to bottom,rgba(33,19,13,0.025) 1px,transparent 1px)",
        }} />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#21130D]">Process</p>
            <h2 className="text-[2.75rem] font-black leading-tight tracking-tight text-[#1a202c]">
              How it <span className="italic text-[#21130D]">works.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[1rem] font-medium leading-relaxed text-[#718096]">
              From submission to resolution — a seamless four-step process designed for speed and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.n} className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(33,19,13,0.15)] hover:shadow-[0_20px_50px_rgba(33,19,13,0.08)]">
                  <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[5rem] font-black leading-none text-[#21130D]/[0.04]">{s.n}</span>
                  <div className="relative z-10">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#21130D] text-white shadow-[0_6px_20px_rgba(33,19,13,0.2)] transition-transform duration-300 group-hover:scale-110">
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <p className="mb-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#21130D]/50">Step {s.n}</p>
                    <h3 className="mb-3 text-[1.05rem] font-black text-[#1a202c]">{s.title}</h3>
                    <p className="text-[0.9rem] font-medium leading-relaxed text-[#718096]">{s.body}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#21130D] transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative overflow-hidden bg-white py-28">
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundSize: "48px 48px",
          backgroundImage: "linear-gradient(to right,rgba(33,19,13,0.025) 1px,transparent 1px),linear-gradient(to bottom,rgba(33,19,13,0.025) 1px,transparent 1px)",
        }} />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#21130D]">Capabilities</p>
            <h2 className="text-[2.75rem] font-black leading-tight tracking-tight text-[#1a202c]">
              Built for <span className="italic text-[#21130D]">every student.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[1rem] font-medium leading-relaxed text-[#718096]">
              Every feature is designed with one goal — making sure your issues get resolved, fast.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(33,19,13,0.15)] hover:shadow-[0_16px_40px_rgba(33,19,13,0.07)]">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[rgba(33,19,13,0.02)] transition-transform duration-500 group-hover:scale-[2]" />
                  <div className="relative z-10">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#e2e8f0] bg-[#f8f9fc] text-[#21130D] transition-all duration-300 group-hover:bg-[#21130D] group-hover:text-white group-hover:border-[#21130D] group-hover:shadow-[0_6px_20px_rgba(33,19,13,0.2)]">
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <h3 className="mb-2.5 text-[1.05rem] font-black text-[#1a202c]">{f.title}</h3>
                    <p className="text-[0.9rem] font-medium leading-relaxed text-[#718096]">{f.body}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#21130D] transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="border-y border-[#e2e8f0] bg-[#f8f9fc] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: `${stats.totalIssues.toLocaleString()}+`, label: "Issues Submitted" },
              { value: `${Math.round(stats.resolvedPercentage)}%`, label: "Resolution Rate" },
              { value: "< 2.4d", label: "Avg. Resolution Time" },
              { value: "100%", label: "Data Privacy" },
            ].map((s) => (
              <div key={s.label} className="group text-center">
                <p className="text-[2.75rem] font-black leading-none tracking-tight text-[#21130D] transition-transform duration-300 group-hover:scale-105">{s.value}</p>
                <p className="mt-2 text-[0.72rem] font-black uppercase tracking-[0.15em] text-[#a0aec0]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative overflow-hidden bg-white py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#21130D]">FAQ</p>
            <h2 className="text-[2.75rem] font-black leading-tight tracking-tight text-[#1a202c]">
              Common <span className="italic text-[#21130D]">questions.</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm transition-all duration-200 hover:border-[rgba(33,19,13,0.15)] hover:shadow-[0_4px_20px_rgba(33,19,13,0.06)]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-[0.95rem] font-black text-[#1a202c]">{f.q}</span>
                  <ChevronDown size={18} className={`flex-shrink-0 text-[#21130D] transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="border-t border-[#e2e8f0] px-6 py-5">
                    <p className="text-[0.9rem] font-medium leading-relaxed text-[#718096]">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND — chocolate used here as accent ── */}
      <section className="relative overflow-hidden bg-[#21130D] py-28">
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundSize: "48px 48px",
          backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px)",
        }} />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="mb-4 text-[0.72rem] font-black uppercase tracking-[0.2em] text-white/40">Get Started Today</p>
          <h2 className="mb-6 text-[3rem] font-black leading-tight tracking-tight text-white lg:text-[3.5rem]">
            Stop waiting.<br />
            <span className="font-black italic text-white/80">Start reporting.</span>
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-[1rem] font-medium leading-relaxed text-white/60">
            Join hundreds of students who already use Vexa to get their issues heard and resolved. It takes less than a minute to get started.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/login" className="group flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-[0.95rem] font-black text-[#21130D] shadow-[0_8px_32px_rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(255,255,255,0.2)]">
                 Student Login
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#e2e8f0] bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#21130D]">
              <img src="/nexa.png" alt="Logo" className="h-10 w-10" />
            </div>
            <span className="text-sm font-black tracking-tight text-[#21130D]">VEXA</span>
          </div>
          <p className="text-[0.75rem] font-bold text-[#a0aec0]">
            © {new Date().getFullYear()} Vexa. Built for students, by students.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[0.75rem] font-bold text-[#718096] transition hover:text-[#21130D]">Login</Link>
            {/* <Link href="/admin/login" className="text-[0.75rem] font-bold text-[#718096] transition hover:text-[#21130D]">Admin</Link> */}
          </div>
        </div>
      </footer>

    </div>
  );
}

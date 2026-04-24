import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f4f8] p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px]"></div>
      </div>

      <section className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[40px] bg-white p-12 text-center shadow-2xl border border-white">
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
    </main>
  );
}

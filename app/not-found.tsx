import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-gray-200 bg-white/80 p-10 text-center shadow-[0_12px_26px_rgba(17,24,39,0.08)] backdrop-blur">
          <p className="text-sm font-semibold text-blue-700/90">SVIET CSE</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Update Soon
          </h1>
          <p className="mt-3 text-base font-medium text-slate-600 md:text-lg">
            This page will be updated soon.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              Go to Home
            </Link>
            <Link
              href="/semester"
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
            >
              Open Semesters
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

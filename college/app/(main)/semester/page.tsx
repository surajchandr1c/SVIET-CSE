"use client";

import Link from "next/link";

export default function SemestersPage() {
  return (
    <div className="min-h-screen animate-fadeIn px-6 pb-10 pt-8">
      <main className="mx-auto max-w-[1680px]">
        <h1 className="text-3xl font-bold text-slate-200 md:text-4xl lg:text-[2.2rem]">B.Tech CSE - Semesters</h1>

        <p className="mt-5 text-lg text-slate-300 md:text-xl lg:text-lg">Select your semester:</p>

        <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 lg:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          <div className="rounded-2xl border border-cyan-400/20 bg-[#0b1c47]/75 p-10 text-center shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 lg:p-8">
            <Link href="/semester/4thSem" className="text-2xl font-bold text-cyan-300 md:text-[1.9rem] lg:text-[1.55rem]">
              4th Semester
            </Link>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-[#0b1c47]/75 p-10 text-center shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 lg:p-8">
            <Link href="/semester/6thSem" className="text-2xl font-bold text-cyan-300 md:text-[1.9rem] lg:text-[1.55rem]">
              6th Semester
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

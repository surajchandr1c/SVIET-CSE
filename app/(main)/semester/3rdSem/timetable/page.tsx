"use client";

import { useState } from "react";
import SectionTabsClient, { type SectionKey } from "./SectionTabsClient";

const sectionLabels: Record<SectionKey, string> = {
  a: "Section A",
  b: "Section B",
  c: "Section C",
  aiMl: "AI/ML",
};

export default function ThirdSemesterTimetablePage() {
  const [section, setSection] = useState<SectionKey>("a");

  return (
    <main className="min-h-screen px-6 pb-10 pt-10">
      <div className="mx-auto max-w-295">
        <h1 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">
          3rd Semester Timetable
        </h1>
        <p className="mt-3 text-center text-slate-600">
          Select your section to view the schedule.
        </p>

        <SectionTabsClient value={section} onChange={setSection} />

        <section className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(17,24,39,0.10)] ring-1 ring-black/5">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <h2 className="text-xl font-extrabold text-slate-900">
              3rd Semester ({sectionLabels[section]})
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              The timetable for this section will be published here.
            </p>
          </div>
          <div className="px-6 py-16 text-center text-slate-500">
            Timetable schedule coming soon.
          </div>
        </section>
      </div>
    </main>
  );
}

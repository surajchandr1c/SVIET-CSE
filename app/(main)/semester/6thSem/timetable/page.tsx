"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTabsClient, { type SectionKey } from "./SectionTabsClient";

function Placeholder({ section }: { section: "X" }) {
  return (
    <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-black/5">
      <p className="text-lg font-semibold text-[#0b3c5d]">
        SEC - {section} timetable will be updated soon.
      </p>
      <p className="mt-2 text-gray-600">
        If you have the latest timetable, share it and I’ll add it here.
      </p>
    </div>
  );
}

function SectionYTimetableEmbed() {
  return (
    <div className="mx-auto mt-6 w-full max-w-[1180px]">
      <div className="rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
        <iframe
          title="6th Semester Timetable - Section Y"
          src="/semester/6thSem/section-y-timetable.html"
          className="w-full h-[calc(100vh-250px)] min-h-[900px]"
        />
      </div>
    </div>
  );
}

export default function TimetablePage() {
  const [section, setSection] = useState<SectionKey>("x");

  return (
    <div className="min-h-screen bg-transparent p-6">
      <h1 className="text-3xl font-bold text-center text-[#0b3c5d]">
        6th Semester Time Table
      </h1>
      <p className="mt-2 text-center text-gray-600">
        Select your section to view the schedule.
      </p>

      <SectionTabsClient value={section} onChange={setSection} />

      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {section === "x" ? <Placeholder section="X" /> : <SectionYTimetableEmbed />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTabsClient, { type SectionKey } from "./SectionTabsClient";

function TimetableEmbed({ section, src }: { section: "Y" | "Z"; src: string }) {
  return (
    <div className="mx-auto mt-6 w-full max-w-[1180px]">
      <div className="rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
        <iframe
          title={`6th Semester Timetable - Section ${section}`}
          src={src}
          className="w-full h-[calc(100vh-250px)] min-h-[900px]"
        />
      </div>
      <p className="mt-3 text-center text-xs sm:text-sm text-slate-600">
        Tip: On mobile, swipe horizontally to view the full timetable.
      </p>
    </div>
  );
}

export default function TimetablePage() {
  const [section, setSection] = useState<SectionKey>("y");

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
          {section === "y" ? (
            <TimetableEmbed
              section="Y"
              src="/semester/6thSem/section-y-timetable.html"
            />
          ) : (
            <TimetableEmbed
              section="Z"
              src="/semester/6thSem/section-z-timetable.html"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

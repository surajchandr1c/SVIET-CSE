"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import SemesterTabsClient, { type SemesterKey } from "./SemesterTabsClient";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarClock,
  ClipboardList,
  FileText,
  NotebookPen,
  Presentation,
  Users,
  UsersRound,
} from "lucide-react";

type SemesterItem = {
  name: string;
  link: string;
  description: string;
  Icon: LucideIcon;
};

const fourthSemItems: SemesterItem[] = [
  {
    name: "Time Table",
    link: "/semester/4thSem/timetable",
    description: "University-style timetable (SEC - D).",
    Icon: CalendarClock,
  },
  {
    name: "Syllabus",
    link: "/semester/4thSem/syllabus",
    description: "Subjects and course structure.",
    Icon: BookOpen,
  },
  {
    name: "Faculty",
    link: "/faculty",
    description: "Meet faculty & profiles.",
    Icon: Users,
  },
  {
    name: "Students List",
    link: "/semester/4thSem/studentsList",
    description: "Class list and details.",
    Icon: UsersRound,
  },
  {
    name: "Previous 5-Year Question Papers",
    link: "/semester/4thSem/Previous",
    description: "Prepare with past papers.",
    Icon: FileText,
  },
  {
    name: "Assignment",
    link: "/semester/4thSem/assignment",
    description: "Assignments and uploads.",
    Icon: ClipboardList,
  },
  {
    name: "Notes",
    link: "/semester/4thSem/notes",
    description: "Topic-wise notes.",
    Icon: NotebookPen,
  },
  {
    name: "PPT",
    link: "/semester/4thSem/ppt",
    description: "Presentations & slides.",
    Icon: Presentation,
  },
];

const sixthSemItems: SemesterItem[] = [
  {
    name: "Time Table",
    link: "/semester/6thSem/timetable",
    description: "Schedule and lectures.",
    Icon: CalendarClock,
  },
  {
    name: "Syllabus",
    link: "/semester/6thSem/syllabus",
    description: "Subjects and course structure.",
    Icon: BookOpen,
  },
  {
    name: "Faculty",
    link: "/faculty",
    description: "Meet faculty & profiles.",
    Icon: Users,
  },
  {
    name: "Students List",
    link: "/semester/6thSem/studentsList",
    description: "Class list and details.",
    Icon: UsersRound,
  },
  {
    name: "Previous 5-Year Question Papers",
    link: "/semester/6thSem/Previous",
    description: "Prepare with past papers.",
    Icon: FileText,
  },
  {
    name: "Assignment",
    link: "/semester/6thSem/assignment",
    description: "Assignments and uploads.",
    Icon: ClipboardList,
  },
  {
    name: "Notes",
    link: "/semester/6thSem/notes",
    description: "Topic-wise notes.",
    Icon: NotebookPen,
  },
  {
    name: "PPT",
    link: "/semester/6thSem/ppt",
    description: "Presentations & slides.",
    Icon: Presentation,
  },
];

export default function SemestersPage() {
  const [semester, setSemester] = useState<SemesterKey>("4th");

  const items = useMemo(
    () => (semester === "4th" ? fourthSemItems : sixthSemItems),
    [semester]
  );

  return (
    <div className="min-h-screen animate-fadeIn px-6 pb-10 pt-8">
      <main className="mx-auto max-w-[1680px]">
        <h1 className="text-3xl font-bold text-slate-200 md:text-4xl lg:text-[2.2rem]">
          B.Tech CSE - Semesters
        </h1>

        <p className="mt-5 text-lg text-slate-300 md:text-xl lg:text-lg">
          Select your semester:
        </p>

        <SemesterTabsClient value={semester} onChange={setSemester} />

        <AnimatePresence mode="wait">
          <motion.div
            key={semester}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mt-2 text-center">
              <p className="mt-2 text-slate-300">Select a category below:</p>
            </div>

            <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
              {items.map((item) => (
                <Link
                  key={`${semester}-${item.name}`}
                  href={item.link}
                  className="group relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-[#0b1c47]/45 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-[#0b1c47]/55 hover:shadow-[0_24px_65px_rgba(0,0,0,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-cyan-400/15 blur-2xl" />
                    <div className="absolute -left-14 -bottom-14 h-44 w-44 rounded-full bg-yellow-400/10 blur-2xl" />
                  </div>

                  <div className="relative flex items-start gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-400/90 text-slate-950 shadow-[0_10px_26px_rgba(250,204,21,0.22)] ring-1 ring-yellow-300/40">
                      <item.Icon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-lg font-extrabold text-slate-100 md:text-xl">
                          {item.name}
                        </h3>
                        <span className="text-xs font-bold text-cyan-200/90 opacity-70 transition-opacity group-hover:opacity-100">
                          Open →
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-300/90">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-5 h-px w-full bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent" />
                  <div className="relative mt-4 flex items-center justify-between text-xs text-slate-300/85">
                    <span className="font-semibold">
                      {semester === "4th" ? "4th Semester" : "6th Semester"}
                    </span>
                    <span className="font-semibold text-yellow-300/90">SVIET CSE</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

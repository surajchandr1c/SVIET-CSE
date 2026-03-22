import Link from "next/link";
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

const sixthSemItems: SemesterItem[] = [
  {
    name: "Time Table",
    link: "/semester/6thSem/timetable",
    description: "See your weekly schedule.",
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

export default function SixthSemesterPage() {
  return (
    <div className="min-h-screen animate-fadeIn px-6 pb-10 pt-8">
      <main className="mx-auto max-w-[1680px]">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl lg:text-[2.2rem]">
          6th Semester - B.Tech CSE
        </h1>

        <p className="mt-3 text-lg text-slate-600 md:text-xl lg:text-lg">
          Select a category below:
        </p>

        <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          {sixthSemItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-[0_12px_26px_rgba(17,24,39,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_rgba(17,24,39,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-600/10 blur-2xl" />
                <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-yellow-400/10 blur-2xl" />
              </div>

              <div className="relative flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-[0_12px_26px_rgba(37,99,235,0.22)] ring-1 ring-blue-500/25">
                  <item.Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-lg font-extrabold text-slate-900 md:text-xl">
                      {item.name}
                    </h3>
                    <span className="text-xs font-bold text-blue-600/90 opacity-70 transition-opacity group-hover:opacity-100">
                      Open →
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="relative mt-5 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              <div className="relative mt-4 flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">6th Semester</span>
                <span className="font-semibold text-yellow-600/90">SVIET CSE</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

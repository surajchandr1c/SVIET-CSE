"use client";

import Link from "next/link";

const sixthSemItems = [
  { name: "Time Table", link: "/semester/6thSem/timetable" },
  { name: "Syllabus", link: "/semester/6thSem/syllabus" },
  { name: "Faculty", link: "/faculty" },
  { name: "Students List", link: "/semester/6thSem/studentsList" },
  { name: "Previous 5-Year Question Papers", link: "/semester/6thSem/Previous" },
  { name: "Assignment", link: "/semester/6thSem/assignment" },
  { name: "Notes", link: "/semester/6thSem/notes" },
  { name: "PPT", link: "/semester/6thSem/ppt" },
];

export default function SixthSemesterPage() {
  return (
    <div className="min-h-screen animate-fadeIn px-6 pb-10 pt-8">
      <main className="mx-auto max-w-[1680px]">
        <h1 className="text-3xl font-bold text-slate-200 md:text-4xl lg:text-[2.2rem]">6th Semester - B.Tech CSE</h1>

        <p className="mt-5 text-lg text-slate-300 md:text-xl lg:text-lg">Select a category below:</p>

        <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {sixthSemItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#0b1c47]/75 p-8 text-center shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 lg:p-6"
            >
              <Link href={item.link} className="block w-full text-center text-2xl font-bold text-cyan-300 md:text-[1.5rem] lg:text-[1.35rem]">
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

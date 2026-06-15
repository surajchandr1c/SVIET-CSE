"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTabsClient, { type SectionKey } from "./SectionTabsClient";

type FacultyRow = {
  sno: number;
  subject: string;
  faculty: string;
};

type DayRow = {
  day: string;
  render: () => ReactNode;
};

function SixthSemesterTable({
  dayRows,
  subjectFaculty,
}: {
  dayRows: DayRow[];
  subjectFaculty: FacultyRow[];
}) {
  return (
    <div className="mt-2">
      <div className="-mx-6 px-6 pb-2 sm:mx-0 sm:px-0">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="overflow-x-auto overscroll-x-contain rounded-xl border border-slate-200 bg-white shadow-lg touch-pan-x">
            <table className="min-w-[1100px] w-full whitespace-nowrap text-center text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th rowSpan={2} className="border border-white/20 px-3 py-3">
                    Day / Time
                  </th>
                  <th className="border border-white/20 px-3 py-3">9:10-10:05</th>
                  <th className="border border-white/20 px-3 py-3">10:05-11:00</th>
                  <th className="border border-white/20 px-3 py-3">11:00-11:55</th>
                  <th className="border border-white/20 px-3 py-3">11:55-12:50</th>
                  <th className="border border-white/20 px-3 py-3">12:50-1:45</th>
                  <th className="border border-white/20 px-3 py-3">1:45-2:40</th>
                  <th className="border border-white/20 px-3 py-3">2:40-3:35</th>
                  <th className="border border-white/20 px-3 py-3">3:35-4:30</th>
                </tr>
                <tr className="bg-blue-700 text-white">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <th
                      key={index}
                      className="border border-white/20 px-3 py-2 font-extrabold"
                    >
                      {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dayRows.map((row, index) => (
                  <motion.tr
                    key={row.day}
                    className="group"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.06 }}
                  >
                    <th className="border border-slate-200 bg-slate-50 px-3 py-3 font-extrabold text-[#0b3c5d] transition-colors group-hover:bg-slate-100">
                      {row.day}
                    </th>
                    {row.render()}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-center text-xs text-slate-600 sm:text-sm">
            Tip: On mobile, swipe horizontally to view the full timetable.
          </p>

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="bg-blue-600 px-4 py-3 font-extrabold text-white">
              Subject - Faculty
            </div>
            <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
              <table className="min-w-[700px] w-full text-sm">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="w-[90px] border border-white/20 px-4 py-3 text-center">
                      S.NO
                    </th>
                    <th className="border border-white/20 px-4 py-3 text-left">
                      SUBJECT NAME
                    </th>
                    <th className="border border-white/20 px-4 py-3 text-left">
                      FACULTY NAME
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjectFaculty.map((item) => (
                    <tr key={item.sno} className="transition-colors hover:bg-slate-50">
                      <td className="border border-slate-200 px-4 py-3 text-center font-extrabold text-[#0b3c5d]">
                        {item.sno}
                      </td>
                      <td className="border border-slate-200 px-4 py-3">{item.subject}</td>
                      <td className="border border-slate-200 px-4 py-3">{item.faculty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionYTimetable() {
  const dayRows: DayRow[] = [
    {
      day: "Monday",
      render: () => (
        <>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Cloud Computing</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Artificial Intelligence</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Compiler Design</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Wireless Communication</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-orange-50 px-3 py-3 font-extrabold tracking-wide text-orange-800 transition group-hover:brightness-95">
            BREAK
          </td>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">CC LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Y11 209A</div>
              <div className="font-extrabold uppercase text-slate-900">SPM LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Y12 209B</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 text-slate-400 transition-colors group-hover:bg-slate-50">
            —
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Software Project Management</div>
            </div>
          </td>
        </>
      ),
    },
    {
      day: "Tuesday",
      render: () => (
        <>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Compiler Design</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Artificial Intelligence</div>
            </div>
          </td>
          <td colSpan={2} className="border border-slate-200 bg-cyan-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Y 209B</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-orange-50 px-3 py-3 font-extrabold tracking-wide text-orange-800 transition group-hover:brightness-95">
            BREAK
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Cloud Computing</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Software Project Management</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Wireless Communication</div>
            </div>
          </td>
        </>
      ),
    },
    {
      day: "Wednesday",
      render: () => (
        <>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Artificial Intelligence</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Compiler Design</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">SPM LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Y11 209B</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">CC LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Y12 209A</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-orange-50 px-3 py-3 font-extrabold tracking-wide text-orange-800 transition group-hover:brightness-95">
            BREAK
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Verbal Ability</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 text-slate-400 transition-colors group-hover:bg-slate-50">
            —
          </td>
          <td className="border border-slate-200 px-3 py-3 text-slate-400 transition-colors group-hover:bg-slate-50">
            —
          </td>
        </>
      ),
    },
    {
      day: "Thursday",
      render: () => (
        <>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Software Project Management</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Cloud Computing</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-cyan-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
              <div className="text-xs font-bold text-slate-600">G-003</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Soft Skills</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-orange-50 px-3 py-3 font-extrabold tracking-wide text-orange-800 transition group-hover:brightness-95">
            BREAK
          </td>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">AI LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Y11 209B</div>
              <div className="font-extrabold uppercase text-slate-900">CD LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Y12 209A</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 text-slate-400 transition-colors group-hover:bg-slate-50">
            —
          </td>
          <td className="border border-slate-200 bg-cyan-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
              <div className="text-xs font-bold text-slate-600">G-003</div>
            </div>
          </td>
        </>
      ),
    },
    {
      day: "Friday",
      render: () => (
        <>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Soft Skills</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Wireless Communication</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">CD LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Y11 209A</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">AI LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Y12 209B</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-orange-50 px-3 py-3 font-extrabold tracking-wide text-orange-800 transition group-hover:brightness-95">
            BREAK
          </td>
          <td colSpan={3} className="border border-slate-200 bg-cyan-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Y 209A</div>
            </div>
          </td>
        </>
      ),
    },
  ];

  const subjectFaculty: FacultyRow[] = [
    { sno: 1, subject: "Cloud Computing + CC Lab", faculty: "Ms. Rupinder Kaur" },
    { sno: 2, subject: "Artificial Intelligence + AI Lab", faculty: "Ms. Pooja Verma" },
    { sno: 3, subject: "Compiler Design + CD Lab", faculty: "Ms. Ruchi Sharma" },
    { sno: 4, subject: "Software Project Management + SPM Lab", faculty: "Mr. Akash Dixit" },
    { sno: 5, subject: "Wireless Communication", faculty: "Ms. Pooja Verma" },
    { sno: 6, subject: "Soft Skills", faculty: "Ms. Keerti" },
    { sno: 7, subject: "Verbal Ability", faculty: "Ms. Navneet" },
    { sno: 8, subject: "Training", faculty: "Mr. Aditya" },
  ];

  return <SixthSemesterTable dayRows={dayRows} subjectFaculty={subjectFaculty} />;
}

function SectionZTimetable() {
  const dayRows: DayRow[] = [
    {
      day: "Monday",
      render: () => (
        <>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Artificial Intelligence</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Cloud Computing</div>
            </div>
          </td>
          <td colSpan={2} className="border border-slate-200 bg-cyan-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Z 209B</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-orange-50 px-3 py-3 font-extrabold tracking-wide text-orange-800 transition group-hover:brightness-95">
            BREAK
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Compiler Design</div>
            </div>
          </td>
          <td colSpan={2} className="border border-slate-200 bg-cyan-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
              <div className="text-xs font-bold text-slate-600">G-004</div>
            </div>
          </td>
        </>
      ),
    },
    {
      day: "Tuesday",
      render: () => (
        <>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">SPM LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Z11 209B</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">CC LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Z12 209A</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Compiler Design</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Soft Skills</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-orange-50 px-3 py-3 font-extrabold tracking-wide text-orange-800 transition group-hover:brightness-95">
            BREAK
          </td>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">CD LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Z11 209A</div>
              <div className="font-extrabold uppercase text-slate-900">AI LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Z12 209B</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Wireless Communication</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 text-slate-400 transition-colors group-hover:bg-slate-50">
            —
          </td>
        </>
      ),
    },
    {
      day: "Wednesday",
      render: () => (
        <>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Software Project Management</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Artificial Intelligence</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Compiler Design</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-cyan-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
              <div className="text-xs font-bold text-slate-600">G-004</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-orange-50 px-3 py-3 font-extrabold tracking-wide text-orange-800 transition group-hover:brightness-95">
            BREAK
          </td>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">SPM LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Z11 209B</div>
              <div className="font-extrabold uppercase text-slate-900">CC LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Z12 209A</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Wireless Communication</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 text-slate-400 transition-colors group-hover:bg-slate-50">
            —
          </td>
        </>
      ),
    },
    {
      day: "Thursday",
      render: () => (
        <>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">AI LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Z11 209B</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-blue-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">CD LAB</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Z12 209A</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Software Project Management</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Cloud Computing</div>
            </div>
          </td>
          <td className="border border-slate-200 bg-orange-50 px-3 py-3 font-extrabold tracking-wide text-orange-800 transition group-hover:brightness-95">
            BREAK
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Wireless Communication</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 text-slate-400 transition-colors group-hover:bg-slate-50">
            —
          </td>
          <td className="border border-slate-200 px-3 py-3 text-slate-400 transition-colors group-hover:bg-slate-50">
            —
          </td>
        </>
      ),
    },
    {
      day: "Friday",
      render: () => (
        <>
          <td className="border border-slate-200 bg-cyan-50 px-3 py-3 transition group-hover:brightness-95">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
              <div className="text-xs font-bold text-slate-600">CSE/6Z 209B</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Cloud Computing</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Soft Skills</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 text-slate-400 transition-colors group-hover:bg-slate-50">
            —
          </td>
          <td className="border border-slate-200 bg-orange-50 px-3 py-3 font-extrabold tracking-wide text-orange-800 transition group-hover:brightness-95">
            BREAK
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Artificial Intelligence</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Verbal Ability</div>
            </div>
          </td>
          <td className="border border-slate-200 px-3 py-3 transition-colors group-hover:bg-slate-50">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Software Project Management</div>
            </div>
          </td>
        </>
      ),
    },
  ];

  const subjectFaculty: FacultyRow[] = [
    { sno: 1, subject: "Cloud Computing + CC Lab", faculty: "Ms. Rupinder Kaur" },
    { sno: 2, subject: "Artificial Intelligence + AI Lab", faculty: "Ms. Pooja Verma" },
    { sno: 3, subject: "Compiler Design + CD Lab", faculty: "Ms. Ruchi Sharma" },
    { sno: 4, subject: "Software Project Management + SPM Lab", faculty: "Mr. Akash Dixit" },
    { sno: 5, subject: "Wireless Communication", faculty: "Ms. Rupinder Kaur" },
    { sno: 6, subject: "Soft Skills", faculty: "Ms. Nidhi" },
    { sno: 7, subject: "Verbal Ability", faculty: "Ms. Keerti" },
    { sno: 8, subject: "Training", faculty: "Mr. Aditya" },
  ];

  return <SixthSemesterTable dayRows={dayRows} subjectFaculty={subjectFaculty} />;
}

export default function TimetablePage() {
  const [section, setSection] = useState<SectionKey>("y");

  return (
    <div className="min-h-screen bg-transparent p-6">
      <h1 className="text-center text-3xl font-bold text-[#0b3c5d]">
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
          <div className="mb-2 text-center">
            <p className="mt-2 font-extrabold text-slate-800">
              TIME TABLE JAN-JUNE, 2026
            </p>
            <p className="mt-1 font-semibold text-slate-600">
              {section === "y"
                ? "6th Semester (Section-Y) (G-003)"
                : "6th Semester (Section-Z) (G-004)"}
            </p>
          </div>

          {section === "y" ? <SectionYTimetable /> : <SectionZTimetable />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

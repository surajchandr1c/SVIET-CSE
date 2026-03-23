"use client";

import { useState, type ReactNode } from "react";
import SectionTabsClient, { type SectionKey } from "./SectionTabsClient";
import { AnimatePresence, motion } from "framer-motion";


type Subject = {
  code: string;
  name: string;
  faculty: string;
  group: string;
  time: string;
  hall: string;
};

type DaySchedule = {
  day: string;
  subjects: Subject[];
};

function formatHall(raw: string) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return "";

  const blockMatch = trimmed.match(/block\s*g\s*-\s*(\d+)/i);
  if (blockMatch?.[1]) return `G-${blockMatch[1].padStart(3, "0")}`;

  const shortMatch = trimmed.match(/\bg\s*-\s*(\d+)\b/i);
  if (shortMatch?.[1]) return `G-${shortMatch[1].padStart(3, "0")}`;

  return trimmed;
}

function formatTime(raw: string) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return "";

  // Normalize common mojibake for an en dash (–) that may exist in stored data.
  const normalized = trimmed.replace(/â€“/g, "–");

  // Already in desired format: "P3 11:01–11:55"
  if (/^P\d+\s+\d{2}:\d{2}–\d{2}:\d{2}$/.test(normalized)) return normalized;

  // Common format: "P3 (11:01 AM - 11:55 AM)"
  const match = normalized.match(
    /^P(\d+)\s*\(\s*([0-9: ]+(?:AM|PM)?)\s*-\s*([0-9: ]+(?:AM|PM)?)\s*\)$/i
  );
  if (match) {
    const p = match[1];
    const start = match[2].replace(/\s*(AM|PM)\s*/gi, "").trim();
    const end = match[3].replace(/\s*(AM|PM)\s*/gi, "").trim();
    return `P${p} ${start}–${end}`;
  }

  // Fallback: normalize hyphen to en dash and strip AM/PM
  return normalized
    .replace(/\s*(AM|PM)\s*/gi, "")
    .replace(/\s*-\s*/g, "–");
}

function SectionDUniversityTimetable() {
  const dayRows: Array<{
    day: string;
    render: () => ReactNode;
  }> = [
    {
      day: "Monday",
      render: () => (
        <>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Discrete Mathematics</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Operating Systems</div>
            </div>
          </td>
          <td colSpan={2} className="px-3 py-3 border border-slate-200 bg-blue-50 group-hover:brightness-95 transition">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">DAA LAB</div>
              <div className="text-xs font-bold text-slate-600">G-109</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 bg-orange-50 text-orange-800 font-extrabold tracking-wide group-hover:brightness-95 transition">
            BREAK
          </td>
          <td className="px-3 py-3 border border-slate-200 bg-blue-50 group-hover:brightness-95 transition">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">COA LAB</div>
              <div className="text-xs font-bold text-slate-600">G-109</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Computer Org. &amp; Architecture</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 bg-cyan-50 group-hover:brightness-95 transition">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
              <div className="text-xs font-bold text-slate-600">G-109</div>
            </div>
          </td>
        </>
      ),
    },
    {
      day: "Tuesday",
      render: () => (
        <>
          <td colSpan={2} className="px-3 py-3 border border-slate-200 bg-cyan-50 group-hover:brightness-95 transition">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
              <div className="text-xs font-bold text-slate-600">G-109</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Discrete Mathematics</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Operating Systems</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 bg-orange-50 text-orange-800 font-extrabold tracking-wide group-hover:brightness-95 transition">
            BREAK
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Soft Skills</div>
            </div>
          </td>
          <td colSpan={2} className="px-3 py-3 border border-slate-200 bg-blue-50 group-hover:brightness-95 transition">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">OS LAB</div>
              <div className="text-xs font-bold text-slate-600">G-109</div>
            </div>
          </td>
        </>
      ),
    },
    {
      day: "Wednesday",
      render: () => (
        <>
          <td colSpan={2} className="px-3 py-3 border border-slate-200 bg-blue-50 group-hover:brightness-95 transition">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">DAA LAB</div>
              <div className="text-xs font-bold text-slate-600">G-109</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Discrete Mathematics</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Verbal Ability</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 bg-orange-50 text-orange-800 font-extrabold tracking-wide group-hover:brightness-95 transition">
            BREAK
          </td>
          <td className="px-3 py-3 border border-slate-200 bg-blue-50 group-hover:brightness-95 transition">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">COA LAB</div>
              <div className="text-xs font-bold text-slate-600">G-109</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Design &amp; Analysis of Algorithms</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 text-slate-400 group-hover:bg-slate-50 transition-colors">
            —
          </td>
        </>
      ),
    },
    {
      day: "Thursday",
      render: () => (
        <>
          <td colSpan={2} className="px-3 py-3 border border-slate-200 bg-cyan-50 group-hover:brightness-95 transition">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Discrete Mathematics</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Computer Org. &amp; Architecture</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 bg-orange-50 text-orange-800 font-extrabold tracking-wide group-hover:brightness-95 transition">
            BREAK
          </td>
          <td colSpan={2} className="px-3 py-3 border border-slate-200 bg-cyan-50 group-hover:brightness-95 transition">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">Training</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Design &amp; Analysis of Algorithms</div>
            </div>
          </td>
        </>
      ),
    },
    {
      day: "Friday",
      render: () => (
        <>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Operating Systems</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Soft Skills</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Computer Org. &amp; Architecture</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Design &amp; Analysis of Algorithms</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 bg-orange-50 text-orange-800 font-extrabold tracking-wide group-hover:brightness-95 transition">
            BREAK
          </td>
          <td colSpan={2} className="px-3 py-3 border border-slate-200 bg-blue-50 group-hover:brightness-95 transition">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold uppercase text-slate-900">OS LAB</div>
              <div className="text-xs font-bold text-slate-600">G-109</div>
            </div>
          </td>
          <td className="px-3 py-3 border border-slate-200 group-hover:bg-slate-50 transition-colors">
            <div className="grid place-items-center gap-1">
              <div className="font-extrabold text-slate-900">Discrete Mathematics</div>
            </div>
          </td>
        </>
      ),
    },
  ];

  const subjectFaculty = [
    { sno: 1, subject: "Computer Organization & Architecture", faculty: "Ms. Kulbir Kaur" },
    { sno: 2, subject: "Design & Analysis of Algorithms + DAA", faculty: "Mr. Chetan Jain" },
    { sno: 3, subject: "Discrete Mathematics", faculty: "Ms. Sushma Rani" },
    { sno: 4, subject: "Operating Systems + OS Lab", faculty: "Ms. Rojy Rani" },
    { sno: 5, subject: "Soft Skills", faculty: "Ms. Navneet" },
    { sno: 6, subject: "Verbal Ability", faculty: "Ms. Nidhi" },
  ];

  return (
    <div className="mt-2">
      <div className="-mx-6 sm:mx-0 px-6 sm:px-0 pb-2">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="rounded-xl border border-slate-200 bg-white shadow-lg overflow-x-auto overscroll-x-contain touch-pan-x">
            <table className="min-w-[1100px] w-full whitespace-nowrap text-sm text-center">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th rowSpan={2} className="px-3 py-3 border border-white/20">
                    Day / Time
                  </th>
                  <th className="px-3 py-3 border border-white/20">9:10-10:05</th>
                  <th className="px-3 py-3 border border-white/20">10:05-11:00</th>
                  <th className="px-3 py-3 border border-white/20">11:00-11:55</th>
                  <th className="px-3 py-3 border border-white/20">11:55-12:50</th>
                  <th className="px-3 py-3 border border-white/20">12:50-1:45</th>
                  <th className="px-3 py-3 border border-white/20">1:45-2:40</th>
                  <th className="px-3 py-3 border border-white/20">2:40-3:35</th>
                  <th className="px-3 py-3 border border-white/20">3:35-4:30</th>
                </tr>
                <tr className="bg-blue-700 text-white">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <th key={i} className="px-3 py-2 border border-white/20 font-extrabold">
                      {i + 1}
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
                    <th className="px-3 py-3 border border-slate-200 bg-slate-50 font-extrabold text-[#0b3c5d] group-hover:bg-slate-100 transition-colors">
                      {row.day}
                    </th>
                    {row.render()}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-center text-xs sm:text-sm text-slate-600">
            Tip: On mobile, swipe horizontally to view the full timetable.
          </p>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <div className="px-4 py-3 bg-blue-600 text-white font-extrabold">
              Subject - Faculty
            </div>
            <div className="overflow-x-auto overscroll-x-contain touch-pan-x">
              <table className="min-w-[700px] w-full text-sm">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-center border border-white/20 w-[90px]">
                      S.NO
                    </th>
                    <th className="px-4 py-3 text-left border border-white/20">
                      SUBJECT NAME
                    </th>
                    <th className="px-4 py-3 text-left border border-white/20">
                      FACULTY NAME
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjectFaculty.map((item) => (
                    <tr key={item.sno} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-center border border-slate-200 font-extrabold text-[#0b3c5d]">
                        {item.sno}
                      </td>
                      <td className="px-4 py-3 border border-slate-200">{item.subject}</td>
                      <td className="px-4 py-3 border border-slate-200">{item.faculty}</td>
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

export default function TimetablePage() {
  const [section, setSection] = useState<SectionKey>("d");

  return (
    <div className="min-h-screen bg-transparent p-6">
      <h1 className="text-3xl font-bold text-center text-[#0b3c5d]">
        4th Semester Time Table
      </h1>
      <p className="mt-2 text-center text-gray-600">
        Select your section to view the schedule.
      </p>

      <SectionTabsClient value={section} onChange={setSection} />

      <AnimatePresence mode="wait">
        {section === "d" ? (
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-2">
              <p className="mt-2 font-extrabold text-slate-800">
                TIME TABLE JAN-JUNE, 2026
              </p>
              <p className="mt-1 font-semibold text-slate-600">
                4th Semester (Section-D) (G-002)
              </p>
            </div>

            <SectionDUniversityTimetable />
          </motion.div>
        ) : (
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white p-7 shadow-sm ring-1 ring-black/5 text-center">
          <p className="text-lg font-semibold text-[#0b3c5d]">
            {section === "a"
              ? "SEC - A"
              : section === "b"
                ? "SEC - B"
                : "SEC - C"}{" "}
            timetable will be updated soon.
          </p>
          <p className="mt-2 text-gray-600">
            Right now, the timetable is available for SEC - D.
          </p>
        </div>
        )}
      </AnimatePresence>
    </div>
  );
}

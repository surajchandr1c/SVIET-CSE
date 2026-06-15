"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Student = {
  _id?: string;
  admissionNo: string;
  name: string;
};

type BatchTab = "2023" | "2024";

const tabs: Array<{ key: BatchTab; label: string }> = [
  { key: "2023", label: "2023 Batch" },
  { key: "2024", label: "2024 Batch" },
];

export default function StudentListTabs({
  students2023,
  students2024,
}: {
  students2023: Student[];
  students2024: Student[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get("tab") === "2024" ? "2024" : "2023") satisfies BatchTab;
  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((tab) => tab.key === activeTab)),
    [activeTab]
  );
  const students = activeTab === "2024" ? students2024 : students2023;

  return (
    <section className="min-h-screen bg-transparent px-6 pb-10 pt-8">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">
          Student List
        </h1>
        <p className="mt-3 text-center text-base text-slate-600 md:text-lg">
          Browse student lists by batch.
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative overflow-hidden rounded-full bg-slate-950/90 p-1 shadow-[0_18px_60px_rgba(0,0,0,0.25)] ring-1 ring-black/10">
            <div role="tablist" aria-label="Student batch selection" className="grid grid-cols-2 gap-1">
              {tabs.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => router.push(`/student-list?tab=${tab.key}`)}
                    className={[
                      "relative z-10 rounded-full px-6 py-3 text-center text-sm font-semibold md:px-10 md:text-base",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60",
                      isActive ? "text-slate-900" : "text-white",
                    ].join(" ")}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div
              aria-hidden
              className="absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc((100%-0.25rem)/2)] rounded-full bg-yellow-400 shadow-[0_10px_26px_rgba(250,204,21,0.35)] transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${activeIndex * 100}%)` }}
            />
          </div>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-sky-900 text-white">
              <tr>
                <th className="border px-4 py-3">Sr. No.</th>
                <th className="border px-4 py-3">Admission No.</th>
                <th className="border px-4 py-3">Name</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student._id ?? `${student.admissionNo}-${index}`}
                  className="text-center hover:bg-gray-100"
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{student.admissionNo}</td>
                  <td className="border px-4 py-2">{student.name}</td>
                </tr>
              ))}
              {students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="border px-4 py-8 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

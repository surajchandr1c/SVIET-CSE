"use client";

import { useState } from "react";
import SemesterTabForm from "@/components/admin/SemesterTabForm";

type SemesterKey = "3rd" | "4th" | "5th" | "6th";

const semesterTabs: Array<{ key: SemesterKey; label: string }> = [
  { key: "3rd", label: "3rd Sem" },
  { key: "4th", label: "4th Sem" },
  { key: "5th", label: "5th Sem" },
  { key: "6th", label: "6th Sem" },
];

export default function AdminSemesterPage() {
  const [semester, setSemester] = useState<SemesterKey>("4th");

  return (
    <section className="space-y-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="admin-card p-6 md:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-(--admin-text-muted)">
            Semester Management
          </p>
          <h1 className="text-3xl font-bold text-(--admin-text) md:text-4xl">
            Manage Semesters
          </h1>
          <p className="mt-3 text-[15px] text-(--admin-text-muted) md:text-base">
            Select a semester to manage its academic content.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" role="tablist" aria-label="Semesters">
            {semesterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={semester === tab.key}
                onClick={() => setSemester(tab.key)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition md:text-base ${
                  semester === tab.key
                    ? "bg-(--admin-accent) text-white shadow-lg"
                    : "bg-(--admin-surface) text-(--admin-text-muted)"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SemesterTabForm
        key={semester}
        semesterName={`${semester} Semester`}
        semesterKey={semester}
      />
    </section>
  );
}
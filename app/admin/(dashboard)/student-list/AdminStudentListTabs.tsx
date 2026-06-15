"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StudentAccountsAdminClient from "@/components/StudentAccountsAdminClient";

type BatchTab = "2024" | "2023";

const tabs: Array<{ key: BatchTab; label: string; semester: 4 | 6 }> = [
  { key: "2023", label: "2023 Batch", semester: 6 },
  { key: "2024", label: "2024 Batch", semester: 4 },
];

export default function AdminStudentListTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get("tab") === "2024" ? "2024" : "2023") satisfies BatchTab;
  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((tab) => tab.key === activeTab)),
    [activeTab]
  );
  const activeSemester = tabs.find((tab) => tab.key === activeTab)?.semester ?? 6;

  return (
    <section className="space-y-6">
      <div className="admin-card p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
              Student Accounts
            </p>
            <h1 className="text-3xl font-bold text-[var(--admin-text)] md:text-4xl">
              Student List
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] text-[var(--admin-text-muted)] md:text-base">
              Manage student accounts and reset first-login passwords by batch.
            </p>
          </div>
        </div>

        <div className="mt-7 max-w-xl">
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
                    onClick={() => router.push(`/admin/student-list?tab=${tab.key}`)}
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
      </div>

      <StudentAccountsAdminClient
        key={activeTab}
        semesterLocked={activeSemester}
        showHeader={false}
      />
    </section>
  );
}

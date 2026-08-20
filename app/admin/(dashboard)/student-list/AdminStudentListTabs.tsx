"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StudentAccountsAdminClient from "@/components/admin/StudentAccountsAdminClient";
import { DEFAULT_BATCH_CONFIGS, type BatchConfig } from "@/lib/shared/batchConfig";

type CourseTab = "CSE" | "AI/ML";

export default function AdminStudentListTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [batches, setBatches] = useState<BatchConfig[]>(DEFAULT_BATCH_CONFIGS);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [newSemester, setNewSemester] = useState("2");
  const [addingBatch, setAddingBatch] = useState(false);
  const [deletingBatch, setDeletingBatch] = useState(false);
  const [batchError, setBatchError] = useState("");

  useEffect(() => {
    fetch("/api/batches", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setBatches(data);
      })
      .catch(() => undefined);
  }, []);

  const requestedTab = searchParams.get("tab");
  const activeTab = batches.some((batch) => batch.year === requestedTab)
    ? requestedTab!
    : batches[0]?.year ?? "2024";
  const activeCourse = (searchParams.get("course") === "AI/ML" ? "AI/ML" : "CSE") satisfies CourseTab;
  const activeIndex = useMemo(
    () => Math.max(0, batches.findIndex((batch) => batch.year === activeTab)),
    [activeTab, batches]
  );
  const activeBatch = batches.find((batch) => batch.year === activeTab) ?? batches[0];

  const addBatch = async (event: FormEvent) => {
    event.preventDefault();
    setAddingBatch(true);
    setBatchError("");
    try {
      const response = await fetch("/api/admin/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: newYear, semester: newSemester }),
      });
      const data = (await response.json()) as BatchConfig & { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to add batch.");
      setBatches((current) => [...current, data].sort((left, right) => left.year.localeCompare(right.year)));
      setNewYear("");
      setNewSemester("2");
      setShowAddBatch(false);
      router.push(`/admin/student-list?tab=${data.year}&course=CSE`);
    } catch (error) {
      setBatchError(error instanceof Error ? error.message : "Failed to add batch.");
    } finally {
      setAddingBatch(false);
    }
  };

  const deleteBatch = async () => {
    if (!activeBatch || batches.length <= 1) return;
    if (!window.confirm(`Delete the ${activeBatch.label} tab? Student records will be preserved.`)) return;

    setDeletingBatch(true);
    setBatchError("");
    try {
      const response = await fetch("/api/admin/batches", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: activeBatch.year }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to delete batch.");
      const remaining = batches.filter((batch) => batch.year !== activeBatch.year);
      setBatches(remaining);
      router.push(`/admin/student-list?tab=${remaining[0].year}&course=CSE`);
    } catch (error) {
      setBatchError(error instanceof Error ? error.message : "Failed to delete batch.");
    } finally {
      setDeletingBatch(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="admin-card p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
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
          <button
            type="button"
            onClick={() => setShowAddBatch((current) => !current)}
            className="rounded-xl bg-(--admin-accent) px-4 py-2.5 text-sm font-semibold text-white"
          >
            {showAddBatch ? "Close" : "Add New Batch"}
          </button>
        </div>

        {showAddBatch && (
          <form onSubmit={addBatch} className="mt-6 grid gap-3 rounded-2xl border border-[var(--admin-border)] p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className="text-sm font-semibold text-[var(--admin-text)]">
              Batch Year
              <input value={newYear} onChange={(event) => setNewYear(event.target.value)} placeholder="2026" inputMode="numeric" maxLength={4} required className="mt-1 w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-2 font-normal" />
            </label>
            <label className="text-sm font-semibold text-[var(--admin-text)]">
              Semester Number
              <input value={newSemester} onChange={(event) => setNewSemester(event.target.value)} type="number" min={1} max={12} required className="mt-1 w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-2 font-normal" />
            </label>
            <button type="submit" disabled={addingBatch} className="rounded-xl bg-yellow-400 px-4 py-2.5 font-semibold text-slate-900 disabled:opacity-60">
              {addingBatch ? "Adding..." : "Create Batch"}
            </button>
            {batchError && <p className="text-sm text-red-500 sm:col-span-3">{batchError}</p>}
          </form>
        )}

        <div className="mt-7 max-w-4xl">
          <div className="relative overflow-hidden rounded-full bg-slate-950/90 p-1 shadow-[0_18px_60px_rgba(0,0,0,0.25)] ring-1 ring-black/10">
            <div role="tablist" aria-label="Student batch selection" className="grid gap-1" style={{ gridTemplateColumns: `repeat(${batches.length}, minmax(0, 1fr))` }}>
              {batches.map((batch) => {
                const isActive = batch.year === activeTab;
                return (
                  <button
                    key={batch.year}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => router.push(`/admin/student-list?tab=${batch.year}&course=CSE`)}
                    className={[
                      "admin-batch-tab relative z-10 rounded-full px-6 py-3 text-center text-sm font-semibold md:px-10 md:text-base",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60",
                      isActive ? "text-slate-900" : "text-white",
                    ].join(" ")}
                  >
                    {batch.label}
                  </button>
                );
              })}
            </div>

            <div
              aria-hidden
              className="absolute left-1 top-1 h-[calc(100%-0.5rem)] rounded-full bg-yellow-400 shadow-[0_10px_26px_rgba(250,204,21,0.35)] transition-transform duration-300 ease-out"
              style={{ width: `calc((100% - ${(batches.length - 1) * 0.25}rem) / ${batches.length})`, transform: `translateX(${activeIndex * 100}%)` }}
            />
          </div>

          {activeBatch?.courseSplit && (
            <div className="mt-4 max-w-xl">
              <div role="tablist" aria-label="2025 course selection" className="grid grid-cols-2 gap-2">
                {(["CSE", "AI/ML"] as const).map((course) => {
                  const isActive = course === activeCourse;
                  return (
                    <button
                      key={course}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => router.push(`/admin/student-list?tab=${activeTab}&course=${encodeURIComponent(course)}`)}
                      className={[
                        "admin-course-tab rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors",
                        isActive
                          ? "border-yellow-400 bg-yellow-400 text-slate-900"
                          : "border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-text)]",
                      ].join(" ")}
                    >
                      {course}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={deleteBatch}
            disabled={deletingBatch || batches.length <= 1}
            className="mt-4 rounded-xl border border-red-400 px-4 py-2 text-sm font-semibold text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deletingBatch ? "Deleting..." : `Delete ${activeBatch?.label ?? "Batch"}`}
          </button>
          {batchError && <p className="mt-3 text-sm text-red-500">{batchError}</p>}
        </div>
      </div>

      <StudentAccountsAdminClient
        key={`${activeTab}-${activeCourse}`}
        semesterLocked={activeBatch?.semester ?? 4}
        courseLocked={activeBatch?.courseSplit ? activeCourse : "CSE"}
        showHeader={false}
      />
    </section>
  );
}

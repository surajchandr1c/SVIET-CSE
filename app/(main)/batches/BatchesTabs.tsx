"use client";

import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import BatchProfilesGrid from "./BatchProfilesGrid";
import type { BatchProfile } from "./types";
import type { BatchConfig } from "@/lib/shared/batchConfig";

type BatchTab = "all" | string;
type CourseTab = "cse" | "aiMl";

const normalizeText = (value: string) => value.trim().toLowerCase();

const profileMatchesSearch = (profile: BatchProfile, query: string) => {
  if (!query) return true;

  const tokens: string[] = [
    profile.name,
    profile.position,
    profile.batch,
    profile.course ?? "",
    profile.about,
    profile.keywords ?? "",
  ];

  for (const skill of profile.skills ?? []) {
    if (typeof skill === "string") {
      tokens.push(skill);
    } else {
      tokens.push(skill.title, ...skill.items);
    }
  }

  for (const project of profile.projects ?? []) {
    if (typeof project === "string") {
      tokens.push(project);
    } else {
      tokens.push(project.title, project.description ?? "");
    }
  }

  for (const certificate of profile.certificates ?? []) {
    if (typeof certificate === "string") {
      tokens.push(certificate);
    } else {
      tokens.push(certificate.title);
    }
  }

  for (const achievement of profile.achievements ?? []) {
    if (typeof achievement === "string") {
      tokens.push(achievement);
    } else {
      tokens.push(achievement.title, achievement.description ?? "");
    }
  }

  const haystack = normalizeText(tokens.join(" "));
  return haystack.includes(query);
};

export default function BatchesTabs({
  batches,
  profilesAll,
}: {
  batches: Array<BatchConfig & { profiles: BatchProfile[] }>;
  profilesAll: BatchProfile[];
}) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [isSwitching, setIsSwitching] = useState(false);
  const [, startTransition] = useTransition();
  const tabs = useMemo(
    () => [{ key: "all", label: "All Batches" }, ...batches.map((batch) => ({ key: batch.year, label: batch.label }))],
    [batches]
  );
  const requestedTab = searchParams.get("tab");

  const activeTab: BatchTab =
    requestedTab && tabs.some((tab) => tab.key === requestedTab) ? requestedTab : "all";
  const activeCourse = (searchParams.get("course") === "aiMl" ? "aiMl" : "cse") satisfies CourseTab;
  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((tab) => tab.key === activeTab)),
    [activeTab, tabs]
  );
  const activeBatch = batches.find((batch) => batch.year === activeTab);
  const activeProfiles = useMemo(() => {
    if (activeBatch) {
      if (!activeBatch.courseSplit) return activeBatch.profiles;
      return activeBatch.profiles.filter((profile) =>
        activeCourse === "aiMl"
          ? profile.course?.trim().toUpperCase() === "AI/ML"
          : profile.course?.trim().toUpperCase() !== "AI/ML"
      );
    }
    return profilesAll;
  }, [activeBatch, activeCourse, profilesAll]);
  const searchQuery = useMemo(() => normalizeText(search), [search]);
  const filteredProfiles = useMemo(
    () => activeProfiles.filter((profile) => profileMatchesSearch(profile, searchQuery)),
    [activeProfiles, searchQuery]
  );

  const updateSelection = (tab: string, course?: CourseTab) => {
    const params = new URLSearchParams();
    if (tab !== "all") params.set("tab", tab);
    if (course && course !== "cse") params.set("course", course);
    const query = params.toString();

    setIsSwitching(true);
    startTransition(() => {
      window.history.pushState(null, "", query ? `/batches?${query}` : "/batches");
    });
    window.requestAnimationFrame(() => setIsSwitching(false));
  };

  return (
    <>
      <div className="mb-5">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3">
          <Search size={18} className="shrink-0 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, skill, tech, project..."
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 md:text-base"
            aria-label="Search batch profiles by name or tech"
          />
        </div>
      </div>

      <div className="mx-4 relative overflow-hidden rounded-full bg-slate-950/90 p-1 ring-1 ring-black/10 sm:mx-6 lg:mx-8">
        <div
          role="tablist"
          aria-label="Batch selection"
          className={tabs.length === 3 ? "grid grid-cols-3 gap-1" : "grid gap-1"}
          style={tabs.length === 3 ? undefined : { gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => updateSelection(tab.key)}
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
          className="absolute left-1 top-1 h-[calc(100%-0.5rem)] rounded-full bg-yellow-400 shadow-[0_10px_26px_rgba(250,204,21,0.35)] transition-transform duration-300 ease-out"
          style={{
            width: tabs.length === 3 ? "calc((100% - 0.5rem) / 3)" : `calc((100% - ${(tabs.length - 1) * 0.25}rem) / ${tabs.length})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>

      {activeBatch?.courseSplit && (
        <div className="mx-4 mt-3 flex justify-center sm:mx-6 lg:mx-8">
          <div className="relative w-full max-w-xl overflow-hidden rounded-full bg-slate-900/90 p-1 ring-1 ring-black/10">
            <div role="tablist" aria-label="Course selection" className="grid grid-cols-2 gap-1">
              {([
                { key: "cse", label: "CSE" },
                { key: "aiMl", label: "AI/ML" },
              ] as const).map((course) => {
                const isActive = course.key === activeCourse;
                return (
                  <button
                    key={course.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => updateSelection(activeTab, course.key)}
                    className={[
                      "relative z-10 rounded-full px-6 py-2.5 text-center text-sm font-semibold md:text-base",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60",
                      isActive ? "text-slate-900" : "text-white",
                    ].join(" ")}
                  >
                    {course.label}
                  </button>
                );
              })}
            </div>

            <div
              aria-hidden
              className="absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc((100%-0.25rem)/2)] rounded-full bg-yellow-400 transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${activeCourse === "aiMl" ? 100 : 0}%)` }}
            />
          </div>
        </div>
      )}

      <BatchProfilesGrid profiles={filteredProfiles} isLoading={isSwitching} />
    </>
  );
}

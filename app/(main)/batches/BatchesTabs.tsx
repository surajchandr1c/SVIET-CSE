"use client";

import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  const tabs = useMemo(
    () => [
      { key: "all", label: "All Batches" },
      ...batches.map((batch) => ({ key: batch.year, label: batch.label })),
    ],
    [batches]
  );

  const [activeTab, setActiveTab] = useState<BatchTab>(() => {
    const tabParam = searchParams.get("tab") as BatchTab | null;
    return tabParam && tabs.some((tab) => tab.key === tabParam) ? tabParam : "all";
  });

  const [activeCourse, setActiveCourse] = useState<CourseTab>(() => {
    return searchParams.get("course") === "aiMl" ? "aiMl" : "cse";
  });

  // Keep state in sync if external navigation / query params change
  useEffect(() => {
    const tabParam = searchParams.get("tab") as BatchTab | null;
    const validTab = tabParam && tabs.some((tab) => tab.key === tabParam) ? tabParam : "all";
    setActiveTab(validTab);

    const courseParam = searchParams.get("course");
    setActiveCourse(courseParam === "aiMl" ? "aiMl" : "cse");
  }, [searchParams, tabs]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as BatchTab | null;
      const validTab = tabParam && tabs.some((tab) => tab.key === tabParam) ? tabParam : "all";
      setActiveTab(validTab);
      setActiveCourse(params.get("course") === "aiMl" ? "aiMl" : "cse");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [tabs]);

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

  const handleTabChange = (nextTab: string) => {
    const validTab = (nextTab && tabs.some((t) => t.key === nextTab) ? nextTab : "all") as BatchTab;
    if (validTab === activeTab) return;

    setActiveTab(validTab);

    const targetBatch = batches.find((b) => b.year === validTab);
    const validCourse = targetBatch?.courseSplit ? activeCourse : "cse";
    if (!targetBatch?.courseSplit && activeCourse !== "cse") {
      setActiveCourse("cse");
    }

    const params = new URLSearchParams(window.location.search);
    if (validTab !== "all") {
      params.set("tab", validTab);
    } else {
      params.delete("tab");
    }

    if (validCourse !== "cse") {
      params.set("course", validCourse);
    } else {
      params.delete("course");
    }

    const query = params.toString();
    const newUrl = query ? `/batches?${query}` : "/batches";
    window.history.replaceState(null, "", newUrl);
  };

  const handleCourseChange = (nextCourse: CourseTab) => {
    if (nextCourse === activeCourse) return;
    setActiveCourse(nextCourse);

    const params = new URLSearchParams(window.location.search);
    if (activeTab !== "all") {
      params.set("tab", activeTab);
    } else {
      params.delete("tab");
    }

    if (nextCourse !== "cse") {
      params.set("course", nextCourse);
    } else {
      params.delete("course");
    }

    const query = params.toString();
    const newUrl = query ? `/batches?${query}` : "/batches";
    window.history.replaceState(null, "", newUrl);
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

      <div className="mx-4 relative overflow-hidden rounded-full bg-slate-950/90 p-1.5 ring-1 ring-black/10 sm:mx-6 lg:mx-8">
        <div
          role="tablist"
          aria-label="Batch selection"
          className={tabs.length === 3 ? "grid grid-cols-3 gap-1.5" : "grid gap-1.5"}
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
                onClick={() => handleTabChange(tab.key)}
                className="relative z-10 rounded-full px-3 py-3 text-center text-sm font-semibold transition-colors duration-200 md:px-10 md:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60 cursor-pointer select-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBatchTabIndicator"
                    className="absolute inset-0 rounded-full bg-yellow-400 shadow-[0_10px_26px_rgba(250,204,21,0.35)]"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                      mass: 0.8,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 block truncate transition-colors duration-200 ${
                    isActive ? "text-slate-950 font-bold" : "text-white/90 hover:text-white"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeBatch?.courseSplit && (
          <motion.div
            key="course-selector"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-4 mt-3 flex justify-center overflow-hidden sm:mx-6 lg:mx-8"
          >
            <div className="relative w-full max-w-xl overflow-hidden rounded-full bg-slate-900/90 p-1.5 ring-1 ring-black/10">
              <div role="tablist" aria-label="Course selection" className="grid grid-cols-2 gap-1.5">
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
                      onClick={() => handleCourseChange(course.key)}
                      className="relative z-10 rounded-full px-6 py-2.5 text-center text-sm font-semibold transition-colors duration-200 md:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60 cursor-pointer select-none"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCourseTabIndicator"
                          className="absolute inset-0 rounded-full bg-yellow-400 shadow-[0_10px_26px_rgba(250,204,21,0.35)]"
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                            mass: 0.8,
                          }}
                        />
                      )}
                      <span
                        className={`relative z-10 block truncate transition-colors duration-200 ${
                          isActive ? "text-slate-950 font-bold" : "text-white/90 hover:text-white"
                        }`}
                      >
                        {course.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={`${activeTab}-${activeCourse}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <BatchProfilesGrid profiles={filteredProfiles} />
      </motion.div>
    </>
  );
}

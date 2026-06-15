"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import BatchProfilesGrid from "./BatchProfilesGrid";
import type { BatchProfile } from "./types";

type BatchTab = "all" | "4" | "6";

const tabs: Array<{ key: BatchTab; label: string; href: string }> = [
  { key: "all", label: "All Batches", href: "/batches" },
  { key: "6", label: "2023 Batch", href: "/semester/6thSem/studentsList" },
  { key: "4", label: "2024 Batch", href: "/semester/4thSem/studentsList" },
];

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
  profiles2024,
  profiles2023,
  profilesAll,
}: {
  profiles2024: BatchProfile[];
  profiles2023: BatchProfile[];
  profilesAll: BatchProfile[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const activeTab =
    (searchParams.get("tab") === "4"
      ? "4"
      : searchParams.get("tab") === "6"
        ? "6"
        : "all") satisfies BatchTab;
  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((tab) => tab.key === activeTab)),
    [activeTab]
  );
  const activeProfiles = useMemo(() => {
    if (activeTab === "4") return profiles2024;
    if (activeTab === "6") return profiles2023;
    return profilesAll;
  }, [activeTab, profiles2023, profiles2024, profilesAll]);
  const searchQuery = useMemo(() => normalizeText(search), [search]);
  const filteredProfiles = useMemo(
    () => activeProfiles.filter((profile) => profileMatchesSearch(profile, searchQuery)),
    [activeProfiles, searchQuery]
  );

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

      <div className="relative overflow-hidden rounded-full bg-slate-950/90 p-1 ring-1 ring-black/10">
        <div role="tablist" aria-label="Batch selection" className="grid grid-cols-3 gap-1">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => router.push(`/batches?tab=${tab.key}`)}
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
          className="absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc((100%-0.5rem)/3)] rounded-full bg-yellow-400 shadow-[0_10px_26px_rgba(250,204,21,0.35)] transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
      </div>

      <BatchProfilesGrid profiles={filteredProfiles} />
    </>
  );
}

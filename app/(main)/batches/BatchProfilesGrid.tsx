"use client";

import { useMemo } from "react";
import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { normalizeImageUrl } from "@/lib/imageUrl";
import { slugifyProfileName } from "./slug";
import type { BatchProfile } from "./types";
import { Award, BadgeCheck, Briefcase, GraduationCap, LayoutGrid } from "lucide-react";

const accentBgs = [
  "bg-[#f3ede7]",
  "bg-[#f4c8d0]",
  "bg-[#7a93a5]",
  "bg-[#cfd7de]",
  "bg-[#d9efe8]",
  "bg-[#f6e7c8]",
];

export default function BatchProfilesGrid({ profiles }: { profiles: BatchProfile[] }) {
  const data = useMemo(() => profiles ?? [], [profiles]);

  const countSkills = (profile: BatchProfile) => {
    const skills = profile.skills ?? [];
    let total = 0;
    for (const entry of skills) {
      if (typeof entry === "string") total += 1;
      else if (
        entry &&
        typeof entry === "object" &&
        "items" in entry &&
        Array.isArray(entry.items)
      ) {
        total += entry.items.length;
      }
    }
    return total;
  };

  return (
    <>
      {data.length === 0 ? (
        <p className="mt-8 text-center text-slate-200/80">No profiles found.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((profile, index) => {
            const accentBg = accentBgs[index % accentBgs.length];
            const imageSrc = normalizeImageUrl(profile.image);
            const slug = slugifyProfileName(profile.name);
            const skillsCount = countSkills(profile);
            const projectsCount = profile.projects?.length ?? 0;
            const certificatesCount = profile.certificates?.length ?? 0;
            const achievementsCount = profile.achievements?.length ?? 0;

            return (
              <Link
                key={profile._id}
                href={`/batches/${slug}`}
                className="group h-full overflow-hidden rounded-3xl bg-white text-left shadow-sm transition-shadow duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60"
                aria-label={`Open profile: ${profile.name}`}
              >
                <div className={`relative h-72 overflow-hidden ${accentBg}`}>
                  <div className="absolute inset-0 overflow-hidden">
                    <SmartImage
                      src={imageSrc}
                      alt={profile.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="absolute right-4 top-4 z-10 text-xs font-bold tracking-[0.16em] text-slate-900">
                    {profile.batch}
                  </div>
                  <div
                    className="absolute -bottom-px left-0 right-0 h-12 bg-white"
                    style={{
                      clipPath: "polygon(0 70%, 100% 0%, 100% 100%, 0% 100%)",
                    }}
                  />
                </div>

                <div className="px-6 pt-5 pb-6">
                  <h2 className="line-clamp-1 text-lg font-semibold leading-snug text-[#0b3c5d]">
                    {profile.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <GraduationCap size={16} className="shrink-0" />
                    <span className="line-clamp-1">{profile.course ?? "Course"}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 ring-1 ring-slate-200">
                      <LayoutGrid size={16} className="text-slate-700" />
                      <span className="font-semibold text-slate-800">{skillsCount}</span>
                      <span className="text-slate-600">Skills</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 ring-1 ring-slate-200">
                      <Briefcase size={16} className="text-slate-700" />
                      <span className="font-semibold text-slate-800">{projectsCount}</span>
                      <span className="text-slate-600">Projects</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 ring-1 ring-slate-200">
                      <BadgeCheck size={16} className="text-slate-700" />
                      <span className="font-semibold text-slate-800">{certificatesCount}</span>
                      <span className="text-slate-600">Certificates</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 ring-1 ring-slate-200">
                      <Award className="h-5 w-4 shrink-0 text-slate-700" strokeWidth={2.2} />
                      <span className="font-semibold text-slate-800">{achievementsCount}</span>
                      <span className="text-slate-600">Achivements</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

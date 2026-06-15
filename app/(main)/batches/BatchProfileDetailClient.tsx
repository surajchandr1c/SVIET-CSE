"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { normalizeImageUrl } from "@/lib/imageUrl";
import type { BatchAchievement, BatchCertificate, BatchProfile, BatchProject, BatchSkillGroup } from "./types";
import { usePathname } from "next/navigation";

const normalizeSocialUrl = (
  kind: "instagram" | "email" | "linkedin" | "github",
  value?: string
) => {
  const raw = (value ?? "").trim();
  if (!raw) return null;

  if (kind === "email") {
    if (/^mailto:/i.test(raw)) return raw;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return `mailto:${raw}`;
    return null;
  }

  if (/^https?:\/\//i.test(raw)) return raw;

  const withoutAt = raw.replace(/^@/, "");

  if (kind === "instagram") {
    if (raw.includes("/") || raw.includes(".")) return `https://${raw}`;
    return `https://instagram.com/${withoutAt}`;
  }

  if (kind === "linkedin") {
    if (raw.includes("/") || raw.includes(".")) return `https://${raw}`;
    return `https://linkedin.com/in/${withoutAt}`;
  }

  if (raw.includes("/") || raw.includes(".")) return `https://${raw}`;
  return `https://github.com/${withoutAt}`;
};

type DetailTab = "Skills" | "Projects" | "Certificate" | "Achivement";

const normalizeProject = (value: string | BatchProject) => {
  if (typeof value === "string") return { title: value, description: "", link: "" };
  return {
    title: value.title,
    description: value.description ?? "",
    link: value.link ?? "",
  };
};

const normalizeCertificate = (value: string | BatchCertificate) => {
  if (typeof value === "string") return { title: value, date: "", previewImage: "", link: "" };
  return {
    title: value.title,
    date: value.date ?? "",
    previewImage: value.previewImage ?? "",
    link: value.link ?? "",
  };
};

const normalizeAchievement = (value: string | BatchAchievement) => {
  if (typeof value === "string") return { title: value, description: "", previewImage: "", link: "", date: "" };
  return {
    title: value.title,
    description: value.description ?? "",
    previewImage: value.previewImage ?? "",
    link: value.link ?? "",
    date: value.date ?? "",
  };
};

export default function BatchProfileDetailClient({ profile }: { profile: BatchProfile }) {
  const [detailTab, setDetailTab] = useState<DetailTab>("Skills");
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const detailTabs = useMemo<DetailTab[]>(
    () => ["Skills", "Projects", "Certificate", "Achivement"],
    []
  );
  const activeTabIndex = useMemo(
    () => Math.max(0, detailTabs.indexOf(detailTab)),
    [detailTab, detailTabs]
  );

  const skills = useMemo(() => profile.skills ?? [], [profile.skills]);
  const skillGroups = useMemo(() => {
    const values = skills ?? [];
    const groups = values.filter(
      (item): item is BatchSkillGroup => typeof item === "object" && item !== null && "items" in item
    );

    if (groups.length > 0) return groups;

    const flat = values.filter((item): item is string => typeof item === "string");
    if (flat.length === 0) return [];
    return [{ title: "Skills", items: flat }];
  }, [skills]);
  const certificates = useMemo(
    () => (profile.certificates ?? []).map(normalizeCertificate),
    [profile.certificates]
  );
  const achievements = useMemo(
    () => (profile.achievements ?? []).map(normalizeAchievement),
    [profile.achievements]
  );
  const projects = useMemo(() => (profile.projects ?? []).map(normalizeProject), [profile.projects]);

  const instagramUrl = normalizeSocialUrl("instagram", profile.instagram);
  const emailUrl = normalizeSocialUrl("email", profile.email);
  const linkedinUrl = normalizeSocialUrl("linkedin", profile.linkedin);
  const githubUrl = normalizeSocialUrl("github", profile.github);
  const profileImageUrl = normalizeImageUrl(profile.image);

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}${pathname}` : "";

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && "share" in navigator && shareUrl) {
        await navigator.share({ title: profile.name, url: shareUrl });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      // ignore share/copy failures
    }
  };

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pt-10 pb-16">
      <div className="mb-6 flex items-center justify-end">
        <Link href="/batches" className="px-20 text-lg font-semibold text-[#08b8a8] hover:text-[#22d3ee]">
          ← Back to Students Portfolio
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white md:mx-auto md:flex md:h-[calc(100vh-180px)] md:max-w-[1480px]">
        <div className="flex w-full flex-col bg-white md:h-full md:w-[320px] md:flex-none lg:w-[380px] md:min-h-full">
          <div className="px-5 pt-5 sm:px-8 sm:pt-8">
            <div className="relative h-[220px] w-full overflow-hidden rounded-3xl bg-gray-100 sm:h-[260px] md:h-[320px]">
              <SmartImage
                src={profileImageUrl}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute right-4 top-4 z-10 text-xs font-bold tracking-[0.16em] text-slate-900">
                {profile.batch}
              </div>

              {instagramUrl || emailUrl || linkedinUrl || githubUrl ? (
                <div className="absolute bottom-3 right-3 flex flex-wrap items-center justify-end gap-2">
                  {instagramUrl ? (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      title="Instagram"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-pink-200 bg-white/90 text-slate-900 backdrop-blur transition hover:bg-pink-50"
                    >
                      <Instagram size={16} />
                    </a>
                  ) : null}
                  {emailUrl ? (
                    <a
                      href={emailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Email"
                      title="Email"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 bg-white/90 text-slate-900 backdrop-blur transition hover:bg-amber-50"
                    >
                      <Mail size={16} />
                    </a>
                  ) : null}
                  {linkedinUrl ? (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-white/90 text-slate-900 backdrop-blur transition hover:bg-blue-50"
                    >
                      <Linkedin size={16} />
                    </a>
                  ) : null}
                  {githubUrl ? (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      title="GitHub"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-900 backdrop-blur transition hover:bg-slate-50"
                    >
                      <Github size={16} />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="w-full bg-white px-5 pt-4 pb-2 text-center sm:px-8">
            <h1 className="text-2xl font-extrabold text-blue-700 sm:text-3xl">
              {profile.name}
            </h1>
          </div>

          {profile.about ? (
            <div className="w-full bg-white px-5 pb-4 text-[15px] leading-7 text-gray-700 sm:px-8 md:pb-5">
              <p className="line-clamp-5 md:line-clamp-6">{profile.about}</p>
            </div>
          ) : null}

          <div className="w-full bg-white px-5 pb-6 sm:px-8">
            <button
              type="button"
              onClick={handleShare}
              className="w-full rounded-xl bg-gradient-to-r from-[#1f56e4] to-[#08b8a8] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
            >
              {copied ? "Link copied" : "Share Profile"}
            </button>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col bg-white px-5 pb-6 sm:px-8 sm:pb-8 md:overflow-y-auto">
          <div className="sticky top-0 z-20 bg-white pt-5 sm:pt-8">
            <div className="pb-4">
              <div className="relative w-full overflow-hidden rounded-full bg-[#0b1c47] p-1 ring-1 ring-black/20">
                <div
                  role="tablist"
                  aria-label="Profile details"
                  className="relative z-10 grid grid-cols-4 gap-1"
                >
                  {detailTabs.map((tab) => {
                    const isActive = detailTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setDetailTab(tab)}
                        className={[
                          "min-w-0 truncate rounded-full px-5 py-2 text-sm font-semibold transition-colors sm:text-base",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70",
                          isActive ? "text-slate-900" : "text-white/90",
                        ].join(" ")}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                <div
                  aria-hidden
                  className="absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc((100%-0.75rem)/4)] rounded-full bg-yellow-400 transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(${activeTabIndex * 100}%)` }}
                />
              </div>
            </div>
          </div>

          <div className={detailTab === "Projects" ? "mt-6" : "mt-6 rounded-2xl bg-white p-6"}>
            {detailTab === "Projects" ? (
              projects.length === 0 ? (
                <p className="text-base font-medium text-slate-500">No projects added yet.</p>
              ) : (
                <div className="grid gap-4">
                  {projects.slice(0, 6).map((project, index) => {
                    const hasLink = Boolean(project.link?.trim());
                    return (
                      <div
                        key={`project-${index}`}
                        className="rounded-2xl bg-white px-7 py-6 ring-1 ring-slate-100"
                      >
                        <div className="flex flex-col gap-5 md:flex-row md:items-start">
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900/5 ring-1 ring-slate-200 md:w-80 md:shrink-0">
                            {hasLink ? (
                              <>
                                <iframe
                                  title={`${project.title} preview`}
                                  src={project.link}
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  scrolling="no"
                                  sandbox="allow-scripts allow-same-origin allow-forms"
                                  className="pointer-events-none h-[calc(100%+64px)] w-[calc(100%+64px)] -ml-8 -mt-8"
                                />
                                <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200 backdrop-blur">
                                  Preview
                                </div>
                              </>
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                                No preview
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h2 className="text-[22px] font-extrabold text-slate-900">
                              {project.title}
                            </h2>
                            <p className="mt-4 text-[16px] leading-7 text-slate-600">
                              {project.description || "Project details will be added soon."}
                            </p>
                            {hasLink ? (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-red-600 hover:text-red-700"
                              >
                                Visit Website <span aria-hidden>↗</span>
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : null}

            {detailTab === "Skills" ? (
              skillGroups.length === 0 ? (
                <p className="text-base font-medium text-slate-500">No skills added yet.</p>
              ) : (
                <div className="space-y-6">
                  {skillGroups.map((group, groupIndex) => (
                    <div key={`skill-group-${groupIndex}`}>
                      <h3 className="text-sm font-extrabold tracking-[0.22em] text-slate-900">
                        {group.title.toUpperCase()}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.items.map((item, index) => (
                          <span
                            key={`skill-${group.title}-${index}`}
                            className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 ring-1 ring-slate-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : null}

            {detailTab === "Certificate" ? (
              certificates.length === 0 ? (
                <p className="text-base font-medium text-slate-500">No certificates added yet.</p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {certificates.slice(0, 8).map((cert, index) => {
                    const hasLink = Boolean(cert.link?.trim());
                    const previewSrc = cert.previewImage?.trim() || "/no-image.png";
                    return (
                      <div
                        key={`cert-${index}`}
                        className="overflow-hidden rounded-2xl bg-white ring-slate-200"
                      >
                        <div className="relative h-[220px] bg-slate-900/10">
                          <SmartImage
                            src={normalizeImageUrl(previewSrc)}
                            alt={cert.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="px-5 pt-4 pb-5">
                          <h3 className="line-clamp-1 text-xl font-extrabold text-slate-900">
                            {cert.title}
                          </h3>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-500">
                              {cert.date || " "}
                            </p>

                            {hasLink ? (
                              <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                              >
                                View <span aria-hidden>↗</span>
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : null}

            {detailTab === "Achivement" ? (
              achievements.length === 0 ? (
                <p className="text-base font-medium text-slate-500">No achivements added yet.</p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {achievements.slice(0, 8).map((ach, index) => {
                    const previewSrc = ach.previewImage?.trim() || "/no-image.png";
                    return (
                      <div
                        key={`ach-${index}`}
                        className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200"
                      >
                        <div className="relative h-[220px] bg-slate-900/10">
                          <SmartImage
                            src={normalizeImageUrl(previewSrc)}
                            alt={ach.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="px-5 pt-4 pb-5">
                          <h3 className="line-clamp-1 text-xl font-extrabold text-slate-900">
                            {ach.title}
                          </h3>

                          {ach.description ? (
                            <p className="mt-2 line-clamp-3 text-[15px] leading-7 text-slate-600">
                              {ach.description}
                            </p>
                          ) : null}

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-slate-500">
                              {ach.date || " "}
                            </p>

                            {/* view link removed by request */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

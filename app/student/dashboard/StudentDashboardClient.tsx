"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import SmartImage from "@/components/shared/SmartImage";
import { normalizeImageUrl } from "@/lib/imageUrl";
import { slugifyProfileName } from "@/app/(main)/batches/slug";
import LogoutButton from "./LogoutButton";

type ProjectItem = {
  title: string;
  description: string;
  link: string;
};

type CertificateItem = {
  title: string;
  date: string;
  previewImage: string;
  link: string;
};

type AchievementItem = {
  title: string;
  description: string;
  previewImage: string;
  link: string;
  date: string;
};

type SkillGroup = {
  title: string;
  items: string[];
};

type StudentProfileForm = {
  name: string;
  position: string;
  image: string;
  admissionNo: string;
  batch: string;
  course: string;
  about: string;
  keywords: string;
  instagram: string;
  email: string;
  linkedin: string;
  github: string;
  skills: SkillGroup[];
  projects: ProjectItem[];
  certificates: CertificateItem[];
  achievements: AchievementItem[];
};

const normalizeProjectItem = (item: Partial<ProjectItem> | null | undefined): ProjectItem => ({
  title: typeof item?.title === "string" ? item.title : "",
  description: typeof item?.description === "string" ? item.description : "",
  link: typeof item?.link === "string" ? item.link : "",
});

const normalizeCertificateItem = (
  item: Partial<CertificateItem> | null | undefined
): CertificateItem => ({
  title: typeof item?.title === "string" ? item.title : "",
  date: typeof item?.date === "string" ? item.date : "",
  previewImage: typeof item?.previewImage === "string" ? item.previewImage : "",
  link: typeof item?.link === "string" ? item.link : "",
});

const normalizeAchievementItem = (
  item: Partial<AchievementItem> | null | undefined
): AchievementItem => ({
  title: typeof item?.title === "string" ? item.title : "",
  description: typeof item?.description === "string" ? item.description : "",
  previewImage: typeof item?.previewImage === "string" ? item.previewImage : "",
  link: typeof item?.link === "string" ? item.link : "",
  date: typeof item?.date === "string" ? item.date : "",
});

const normalizeSkillGroup = (group: Partial<SkillGroup> | null | undefined): SkillGroup => ({
  title: typeof group?.title === "string" ? group.title : "",
  items: Array.isArray(group?.items)
    ? group.items.filter((item): item is string => typeof item === "string").map((item) => item.trim())
    : [],
});

const normalizeStudentProfileForm = (
  profile: StudentProfileForm
): StudentProfileForm => ({
  name: typeof profile.name === "string" ? profile.name : "",
  position: typeof profile.position === "string" ? profile.position : "",
  image: typeof profile.image === "string" ? profile.image : "",
  admissionNo: typeof profile.admissionNo === "string" ? profile.admissionNo : "",
  batch: typeof profile.batch === "string" ? profile.batch : "",
  course: typeof profile.course === "string" ? profile.course : "",
  about: typeof profile.about === "string" ? limitWords(profile.about, 100) : "",
  keywords: typeof profile.keywords === "string" ? profile.keywords : "",
  instagram: typeof profile.instagram === "string" ? profile.instagram : "",
  email: typeof profile.email === "string" ? profile.email : "",
  linkedin: typeof profile.linkedin === "string" ? profile.linkedin : "",
  github: typeof profile.github === "string" ? profile.github : "",
  skills: Array.isArray(profile.skills) ? profile.skills.map(normalizeSkillGroup) : [],
  projects: Array.isArray(profile.projects) ? profile.projects.map(normalizeProjectItem) : [],
  certificates: Array.isArray(profile.certificates)
    ? profile.certificates.map(normalizeCertificateItem)
    : [],
  achievements: Array.isArray(profile.achievements)
    ? profile.achievements.map(normalizeAchievementItem)
    : [],
});

type DashboardTab =
  | "About"
  | "Social Media"
  | "Skills"
  | "Projects"
  | "Certificate"
  | "Achivement";

const tabs: DashboardTab[] = [
  "About",
  "Social Media",
  "Skills",
  "Projects",
  "Certificate",
  "Achivement",
];

const emptyProject = (): ProjectItem => ({ title: "", description: "", link: "" });
const emptyCertificate = (): CertificateItem => ({
  title: "",
  date: "",
  previewImage: "",
  link: "",
});
const emptyAchievement = (): AchievementItem => ({
  title: "",
  description: "",
  previewImage: "",
  link: "",
  date: "",
});
const emptySkillGroup = (): SkillGroup => ({ title: "", items: [] });
const skillItemsToInput = (items: string[]) => items.join(", ");
const parseSkillItems = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
const countWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const limitWords = (value: string, limit: number) =>
  (value.match(/\S+\s*/g) ?? []).slice(0, limit).join("").trimEnd();
export default function StudentDashboardClient({
  initialProfile,
}: {
  initialProfile: StudentProfileForm;
}) {
  const [form, setForm] = useState<StudentProfileForm>(() => normalizeStudentProfileForm(initialProfile));
  const [activeTab, setActiveTab] = useState<DashboardTab>("About");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [hoveredSkillGroupDelete, setHoveredSkillGroupDelete] = useState<number | null>(null);
  const [hoveredProjectDelete, setHoveredProjectDelete] = useState<number | null>(null);
  const [hoveredCertificateDelete, setHoveredCertificateDelete] = useState<number | null>(null);
  const [hoveredAchievementDelete, setHoveredAchievementDelete] = useState<number | null>(null);
  const [skillInputs, setSkillInputs] = useState<string[]>(
    (Array.isArray(initialProfile.skills) ? initialProfile.skills : []).map((group) =>
      skillItemsToInput(group.items)
    )
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSkillInputs(form.skills.map((group) => skillItemsToInput(group.items)));
  }, [form.skills]);

  useEffect(() => {
    if (!message) return;

    const timeout = window.setTimeout(() => {
      setMessage(null);
    }, 2500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [message]);

  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((tab) => tab === activeTab)),
    [activeTab]
  );
  const profileHref = useMemo(
    () => `/batches/${slugifyProfileName(form.name || initialProfile.name || "student")}`,
    [form.name, initialProfile.name]
  );
  const hasProfileImage = Boolean(form.image.trim()) && normalizeImageUrl(form.image) !== "/no-image.png";

  const handleChange = (key: keyof StudentProfileForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "about" ? limitWords(value, 100) : value,
    }));
  };

  const updateSkillGroup = (index: number, field: keyof SkillGroup, value: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.map((group, groupIndex) =>
        groupIndex === index
          ? {
              ...group,
              [field]: field === "items" ? parseSkillItems(value) : value,
            }
          : group
      ),
    }));
  };

  const handleSkillInputChange = (index: number, value: string) => {
    setSkillInputs((prev) => prev.map((entry, entryIndex) => (entryIndex === index ? value : entry)));
  };

  const commitSkillInput = (index: number) => {
    const value = skillInputs[index] ?? "";
    updateSkillGroup(index, "items", value);
    setSkillInputs((prev) =>
      prev.map((entry, entryIndex) =>
        entryIndex === index ? skillItemsToInput(parseSkillItems(value)) : entry
      )
    );
  };

  const addSkillGroup = () => {
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, emptySkillGroup()],
    }));
    setSkillInputs((prev) => [...prev, ""]);
  };

  const removeSkillGroup = (index: number) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, groupIndex) => groupIndex !== index),
    }));
    setSkillInputs((prev) => prev.filter((_, groupIndex) => groupIndex !== index));
  };

  const updateListItem = <K extends "projects" | "certificates" | "achievements">(
    key: K,
    index: number,
    field: keyof StudentProfileForm[K][number],
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addListItem = (key: "projects" | "certificates" | "achievements") => {
    setForm((prev) => ({
      ...prev,
      [key]:
        key === "projects"
          ? [...prev.projects, emptyProject()]
          : key === "certificates"
            ? [...prev.certificates, emptyCertificate()]
            : [...prev.achievements, emptyAchievement()],
    }));
  };

  const removeListItem = (key: "projects" | "certificates" | "achievements", index: number) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const normalizedSkills = form.skills.map((group, index) => ({
        ...group,
        items: parseSkillItems(skillInputs[index] ?? skillItemsToInput(group.items)),
      }));
      setForm((prev) => ({ ...prev, skills: normalizedSkills }));
      setSkillInputs(normalizedSkills.map((group) => skillItemsToInput(group.items)));

      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          skills: normalizedSkills,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setMessage("Profile updated");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async () => {
    const confirmed =
      typeof window === "undefined"
        ? true
        : window.confirm("Delete your profile image?");

    if (!confirmed) return;

    setDeletingImage(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: "/no-image.png",
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to delete image");
      setForm((prev) => ({ ...prev, image: "/no-image.png" }));
      setMessage("Profile image deleted.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    } finally {
      setDeletingImage(false);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    setUploadingImage(true);
    setMessage(null);
    setError(null);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const res = await fetch("/api/student/profile/image", {
        method: "POST",
        body: uploadData,
      });
      const data = (await res.json()) as { image?: string; error?: string };
      if (!res.ok || !data.image) throw new Error(data.error || "Failed to upload image.");

      setForm((prev) => ({ ...prev, image: data.image! }));
      setMessage("Profile image uploaded.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <section className="w-full px-4 pt-5 pb-12">
      <div className="overflow-hidden rounded-[2rem] bg-white">
        <div className="p-4 md:p-5">
          <form onSubmit={handleSubmit} className="mt-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={profileHref}
                className="cursor-pointer rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-100"
              >
                Go to your profile
              </Link>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={saving || deletingImage || uploadingImage}
                  className="cursor-pointer rounded-xl bg-gradient-to-r from-[#1f56e4] to-[#08b8a8] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(31,86,228,0.20)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Update Profile"}
                </button>
                <LogoutButton />
              </div>
            </div>

            <div className="grid items-stretch gap-4 md:grid-cols-[300px_1fr]">
              <div className="flex h-fit flex-col rounded-[1.75rem] p-4">
                <div className="relative flex min-h-[150px] items-center justify-center overflow-hidden rounded-[1.5rem] sm:min-h-[165px] md:min-h-[180px]">
                  {hasProfileImage ? (
                    <SmartImage
                      key={form.image}
                      src={normalizeImageUrl(form.image)}
                      alt={form.name || "Student profile"}
                      loading="eager"
                      decoding="sync"
                      className="max-h-[58%] w-auto max-w-[58%] rounded-[1.5rem] object-contain md:max-h-[35%] md:max-w-[35%] lg:max-h-[80%] lg:max-w-[80%]"
                    />
                  ) : (
                    <div className="flex min-h-[150px] w-full items-center justify-center rounded-[1.5rem] border border-dashed border-sky-200 bg-sky-50 px-5 text-center text-sm font-semibold text-sky-700 sm:min-h-[165px] md:min-h-[180px]">
                      Upload your image
                    </div>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <h1 className="text-xl font-extrabold text-slate-900 md:text-2xl">{form.name}</h1>
                  <p className="mt-1 text-sm font-semibold tracking-[0.18em] text-slate-500">
                    {form.batch}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{form.position || "Student"}</p>
                </div>

                <div className="mt-3 rounded-2xl bg-white/80 p-3 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    onMouseEnter={() => setDeleteHovered(true)}
                    onMouseLeave={() => setDeleteHovered(false)}
                    onFocus={() => setDeleteHovered(true)}
                    onBlur={() => setDeleteHovered(false)}
                    disabled={deletingImage || saving}
                    className={[
                      "delete-image-button flex w-full cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60",
                      deleteHovered
                        ? "border border-red-500 bg-red-500 text-white"
                        : "border border-slate-200 bg-white text-slate-900",
                    ].join(" ")}
                  >
                    {deletingImage ? "Deleting..." : "Delete Image"}
                  </button>
                  <label className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-100">
                    {uploadingImage ? "Uploading..." : "Upload new image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage || saving || deletingImage}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <div className="flex h-full flex-col rounded-[1.75rem] bg-slate-50 p-4 md:p-5">
                <p className="text-xs font-semibold tracking-[0.42em] text-[#1e56d8]">
                  STUDENT DASHBOARD
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-[28px]">About Section</h2>
                <p className="mt-2 min-w-0 whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-600">
                  {form.about ||
                    "Add your profile summary here. This content appears on your public batches profile."}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold tracking-[0.22em] text-slate-500">
                      ADMISSION NO.
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{form.admissionNo}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold tracking-[0.22em] text-slate-500">
                      COURSE
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{form.course}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 relative overflow-hidden rounded-full bg-[#10265e] p-1 shadow-[0_18px_45px_rgba(0,0,0,0.18)] ring-1 ring-black/10 md:hidden">
              <div
                role="tablist"
                aria-label="Student profile sections"
                className="relative z-10 grid grid-cols-6 gap-1"
              >
                {tabs.map((tab) => {
                  const isActive = tab === activeTab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab)}
                      className={[
                        "cursor-pointer rounded-full px-2 py-3 text-center text-xs font-semibold transition-colors md:px-3 md:text-base",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60",
                        isActive ? "text-slate-900" : "text-white",
                      ].join(" ")}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              <div
                aria-hidden
                className="absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc((100%-1.5rem)/6)] rounded-full bg-[#f7c316] transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(${activeIndex * 100}%)`,
                }}
              />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:items-start">
              <div className="hidden md:block">
                <div
                  role="tablist"
                  aria-label="Student profile sections"
                  className="rounded-[1.75rem] bg-[#10265e] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                >
                  <div className="space-y-2">
                    {tabs.map((tab) => {
                      const isActive = tab === activeTab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setActiveTab(tab)}
                          className={[
                            "flex w-full cursor-pointer items-center justify-start rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/60",
                            isActive ? "bg-[#f7c316] text-slate-900" : "text-white",
                          ].join(" ")}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-white p-5">
              {activeTab === "About" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={form.name ?? ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                    required
                  />
                  <input
                    value={form.position ?? ""}
                    onChange={(e) => handleChange("position", e.target.value)}
                    placeholder="Position / Headline"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                  />
                  <input
                    value={form.keywords ?? ""}
                    onChange={(e) => handleChange("keywords", e.target.value)}
                    placeholder="Keywords for search only, separated by commas"
                    className="md:col-span-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                  />
                  <div className="md:col-span-2 rounded-xl border border-dashed border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                    Use the image upload control above to add or replace your portfolio image.
                  </div>
                  <textarea
                    value={form.about ?? ""}
                    onChange={(e) => handleChange("about", e.target.value)}
                    placeholder="Write your about section (maximum 100 words)"
                    className="md:col-span-2 min-h-36 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                    required
                  />
                  <p className="md:col-span-2 -mt-2 text-right text-xs text-slate-500">
                    {countWords(form.about ?? "")}/100 words
                  </p>
                </div>
              ) : null}

              {activeTab === "Social Media" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={form.instagram ?? ""}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                    placeholder="Instagram (optional)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                  />
                  <input
                    value={form.email ?? ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Email (optional)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                  />
                  <input
                    value={form.linkedin ?? ""}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    placeholder="LinkedIn (optional)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                  />
                  <input
                    value={form.github ?? ""}
                    onChange={(e) => handleChange("github", e.target.value)}
                    placeholder="GitHub (optional)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                  />
                </div>
              ) : null}

              {activeTab === "Skills" ? (
                <div className="space-y-4">
                  {form.skills.map((group, index) => (
                    <div key={`skill-group-${index}`} className="rounded-2xl border border-slate-200 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <input
                          value={group.title ?? ""}
                          onChange={(e) => updateSkillGroup(index, "title", e.target.value)}
                          placeholder="Heading like Frontend, Backend"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          required
                        />
                        <input
                          value={skillInputs[index] ?? ""}
                          onChange={(e) => handleSkillInputChange(index, e.target.value)}
                          onBlur={() => commitSkillInput(index)}
                          placeholder="Skills for this heading, separated by commas"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          required
                        />
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        Enter multiple skills separated by commas.
                      </p>
                      <button
                        type="button"
                        onClick={() => removeSkillGroup(index)}
                        onMouseEnter={() => setHoveredSkillGroupDelete(index)}
                        onMouseLeave={() => setHoveredSkillGroupDelete(null)}
                        onFocus={() => setHoveredSkillGroupDelete(index)}
                        onBlur={() => setHoveredSkillGroupDelete(null)}
                        className={[
                          "student-dashboard-remove-button mt-3 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors duration-300 ease-out",
                          hoveredSkillGroupDelete === index
                            ? "border border-red-500 bg-red-500 text-white"
                            : "border border-slate-200 bg-white text-slate-900",
                        ].join(" ")}
                      >
                        Remove Skill Group
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSkillGroup}
                    className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Add Skill Group
                  </button>
                </div>
              ) : null}

                {activeTab === "Projects" ? (
                  <div className="space-y-4">
                    {form.projects.map((project, index) => (
                      <div key={`project-${index}`} className="rounded-2xl border border-slate-200 p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <input
                            value={project.title ?? ""}
                            onChange={(e) => updateListItem("projects", index, "title", e.target.value)}
                            placeholder="Project title"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                          <input
                            value={project.link ?? ""}
                            onChange={(e) => updateListItem("projects", index, "link", e.target.value)}
                            placeholder="Project link"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                          <textarea
                            value={project.description ?? ""}
                            onChange={(e) =>
                              updateListItem("projects", index, "description", e.target.value)
                            }
                            placeholder="Project description"
                            className="md:col-span-2 min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeListItem("projects", index)}
                          onMouseEnter={() => setHoveredProjectDelete(index)}
                          onMouseLeave={() => setHoveredProjectDelete(null)}
                          onFocus={() => setHoveredProjectDelete(index)}
                          onBlur={() => setHoveredProjectDelete(null)}
                          className={[
                            "student-dashboard-remove-button mt-3 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors duration-300 ease-out",
                            hoveredProjectDelete === index
                              ? "border border-red-500 bg-red-500 text-white"
                              : "border border-slate-200 bg-white text-slate-900",
                          ].join(" ")}
                        >
                          Remove Project
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addListItem("projects")}
                      className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Add Project
                    </button>
                  </div>
                ) : null}

                {activeTab === "Certificate" ? (
                  <div className="space-y-4">
                    {form.certificates.map((certificate, index) => (
                      <div key={`certificate-${index}`} className="rounded-2xl border border-slate-200 p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <input
                            value={certificate.title ?? ""}
                            onChange={(e) =>
                              updateListItem("certificates", index, "title", e.target.value)
                            }
                            placeholder="Certificate title"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                          <input
                            value={certificate.date ?? ""}
                            onChange={(e) =>
                              updateListItem("certificates", index, "date", e.target.value)
                            }
                            placeholder="Date"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                          <input
                            value={certificate.previewImage ?? ""}
                            onChange={(e) =>
                              updateListItem("certificates", index, "previewImage", e.target.value)
                            }
                            placeholder="Preview image URL"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                          <input
                            value={certificate.link ?? ""}
                            onChange={(e) =>
                              updateListItem("certificates", index, "link", e.target.value)
                            }
                            placeholder="Certificate link"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeListItem("certificates", index)}
                          onMouseEnter={() => setHoveredCertificateDelete(index)}
                          onMouseLeave={() => setHoveredCertificateDelete(null)}
                          onFocus={() => setHoveredCertificateDelete(index)}
                          onBlur={() => setHoveredCertificateDelete(null)}
                          className={[
                            "student-dashboard-remove-button mt-3 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors duration-300 ease-out",
                            hoveredCertificateDelete === index
                              ? "border border-red-500 bg-red-500 text-white"
                              : "border border-slate-200 bg-white text-slate-900",
                          ].join(" ")}
                        >
                          Remove Certificate
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addListItem("certificates")}
                      className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Add Certificate
                    </button>
                  </div>
                ) : null}

                {activeTab === "Achivement" ? (
                  <div className="space-y-4">
                    {form.achievements.map((achievement, index) => (
                      <div key={`achievement-${index}`} className="rounded-2xl border border-slate-200 p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <input
                            value={achievement.title ?? ""}
                            onChange={(e) =>
                              updateListItem("achievements", index, "title", e.target.value)
                            }
                            placeholder="Achievement title"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                          <input
                            value={achievement.date ?? ""}
                            onChange={(e) =>
                              updateListItem("achievements", index, "date", e.target.value)
                            }
                            placeholder="Date"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                          <input
                            value={achievement.previewImage ?? ""}
                            onChange={(e) =>
                              updateListItem("achievements", index, "previewImage", e.target.value)
                            }
                            placeholder="Preview image URL"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                          <input
                            value={achievement.link ?? ""}
                            onChange={(e) =>
                              updateListItem("achievements", index, "link", e.target.value)
                            }
                            placeholder="Achievement link"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                          <textarea
                            value={achievement.description ?? ""}
                            onChange={(e) =>
                              updateListItem(
                                "achievements",
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Achievement description"
                            className="md:col-span-2 min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#08b8a8] focus:ring-2 focus:ring-[#08b8a8]/20"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeListItem("achievements", index)}
                          onMouseEnter={() => setHoveredAchievementDelete(index)}
                          onMouseLeave={() => setHoveredAchievementDelete(null)}
                          onFocus={() => setHoveredAchievementDelete(index)}
                          onBlur={() => setHoveredAchievementDelete(null)}
                          className={[
                            "student-dashboard-remove-button mt-3 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors duration-300 ease-out",
                            hoveredAchievementDelete === index
                              ? "border border-red-500 bg-red-500 text-white"
                              : "border border-slate-200 bg-white text-slate-900",
                          ].join(" ")}
                        >
                          Remove Achievement
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addListItem("achievements")}
                      className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Add Achievement
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {error ? (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : null}

          </form>
        </div>
      </div>

      {message ? (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(5,150,105,0.28)]">
          {message}
        </div>
      ) : null}
    </section>
  );
}

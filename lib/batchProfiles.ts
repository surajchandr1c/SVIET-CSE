import { connectDB } from "@/lib/mongodb";
import BatchProfile from "@/models/BatchProfile";
import type {
  BatchAchievement,
  BatchCertificate,
  BatchProfile as PublicBatchProfile,
  BatchProject,
  BatchSkillGroup,
} from "@/app/(main)/batches/types";

type BatchProfileDoc = {
  _id?: unknown;
  name?: unknown;
  position?: unknown;
  image?: unknown;
  admissionNo?: unknown;
  batch?: unknown;
  course?: unknown;
  about?: unknown;
  keywords?: unknown;
  skills?: unknown;
  projects?: unknown;
  certificates?: unknown;
  achievements?: unknown;
  isDisabled?: unknown;
  instagram?: unknown;
  email?: unknown;
  whatsapp?: unknown;
  linkedin?: unknown;
  github?: unknown;
};

const normalizeString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

const normalizeSkills = (value: unknown): Array<string | BatchSkillGroup> => {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => {
    if (typeof item === "string") return item.trim().length > 0;
    if (!item || typeof item !== "object") return false;
    const title = "title" in item ? normalizeString(item.title) : "";
    const items =
      "items" in item && Array.isArray(item.items)
        ? item.items.filter(
            (entry: unknown): entry is string =>
              typeof entry === "string" && entry.trim().length > 0
          )
        : [];
    return Boolean(title && items.length > 0);
  }) as Array<string | BatchSkillGroup>;
};

const normalizeProjects = (value: unknown): BatchProject[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      title: normalizeString((item as BatchProject).title),
      description: normalizeString((item as BatchProject).description),
      link: normalizeString((item as BatchProject).link),
    }))
    .filter((item) => item.title);
};

const normalizeCertificates = (value: unknown): BatchCertificate[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      title: normalizeString((item as BatchCertificate).title),
      date: normalizeString((item as BatchCertificate).date),
      previewImage: normalizeString((item as BatchCertificate).previewImage, "/no-image.png"),
      link: normalizeString((item as BatchCertificate).link),
    }))
    .filter((item) => item.title);
};

const normalizeAchievements = (value: unknown): BatchAchievement[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      title: normalizeString((item as BatchAchievement).title),
      description: normalizeString((item as BatchAchievement).description),
      previewImage: normalizeString((item as BatchAchievement).previewImage, "/no-image.png"),
      link: normalizeString((item as BatchAchievement).link),
      date: normalizeString((item as BatchAchievement).date),
    }))
    .filter((item) => item.title);
};

const toPublicBatchProfile = (doc: BatchProfileDoc): PublicBatchProfile => ({
  _id: String(doc._id ?? ""),
  name: normalizeString(doc.name),
  position: normalizeString(doc.position, "Student"),
  image: normalizeString(doc.image, "/no-image.png"),
  admissionNo: normalizeString(doc.admissionNo),
  batch: normalizeString(doc.batch),
  course: normalizeString(doc.course, "B.Tech CSE"),
  about: normalizeString(doc.about),
  keywords: normalizeString(doc.keywords),
  skills: normalizeSkills(doc.skills),
  projects: normalizeProjects(doc.projects),
  certificates: normalizeCertificates(doc.certificates),
  achievements: normalizeAchievements(doc.achievements),
  isDisabled: doc.isDisabled === true,
  instagram: normalizeString(doc.instagram),
  email: normalizeString(doc.email, normalizeString(doc.whatsapp)),
  linkedin: normalizeString(doc.linkedin),
  github: normalizeString(doc.github),
});

export const getAllBatchProfiles = async (
  options?: { includeDisabled?: boolean }
): Promise<PublicBatchProfile[]> => {
  try {
    await connectDB();
    const docs = await BatchProfile.find().lean<BatchProfileDoc[]>();
    return docs
      .map(toPublicBatchProfile)
      .filter(
        (profile) =>
          profile.name &&
          profile.admissionNo &&
          (options?.includeDisabled ? true : !profile.isDisabled)
      );
  } catch {
    return [];
  }
};

export const getBatchProfiles = async (
  tab: "4" | "6",
  options?: { includeDisabled?: boolean }
): Promise<PublicBatchProfile[]> => {
  const profiles = await getAllBatchProfiles(options);
  return profiles.filter((profile) =>
    tab === "6" ? profile.batch === "2023 Batch" : profile.batch === "2024 Batch"
  );
};

import type { SemesterKey } from "@/config/semesters";

export type SemesterSlug = SemesterKey;
export type StudyResourceCategory = "assignment" | "notes" | "ppt";

export const apiRoutes = {
  notices: () => "/api/notices",
  gallery: () => "/api/gallery",
  achivement: () => "/api/achivement",

  studyResources: (semester: SemesterSlug, category: StudyResourceCategory) =>
    `/api/study-resources?semester=${semester}&category=${category}`,

  questionPapers: (semester: SemesterSlug) =>
    `/api/question-papers?semester=${semester}`,

  syllabus: (semester: SemesterSlug) => `/api/syllabus?semester=${semester}`,
} as const;

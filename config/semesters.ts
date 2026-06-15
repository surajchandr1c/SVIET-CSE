export const SEMESTERS = [
  { key: "4th", number: 4, slug: "4thSem" },
  { key: "6th", number: 6, slug: "6thSem" },
] as const;

export type SemesterKey = (typeof SEMESTERS)[number]["key"];
export type SemesterNumber = (typeof SEMESTERS)[number]["number"];
export type SemesterSlug = (typeof SEMESTERS)[number]["slug"];

export const isSemesterKey = (value: string): value is SemesterKey =>
  SEMESTERS.some((s) => s.key === value);

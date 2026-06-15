import students4thSem from "@/data/students4thSem.json";
import students6thSem from "@/data/students6thSem.json";

type StudentRosterRow = {
  admissionNo?: string;
  name?: string;
  Name?: string;
};

export type StudentRosterEntry = {
  admissionNo: string;
  name: string;
  semester: 4 | 6;
};

export const normalizeAdmissionNo = (value: string) => value.trim().toUpperCase();

export const normalizeStudentName = (value: string) =>
  value.trim().replace(/\s+/g, " ");

export const initialPasswordForAdmission = (admissionNo: string) => {
  const match = admissionNo.match(/(\d{3,4})$/);
  const suffix = String(match?.[1] ?? "0000").padStart(4, "0");
  return `SVIET@${suffix}`;
};

const buildRoster = (
  rows: StudentRosterRow[],
  semester: 4 | 6
): StudentRosterEntry[] =>
  rows
    .map((row) => ({
      admissionNo: normalizeAdmissionNo(String(row.admissionNo ?? "")),
      name: normalizeStudentName(String(row.name ?? row.Name ?? "")),
      semester,
    }))
    .filter((row) => row.admissionNo && row.name);

const roster = [
  ...buildRoster(students4thSem as StudentRosterRow[], 4),
  ...buildRoster(students6thSem as StudentRosterRow[], 6),
];

const rosterByAdmission = new Map(
  roster.map((student) => [student.admissionNo, student] as const)
);

export const findStudentInRoster = (admissionNo: string) =>
  rosterByAdmission.get(normalizeAdmissionNo(admissionNo)) ?? null;

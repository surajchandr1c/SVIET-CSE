import Student from "@/models/Student";
import { connectDB } from "@/server/db/mongodb";
import students4thSem from "@/data/students4thSem.json";
import students6thSem from "@/data/students6thSem.json";

type FallbackStudentRow = {
  admissionNo: string;
  name?: string;
  Name?: string;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const semesterAliases = (semester: number) =>
  [
    semester,
    String(semester),
    `${semester}th`,
    `${semester}th Semester`,
    semester === 4 ? "4th" : semester === 6 ? "6th" : undefined,
  ].filter((v): v is string | number => Boolean(v));

const buildFallbackStudents = (semester: 4 | 6) => {
  const normalize = (row: FallbackStudentRow) => ({
    admissionNo: String(row.admissionNo ?? "").trim().toUpperCase(),
    name: String(row.name ?? row.Name ?? "").trim().replace(/\s+/g, " "),
    semester,
  });

  const source = semester === 4 ? (students4thSem as FallbackStudentRow[]) : (students6thSem as FallbackStudentRow[]);

  return source
    .map(normalize)
    .filter((row) => row.admissionNo && row.name)
    .sort((a, b) => a.admissionNo.localeCompare(b.admissionNo));
};

export type PublicStudentRow = {
  _id: string;
  admissionNo: string;
  name: string;
  semester: number;
  createdAt?: string | null;
};

export const listStudentsForSemester = async (
  semester: 4 | 6,
  admissionNo?: string
): Promise<PublicStudentRow[]> => {
  await connectDB();

  const match: Record<string, unknown> = {
    admissionNo: { $type: "string", $ne: "" },
    semester: { $in: semesterAliases(semester) },
  };

  const normalizedAdmissionNo = (admissionNo ?? "").trim().toUpperCase();
  if (normalizedAdmissionNo) {
    match.admissionNo = new RegExp(`^${escapeRegex(normalizedAdmissionNo)}$`, "i");
  }

  const col = Student.collection;
  const fetchFromDb = async () => {
    const docs = await col
      .aggregate([
        { $match: match },
        {
          $addFields: {
            __hasPassword: {
              $cond: [
                { $and: [{ $ne: ["$password", null] }, { $ne: ["$password", ""] }] },
                1,
                0,
              ],
            },
          },
        },
        { $sort: { __hasPassword: -1, updatedAt: -1, createdAt: -1, _id: -1 } },
        { $group: { _id: "$admissionNo", doc: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$doc" } },
        { $sort: { admissionNo: 1 } },
        { $project: { name: 1, admissionNo: 1, semester: 1, createdAt: 1 } },
      ])
      .toArray();

    return docs.map((d) => ({
      _id: String((d as { _id?: unknown })._id ?? ""),
      name: String((d as { name?: unknown }).name ?? ""),
      admissionNo: String((d as { admissionNo?: unknown }).admissionNo ?? ""),
      semester:
        typeof (d as { semester?: unknown }).semester === "number"
          ? (d as { semester: number }).semester
          : semester,
      createdAt: (d as { createdAt?: unknown }).createdAt
        ? String((d as { createdAt: unknown }).createdAt)
        : null,
    }));
  };

  let students = await fetchFromDb();
  if (students.length > 0) return students;

  // Seed from local JSON if DB is empty for this semester.
  try {
    const seed = buildFallbackStudents(semester);
    if (seed.length > 0) {
      await Student.insertMany(seed, { ordered: false });
      students = await fetchFromDb();
    }
  } catch (seedError) {
    console.error("Student seed error:", seedError);
  }

  return students;
};

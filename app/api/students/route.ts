import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import { verifyAdminToken } from "@/lib/auth";
import students4thSem from "@/data/students4thSem.json";
import students6thSem from "@/data/students6thSem.json";
import { listStudentsForSemester } from "@/lib/students";

const parseSemester = (value: string | null): number | null => {
  if (!value) return null;
  if (value === "4th") return 4;
  if (value === "6th") return 6;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeCourse = (value: unknown): "CSE" | "AI/ML" =>
  typeof value === "string" && value.toUpperCase() === "AI/ML" ? "AI/ML" : "CSE";

type FallbackStudentRow = {
  srNo?: number;
  admissionNo: string;
  name?: string;
  Name?: string;
};

const buildFallbackStudents = (semester: number | null) => {
  const normalize = (row: FallbackStudentRow, fallbackSemester: number) => ({
    _id: row.admissionNo,
    admissionNo: row.admissionNo,
    name: row.name ?? row.Name ?? "",
    semester: fallbackSemester,
  });

  if (semester === 4) {
    return (students4thSem as FallbackStudentRow[])
      .map((row) => normalize(row, 4))
      .sort((a, b) => a.admissionNo.localeCompare(b.admissionNo));
  }

  if (semester === 6) {
    return (students6thSem as FallbackStudentRow[])
      .map((row) => normalize(row, 6))
      .sort((a, b) => a.admissionNo.localeCompare(b.admissionNo));
  }

  const all4 = (students4thSem as FallbackStudentRow[]).map((row) => normalize(row, 4));
  const all6 = (students6thSem as FallbackStudentRow[]).map((row) => normalize(row, 6));
  return [...all4, ...all6].sort((a, b) => a.admissionNo.localeCompare(b.admissionNo));
};

const requireAdmin = async () => {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const semesterParam = searchParams.get("semester");
  const semester = parseSemester(semesterParam);
  const admissionNo = searchParams.get("admissionNo") ?? undefined;

  try {
    if (semester === 4 || semester === 6) {
      const students = await listStudentsForSemester(semester, admissionNo);
      return NextResponse.json(students);
    }

    // Semester not specified: return everything (fallback to legacy behavior).
    await connectDB();
    const students = await Student.find({})
      .select("name admissionNo semester createdAt")
      .sort({ admissionNo: 1 })
      .lean();

    return NextResponse.json(students);
  } catch (error) {
    console.error("Students fetch error (falling back to local JSON):", error);
    return NextResponse.json(buildFallbackStudents(semester), { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const semester = parseSemester(body?.semester ?? null);
    const payload = {
      ...body,
      ...(semester ? { semester } : {}),
      course: normalizeCourse(body?.course),
    };
    const newStudent = await Student.create(payload);
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error("Students create error:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

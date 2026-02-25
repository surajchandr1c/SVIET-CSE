import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import students4thSem from "@/data/students4thSem.json";
import students6thSem from "@/data/students6thSem.json";

type StudentSeed = {
  srNo: number;
  admissionNo: string;
  name?: string;
  Name?: string;
};

const mapSeed = (semester: "4th" | "6th", data: StudentSeed[]) =>
  data
    .map((item) => ({
      semester,
      admissionNo: item.admissionNo?.trim(),
      name: (item.name ?? item.Name ?? "").trim(),
    }))
    .filter((item) => item.admissionNo && item.name);

const DEFAULT_4TH_STUDENTS = mapSeed("4th", students4thSem as StudentSeed[]);
const DEFAULT_6TH_STUDENTS = mapSeed("6th", students6thSem as StudentSeed[]);

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");
    const filter = semester ? { semester } : {};

    let students = await Student.find(filter).sort({ admissionNo: 1, createdAt: 1 });

    if (semester === "4th" && students.length === 0) {
      await Student.insertMany(DEFAULT_4TH_STUDENTS);
      students = await Student.find(filter).sort({ admissionNo: 1, createdAt: 1 });
    }

    if (semester === "6th" && students.length === 0) {
      await Student.insertMany(DEFAULT_6TH_STUDENTS);
      students = await Student.find(filter).sort({ admissionNo: 1, createdAt: 1 });
    }

    return NextResponse.json(students);
  } catch (error) {
    console.error("Students fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newStudent = await Student.create(body);
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error("Students create error:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

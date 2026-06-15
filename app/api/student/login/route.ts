import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import { signStudentToken } from "@/lib/studentAuth";
import {
  findStudentInRoster,
  initialPasswordForAdmission,
  normalizeAdmissionNo,
} from "@/lib/studentCredentials";

type LoginBody = {
  admissionNo?: string;
  password?: string;
  name?: string;
};

type StudentLoginCandidate = {
  _id: unknown;
  name: string;
  admissionNo: string;
  password?: string;
  semester: number;
  mustChangePassword: boolean;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    const admissionNo = normalizeAdmissionNo(body.admissionNo ?? "");
    const password = body.password ?? "";

    if (!admissionNo || !password) {
      return NextResponse.json(
        { error: "Admission no. and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    // Be robust to any legacy duplicate documents (same admissionNo) by picking
    // the most recently updated entry that actually has a password set.
    const baseQuery: Record<string, unknown> = { admissionNo };
    let candidates = await Student.find(baseQuery)
      .select("name admissionNo semester mustChangePassword")
      .select("+password")
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(5)
      .lean<StudentLoginCandidate[]>();

    if (candidates.length === 0 && admissionNo) {
      // Legacy data may have inconsistent casing.
      candidates = await Student.find({
        admissionNo: { $regex: `^${escapeRegex(admissionNo)}$`, $options: "i" },
      })
        .select("name admissionNo semester mustChangePassword")
        .select("+password")
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(5)
        .lean();
    }

    let student: StudentLoginCandidate | null =
      candidates.find((c) => typeof c.password === "string" && c.password.length > 0) ??
      candidates[0] ??
      null;
    const rosterStudent = findStudentInRoster(admissionNo);
    const documentedInitialPassword = rosterStudent
      ? initialPasswordForAdmission(rosterStudent.admissionNo)
      : null;
    const usingDocumentedInitialPassword =
      documentedInitialPassword !== null && password === documentedInitialPassword;

    const syncInitialPasswordFromRoster = async () => {
      if (!rosterStudent || !usingDocumentedInitialPassword) return null;

      return Student.findOneAndUpdate(
        student?._id ? { _id: student._id } : { admissionNo: rosterStudent.admissionNo },
        {
          $set: {
            name: rosterStudent.name,
            admissionNo: rosterStudent.admissionNo,
            semester: rosterStudent.semester,
            role: "student",
            password: await bcrypt.hash(documentedInitialPassword, 10),
            mustChangePassword: true,
          },
        },
        { new: true, upsert: true, strict: false, setDefaultsOnInsert: true }
      )
        .select("name admissionNo semester mustChangePassword")
        .select("+password")
        .lean<StudentLoginCandidate | null>();
    };

    if ((!student || !student.password) && rosterStudent && usingDocumentedInitialPassword) {
      student = await syncInitialPasswordFromRoster();
    }

    if (!student) {
      return NextResponse.json(
        { error: "Invalid admission no. or password." },
        { status: 401 }
      );
    }

    let ok =
      typeof student.password === "string" && student.password.length > 0
        ? await bcrypt.compare(password, student.password)
        : false;

    // Repair legacy accounts whose first password was seeded inconsistently.
    if (!ok && student.mustChangePassword && rosterStudent && usingDocumentedInitialPassword) {
      student = (await syncInitialPasswordFromRoster()) ?? student;
      ok =
        typeof student.password === "string" && student.password.length > 0
          ? await bcrypt.compare(password, student.password)
          : false;
    }

    if (!ok) {
      return NextResponse.json(
        { error: "Invalid admission no. or password." },
        { status: 401 }
      );
    }

    const token = signStudentToken({
      sub: String(student._id),
      admissionNo: student.admissionNo,
      role: "student",
      semester: student.semester,
      name: student.name,
    });

    const res = NextResponse.json({
      student: {
        name: student.name,
        admissionNo: student.admissionNo,
        semester: student.semester,
      },
      mustChangePassword: student.mustChangePassword,
    });

    res.cookies.set("student_token", token, {
      httpOnly: true,
      sameSite: "lax",
      // When running `next start` locally (NODE_ENV=production) over HTTP,
      // `secure: true` would prevent the cookie from being stored.
      secure: ((await headers()).get("x-forwarded-proto") ?? "http") === "https",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Student login error:", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}

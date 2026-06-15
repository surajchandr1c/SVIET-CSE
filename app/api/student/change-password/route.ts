import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import { verifyStudentToken } from "@/lib/studentAuth";
import mongoose from "mongoose";

type Body = {
  oldPassword?: string;
  newPassword?: string;
};

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("student_token")?.value;
    const payload = token ? verifyStudentToken(token) : null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const oldPassword = body.oldPassword ?? "";
    const newPassword = body.newPassword ?? "";

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Old password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }

    await connectDB();

    const tryById = async () => {
      if (!mongoose.Types.ObjectId.isValid(payload.sub)) return null;
      return Student.findById(payload.sub).select("+password");
    };

    const tryByAdmissionNo = async () => {
      const admissionNo = (payload.admissionNo ?? "").trim().toUpperCase();
      if (!admissionNo) return null;

      const candidates = await Student.find({ admissionNo })
        .select("admissionNo mustChangePassword")
        .select("+password")
        .sort({ updatedAt: -1, createdAt: -1, _id: -1 })
        .limit(5);

      return (
        candidates.find((c) => typeof c.password === "string" && c.password.length > 0) ??
        candidates[0] ??
        null
      );
    };

    const student = (await tryById()) ?? (await tryByAdmissionNo());
    if (!student?.password) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const ok = await bcrypt.compare(oldPassword, student.password);
    if (!ok) {
      return NextResponse.json({ error: "Old password is incorrect." }, { status: 401 });
    }

    student.password = await bcrypt.hash(newPassword, 10);
    student.mustChangePassword = false;
    await student.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Student change password error:", error);
    return NextResponse.json({ error: "Failed to change password." }, { status: 500 });
  }
}

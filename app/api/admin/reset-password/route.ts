import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import { verifyAdminToken } from "@/lib/auth";
import mongoose from "mongoose";

type Body = {
  admissionNo?: string;
  studentId?: string;
};

const normalizeSemester = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const match = value.match(/\d+/);
    if (match) {
      const parsed = Number.parseInt(match[0], 10);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
};

const generatePassword = () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SVIET@${num}`;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("admin_token")?.value;
    const admin = token ? verifyAdminToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const admissionNoRaw = (body.admissionNo ?? "").trim();
    const admissionNo = admissionNoRaw.toUpperCase();
    const studentId = (body.studentId ?? "").trim();
    if (!admissionNo) {
      if (!studentId) {
        return NextResponse.json(
          { error: "Admission no. is required." },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const plainPassword = generatePassword();
    const hashed = await bcrypt.hash(plainPassword, 10);

    let filter: Record<string, unknown> =
      studentId && mongoose.Types.ObjectId.isValid(studentId)
        ? { _id: new mongoose.Types.ObjectId(studentId) }
        : { admissionNo };

    let existing = await Student.findOne(filter)
      .select("semester admissionNo")
      .lean<{ semester?: unknown; admissionNo?: string } | null>();

    if (!existing && admissionNoRaw && !("_id" in filter)) {
      const byAdmission = await Student.findOne({
        admissionNo: { $regex: `^${escapeRegex(admissionNoRaw)}$`, $options: "i" },
      })
        .select("semester admissionNo")
        .lean<{ semester?: unknown; admissionNo?: string } | null>();
      if (byAdmission) {
        existing = byAdmission;
        if (byAdmission.admissionNo) {
          filter = { admissionNo: byAdmission.admissionNo };
        }
      }
    }

    const semester = (() => {
      const parsed = normalizeSemester(existing?.semester);
      return parsed === 6 ? 6 : 4;
    })();

    // Some legacy data may have inconsistent casing. Try exact match first,
    // then fall back to a case-insensitive exact match.
    const tryUpdate = async (query: Record<string, unknown>) =>
      Student.findOneAndUpdate(
        query,
        {
          $set: {
            ...(admissionNo ? { admissionNo } : {}),
            password: hashed,
            mustChangePassword: true,
            role: "student",
            semester,
          },
        },
        // `strict: false` prevents a stale dev-time schema from dropping the update.
        { new: true, strict: false }
      ).select("name admissionNo semester");

    let updated = await tryUpdate(filter);
    if (!updated && admissionNoRaw) {
      updated = await tryUpdate({ admissionNo: { $regex: `^${escapeRegex(admissionNoRaw)}$`, $options: "i" } });
    }

    if (!updated) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    return NextResponse.json({
      admissionNo: updated.admissionNo,
      name: updated.name,
      newPassword: plainPassword,
    });
  } catch (error) {
    console.error("Admin reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}

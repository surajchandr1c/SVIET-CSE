import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import BatchProfile from "@/models/BatchProfile";
import Student from "@/models/Student";
import { verifyStudentToken } from "@/lib/studentAuth";

const batchLabel = (admissionNo: string, semester: number) => {
  const year = admissionNo.match(/^(20\d{2})/i)?.[1];
  if (year) return `${year} Batch`;
  return semester === 6 ? "2023 Batch" : "2024 Batch";
};

const normalizeText = (value: unknown, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

const limitWords = (value: string, limit: number) =>
  (value.match(/\S+\s*/g) ?? []).slice(0, limit).join("").trimEnd();

const normalizeSkillGroups = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  const groups = value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      title: normalizeText(item.title),
      items: Array.isArray(item.items)
        ? item.items
            .filter((entry): entry is string => typeof entry === "string")
            .map((entry) => entry.trim())
            .filter(Boolean)
        : [],
    }))
    .filter((item) => item.title && item.items.length > 0);

  if (groups.length > 0) return groups;

  const flat = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return flat.length > 0 ? [{ title: "Skills", items: flat }] : [];
};

const normalizeProjects = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          title: normalizeText((item as Record<string, unknown>).title),
          description: normalizeText((item as Record<string, unknown>).description),
          link: normalizeText((item as Record<string, unknown>).link),
        }))
        .filter((item) => item.title)
    : [];

const normalizeCertificates = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          title: normalizeText((item as Record<string, unknown>).title),
          date: normalizeText((item as Record<string, unknown>).date),
          previewImage: normalizeText((item as Record<string, unknown>).previewImage),
          link: normalizeText((item as Record<string, unknown>).link),
        }))
        .filter((item) => item.title)
    : [];

const normalizeAchievements = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          title: normalizeText((item as Record<string, unknown>).title),
          description: normalizeText((item as Record<string, unknown>).description),
          previewImage: normalizeText((item as Record<string, unknown>).previewImage),
          link: normalizeText((item as Record<string, unknown>).link),
          date: normalizeText((item as Record<string, unknown>).date),
        }))
        .filter((item) => item.title)
    : [];

export async function GET() {
  try {
    const token = (await cookies()).get("student_token")?.value;
    const payload = token ? verifyStudentToken(token) : null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const student = await Student.findOne({ admissionNo: payload.admissionNo })
      .select("name admissionNo semester course")
      .sort({ updatedAt: -1, createdAt: -1, _id: -1 })
      .lean<{
        _id?: unknown;
        name?: string;
        admissionNo?: string;
        semester?: number;
        course?: string;
      } | null>();

    if (!student?.admissionNo) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const profile = await BatchProfile.findOne({ admissionNo: student.admissionNo }).lean<Record<string, unknown> | null>();
    const semester = typeof student.semester === "number" ? student.semester : 4;

    return NextResponse.json({
      profile: {
        name: normalizeText(profile?.name, student.name ?? ""),
        position: normalizeText(profile?.position, "Student"),
        image: normalizeText(profile?.image, "/no-image.png"),
        admissionNo: student.admissionNo,
        batch: normalizeText(profile?.batch, batchLabel(student.admissionNo, semester)),
        course: student.course === "AI/ML" ? "AI/ML" : "CSE",
        about: normalizeText(profile?.about),
        keywords: normalizeText(profile?.keywords),
        instagram: normalizeText(profile?.instagram),
        email: normalizeText(profile?.email, normalizeText(profile?.whatsapp)),
        linkedin: normalizeText(profile?.linkedin),
        github: normalizeText(profile?.github),
        skills: normalizeSkillGroups(profile?.skills),
        projects: normalizeProjects(profile?.projects),
        certificates: normalizeCertificates(profile?.certificates),
        achievements: normalizeAchievements(profile?.achievements),
      },
    });
  } catch (error) {
    console.error("Student profile fetch error:", error);
    return NextResponse.json({ error: "Failed to load profile." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = (await cookies()).get("student_token")?.value;
    const payload = token ? verifyStudentToken(token) : null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const student = await Student.findOne({ admissionNo: payload.admissionNo })
      .select("name admissionNo semester course")
      .sort({ updatedAt: -1, createdAt: -1, _id: -1 });

    if (!student?.admissionNo) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const semester = typeof student.semester === "number" ? student.semester : 4;

    const update = {
      studentId: mongoose.Types.ObjectId.isValid(String(student._id))
        ? new mongoose.Types.ObjectId(String(student._id))
        : null,
      name: normalizeText(body.name, student.name),
      position: normalizeText(body.position, "Student"),
      image: normalizeText(body.image, "/no-image.png"),
      admissionNo: student.admissionNo,
      batch: batchLabel(student.admissionNo, semester),
      course: student.course === "AI/ML" ? "AI/ML" : "CSE",
      about: limitWords(normalizeText(body.about), 100),
      keywords: normalizeText(body.keywords),
      instagram: normalizeText(body.instagram),
      email: normalizeText(body.email, normalizeText(body.whatsapp)),
      linkedin: normalizeText(body.linkedin),
      github: normalizeText(body.github),
      skills: normalizeSkillGroups(body.skills),
      projects: normalizeProjects(body.projects),
      certificates: normalizeCertificates(body.certificates),
      achievements: normalizeAchievements(body.achievements),
    };

    const saved = await BatchProfile.findOneAndUpdate(
      { admissionNo: student.admissionNo },
      { $set: update },
      { new: true, upsert: true, strict: false, setDefaultsOnInsert: true }
    ).lean<Record<string, unknown> | null>();

    return NextResponse.json({ profile: saved });
  } catch (error) {
    console.error("Student profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const token = (await cookies()).get("student_token")?.value;
    const payload = token ? verifyStudentToken(token) : null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const student = await Student.findOne({ admissionNo: payload.admissionNo })
      .select("admissionNo")
      .sort({ updatedAt: -1, createdAt: -1, _id: -1 })
      .lean<{ admissionNo?: string } | null>();

    if (!student?.admissionNo) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    await BatchProfile.deleteOne({ admissionNo: student.admissionNo });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Student profile delete error:", error);
    return NextResponse.json({ error: "Failed to delete profile." }, { status: 500 });
  }
}

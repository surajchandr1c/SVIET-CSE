import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import { verifyAdminToken } from "@/lib/auth";

type PatchBody = {
  name?: string;
  admissionNo?: string;
};

const requireAdmin = async () => {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? verifyAdminToken(token) : null;
};

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid student id." }, { status: 400 });
    }

    const body = (await req.json()) as PatchBody;
    const name = (body.name ?? "").trim();
    const admissionNo = (body.admissionNo ?? "").trim().toUpperCase();

    if (!name || !admissionNo) {
      return NextResponse.json(
        { error: "Name and admission no. are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const col = Student.collection;
    const _id = new mongoose.Types.ObjectId(id);

    const existing = await col.findOne({ _id }, { projection: { _id: 1, admissionNo: 1 } });
    if (!existing) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const existingAdmissionNo = String((existing as { admissionNo?: unknown })?.admissionNo ?? "")
      .trim()
      .toUpperCase();

    // Legacy data can contain duplicate admission numbers. Allow editing the name
    // without forcing the user to resolve duplicates, as long as the admissionNo
    // is not being changed.
    if (existingAdmissionNo !== admissionNo) {
      const dup = await col.findOne(
        { admissionNo, _id: { $ne: _id } },
        { projection: { _id: 1 } }
      );
      if (dup) {
        return NextResponse.json(
          { error: "Admission no. already exists." },
          { status: 409 }
        );
      }
    }

    await col.updateOne(
      { _id },
      { $set: { name, admissionNo } }
    );

    const updated = (await col.findOne(
      { _id },
      { projection: { _id: 1, name: 1, admissionNo: 1, semester: 1, mustChangePassword: 1, createdAt: 1 } }
    )) as { _id?: unknown; name?: unknown; admissionNo?: unknown } | null;

    return NextResponse.json({
      student: {
        _id: String(updated?._id ?? id),
        name: String(updated?.name ?? name),
        admissionNo: String(updated?.admissionNo ?? admissionNo),
      },
    });
  } catch (error) {
    console.error("Admin student update error:", error);
    return NextResponse.json({ error: "Failed to update student." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid student id." }, { status: 400 });
    }

    await connectDB();
    const col = Student.collection;
    const _id = new mongoose.Types.ObjectId(id);

    const result = await col.deleteOne({ _id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin student delete error:", error);
    return NextResponse.json({ error: "Failed to delete student." }, { status: 500 });
  }
}

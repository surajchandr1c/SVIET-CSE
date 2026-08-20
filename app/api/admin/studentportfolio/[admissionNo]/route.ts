import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import BatchProfile from "@/models/BatchProfile";
import { verifyAdminToken } from "@/lib/auth";
import { removePinnedBatchProfile } from "@/lib/batchProfilePins";

const requireAdmin = (request: NextRequest) => {
  const token = request.cookies.get("admin_token")?.value;
  return token ? verifyAdminToken(token) : null;
};

const normalizeAdmissionNo = (value: string) => value.trim().toUpperCase();
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ admissionNo: string }> }
) {
  try {
    const admin = requireAdmin(request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { admissionNo: rawAdmissionNo } = await context.params;
    const admissionNo = normalizeAdmissionNo(rawAdmissionNo);
    if (!admissionNo) {
      return NextResponse.json({ error: "Admission number is required." }, { status: 400 });
    }

    const body = (await request.json()) as {
      isDisabled?: unknown;
      removeImage?: unknown;
    };
    if (body.removeImage !== true && typeof body.isDisabled !== "boolean") {
      return NextResponse.json({ error: "Valid disable status is required." }, { status: 400 });
    }

    await connectDB();
    const filter = { admissionNo: { $regex: `^${escapeRegex(admissionNo)}$`, $options: "i" } };
    const existing = await BatchProfile.collection.findOne(filter, {
      projection: { _id: 1, admissionNo: 1 },
    });

    if (!existing?._id) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    await BatchProfile.collection.updateOne(
      { _id: existing._id },
      {
        $set:
          body.removeImage === true
            ? { image: "/no-image.png" }
            : { isDisabled: body.isDisabled },
      }
    );
    revalidateTag("batch-profiles", "default");

    const updated = await BatchProfile.collection.findOne(
      { _id: existing._id },
      { projection: { admissionNo: 1, isDisabled: 1, image: 1 } }
    );

    if (!updated?.admissionNo) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      profile: {
        admissionNo: String(updated.admissionNo),
        isDisabled: updated.isDisabled === true,
        image: typeof updated.image === "string" ? updated.image : "/no-image.png",
      },
    });
  } catch (error) {
    console.error("Admin student portfolio status update error:", error);
    return NextResponse.json({ error: "Failed to update profile status." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ admissionNo: string }> }
) {
  try {
    const admin = requireAdmin(_request);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { admissionNo: rawAdmissionNo } = await context.params;
    const admissionNo = normalizeAdmissionNo(rawAdmissionNo);
    if (!admissionNo) {
      return NextResponse.json({ error: "Admission number is required." }, { status: 400 });
    }

    await connectDB();
    const result = await BatchProfile.deleteOne({
      admissionNo: { $regex: `^${escapeRegex(admissionNo)}$`, $options: "i" },
    });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const pinnedAdmissionNos = await removePinnedBatchProfile(admissionNo);
    revalidateTag("batch-profiles", "default");

    return NextResponse.json({
      ok: true,
      pinnedAdmissionNos,
    });
  } catch (error) {
    console.error("Admin student portfolio delete error:", error);
    return NextResponse.json({ error: "Failed to delete profile." }, { status: 500 });
  }
}

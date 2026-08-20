import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { verifyStudentToken } from "@/lib/studentAuth";
import BatchProfile from "@/models/BatchProfile";
import Student from "@/models/Student";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_FOLDER = "student-portfolios";

const jsonError = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("student_token")?.value;
    const payload = token ? verifyStudentToken(token) : null;
    if (!payload) return jsonError("Unauthorized", 401);

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return jsonError("An image file is required.", 400);
    if (!file.type.startsWith("image/")) return jsonError("Only image files are allowed.", 400);
    if (file.size > MAX_IMAGE_BYTES) return jsonError("Image must be 5 MB or smaller.", 400);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return jsonError("Image upload is not configured.", 503);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signatureBase = `folder=${IMAGE_FOLDER}&timestamp=${timestamp}`;
    const signature = createHash("sha1")
      .update(`${signatureBase}${apiSecret}`)
      .digest("hex");

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("api_key", apiKey);
    uploadData.append("timestamp", String(timestamp));
    uploadData.append("folder", IMAGE_FOLDER);
    uploadData.append("signature", signature);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      { method: "POST", body: uploadData }
    );
    const uploadResult = (await uploadResponse.json()) as {
      secure_url?: unknown;
      error?: { message?: string };
    };

    if (!uploadResponse.ok || typeof uploadResult.secure_url !== "string") {
      return jsonError(uploadResult.error?.message || "Cloudinary upload failed.", 502);
    }

    await connectDB();
    const student = await Student.findOne({ admissionNo: payload.admissionNo })
      .select("name admissionNo semester course")
      .lean<{
        name?: string;
        admissionNo?: string;
        semester?: number;
        course?: string;
      } | null>();
    if (!student?.admissionNo) return jsonError("Student not found.", 404);

    const admissionYear = student.admissionNo.match(/^(20\d{2})/i)?.[1];
    const batch = admissionYear
      ? `${admissionYear} Batch`
      : student.semester === 6
        ? "2023 Batch"
        : "2024 Batch";

    await BatchProfile.findOneAndUpdate(
      { admissionNo: student.admissionNo },
      {
        $set: { image: uploadResult.secure_url },
        $setOnInsert: {
          name: student.name || "Student",
          position: "Student",
          admissionNo: student.admissionNo,
          batch,
          course: student.course === "AI/ML" ? "AI/ML" : "CSE",
          about: "",
          skills: [],
          projects: [],
          certificates: [],
          achievements: [],
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    revalidateTag("batch-profiles", "default");

    return NextResponse.json({ image: uploadResult.secure_url });
  } catch (error) {
    console.error("Student profile image upload error:", error);
    return jsonError("Failed to upload image.", 500);
  }
}

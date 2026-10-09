import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_FOLDER = "faculty";

const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  try {
    if (!(await checkAdminAuth(request))) {
      return jsonError("Unauthorized", 401);
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return jsonError("An image file is required.", 400);
    if (!file.type.startsWith("image/")) return jsonError("Only image files are allowed.", 400);
    if (file.size > MAX_IMAGE_BYTES) return jsonError("Image must be 5 MB or smaller.", 400);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return jsonError("Image upload is not configured in server environment.", 503);
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

    return NextResponse.json({ image: uploadResult.secure_url });
  } catch (error) {
    console.error("Faculty image upload error:", error);
    return jsonError("Failed to upload image.", 500);
  }
}

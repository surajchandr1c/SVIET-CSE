import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GalleryAlbum from "@/models/GalleryAlbum";

type GalleryPayload = {
  heading?: unknown;
  date?: unknown;
  coverImageUrl?: unknown;
  driveUrl?: unknown;
};

const normalizePayload = (body: GalleryPayload) => ({
  heading: typeof body.heading === "string" ? body.heading.trim() : "",
  date: typeof body.date === "string" ? body.date.trim() : "",
  coverImageUrl:
    typeof body.coverImageUrl === "string" ? body.coverImageUrl.trim() : "",
  driveUrl: typeof body.driveUrl === "string" ? body.driveUrl.trim() : "",
});

const getValidationError = (
  payload: ReturnType<typeof normalizePayload>
): string | null => {
  if (!payload.heading && !payload.date) {
    return "Either heading or date is required";
  }

  if (!payload.coverImageUrl) {
    return "Cover image URL is required";
  }

  if (!payload.driveUrl) {
    return "Drive URL is required";
  }

  return null;
};

export async function GET() {
  try {
    await connectDB();
    const albums = await GalleryAlbum.find().sort({ date: -1, createdAt: -1 });
    return NextResponse.json(albums);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch gallery albums" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = (await req.json()) as GalleryPayload;
    const payload = normalizePayload(body);

    const validationError = getValidationError(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const album = await GalleryAlbum.create(payload);
    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error("Gallery create error:", error);
    return NextResponse.json(
      { error: "Failed to create gallery album" },
      { status: 500 }
    );
  }
}

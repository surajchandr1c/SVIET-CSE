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

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = (await request.json()) as GalleryPayload;
    const payload = normalizePayload(body);

    const validationError = getValidationError(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updatedAlbum = await GalleryAlbum.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedAlbum) {
      return NextResponse.json(
        { error: "Gallery album not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAlbum, { status: 200 });
  } catch (error) {
    console.error("Gallery update error:", error);
    return NextResponse.json(
      { error: "Failed to update gallery album" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const deletedAlbum = await GalleryAlbum.findByIdAndDelete(id);
    if (!deletedAlbum) {
      return NextResponse.json(
        { error: "Gallery album not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Gallery album deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery album" },
      { status: 500 }
    );
  }
}

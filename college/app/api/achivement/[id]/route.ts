import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Achivement from "@/models/Achivement";

type AchivementPayload = {
  heading?: unknown;
  date?: unknown;
  coverImageUrl?: unknown;
  driveUrl?: unknown;
};

const normalizePayload = (body: AchivementPayload) => ({
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
    const body = (await request.json()) as AchivementPayload;
    const payload = normalizePayload(body);

    const validationError = getValidationError(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updatedEntry = await Achivement.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedEntry) {
      return NextResponse.json(
        { error: "Achivement entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEntry, { status: 200 });
  } catch (error) {
    console.error("Achivement update error:", error);
    return NextResponse.json(
      { error: "Failed to update achivement entry" },
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

    const deletedEntry = await Achivement.findByIdAndDelete(id);
    if (!deletedEntry) {
      return NextResponse.json(
        { error: "Achivement entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Achivement entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Achivement delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete achivement entry" },
      { status: 500 }
    );
  }
}

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

export async function GET() {
  try {
    await connectDB();
    const entries = await Achivement.find().sort({ date: -1, createdAt: -1 });
    return NextResponse.json(entries);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch achivement entries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = (await req.json()) as AchivementPayload;
    const payload = normalizePayload(body);

    const validationError = getValidationError(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const entry = await Achivement.create(payload);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Achivement create error:", error);
    return NextResponse.json(
      { error: "Failed to create achivement entry" },
      { status: 500 }
    );
  }
}

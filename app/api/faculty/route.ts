import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import { compareFacultyByPositionThenCreatedAtDesc } from "@/lib/facultyOrder";
import { normalizeFacultyPosition } from "@/lib/facultyPosition";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const faculty = await Faculty.find()
      .select(
        "name profession image email experience specialization about position createdAt"
      )
      .lean();

    faculty.sort(compareFacultyByPositionThenCreatedAtDesc);
    return NextResponse.json(faculty);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch faculty" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const position = normalizeFacultyPosition(body?.position);

    const payload = { ...body } as Record<string, unknown>;
    if (position === undefined) {
      delete payload.position;
    } else {
      payload.position = position;
    }

    const newFaculty = await Faculty.create(payload);

    revalidateTag("faculty:list", "default");
    return NextResponse.json(newFaculty, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid position") {
      return NextResponse.json(
        { error: "Invalid position. Use a whole number (>= 1) or leave blank." },
        { status: 400 }
      );
    }
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create faculty" },
      { status: 500 }
    );
  }
}

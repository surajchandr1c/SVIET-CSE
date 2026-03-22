import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";
import { normalizeFacultyPosition } from "@/lib/facultyPosition";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();

    const updates = { ...(body as Record<string, unknown>) };
    if (Object.prototype.hasOwnProperty.call(updates, "position")) {
      const position = normalizeFacultyPosition(updates.position);
      if (position === undefined) {
        delete updates.position;
      } else {
        updates.position = position;
      }
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedFaculty) {
      return NextResponse.json(
        { error: "Faculty not found" },
        { status: 404 }
      );
    }

    revalidateTag("faculty:list", "default");
    return NextResponse.json(updatedFaculty, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid position") {
      return NextResponse.json(
        { error: "Invalid position. Use a whole number (>= 1) or leave blank." },
        { status: 400 }
      );
    }
    console.error("Update Error:", error);

    return NextResponse.json(
      { error: "Failed to update faculty" },
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

    // 🔥 IMPORTANT: Await params
    const { id } = await context.params;

    const deletedFaculty = await Faculty.findByIdAndDelete(id);

    if (!deletedFaculty) {
      return NextResponse.json(
        { error: "Faculty not found" },
        { status: 404 }
      );
    }

    revalidateTag("faculty:list", "default");
    return NextResponse.json(
      { message: "Faculty deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Error:", error);

    return NextResponse.json(
      { error: "Failed to delete faculty" },
      { status: 500 }
    );
  }
}

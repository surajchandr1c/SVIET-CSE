import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Syllabus from "@/models/Syllabus";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    const updated = await Syllabus.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Syllabus item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Syllabus update error:", error);
    return NextResponse.json(
      { error: "Failed to update syllabus item" },
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
    const deleted = await Syllabus.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Syllabus item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Syllabus item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Syllabus delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete syllabus item" },
      { status: 500 }
    );
  }
}

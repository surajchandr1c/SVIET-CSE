import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    const updated = await Student.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Students update error:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
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

    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Students delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}

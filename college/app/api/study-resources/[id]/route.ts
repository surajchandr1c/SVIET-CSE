import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyResource from "@/models/StudyResource";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    const updated = await StudyResource.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Study resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Study resources update error:", error);
    return NextResponse.json(
      { error: "Failed to update study resource" },
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

    const deleted = await StudyResource.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Study resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Study resource deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Study resources delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete study resource" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TechxploreStudent from "@/models/TechxploreStudent";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();

    const updatedStudent = await TechxploreStudent.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return NextResponse.json(
        { error: "TechXplore student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    console.error("TechXplore update error:", error);
    return NextResponse.json(
      { error: "Failed to update TechXplore student" },
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
    const deletedStudent = await TechxploreStudent.findByIdAndDelete(id);

    if (!deletedStudent) {
      return NextResponse.json(
        { error: "TechXplore student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "TechXplore student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("TechXplore delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete TechXplore student" },
      { status: 500 }
    );
  }
}

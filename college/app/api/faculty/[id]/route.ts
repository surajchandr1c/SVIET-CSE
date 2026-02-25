import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();

    const updatedFaculty = await Faculty.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedFaculty) {
      return NextResponse.json(
        { error: "Faculty not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedFaculty, { status: 200 });
  } catch (error) {
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

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import QuestionPaper from "@/models/QuestionPaper";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    const updated = await QuestionPaper.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Question paper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Question papers update error:", error);
    return NextResponse.json(
      { error: "Failed to update question paper" },
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

    const deleted = await QuestionPaper.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Question paper not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Question paper deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Question papers delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete question paper" },
      { status: 500 }
    );
  }
}

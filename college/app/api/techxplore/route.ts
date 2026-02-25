import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TechxploreStudent from "@/models/TechxploreStudent";

export async function GET() {
  try {
    await connectDB();
    const students = await TechxploreStudent.find().sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (error) {
    console.error("TechXplore fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch TechXplore students" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newStudent = await TechxploreStudent.create(body);
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error("TechXplore create error:", error);
    return NextResponse.json(
      { error: "Failed to create TechXplore student" },
      { status: 500 }
    );
  }
}

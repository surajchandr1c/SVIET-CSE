import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notice from "@/models/Notice";

export async function GET() {
  try {
    await connectDB();
    const notices = await Notice.find().sort({ date: -1, createdAt: -1 });
    return NextResponse.json(notices);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newNotice = await Notice.create(body);
    return NextResponse.json(newNotice, { status: 201 });
  } catch (error) {
    console.error("Notice create error:", error);
    return NextResponse.json(
      { error: "Failed to create notice" },
      { status: 500 }
    );
  }
}

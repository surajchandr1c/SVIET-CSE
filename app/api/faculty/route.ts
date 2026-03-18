import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Faculty from "@/models/Faculty";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const faculty = await Faculty.find();
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

    const newFaculty = await Faculty.create(body);

    revalidateTag("faculty:list", "default");
    return NextResponse.json(newFaculty, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create faculty" },
      { status: 500 }
    );
  }
}

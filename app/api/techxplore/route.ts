import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import TechxploreStudent from "@/models/TechxploreStudent";
import { compareTechxploreByOrderThenCreatedAtAsc } from "@/lib/techxploreOrder";
import { normalizeTechxploreOrder } from "@/lib/techxploreOrderValue";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const students = await TechxploreStudent.find().lean();
    students.sort(compareTechxploreByOrderThenCreatedAtAsc as any);
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

    const payload = { ...(body as Record<string, unknown>) };
    if (Object.prototype.hasOwnProperty.call(payload, "order")) {
      const order = normalizeTechxploreOrder(payload.order);
      if (order === undefined) delete payload.order;
      else payload.order = order;
    }

    const newStudent = await TechxploreStudent.create(payload);
    revalidateTag("techxplore:list", "default");
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid order") {
      return NextResponse.json(
        { error: "Invalid order. Use a whole number (>= 1) or leave blank." },
        { status: 400 }
      );
    }
    console.error("TechXplore create error:", error);
    return NextResponse.json(
      { error: "Failed to create TechXplore student" },
      { status: 500 }
    );
  }
}

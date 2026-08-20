import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import BatchConfig from "@/models/BatchConfig";
import { verifyAdminToken } from "@/lib/auth";
import { getBatchConfigs } from "@/lib/batchConfigs";

const isAdmin = async () => {
  const token = (await cookies()).get("admin_token")?.value;
  return token ? Boolean(verifyAdminToken(token)) : false;
};

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getBatchConfigs());
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const year = typeof body.year === "string" ? body.year.trim() : "";
    const semester = Number(body.semester);

    if (!/^\d{4}$/.test(year) || !Number.isInteger(semester) || semester < 1 || semester > 12) {
      return NextResponse.json({ error: "Enter a valid batch year and semester." }, { status: 400 });
    }

    await connectDB();
    const config = await BatchConfig.create({
      year,
      label: `${year} Batch`,
      semester,
      courseSplit: true,
    });

    return NextResponse.json(
      {
        year: config.year,
        label: config.label,
        semester: config.semester,
        courseSplit: config.courseSplit,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error && error.message.includes("duplicate")
      ? "That batch already exists."
      : "Failed to add batch.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const year = typeof body.year === "string" ? body.year.trim() : "";
    if (!/^\d{4}$/.test(year)) {
      return NextResponse.json({ error: "A valid batch year is required." }, { status: 400 });
    }

    await connectDB();
    const count = await BatchConfig.countDocuments();
    if (count <= 1) {
      return NextResponse.json({ error: "At least one batch must remain." }, { status: 400 });
    }

    const result = await BatchConfig.deleteMany({ year });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Batch not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, year });
  } catch {
    return NextResponse.json({ error: "Failed to delete batch." }, { status: 500 });
  }
}

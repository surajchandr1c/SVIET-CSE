import { NextResponse } from "next/server";
import { getBatchProfiles } from "@/lib/batchProfiles";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [profiles4th, profiles5th] = await Promise.all([
      getBatchProfiles("4", { includeDisabled: true }),
      getBatchProfiles("5", { includeDisabled: true }),
    ]);

    return NextResponse.json({
      profiles4th,
      profiles5th,
    });
  } catch (error) {
    console.error("Admin student portfolio fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load student portfolio profiles." },
      { status: 500 }
    );
  }
}

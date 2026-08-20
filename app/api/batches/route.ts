import { NextResponse } from "next/server";
import { getBatchConfigs } from "@/lib/batchConfigs";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getBatchConfigs());
}

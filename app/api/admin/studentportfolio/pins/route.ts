import { NextRequest, NextResponse } from "next/server";
import {
  getPinnedBatchAdmissionNos,
  setBatchProfilePinned,
} from "@/lib/batchProfilePins";
import { MAX_PINNED_BATCH_PROFILES } from "@/lib/shared/batchProfilePins";

export const dynamic = "force-dynamic";

export async function GET() {
  const pinnedAdmissionNos = await getPinnedBatchAdmissionNos();
  return NextResponse.json({
    pinnedAdmissionNos,
    maxPinned: MAX_PINNED_BATCH_PROFILES,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      admissionNo?: unknown;
      pinned?: unknown;
    };

    const admissionNo = typeof body.admissionNo === "string" ? body.admissionNo.trim() : "";
    const pinned = Boolean(body.pinned);

    if (!admissionNo) {
      return NextResponse.json({ error: "Admission number is required." }, { status: 400 });
    }

    const pinnedAdmissionNos = await setBatchProfilePinned(admissionNo, pinned);
    return NextResponse.json({
      pinnedAdmissionNos,
      maxPinned: MAX_PINNED_BATCH_PROFILES,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update pin status.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { connectDB } from "@/lib/mongodb";
import PinnedBatchProfile from "@/models/PinnedBatchProfile";
import { MAX_PINNED_BATCH_PROFILES } from "@/lib/shared/batchProfilePins";

type PinnedDoc = {
  admissionNo?: unknown;
  order?: unknown;
};

const normalizeAdmissionNo = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const normalizeOrder = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

export async function getPinnedBatchAdmissionNos(): Promise<string[]> {
  try {
    await connectDB();
    const docs = await PinnedBatchProfile.find().sort({ order: 1, createdAt: 1 }).lean<PinnedDoc[]>();
    return docs.map((doc) => normalizeAdmissionNo(doc.admissionNo)).filter(Boolean);
  } catch {
    return [];
  }
}

export async function setBatchProfilePinned(admissionNo: string, pinned: boolean): Promise<string[]> {
  const normalizedAdmissionNo = admissionNo.trim();
  if (!normalizedAdmissionNo) {
    throw new Error("Admission number is required.");
  }

  await connectDB();

  const existingPins = await PinnedBatchProfile.find()
    .sort({ order: 1, createdAt: 1 })
    .lean<Array<{ admissionNo: string; order: number }>>();
  const existingIndex = existingPins.findIndex((entry) => entry.admissionNo === normalizedAdmissionNo);

  if (pinned) {
    if (existingIndex === -1) {
      if (existingPins.length >= MAX_PINNED_BATCH_PROFILES) {
        throw new Error(`Only ${MAX_PINNED_BATCH_PROFILES} profiles can be pinned.`);
      }

      await PinnedBatchProfile.create({
        admissionNo: normalizedAdmissionNo,
        order: existingPins.length,
      });
    }
  } else if (existingIndex !== -1) {
    const removedOrder = normalizeOrder(existingPins[existingIndex]?.order);
    await PinnedBatchProfile.deleteOne({ admissionNo: normalizedAdmissionNo });
    await PinnedBatchProfile.updateMany(
      { order: { $gt: removedOrder } },
      { $inc: { order: -1 } }
    );
  }

  const nextPins = await PinnedBatchProfile.find()
    .sort({ order: 1, createdAt: 1 })
    .lean<PinnedDoc[]>();
  return nextPins.map((doc) => normalizeAdmissionNo(doc.admissionNo)).filter(Boolean);
}

export async function removePinnedBatchProfile(admissionNo: string): Promise<string[]> {
  return setBatchProfilePinned(admissionNo, false);
}

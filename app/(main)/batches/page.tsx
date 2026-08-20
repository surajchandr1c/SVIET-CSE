import { Suspense } from "react";
import BatchesTabs from "./BatchesTabs";
import { getAllBatchProfiles } from "@/lib/batchProfiles";
import { getBatchConfigs } from "@/lib/batchConfigs";
import { getPinnedBatchAdmissionNos } from "@/lib/batchProfilePins";
import type { BatchProfile } from "./types";

export const dynamic = "force-dynamic";

const sortProfilesByPinned = (profiles: BatchProfile[], pinnedAdmissionNos: string[]) => {
  const pinnedOrder = new Map(pinnedAdmissionNos.map((admissionNo, index) => [admissionNo, index]));

  return [...profiles].sort((left, right) => {
    const leftPinnedOrder = pinnedOrder.get(left.admissionNo);
    const rightPinnedOrder = pinnedOrder.get(right.admissionNo);

    if (leftPinnedOrder !== undefined && rightPinnedOrder !== undefined) {
      return leftPinnedOrder - rightPinnedOrder;
    }

    if (leftPinnedOrder !== undefined) return -1;
    if (rightPinnedOrder !== undefined) return 1;
    return 0;
  });
};

export default async function BatchesPage() {
  const [profiles, batchConfigs, pinnedAdmissionNos] = await Promise.all([
    getAllBatchProfiles(),
    getBatchConfigs(),
    getPinnedBatchAdmissionNos(),
  ]);
  const orderedProfilesAll = sortProfilesByPinned(profiles, pinnedAdmissionNos);
  const batches = batchConfigs.map((batch) => ({
    ...batch,
    profiles: sortProfilesByPinned(
      profiles.filter((profile) => profile.batch === batch.label),
      pinnedAdmissionNos
    ),
  }));

  return (
    <section className="pt-12">
      <div className="mx-auto max-w-[1180px]">
        <h1 className="mb-6 text-center text-2xl font-semibold tracking-widest text-slate-200 md:text-3xl">
          STUDENTS PORTFOLIO
        </h1>
        <Suspense fallback={<div className="h-[54px] rounded-full bg-white/10" />}>
          <BatchesTabs
            batches={batches}
            profilesAll={orderedProfilesAll}
          />
        </Suspense>
      </div>
    </section>
  );
}

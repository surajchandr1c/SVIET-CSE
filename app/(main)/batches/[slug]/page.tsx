import { notFound } from "next/navigation";
import BatchProfileDetailClient from "../BatchProfileDetailClient";
import { getAllBatchProfiles } from "@/lib/batchProfiles";
import { getProfileSlug, slugifyProfileName } from "../slug";

export const dynamic = "force-dynamic";

export default async function BatchProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profiles = await getAllBatchProfiles();
  const normalizedSlug = slug.toLowerCase();

  // 1. Exact match with getProfileSlug
  let profile = profiles.find((p) => getProfileSlug(p).toLowerCase() === normalizedSlug);

  // 2. Match by admission number in slug suffix
  if (!profile) {
    profile = profiles.find((p) => {
      if (!p.admissionNo) return false;
      const cleanAdm = p.admissionNo.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return Boolean(cleanAdm && normalizedSlug.endsWith(cleanAdm));
    });
  }

  // 3. Fallback to name slug for backward compatibility
  if (!profile) {
    profile = profiles.find((p) => slugifyProfileName(p.name).toLowerCase() === normalizedSlug);
  }

  if (!profile) notFound();

  return <BatchProfileDetailClient profile={profile} />;
}

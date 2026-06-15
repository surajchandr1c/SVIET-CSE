import { notFound } from "next/navigation";
import BatchProfileDetailClient from "../BatchProfileDetailClient";
import { getAllBatchProfiles } from "@/lib/batchProfiles";
import { slugifyProfileName } from "../slug";

export const dynamic = "force-dynamic";

export default async function BatchProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profiles = await getAllBatchProfiles();
  const profile = profiles.find((p) => slugifyProfileName(p.name) === slug);
  if (!profile) notFound();

  return <BatchProfileDetailClient profile={profile} />;
}

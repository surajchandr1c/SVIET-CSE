export const slugifyProfileName = (name: string) => {
  return (name || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export const getProfileSlug = (profile: { name: string; admissionNo?: string }) => {
  const nameSlug = slugifyProfileName(profile.name) || "student";
  if (profile.admissionNo) {
    const adm = profile.admissionNo.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    if (adm) return `${nameSlug}-${adm}`;
  }
  return nameSlug;
};

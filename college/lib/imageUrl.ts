export const extractGoogleDriveFileId = (url: string): string | null => {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const directMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (directMatch?.[1]) return directMatch[1];

  try {
    const parsed = new URL(trimmed);
    const idParam = parsed.searchParams.get("id");
    if (idParam) return idParam;
  } catch {
    return null;
  }

  return null;
};

export const getImageUrlCandidates = (url: string): string[] => {
  const trimmed = url.trim();
  if (!trimmed) return [];

  const fileId = extractGoogleDriveFileId(trimmed);
  if (!fileId) return [trimmed];

  const candidates = [
    `/api/images/drive/${encodeURIComponent(fileId)}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/uc?export=download&id=${fileId}`,
  ];

  return Array.from(new Set(candidates));
};

export const normalizeImageUrl = (url: string): string => {
  return getImageUrlCandidates(url)[0] ?? "";
};

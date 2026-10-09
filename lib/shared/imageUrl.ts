import { extractGoogleDriveFileId } from "@/lib/shared/driveUrl";

export { extractGoogleDriveFileId };

export const getImageUrlCandidates = (url: string): string[] => {
  const trimmed = url.trim();
  if (!trimmed) return [];

  const fileId = extractGoogleDriveFileId(trimmed);
  if (!fileId) return [trimmed];

  const candidates = [
    `/api/images/drive/${encodeURIComponent(fileId)}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/uc?export=download&id=${fileId}`,
  ];

  return Array.from(new Set(candidates));
};

export const normalizeImageUrl = (url: string): string => {
  return getImageUrlCandidates(url)[0] ?? "";
};

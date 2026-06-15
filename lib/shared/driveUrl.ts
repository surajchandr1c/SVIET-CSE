export const extractGoogleDriveFolderId = (url: string): string | null => {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch?.[1]) return folderMatch[1];

  try {
    const parsed = new URL(trimmed);
    const idParam = parsed.searchParams.get("id");
    if (idParam) return idParam;
  } catch {
    return null;
  }

  return null;
};

export const normalizeGoogleDriveFolderUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const folderId = extractGoogleDriveFolderId(trimmed);
  if (!folderId) return trimmed;

  return `https://drive.google.com/drive/folders/${folderId}`;
};

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

export const normalizeGoogleDriveFileViewUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  const id = extractGoogleDriveFileId(trimmed);
  if (!id) return trimmed;
  return `https://drive.google.com/file/d/${id}/view`;
};

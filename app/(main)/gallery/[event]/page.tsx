import { readdir } from "node:fs/promises";
import path from "node:path";
import EventGalleryClient from "./EventGalleryClient";
import { EVENT_GALLERY_FALLBACK_COUNTS } from "@/config/eventGalleryFallback";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

const sortByNumericNameThenLex = (a: string, b: string) => {
  const aBase = path.parse(a).name;
  const bBase = path.parse(b).name;

  const aNum = Number(aBase);
  const bNum = Number(bBase);

  const aIsNum = Number.isFinite(aNum) && String(aNum) === aBase;
  const bIsNum = Number.isFinite(bNum) && String(bNum) === bBase;

  if (aIsNum && bIsNum) return aNum - bNum;
  if (aIsNum) return -1;
  if (bIsNum) return 1;
  return a.localeCompare(b);
};

const listEventImages = async (event: string): Promise<string[]> => {
  const dirPath = path.join(process.cwd(), "public", "events", event);

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort(sortByNumericNameThenLex);

    if (files.length > 0) {
      return files.map((name) => `/events/${event}/${name}`);
    }
  } catch {
    // ignore FS errors and fall back to configured counts
  }

  const fallbackTotal = EVENT_GALLERY_FALLBACK_COUNTS[event] ?? 0;
  return Array.from(
    { length: fallbackTotal },
    (_, i) => `/events/${event}/${i + 1}.jpg`
  );
};

export default async function EventGalleryPage({
  params,
}: {
  params: { event: string };
}) {
  const { event } = params;
  const images = await listEventImages(event);
  return <EventGalleryClient event={event} images={images} />;
}

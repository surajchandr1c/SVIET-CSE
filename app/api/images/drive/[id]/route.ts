import { NextResponse } from "next/server";

const DRIVE_SOURCES = (id: string) => [
  `https://drive.google.com/thumbnail?id=${id}&sz=w1200`,
  `https://drive.google.com/uc?export=view&id=${id}`,
  `https://drive.google.com/uc?export=download&id=${id}`,
  `https://drive.usercontent.google.com/download?id=${id}&export=view&authuser=0`,
];

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing image id" }, { status: 400 });
    }

    for (const source of DRIVE_SOURCES(id)) {
      const upstream = await fetch(source, {
        method: "GET",
        redirect: "follow",
        headers: {
          Accept: "image/*,*/*;q=0.8",
          "User-Agent": "Mozilla/5.0",
        },
      });

      if (!upstream.ok) continue;

      const contentType = upstream.headers.get("content-type") ?? "";
      if (!contentType.startsWith("image/")) continue;

      const data = await upstream.arrayBuffer();
      return new NextResponse(data, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }

    return NextResponse.json(
      { error: "Image not found or not publicly accessible" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Drive image proxy error:", error);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}

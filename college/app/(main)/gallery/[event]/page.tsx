"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function EventGallery() {
  const params = useParams();
  const event = params.event as string;
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const eventImages = useMemo(
    () => ({
      "atmanirbhar-bharat": 10,
      "Idea-ConClave": 48,
      interection: 21,
    }),
    []
  );

  const total = eventImages[event as keyof typeof eventImages] || 0;
  const images = Array.from({ length: total }, (_, i) => `/events/${event}/${i + 1}.jpg`);

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImage(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeImage]);

  const openImage = (src: string) => {
    setRotation(0);
    setActiveImage(src);
  };

  const closeViewer = () => {
    setActiveImage(null);
    setRotation(0);
  };

  return (
    <div className="min-h-screen px-6 pb-10 pt-8">
      <h1 className="mb-12 text-center text-4xl font-bold capitalize text-slate-200 md:text-6xl">
        {event.replaceAll("-", " ")}
      </h1>

      <div className="mx-auto grid max-w-[1200px] gap-5 md:grid-cols-2 lg:grid-cols-3">
        {images.map((src, index) => (
          <button
            type="button"
            key={src}
            onClick={() => openImage(src)}
            className="relative h-[230px] w-full overflow-hidden rounded-2xl border border-cyan-400/20 shadow-[0_18px_45px_rgba(0,0,0,0.35)] opacity-0 animate-fadeIn"
            style={{ animationDelay: `${index * 90}ms`, animationFillMode: "forwards" }}
          >
            <Image
              src={src}
              alt="event"
              fill
              className="object-cover transition duration-500 hover:scale-110"
            />
          </button>
        ))}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-6"
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setRotation((prev) => prev + 90)}
              className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              Rotate
            </button>
            <button
              type="button"
              onClick={closeViewer}
              className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
              aria-label="Close image"
            >
              X
            </button>
          </div>

          <div
            className="relative h-[min(84vh,900px)] w-[min(92vw,1200px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt="event full view"
              fill
              className="object-contain transition-transform duration-300"
              style={{ transform: `rotate(${rotation}deg)` }}
              sizes="92vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}

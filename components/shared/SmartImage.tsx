"use client";

import { useEffect, useMemo, useState } from "react";
import { getImageUrlCandidates } from "@/lib/imageUrl";

type SmartImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  src: string;
  fallbackSrc?: string;
};

export default function SmartImage({
  src,
  alt,
  fallbackSrc = "/no-image.png",
  loading = "lazy",
  decoding = "async",
  onError,
  ...props
}: SmartImageProps) {
  const candidates = useMemo(() => getImageUrlCandidates(src), [src]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [src]);

  const currentSrc = candidates[index] ?? fallbackSrc;

  return (
    <img
      {...props}
      suppressHydrationWarning
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding={decoding}
      onError={(e) => {
        if (index < candidates.length - 1) {
          setIndex((prev) => prev + 1);
        } else if ((e.target as HTMLImageElement).src !== fallbackSrc) {
          (e.target as HTMLImageElement).src = fallbackSrc;
        }

        onError?.(e);
      }}
    />
  );
}

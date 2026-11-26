"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { cn } from "@/lib/utils";

const POSTER_WIDTHS = [92, 154, 185, 342, 500, 780];
const BACKDROP_WIDTHS = [300, 780, 1280];

function loaderFor(widths: number[]) {
  return ({ src, width }: ImageLoaderProps) => {
    const size = widths.find((w) => w >= width);
    return `https://image.tmdb.org/t/p/${size ? `w${size}` : "original"}${src}`;
  };
}

const posterLoader = loaderFor(POSTER_WIDTHS);
const backdropLoader = loaderFor(BACKDROP_WIDTHS);

interface Props {
  path: string | null | undefined;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export function PosterImage({ path, sizes, className, priority }: Props) {
  if (!path) return null;
  return (
    <Image
      loader={posterLoader}
      src={path}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}

export function BackdropImage({ path, sizes, className, priority }: Props) {
  if (!path) return null;
  return (
    <Image
      loader={backdropLoader}
      src={path}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}

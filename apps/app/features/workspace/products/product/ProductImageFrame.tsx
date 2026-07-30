import Image from "next/image";
import type { ReactNode } from "react";
import { Image01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";

import { cn } from "@uprevit/ui/lib/utils";
import { getNextImageSrc } from "@/utils/isNextImageSrc";

type ProductImageFrameProps = {
  src?: string | null;
  alt: string;
  variant?: "thumbnail" | "preview";
  frameClassName?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  badge?: ReactNode;
  priority?: boolean;
  sizes?: string;
};

const frameVariants = {
  thumbnail:
    "relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted",
  preview:
    "relative mx-auto h-[280px] w-full max-w-[280px] overflow-hidden rounded-md border bg-muted",
};

const imageVariants = {
  thumbnail: "object-contain p-1.5",
  preview: "object-contain p-3",
};

const fallbackVariants = {
  thumbnail: "size-full p-2 text-muted-foreground/60",
  preview: "size-full p-10 text-muted-foreground/60",
};

export function ProductImageFrame({
  src,
  alt,
  variant = "thumbnail",
  frameClassName,
  imageClassName,
  fallbackClassName,
  badge,
  priority = false,
  sizes,
}: ProductImageFrameProps) {
  const imageSrc = getNextImageSrc(src);
  const hasImage = Boolean(imageSrc);

  return (
    <div className={cn(frameVariants[variant], frameClassName)}>
      {badge}
      {hasImage ? (
        <Image
          src={imageSrc ?? ""}
          alt={alt}
          fill
          className={cn(imageVariants[variant], imageClassName)}
          sizes={
            sizes ??
            (variant === "thumbnail"
              ? "48px"
              : "(max-width: 768px) 100vw, 280px")
          }
          priority={priority}
        />
      ) : (
        <Icon
          icon={Image01Icon}
          strokeWidth={2}
          className={cn(fallbackVariants[variant], fallbackClassName)}
        />
      )}
    </div>
  );
}

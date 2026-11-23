"use client";

import * as React from "react";
import { cn } from "@uprevit/ui/lib/utils";

export function ScaledCanvas({
  width,
  height,
  minScale = 0,
  panX,
  panBelow,
  className,
  children,
  ...props
}: {
  width: number;
  height: number;
  minScale?: number;
  panX?: number;
  panBelow?: number;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithRef<"div">, "children">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(width);

  React.useImperativeHandle(props.ref, () => ref.current as HTMLDivElement);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = (nextWidth: number) => {
      if (nextWidth > 0) setContainerWidth(nextWidth);
    };
    update(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const naturalScale = Math.min(1, containerWidth / width);
  const allowPan = panBelow === undefined || containerWidth < panBelow;
  const scale = allowPan ? Math.max(minScale, naturalScale) : naturalScale;
  const scaledWidth = width * scale;
  const focusX = panX ?? width / 2;
  const isOverflowing = scaledWidth > containerWidth + 0.5;
  const tx = isOverflowing
    ? Math.min(0, Math.max(containerWidth - scaledWidth, containerWidth / 2 - focusX * scale))
    : (containerWidth - scaledWidth) / 2;

  return (
    <div
      {...props}
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ height: height * scale, ...props.style }}
    >
      <div
        className={cn(
          "absolute left-0 top-0 origin-top-left",
          panX !== undefined &&
            "transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
        )}
        style={{
          width,
          height,
          transform: `translate3d(${tx}px, 0, 0) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

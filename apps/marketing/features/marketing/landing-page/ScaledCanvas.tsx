"use client";

import * as React from "react";
import { cn } from "@uprevit/ui/lib/utils";

export function ScaledCanvas({
  width,
  height,
  className,
  children,
  ...props
}: {
  width: number;
  height: number;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithRef<"div">, "children">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useImperativeHandle(props.ref, () => ref.current as HTMLDivElement);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      {...props}
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ height: height * scale, ...props.style }}
    >
      <div
        className="absolute left-1/2 top-0 origin-top"
        style={{ width, height, transform: `translateX(-50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

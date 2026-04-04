import React, { ComponentPropsWithoutRef, CSSProperties } from "react";

import { cn } from "@uprevit/ui/lib/utils";

export interface OrbitingItem {
  content: React.ReactNode;
  circleIndex: number;
  speed?: number; // Duration in seconds
  reverse?: boolean;
  initialAngle?: number; // Degrees
}

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  items?: OrbitingItem[];
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 800,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  items = [],
  ...props
}: RippleProps) {
  const sceneSize = mainCircleSize + (numCircles - 1) * 300;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)] select-none",
        className,
      )}
      {...props}
    >
      <div
        className="relative origin-center scale-[0.5] sm:scale-[0.6] md:scale-[0.75] lg:scale-100"
        style={{
          width: `${sceneSize}px`,
          height: `${sceneSize}px`,
        }}
      >
        {Array.from({ length: numCircles }, (_, i) => {
          const size = mainCircleSize + i * 300;
          const opacity = mainCircleOpacity - i * 0.02;
          const borderStyle = "dashed";

          const circleItems = items.filter((item) => item.circleIndex === i);

          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-foreground/5 shadow-xl"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                opacity,
                borderStyle,
                borderWidth: "1px",
                borderColor: `var(--foreground)`,
              }}
            >
              {circleItems.map((item, idx) => {
                const speed = item.speed || 20;
                const reverse = item.reverse;
                const initialAngle =
                  item.initialAngle !== undefined
                    ? item.initialAngle
                    : (360 / circleItems.length) * idx;

                const delay = reverse
                  ? -1 * speed * (1 - initialAngle / 360)
                  : -1 * speed * (initialAngle / 360);

                return (
                  <div key={idx} className="absolute inset-0">
                    <div
                      className={cn("absolute inset-0 animate-spin")}
                      style={{
                        animationDuration: `${speed}s`,
                        animationDirection: reverse ? "reverse" : "normal",
                        animationDelay: `${delay}s`,
                      }}
                    >
                      <div
                        className="absolute left-1/2 top-0"
                        style={{ transform: "translate(-50%, -50%)" }}
                      >
                        <div
                          className={cn("animate-spin")}
                          style={{
                            animationDuration: `${speed}s`,
                            animationDirection: reverse ? "normal" : "reverse",
                            animationDelay: `${delay}s`,
                          }}
                        >
                          {item.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});

Ripple.displayName = "Ripple";

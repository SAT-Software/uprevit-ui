import { useId } from "react";
import { cn } from "@uprevit/ui/lib/utils";

interface FluteSpec {
  top: string;
  mid: string;
  bottom: string;
  groove: string;
  highlight: number;
  shadow: number;
}

const FLUTE_SPECS: FluteSpec[] = [
  { top: "#0B0A1B", mid: "#080714", bottom: "#060510", groove: "rgba(3,2,10,0.92)", highlight: 0.03, shadow: 0.65 },
  { top: "#12102E", mid: "#0A091A", bottom: "#070612", groove: "rgba(3,2,10,0.92)", highlight: 0.05, shadow: 0.68 },
  { top: "#1E1B52", mid: "#0F0D28", bottom: "#080714", groove: "rgba(4,3,14,0.94)", highlight: 0.08, shadow: 0.72 },
  { top: "#3730A3", mid: "#1B164F", bottom: "#090818", groove: "rgba(5,4,18,0.94)", highlight: 0.12, shadow: 0.76 },
  { top: "#483ED0", mid: "#28217A", bottom: "#0C0A22", groove: "rgba(6,5,22,0.94)", highlight: 0.16, shadow: 0.78 },
  { top: "#5348DE", mid: "#3B31B8", bottom: "#13103A", groove: "rgba(7,6,26,0.92)", highlight: 0.19, shadow: 0.76 },
  { top: "#6A5EE5", mid: "#4D41CE", bottom: "#272085", groove: "rgba(10,8,34,0.88)", highlight: 0.22, shadow: 0.7 },
  { top: "#8C80ED", mid: "#6355DF", bottom: "#3F33C0", groove: "rgba(18,14,56,0.82)", highlight: 0.26, shadow: 0.62 },
  { top: "#B4A9F4", mid: "#8879E8", bottom: "#5648D6", groove: "rgba(28,22,86,0.74)", highlight: 0.3, shadow: 0.54 },
  { top: "#C5B9F4", mid: "#A99BEE", bottom: "#7D6EE4", groove: "rgba(44,36,118,0.62)", highlight: 0.32, shadow: 0.46 },
  { top: "#D3C5F2", mid: "#C0B2EE", bottom: "#9B8CE8", groove: "rgba(62,52,148,0.52)", highlight: 0.32, shadow: 0.4 },
  { top: "#E5D5EE", mid: "#D0C0EE", bottom: "#B0A1EA", groove: "rgba(78,68,164,0.44)", highlight: 0.3, shadow: 0.34 },
  { top: "#EEDCEB", mid: "#DECDE9", bottom: "#C2B4EA", groove: "rgba(96,86,174,0.38)", highlight: 0.28, shadow: 0.3 },
  { top: "#F2E0EB", mid: "#E6D3E8", bottom: "#D3C3EA", groove: "rgba(116,104,178,0.34)", highlight: 0.26, shadow: 0.26 },
  { top: "#F4E2EB", mid: "#ECDBE8", bottom: "#DFCFE9", groove: "rgba(136,120,178,0.28)", highlight: 0.24, shadow: 0.22 },
  { top: "#F5E4EC", mid: "#F0DFEA", bottom: "#E7D7E8", groove: "rgba(154,138,180,0.24)", highlight: 0.22, shadow: 0.18 },
  { top: "#F6E6ED", mid: "#F2E2EB", bottom: "#ECDBE9", groove: "rgba(168,150,184,0.2)", highlight: 0.2, shadow: 0.15 },
  { top: "#F7E8EE", mid: "#F4E5EC", bottom: "#EFE0EA", groove: "rgba(180,162,190,0.16)", highlight: 0.18, shadow: 0.12 },
];

export interface FlutedGlassBackdropProps {
  className?: string;
}

export function FlutedGlassBackdrop({ className }: FlutedGlassBackdropProps) {
  const noiseId = useId();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-[#080716]",
        className,
      )}
    >
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${FLUTE_SPECS.length}, minmax(0, 1fr))`,
        }}
      >
        {FLUTE_SPECS.map((flute, index) => (
          <div
            key={index}
            className="relative h-full overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(172deg, ${flute.top} 0%, ${flute.mid} 48%, ${flute.bottom} 100%)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(255,255,255,${flute.highlight}) 0%, rgba(255,255,255,${(flute.highlight * 0.45).toFixed(2)}) 16%, rgba(255,255,255,0) 48%, rgba(16,12,52,${(flute.shadow * 0.42).toFixed(2)}) 78%, ${flute.groove} 100%)`,
              }}
            />
            <div
              className="absolute inset-y-0 left-0 w-px"
              style={{
                backgroundColor: `rgba(255, 255, 255, ${(flute.highlight * 0.65).toFixed(2)})`,
              }}
            />
          </div>
        ))}
      </div>

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.095] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id={noiseId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.95"
            numOctaves={2}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
      </svg>
    </div>
  );
}

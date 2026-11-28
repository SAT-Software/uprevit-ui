import { ImageResponse } from "next/og";
import { BrandMark, BrandWordmark } from "@/components/BrandLogo";
import { formatBlogDate, type BlogPost } from "@/lib/blog";

const FONTS = [
  { name: "Outfit", weight: 600 },
  { name: "Geist", weight: 400 },
  { name: "Geist", weight: 500 },
] as const;

type FontEntry = {
  name: string;
  weight: 400 | 500 | 600;
  style: "normal";
  data: ArrayBuffer;
};

let fontsPromise: Promise<FontEntry[]> | undefined;

async function loadGoogleFont(name: string, weight: number) {
  const cssRes = await fetch(
    `https://fonts.googleapis.com/css2?family=${name.replaceAll(" ", "+")}:wght@${weight}`,
  );
  if (!cssRes.ok) throw new Error(`Font CSS ${name} ${weight} failed (${cssRes.status})`);
  const css = await cssRes.text();
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`Font ${name} ${weight} not found`);
  const fontRes = await fetch(url);
  if (!fontRes.ok) throw new Error(`Font ${name} ${weight} download failed (${fontRes.status})`);
  return fontRes.arrayBuffer();
}

function loadFonts() {
  fontsPromise ??= Promise.all(
    FONTS.map(async ({ name, weight }) => ({
      name,
      weight,
      style: "normal" as const,
      data: await loadGoogleFont(name, weight),
    })),
  ).catch((err) => {
    fontsPromise = undefined;
    throw err;
  });
  return fontsPromise;
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? trimmed.slice(0, lastSpace) : trimmed).trimEnd()}…`;
}

const DOT_ARC_W = 560;
const DOT_ARC_H = 340;
const DOT_STEP = 14;

const CORNER_DOTS = (() => {
  const dots: Array<{ cx: number; cy: number; opacity: number }> = [];
  for (let y = DOT_STEP; y < DOT_ARC_H; y += DOT_STEP) {
    for (let x = DOT_STEP; x < DOT_ARC_W; x += DOT_STEP) {
      const dx = (DOT_ARC_W - x) / DOT_ARC_W;
      const dy = (DOT_ARC_H - y) / DOT_ARC_H;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) {
        const opacity = Number((0.22 * (1 - dist) ** 1.4).toFixed(3));
        if (opacity >= 0.015) dots.push({ cx: x, cy: y, opacity });
      }
    }
  }
  return dots;
})();

export async function BlogOgImage(post: BlogPost) {
  const fonts = await loadFonts();

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "60px 76px",
        backgroundColor: "#FDFDFD",
        fontFamily: "Geist",
        color: "#171717",
        overflow: "hidden",
      }}
    >
      <svg
        width={DOT_ARC_W}
        height={DOT_ARC_H}
        viewBox={`0 0 ${DOT_ARC_W} ${DOT_ARC_H}`}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
        }}
      >
        {CORNER_DOTS.map((dot) => (
          <circle
            key={`${dot.cx}-${dot.cy}`}
            cx={dot.cx}
            cy={dot.cy}
            r={1.35}
            fill="#171717"
            fillOpacity={dot.opacity}
          />
        ))}
      </svg>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 46,
              height: 46,
              paddingTop: 2,
              borderRadius: 12,
              border: "1px solid #000000",
              backgroundImage:
                "linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 55%, #111111 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            <BrandMark
              width={26}
              height={21.7}
              markColor="#FFFFFF"
              arrowColor="#A56BFF"
            />
          </div>
          <BrandWordmark
            width={116}
            height={36}
            letterColor="#171717"
            chevronColor="#7F22FE"
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            borderRadius: 10,
            border: "1px solid rgba(23,23,23,0.12)",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            overflow: "hidden",
            fontSize: 19,
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "9px 15px",
              backgroundColor: "#F6F6F6",
              color: "rgba(23,23,23,0.6)",
              borderRight: "1px solid rgba(23,23,23,0.12)",
            }}
          >
            Blog
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "9px 16px",
              color: "#171717",
            }}
          >
            {post.category}
          </span>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 980,
        }}
      >
        <span
          style={{
            fontFamily: "Outfit",
            fontSize: post.title.length > 65 ? 54 : 64,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "#171717",
          }}
        >
          {post.title}
        </span>

        <span
          style={{
            fontSize: 24,
            lineHeight: 1.45,
            color: "rgba(23,23,23,0.62)",
            maxWidth: 900,
          }}
        >
          {truncateText(post.description, 155)}
        </span>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 28,
          borderTop: "1px solid rgba(23,23,23,0.1)",
          fontSize: 21,
          fontWeight: 500,
          color: "rgba(23,23,23,0.58)",
        }}
      >
        <span>
          {formatBlogDate(post.date)} · {post.readTime}
        </span>
        <span style={{ color: "#171717" }}>uprevit.com</span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts },
  );
}

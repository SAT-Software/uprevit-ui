"use client";

import Link from "next/link";
import { ThemeToggle } from "@uprevit/ui/components/common/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { openCookieConsent } from "@/components/CookieConsentBanner";
import { TileRow } from "@/components/TileGrid";

const FOOTER_COLUMNS: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Product",
    links: [
      { label: "Platform overview", href: "/platform/overview" },
      { label: "Automatic redlines", href: "/platform/redlining" },
      { label: "Reports & exports", href: "/platform/reports-exports" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "Blog", href: "/resources/blogs" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Follow",
    links: [
      {
        label: "LinkedIn",
        href: "https://linkedin.com/company/uprevit",
        external: true,
      },
      {
        label: "X",
        href: "https://x.com/uprevit",
        external: true,
      },
    ],
  },
];

const BLUEPRINT_POINTS: readonly [number, number, string][] = [
  [5.2, 40.36, "#5B606B"],
  [17.17, 40.36, "#5B606B"],
  [34.39, 40.36, "#5B606B"],
  [46.36, 40.36, "#5B606B"],
  [25.5, 89.99, "#5B606B"],
  [46.36, 69.69, "#5B606B"],
  [5.2, 69.69, "#5B606B"],
  [49.75, 88.5, "#5B606B"],
  [61.25, 88.5, "#5B606B"],
  [79.75, 35, "#5B606B"],
  [79.75, 48, "#5B606B"],
  [88.75, 10.5, "#A56BFF"],
  [77.75, 27, "#A56BFF"],
  [100.25, 27, "#A56BFF"],
  [83.25, 27, "#A56BFF"],
  [94.75, 27, "#A56BFF"],
  [64.75, 64.5, "#A56BFF"],
  [64.75, 77, "#A56BFF"],
];

function FooterBlueprintGraphic() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-152.7 -6.25 409.4 112.5"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="h-full w-full"
    >
      <line x1="-152.7" y1="10.5" x2="256.7" y2="10.5" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="-152.7" y1="27" x2="256.7" y2="27" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="-152.7" y1="40.36" x2="256.7" y2="40.36" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="-152.7" y1="88.5" x2="256.7" y2="88.5" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="5.2" y1="-6.25" x2="5.2" y2="106.25" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="46.36" y1="-6.25" x2="46.36" y2="106.25" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="61.25" y1="-6.25" x2="61.25" y2="106.25" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="88.75" y1="-6.25" x2="88.75" y2="106.25" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="2288.75" y1="-3289.5" x2="-2111.25" y2="3310.5" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="-2211.25" y1="-3289.5" x2="2388.75" y2="3310.5" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="-152.7" y1="69.69" x2="256.7" y2="69.69" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <line x1="49.75" y1="-6.25" x2="49.75" y2="106.25" vectorEffect="non-scaling-stroke" stroke="#2A2C31" strokeDasharray="4 6" />
      <circle cx="25.78" cy="69.7" r="20.3" vectorEffect="non-scaling-stroke" fill="none" stroke="#2A2C31" strokeDasharray="4 6" />

      <path
        d="M17.172 40.36V69.76C17.172 72.7 17.896 74.963 19.342 76.55C20.789 78.137 22.912 78.93 25.712 78.93C28.512 78.93 30.659 78.137 32.152 76.55C33.646 74.963 34.392 72.7 34.392 69.76V40.36H46.362V69.69C46.362 74.077 45.429 77.787 43.562 80.82C41.696 83.853 39.176 86.14 36.002 87.68C32.876 89.22 29.376 89.99 25.502 89.99C21.629 89.99 18.152 89.243 15.072 87.75C12.039 86.21 9.636 83.923 7.862 80.89C6.089 77.81 5.202 74.077 5.202 69.69V40.36H17.172Z"
        fill="#141414"
      />
      <path
        d="M17.172 40.36V69.76C17.172 72.7 17.896 74.963 19.342 76.55C20.789 78.137 22.912 78.93 25.712 78.93C28.512 78.93 30.659 78.137 32.152 76.55C33.646 74.963 34.392 72.7 34.392 69.76V40.36H46.362V69.69C46.362 74.077 45.429 77.787 43.562 80.82C41.696 83.853 39.176 86.14 36.002 87.68C32.876 89.22 29.376 89.99 25.502 89.99C21.629 89.99 18.152 89.243 15.072 87.75C12.039 86.21 9.636 83.923 7.862 80.89C6.089 77.81 5.202 74.077 5.202 69.69V40.36H17.172Z"
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#3A3D44"
      />
      <path
        d="M61.25 88.5H49.75L49.75 54.839C49.75 53.612 49.825 52.382 50.067 51.18C52.486 39.179 59.936 35.93 63.75 34.5C69.836 32.218 76.75 33.667 79.75 35V48C70.858 41.331 63.943 46.918 61.816 52.104C61.316 53.325 61.25 54.653 61.25 55.973V88.5Z"
        fill="#141414"
      />
      <path
        d="M61.25 88.5H49.75L49.75 54.839C49.75 53.612 49.825 52.382 50.067 51.18C52.486 39.179 59.936 35.93 63.75 34.5C69.836 32.218 76.75 33.667 79.75 35V48C70.858 41.331 63.943 46.918 61.816 52.104C61.316 53.325 61.25 54.653 61.25 55.973V88.5Z"
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#3A3D44"
      />
      <path
        d="M64.75 64.5V77C83.352 83.325 91.862 69.377 94.301 60.021C94.649 58.685 94.75 57.306 94.75 55.926V27H100.25L88.75 10.5L77.75 27H83.25V55.836C83.25 57.275 83.025 58.709 82.391 60.001C77.666 69.642 69.293 66.85 64.75 64.5Z"
        fill="#1B1526"
      />
      <path
        d="M64.75 64.5V77C83.352 83.325 91.862 69.377 94.301 60.021C94.649 58.685 94.75 57.306 94.75 55.926V27H100.25L88.75 10.5L77.75 27H83.25V55.836C83.25 57.275 83.025 58.709 82.391 60.001C77.666 69.642 69.293 66.85 64.75 64.5Z"
        vectorEffect="non-scaling-stroke"
        fill="none"
        stroke="#6A46A8"
      />

      {BLUEPRINT_POINTS.map(([x, y, color], idx) => (
        <circle
          key={idx}
          cx={x}
          cy={y}
          r={0.85}
          fill="#141414"
          vectorEffect="non-scaling-stroke"
          stroke={color}
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

export interface FooterSectionProps {
  inTileGrid?: boolean;
}

export default function FooterSection({ inTileGrid = false }: FooterSectionProps) {
  const rows = (
    <TileRow
      as="footer"
      centerClassName="overflow-hidden rounded-tile bg-[#0E0E0E]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[436px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 px-5 pb-2 pt-10 sm:px-8 sm:py-10 lg:justify-between lg:gap-12 lg:px-10 lg:py-12">
          <Link
            href="/"
            aria-label="Uprevit home"
            className="inline-flex self-start rounded-md outline-none transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E] active:scale-[0.98]"
          >
            <BrandLogo size="xs" appearance="dark" />
          </Link>

          <p className="max-w-[300px] text-pretty font-ui text-[14px] leading-[1.55] text-[#A1A1A1]">
            Label documentation, review and release for medical device teams.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-7 px-5 pb-8 pt-6 sm:grid-cols-3 sm:px-8 sm:py-10 lg:flex lg:flex-wrap lg:gap-10 lg:px-10 lg:py-12">
          {FOOTER_COLUMNS.map((col) => (
            <div
              key={col.title}
              className="flex flex-col gap-3 lg:w-[180px] lg:shrink-0 lg:gap-3.5"
            >
              <h2 className="font-ui text-[12px] font-medium leading-4 text-[#8C8C8C]">
                {col.title}
              </h2>
              <ul className="flex flex-col gap-3 lg:gap-3.5">
                {col.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="inline-flex min-h-6 items-center rounded-xs font-ui text-[14px] leading-[18px] text-[#EDEDED] outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E] [@media(hover:hover)_and_(pointer:fine)]:hover:text-white/75"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse items-start justify-between gap-3 border-y border-white/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:gap-4 sm:px-8 lg:px-10">
        <p
          suppressHydrationWarning
          className="font-ui text-[13px] leading-4 text-[#A1A1A1]"
        >
          © {new Date().getFullYear()} Uprevit. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 font-ui text-[13px] leading-4 text-[#A1A1A1] sm:gap-6">
          <Link
            href="/privacy-policy"
            className="inline-flex min-h-6 items-center rounded-xs outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#EDEDED]"
          >
            Privacy policy
          </Link>
          <Link
            href="/terms-of-service"
            className="inline-flex min-h-6 items-center rounded-xs outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#EDEDED]"
          >
            Terms of service
          </Link>
          <button
            type="button"
            onClick={openCookieConsent}
            className="inline-flex min-h-6 cursor-pointer items-center rounded-xs outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E0E] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#EDEDED]"
          >
            Cookie settings
          </button>
          <ThemeToggle background="dark" />
        </div>
      </div>

      <div className="relative h-[220px] overflow-hidden sm:h-[300px] lg:h-[360px]">
        <FooterBlueprintGraphic />
      </div>
    </TileRow>
  );

  if (inTileGrid) {
    return rows;
  }

  return (
    <div className="mt-20 w-full bg-card dark:bg-background">
      <div className="flex w-full flex-col gap-px bg-grid p-px">{rows}</div>
    </div>
  );
}

"use client";

import { Badge } from "@uprevit/ui/components/ui/badge";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  PiCalendarDuotone,
  PiFileTextDuotone,
  PiGlobeHemisphereWestDuotone,
  PiNewspaperDuotone,
  PiShieldCheckDuotone,
} from "react-icons/pi";

const blogPosts = [
  {
    title: "Understanding FDA's New Labeling Requirements",
    excerpt:
      "A comprehensive guide to the latest FDA labeling guidelines and how they impact your medical device documentation.",
    date: "2024-12-15",
    category: "Regulatory Update",
  },
  {
    title: "EU MDR Compliance: A Step-by-Step Approach",
    excerpt:
      "Navigate the complexities of European Medical Device Regulation with this practical implementation guide.",
    date: "2024-12-01",
    category: "Compliance Guide",
  },
  {
    title: "ISO 15223-1:2021 Key Changes Explained",
    excerpt:
      "Understanding the important updates to the international standard for medical device symbols.",
    date: "2024-11-20",
    category: "Standards",
  },
];

const newsUpdates = [
  {
    title: "FDA Announces Updated UDI Compliance Deadlines",
    highlight: "UDI timeline shift",
    excerpt:
      "New timeline for Unique Device Identifier requirements gives manufacturers additional flexibility.",
    date: "2024-12-10",
    source: "FDA",
    icon: PiShieldCheckDuotone,
  },
  {
    title: "EU MDR Implementation Extended for Certain Devices",
    highlight: "EU MDR extension",
    excerpt:
      "European Commission grants transition period for specific medical device categories.",
    date: "2024-12-05",
    source: "EU Commission",
    icon: PiGlobeHemisphereWestDuotone,
  },
  {
    title: "New ISO Standard for Digital Labeling Published",
    highlight: "ISO eLabel guidance",
    excerpt:
      "International Organization for Standardization releases guidance for electronic labeling.",
    date: "2024-11-28",
    source: "ISO",
    icon: PiFileTextDuotone,
  },
];

const focusAreas = [
  "FDA updates",
  "EU MDR shifts",
  "ISO standards",
  "Labeling operations",
];

export default function BlogsSection() {
  const { resolvedTheme } = useTheme();
  const badgeVariant = resolvedTheme === "dark" ? "outline" : "white";
  const featuredPost = blogPosts[0];

  return (
    <div className="w-full mt-16 mb-24 pointer-events-auto relative">
      <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      <div className="max-w-6xl mx-auto mb-12">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <PiNewspaperDuotone className="text-foreground/60" />
          <span className="font-medium">Blogs</span>
        </Badge>
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tightest">
            Insights for labeling leaders who need clarity fast
          </h1>
          <div className="hidden lg:block h-24 w-px bg-border" />
          <p className="text-lg text-muted-foreground max-w-md">
            Clear, concise analysis of the regulatory shifts that matter most.
            Stay ahead of enforcement changes with practical guidance you can
            act on.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {focusAreas.map((area) => (
            <Badge key={area} variant="outline" className="text-xs">
              {area}
            </Badge>
          ))}
        </div>
      </div>

      <div className="relative w-full mb-16">
        <div className="max-w-6xl mx-auto relative">
          <DecorativeCornerCircleCustom
            positionClassName="bottom-0 -left-15"
            rotation={0}
          />
          <DecorativeCornerCircleCustom
            positionClassName="bottom-0 -right-15"
            rotation={90}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-top-15 -right-15"
            rotation={90}
          />

          <div className="p-1 bg-accent border-border border rounded-[12px]">
            <div className="p-2 bg-white dark:bg-neutral-800 border-border border rounded-[12px]">
              <Link
                href="/resources/blogs"
                className="group relative block overflow-hidden rounded-[10px] border border-border bg-black text-white transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 hover:-translate-y-0.5"
                aria-label={`Read featured post: ${featuredPost.title}`}
              >
                <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:120px_120px]" />
                <div className="absolute inset-0 bg-linear-to-br from-white/12 via-transparent to-white/5" />
                <div className="relative grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-8 p-6 min-h-[420px]">
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                        <span className="font-semibold tracking-wide">
                          Uprevit Insights
                        </span>
                        <Badge
                          variant="outline"
                          className="border-white/30 text-white/80"
                        >
                          {featuredPost.category}
                        </Badge>
                        <span className="rounded-full border border-white/20 px-2 py-0.5 text-[11px] uppercase">
                          Featured
                        </span>
                      </div>
                      <h3 className="mt-6 text-4xl md:text-5xl font-semibold leading-tight">
                        {featuredPost.title}
                      </h3>
                      <p className="mt-4 text-sm text-white/70">
                        {featuredPost.excerpt}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-xs text-white/70">
                      <PiCalendarDuotone className="size-4" />
                      {featuredPost.date}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-4 border-t border-white/10 pt-6 lg:border-t-0 lg:pl-6">
                    <div className="text-xs uppercase tracking-widest text-white/50">
                      Focus areas
                    </div>
                    <div className="space-y-3 text-sm font-medium text-white/70">
                      <div>FDA labeling updates</div>
                      <div>EU MDR enforcement timelines</div>
                      <div>ISO symbol guidance</div>
                      <div>Audit readiness playbooks</div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/50">
                      <span>Updated weekly</span>
                      <span className="h-1 w-1 rounded-full bg-white/40" />
                      <span>Actionable summaries</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
        <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      </div>

      <div className="relative">
        <div className="relative max-w-6xl mx-auto">
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -left-15"
            rotation={270}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -right-15"
            rotation={180}
          />
          <div className="p-1 bg-accent border-border border rounded-[12px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              {newsUpdates.map((news) => (
                <Link
                  key={news.title}
                  href="/resources/blogs"
                  className="group overflow-hidden rounded-[10px] border border-border bg-background/80 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  aria-label={`Read blog update: ${news.title}`}
                >
                  <div className="relative h-62 bg-black dark:bg-neutral-900 text-white">
                    <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:120px_120px]" />
                    <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-white/5" />
                    <div className="relative flex h-full flex-col justify-between p-4">
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <span className="uppercase tracking-wide">
                          {news.source}
                        </span>
                        <news.icon className="size-4" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-white/50">
                          Regulatory briefing
                        </p>
                        <h3 className="mt-2 text-lg font-semibold leading-tight">
                          {news.highlight}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-semibold leading-tight">
                      {news.title}
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {news.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <PiCalendarDuotone className="size-4" />
                      {news.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
        <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      </div>
    </div>
  );
}

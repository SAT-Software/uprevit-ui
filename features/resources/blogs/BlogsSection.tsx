"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DecorativeCornerCircleCustom } from "@/components/ui/DecorativeCornerCircle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  PiArrowRightDuotone,
  PiCalendarDuotone,
  PiNewspaperDuotone,
} from "react-icons/pi";

const blogPosts = [
  {
    title: "Understanding FDA's New Labeling Requirements",
    excerpt: "A comprehensive guide to the latest FDA labeling guidelines and how they impact your medical device documentation.",
    date: "2024-12-15",
    category: "Regulatory Update",
  },
  {
    title: "EU MDR Compliance: A Step-by-Step Approach",
    excerpt: "Navigate the complexities of European Medical Device Regulation with this practical implementation guide.",
    date: "2024-12-01",
    category: "Compliance Guide",
  },
  {
    title: "ISO 15223-1:2021 Key Changes Explained",
    excerpt: "Understanding the important updates to the international standard for medical device symbols.",
    date: "2024-11-20",
    category: "Standards",
  },
];

const newsUpdates = [
  {
    title: "FDA Announces Updated UDI Compliance Deadlines",
    excerpt: "New timeline for Unique Device Identifier requirements gives manufacturers additional flexibility.",
    date: "2024-12-10",
    source: "FDA",
  },
  {
    title: "EU MDR Implementation Extended for Certain Devices",
    excerpt: "European Commission grants transition period for specific medical device categories.",
    date: "2024-12-05",
    source: "EU Commission",
  },
  {
    title: "New ISO Standard for Digital Labeling Published",
    excerpt: "International Organization for Standardization releases guidance for electronic labeling.",
    date: "2024-11-28",
    source: "ISO",
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant = mounted && resolvedTheme === "dark" ? "outline" : "white";
  const featuredPost = blogPosts[0];
  const latestPosts = blogPosts.slice(1);

  return (
    <div className="w-full mt-12 mb-24 pointer-events-auto">
      <div className="max-w-6xl mx-auto mb-12 px-4">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <PiNewspaperDuotone className="text-foreground/60" />
          <span className="font-medium">Blogs</span>
        </Badge>
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
            Insights for labeling leaders who need clarity fast
          </h2>
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
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button size="lg">Subscribe for updates</Button>
          <Button size="lg" variant="outline">
            See all posts
          </Button>
        </div>
      </div>

      <div className="relative w-full mb-16">
        <div className="max-w-6xl mx-auto relative px-4">
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -left-15"
            rotation={180}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-7.5 -right-22.5"
            rotation={90}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-top-15 -right-15"
            rotation={90}
          />

          <div className="p-1 bg-accent border-border border rounded-[12px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
              <div className="lg:col-span-2 rounded-[10px] border border-border bg-foreground text-background p-6">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="border-background/40 text-background/80"
                  >
                    {featuredPost.category}
                  </Badge>
                  <span className="text-xs text-background/70">
                    Featured
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold leading-tight">
                  {featuredPost.title}
                </h3>
                <p className="mt-3 text-sm text-background/80">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-background/70">
                    <PiCalendarDuotone className="size-4" />
                    {featuredPost.date}
                  </div>
                  <Button
                    variant="outline"
                    className="border-background/40 text-background hover:bg-background hover:text-foreground"
                  >
                    Read featured story
                  </Button>
                </div>
              </div>
              <div className="rounded-[10px] border border-border bg-background/80 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Latest posts</h3>
                  <Badge variant="outline" className="text-xs">
                    Updated weekly
                  </Badge>
                </div>
                <div className="mt-4 space-y-4">
                  {latestPosts.map((post) => (
                    <div
                      key={post.title}
                      className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/40"
                    >
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <h4 className="mt-2 text-base font-semibold leading-snug">
                        {post.title}
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {post.date}
                        </span>
                        <Button variant="link" className="px-0 text-sm">
                          Read more
                          <PiArrowRightDuotone className="ml-1 size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-medium">
            Regulatory briefings in plain language
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We distill complex announcements into clear, actionable steps. Use
            these briefings to align your labeling roadmap with upcoming
            enforcement timelines.
          </p>
        </div>
        <div className="p-1 bg-accent border-border border rounded-[12px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {newsUpdates.map((news) => (
              <div
                key={news.title}
                className="rounded-[10px] border border-border bg-background/80 p-6 transition-colors hover:bg-accent/40"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {news.source}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {news.date}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-tight">
                  {news.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {news.excerpt}
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Read full briefing
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

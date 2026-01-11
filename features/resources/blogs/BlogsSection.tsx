"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiNewspaperDuotone, PiArrowRightDuotone, PiCalendarDuotone } from "react-icons/pi";

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

export default function BlogsSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant = mounted && resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="w-full mt-10 mb-20 pointer-events-auto">
      {/* Part 1: Navigate Compliance with Clarity */}
      <div className="max-w-6xl mx-auto mb-16 px-4">
        <Badge variant={badgeVariant} className="mb-8 z-60 dark:px-2 dark:py-0.5">
          <span className="font-medium">Blogs</span>
        </Badge>
        <div className="w-full flex flex-col md:flex-row items-start gap-4 mb-6">
          <h2 className="text-4xl md:text-5xl font-medium">
            Navigate Compliance with Clarity and Confidence
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mb-8">
          The medical device landscape is constantly evolving, making compliant labeling a continuous
          challenge. Our blog and news section provides clear, expert analysis of the latest regulatory
          shifts, giving you the critical knowledge to make informed decisions and stay ahead of
          enforcement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-2">
                  <PiCalendarDuotone className="w-4 h-4" />
                  {post.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  {post.excerpt}
                </CardDescription>
                <Button variant="link" className="px-0">
                  Read More
                  <PiArrowRightDuotone className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Part 2: Decoding Regulatory Change */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t pt-16">
          <div className="w-full flex flex-col md:flex-row items-start gap-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-medium">
              Decoding Regulatory Change
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            Compliance is complex, but understanding it shouldn&apos;t be. We break down the latest
            regulatory announcements from bodies worldwide, transforming complicated rules into clear,
            actionable steps for your labeling teams. Get the crucial intelligence you need to
            future-proof your product documentation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsUpdates.map((news, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{news.source}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{news.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <PiCalendarDuotone className="w-4 h-4" />
                    {news.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {news.excerpt}
                  </CardDescription>
                  <Button variant="outline" size="sm">
                    Read Full Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

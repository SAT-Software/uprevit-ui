"use client";

import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { DottedVerticalLines } from "@/features/marketing/landing-page/DottedVerticalLines";
import BlogsSection from "@/features/resources/blogs/BlogsSection";

export default function BlogsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="relative w-full">
        <DottedVerticalLines />
        <div className="relative z-10 w-full pt-32">
          <BlogsSection />
        </div>
        <div className="relative z-35 w-full">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}

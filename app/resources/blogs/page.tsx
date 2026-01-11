"use client";

import MarketingHeader from "@/features/marketing/marketing-header";
import BlogsSection from "@/features/resources/blogs/BlogsSection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export default function BlogsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="w-full pt-32">
        <BlogsSection />
      </div>
      <div className="w-full">
        <FooterSection />
      </div>
    </div>
  );
}

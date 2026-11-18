import { pageMetadata } from "@/lib/metadata";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { DottedVerticalLines } from "@/features/marketing/landing-page/DottedVerticalLines";
import ResourcesHub from "@/features/resources/ResourcesHub";

export const metadata = pageMetadata(
  "Resources for Medical Device Labeling Teams",
  "Standards, symbols, templates and guides that help medical device labeling teams stay compliant across markets.",
  "/resources",
);

export default function ResourcesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="relative w-full">
        <DottedVerticalLines />
        <main className="relative z-10 w-full pt-8 md:pt-24">
          <ResourcesHub />
        </main>
        <div className="relative z-35 w-full">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}

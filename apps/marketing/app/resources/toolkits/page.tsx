import { pageMetadata } from "@/lib/metadata";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { DottedVerticalLines } from "@/features/marketing/landing-page/DottedVerticalLines";
import ToolkitsPlaceholder from "@/features/resources/toolkits/ToolkitsPlaceholder";

export const metadata = pageMetadata(
  "Labeling Toolkits",
  "Tools for medical device labeling teams from Uprevit. Coming soon.",
  "/resources/toolkits",
  false,
);

export default function ToolkitsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="relative w-full">
        <DottedVerticalLines />
        <main className="relative z-10 w-full pt-8 md:pt-24">
          <ToolkitsPlaceholder />
        </main>
        <div className="relative z-35 w-full">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}

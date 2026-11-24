import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import ToolkitsPlaceholder from "@/features/resources/toolkits/ToolkitsPlaceholder";

export const metadata = pageMetadata(
  "Labeling Toolkits",
  "Tools for medical device labeling teams from Uprevit. Coming soon.",
  "/resources/toolkits",
  false,
);

export default function ToolkitsPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow className="hidden sm:grid" />
      <main className="contents">
        <ToolkitsPlaceholder />
        <CTASection
          title="See your own labels"
          mutedTitle="in Uprevit."
          description="Bring one product. We'll set it up live, run it through review and export the release on the call."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "toolkits-cta-book-demo",
          }}
          secondaryCta={{
            label: "Learn more",
            href: "/#product-preview",
            dataAttr: "toolkits-cta-learn-more",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}

import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import ResourcesHub from "@/features/resources/ResourcesHub";

export const metadata = pageMetadata(
  "Resources for Medical Device Labeling Teams",
  "Standards, symbols, templates and guides that help medical device labeling teams stay compliant across markets.",
  "/resources",
);

export default function ResourcesPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <ResourcesHub />
        <CTASection
          title="See your own labels"
          mutedTitle="in Uprevit."
          description="Bring one product. We'll set it up live, run it through review and export the release on the call."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "resources-cta-book-demo",
          }}
          secondaryCta={{
            label: "Explore the platform",
            href: "/platform/overview",
            dataAttr: "resources-cta-platform",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}

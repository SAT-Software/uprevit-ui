import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import TemplatesSection from "@/features/resources/templates/TemplatesSection";

export const metadata = pageMetadata(
  "Labeling Templates",
  "Practical medical device labeling templates from Uprevit. Coming soon.",
  "/resources/templates",
  false,
);

export default function TemplatesPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <TemplatesSection />
        <CTASection
          title="See your own labels"
          mutedTitle="in Uprevit."
          description="Bring one product. We'll set it up live, run it through review and export the release on the call."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "templates-cta-book-demo",
          }}
          secondaryCta={{
            label: "Explore the platform",
            href: "/platform/overview",
            dataAttr: "templates-cta-platform",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}

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
      <TileSpacerRow className="hidden sm:grid" />
      <main className="contents">
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
            label: "Learn more",
            href: "/#product-preview",
            dataAttr: "templates-cta-learn-more",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}

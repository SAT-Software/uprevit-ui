import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { NewsletterActionPageContent } from "@/features/resources/blogs/NewsletterActionPageContent";

export const metadata = pageMetadata(
  "Unsubscribe from Uprevit Blog",
  "Unsubscribe from Uprevit blog update emails.",
  "/newsletter/unsubscribe",
  false,
);

export default function NewsletterUnsubscribePage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <NewsletterActionPageContent mode="unsubscribe" />
      </main>
      <TileSpacerRow />
      <FooterSection inTileGrid />
    </TileGrid>
  );
}

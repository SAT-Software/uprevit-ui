import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { NewsletterActionPageContent } from "@/features/resources/blogs/NewsletterActionPageContent";

export const metadata = pageMetadata(
  "Confirm Blog Subscription",
  "Confirm your email address to receive new posts from the Uprevit blog.",
  "/newsletter/confirm",
  false,
);

export default function NewsletterConfirmPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <NewsletterActionPageContent mode="confirm" />
      </main>
      <TileSpacerRow />
      <FooterSection inTileGrid />
    </TileGrid>
  );
}

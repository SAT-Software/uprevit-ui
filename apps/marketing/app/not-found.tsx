import type { Metadata } from "next";
import Link from "next/link";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { NotFoundIllustration } from "@/features/marketing/errors/ErrorIllustrations";
import {
  ERROR_PRIMARY_ACTION,
  ERROR_SECONDARY_ACTION,
  ErrorPageSection,
} from "@/features/marketing/errors/ErrorPageSection";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <ErrorPageSection
          illustration={<NotFoundIllustration />}
          title="Page not found"
          mutedTitle="It may have moved."
          description="The link may be broken or the page may have been removed. Head back home or tell us what you were looking for."
          actions={
            <>
              <Link href="/" data-attr="not-found-home" className={ERROR_PRIMARY_ACTION}>
                Back to home
              </Link>
              <Link href="/contact" data-attr="not-found-contact" className={ERROR_SECONDARY_ACTION}>
                Contact us
              </Link>
            </>
          }
        />
      </main>
      <TileSpacerRow />
      <FooterSection inTileGrid />
    </TileGrid>
  );
}

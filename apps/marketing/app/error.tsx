"use client";

import { useEffect } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import { ServerErrorIllustration } from "@/features/marketing/errors/ErrorIllustrations";
import {
  ERROR_PRIMARY_ACTION,
  ERROR_SECONDARY_ACTION,
  ErrorPageSection,
} from "@/features/marketing/errors/ErrorPageSection";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    posthog.captureException(error);
  }, [error]);

  return (
    <TileGrid>
      <title>Something went wrong | Uprevit</title>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <ErrorPageSection
          illustration={<ServerErrorIllustration />}
          title="Something went wrong"
          mutedTitle="We're on it."
          description="An unexpected error stopped this page from loading. Try again in a moment, or head back home."
          actions={
            <>
              <button type="button" onClick={retry} data-attr="error-try-again" className={ERROR_PRIMARY_ACTION}>
                Try again
              </button>
              <Link href="/" data-attr="error-home" className={ERROR_SECONDARY_ACTION}>
                Back to home
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

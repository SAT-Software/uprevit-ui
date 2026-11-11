"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Button } from "@uprevit/ui/components/ui/button";

const OPEN_EVENT = "cookie-consent:open";

export function openCookieConsent() {
  posthog.clear_opt_in_out_capturing();
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!posthog.__loaded) return;
    const show = () => setOpen(true);
    if (posthog.get_explicit_consent_status() === "pending") show();
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  if (!open) return null;

  const choose = (accept: boolean) => {
    if (accept) posthog.opt_in_capturing();
    else posthog.opt_out_capturing();
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-100 mx-auto flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-background p-4 shadow-bottom-lg sm:flex-row sm:items-center"
    >
      <p className="text-sm text-muted-foreground">
        We use cookies to understand how visitors use our site. If you decline,
        we only count anonymous visits.{" "}
        <Link
          href="/privacy-policy"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Privacy Policy
        </Link>
      </p>
      <div className="flex shrink-0 gap-2">
        <Button variant="outline" size="sm" onClick={() => choose(false)}>
          Decline
        </Button>
        <Button size="sm" onClick={() => choose(true)}>
          Accept
        </Button>
      </div>
    </div>
  );
}

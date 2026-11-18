import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Pricing for Medical Device Labeling Teams",
  "Uprevit pricing combines a platform fee, seats and optional add-ons for uploads, exports and SSO. Estimate the cost for your labeling team.",
  "/pricing",
);

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

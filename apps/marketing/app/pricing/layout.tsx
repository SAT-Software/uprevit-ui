import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Pricing for Medical Device Labeling Teams",
  "Uprevit pricing combines a monthly platform fee, role-based seats and metered usage for stored files, exports and SSO.",
  "/pricing",
);

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

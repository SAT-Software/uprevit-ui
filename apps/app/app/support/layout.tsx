import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support screenshot · Uprevit",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

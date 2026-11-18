import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@uprevit/ui/lib/theme-provider";
import { TooltipProvider } from "@uprevit/ui/components/ui/tooltip";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { JsonLd } from "@/components/JsonLd";
import { cdnUrl } from "@/lib/cdn";
import { ogImage, pageMetadata, siteUrl } from "@/lib/metadata";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const homeTitle = "Uprevit: Medical Device Labeling Management Software";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata(
    homeTitle,
    "Create, manage and track medical device labeling documentation with ease. Collaborate across teams and track departments, projects and products in one place.",
    "/",
  ),
  title: { default: homeTitle, template: "%s | Uprevit" },
  twitter: { card: "summary_large_image", site: "@uprevit", images: ogImage },
  icons: {
    icon: [
      { url: "/favicon-black.ico", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-white.ico", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Uprevit",
      url: siteUrl,
      logo: cdnUrl("brand/uprevit-logo-black.svg"),
      email: "contact@uprevit.com",
      sameAs: [
        "https://linkedin.com/company/uprevit",
        "https://x.com/uprevit",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Uprevit",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="antialiased">
        <JsonLd data={organizationJsonLd} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}

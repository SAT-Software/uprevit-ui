import type { Metadata } from "next";
import { Fragment_Mono, Geist, Outfit } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@uprevit/ui/lib/theme-provider";
import { TooltipProvider } from "@uprevit/ui/components/ui/tooltip";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { JsonLd } from "@/components/JsonLd";
import { MotionProvider } from "@/components/MotionProvider";
import { ogImage, pageMetadata, siteUrl } from "@/lib/metadata";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  weight: "400",
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
  twitter: { card: "summary_large_image", images: ogImage },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Uprevit",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      email: "contact@uprevit.com",
      sameAs: ["https://linkedin.com/company/uprevit"],
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
    <html
      lang="en"
      className={`${outfit.variable} ${geist.variable} ${fragmentMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:font-ui focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <JsonLd data={organizationJsonLd} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <CookieConsentBanner />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

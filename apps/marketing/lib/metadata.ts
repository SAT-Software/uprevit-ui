import type { Metadata } from "next";

export const siteUrl = "https://www.uprevit.com";

export const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Uprevit product compliance view for a medical device",
};

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  indexable = true,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Uprevit",
      locale: "en_US",
      url: path,
      title,
      description,
      images: ogImage,
    },
    ...(!indexable && { robots: { index: false, follow: true } }),
  };
}

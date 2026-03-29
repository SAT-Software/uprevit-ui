import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Uprevit",
  description:
    "Create, manage and track medical device labeling documentation with ease. Collaborate seamlessly across teams and track departments, projects, and products in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

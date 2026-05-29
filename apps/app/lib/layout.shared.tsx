import { buttonVariants } from "@uprevit/ui/components/ui/button";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Link from "next/link";
import { PiArrowLeftDuotone } from "react-icons/pi";
import { docsNavTitle } from "@/lib/docs-nav-title";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: docsNavTitle(),
      url: "/docs",
    },
    links: [
      {
        type: "custom",
        children: (
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline" })}
          >
            <PiArrowLeftDuotone />
            Back to App
          </Link>
        ),
        secondary: true,
      },
    ],
  };
}

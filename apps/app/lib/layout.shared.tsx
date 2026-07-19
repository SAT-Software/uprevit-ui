import { buttonVariants } from "@uprevit/ui/components/ui/button";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Link from "next/link";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
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
            <Icon icon={ArrowLeft02Icon} size={16} strokeWidth={2} />
            Back to App
          </Link>
        ),
        secondary: true,
      },
    ],
  };
}

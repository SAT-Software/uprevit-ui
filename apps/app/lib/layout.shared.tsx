import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { docsNavTitle } from "@/lib/docs-nav-title";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: docsNavTitle(),
      url: "/docs",
      component: <DocsHeader />,
    },
  };
}

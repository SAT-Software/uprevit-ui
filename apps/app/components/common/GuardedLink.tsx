"use client";

import Link from "next/link";
import { useProductWorkbookUnsavedGuardOptional } from "@/lib/product-workbook-unsaved-guard";
import type { ComponentProps } from "react";

type GuardedLinkProps = ComponentProps<typeof Link>;

function resolveHrefString(href: GuardedLinkProps["href"]): string {
  if (typeof href === "string") return href;
  if (!href || typeof href !== "object") return "";

  const pathname = href.pathname ?? "";
  if (href.search) return `${pathname}${href.search}`;
  if (href.query && typeof href.query === "object") {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(href.query)) {
      if (value === undefined || value === null) continue;
      params.set(key, String(value));
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }
  return pathname;
}

export function GuardedLink({ href, onClick, ...props }: GuardedLinkProps) {
  const guardContext = useProductWorkbookUnsavedGuardOptional();
  const hrefString = resolveHrefString(href);

  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        if (!guardContext || !hrefString) return;

        event.preventDefault();
        guardContext.tryNavigate(hrefString);
      }}
    />
  );
}

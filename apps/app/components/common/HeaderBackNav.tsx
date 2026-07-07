"use client";

import { GuardedLink } from "@/components/common/GuardedLink";
import { useGetCurrentSourceFilesFolder } from "@/hooks/source-files/useGetCurrentSourceFilesFolder";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { useParams, usePathname } from "next/navigation";

type BackNav = {
  href: string;
  label: string;
};

function getRouteParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

function getStaticBackNav(pathname: string): BackNav | null {
  if (/^\/departments\/[^/]+$/.test(pathname)) {
    return { href: "/departments", label: "All departments" };
  }
  if (/^\/projects\/[^/]+$/.test(pathname)) {
    return { href: "/projects", label: "All projects" };
  }
  if (/^\/bookmarked-products\/[^/]+$/.test(pathname)) {
    return { href: "/bookmarked-products", label: "Bookmarked products" };
  }
  return null;
}

function useSourceFilesBackNav(folderId: string): BackNav | null | "loading" {
  const { data, isLoading } = useGetCurrentSourceFilesFolder(folderId);
  const parentId = data?.result?.parentId ?? data?.result?.parent_id ?? null;
  const { data: parentData, isLoading: isParentLoading } =
    useGetCurrentSourceFilesFolder(parentId ?? "");

  if (!folderId) return null;
  if (isLoading) return "loading";
  if (parentId == null) {
    return { href: "/source-files", label: "Source files" };
  }
  if (isParentLoading) return "loading";

  return {
    href: `/source-files/view/${parentId}`,
    label: parentData?.result?.name ?? "Parent folder",
  };
}

export function HeaderBackNav() {
  const pathname = usePathname();
  const params = useParams();
  const staticNav = getStaticBackNav(pathname);
  const sourceFilesFolderId = pathname.startsWith("/source-files/view/")
    ? getRouteParam(params.slug)
    : "";
  const sourceFilesNav = useSourceFilesBackNav(sourceFilesFolderId);

  const nav =
    staticNav ?? (sourceFilesNav === "loading" ? "loading" : sourceFilesNav);

  if (!nav) return null;

  if (nav === "loading") {
    return <Skeleton className="h-7 w-36 rounded-md" />;
  }

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="max-w-[min(100%,16rem)]"
    >
      <GuardedLink href={nav.href} className="min-w-0">
        <Icon icon={ArrowLeft02Icon} />
        <span className="truncate">{nav.label}</span>
      </GuardedLink>
    </Button>
  );
}

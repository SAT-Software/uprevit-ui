"use client";

import { HeaderBackNav } from "@/components/common/HeaderBackNav";
import { cn } from "@uprevit/ui/lib/utils";
import { useParams, usePathname } from "next/navigation";
import { SidebarTrigger } from "@uprevit/ui/components/ui/sidebar";
import { UserNav } from "./UserNav";

const pathData = [
  { title: "Dashboard", url: "/dashboard" },
  { title: "Departments", url: "/departments" },
  { title: "Projects", url: "/projects" },
  { title: "Products", url: "/products" },
  { title: "Source Files", url: "/source-files" },
  { title: "Bookmarked Products", url: "/bookmarked-products" },
  { title: "Reports", url: "/reports" },
  { title: "Analytics", url: "/analytics" },
  { title: "Archive", url: "/archive" },
  { title: "Settings", url: "/settings" },
  { title: "Feedback", url: "/feedback" },
  { title: "Help Center", url: "/help-center" },
];

const NESTED_ROUTE_PATTERN =
  /^\/(departments|projects|source-files|bookmarked-products)\/.+/;

export function AppHeader() {
  const pathname = usePathname();
  const params = useParams();

  const productId =
    typeof params.productId === "string"
      ? params.productId
      : Array.isArray(params.productId)
        ? params.productId[0]
        : undefined;

  if (productId) return null;

  const isNestedRoute = NESTED_ROUTE_PATTERN.test(pathname);
  const pageTitle =
    pathData.find((item) => item.url === pathname)?.title ?? "";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 bg-background flex shrink-0 items-center justify-between px-4 gap-2 border-b border-sidebar-border transition-[width,height,left] ease-linear duration-200",
        "left-0 right-0",
        "md:left-[var(--sidebar-width)] md:w-[calc(100%-var(--sidebar-width))]",
        "md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:left-[var(--sidebar-width-icon)] md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[calc(100%-var(--sidebar-width-icon))]",
        "md:group-has-[[data-collapsible=offcanvas]]/sidebar-wrapper:left-0 md:group-has-[[data-collapsible=offcanvas]]/sidebar-wrapper:w-full",
        "h-12 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
      )}
    >
      <div className="flex w-full">
        <div className="flex w-full min-w-0 items-center gap-2">
          <SidebarTrigger />
          {isNestedRoute ? (
            <HeaderBackNav />
          ) : (
            <p className="text-sm font-medium">{pageTitle}</p>
          )}
        </div>
        <UserNav />
      </div>
    </header>
  );
}

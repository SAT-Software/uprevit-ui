"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@uprevit/ui/components/ui/breadcrumb";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { cn } from "@uprevit/ui/lib/utils";
import { Product } from "@/types/product";
import { GuardedLink } from "@/components/common/GuardedLink";
import { useParams, usePathname } from "next/navigation";
import { SidebarTrigger } from "@uprevit/ui/components/ui/sidebar";
import { UserNav } from "./UserNav";

const pathData = [
  {
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    title: "Departments",
    url: "/departments",
  },
  {
    title: "Projects",
    url: "/projects",
  },
  {
    title: "Products",
    url: "/products",
  },
  {
    title: "Source Files",
    url: "/source-files",
  },
  {
    title: "Bookmarked Products",
    url: "/bookmarked-products",
  },
  {
    title: "Reports",
    url: "/reports",
  },
  {
    title: "Analytics",
    url: "/analytics",
  },
  {
    title: "Archive",
    url: "/archive",
  },
  {
    title: "Settings",
    url: "/settings",
  },
  {
    title: "Feedback",
    url: "/feedback",
  },
  {
    title: "Help Center",
    url: "/help-center",
  },
];

export function AppHeader() {
  const pathname = usePathname();
  const params = useParams();
  const { mutate: updateProduct } = useUpdateProduct();

  const productId =
    typeof params.productId === "string"
      ? params.productId
      : Array.isArray(params.productId)
        ? params.productId[0]
        : undefined;

  const isProductPage = Boolean(productId);

  // Get current product and check completion status
  const { data } = useGetAllProducts();
  const currentProduct = productId
    ? data?.result.products?.find((p: Product) => p._id === productId)
    : null;

  const isProductComplete = currentProduct?.complete_count === 100;

  const handleSubmit = () => {
    if (!currentProduct?._id) return;
    updateProduct({
      _id: currentProduct._id,
      action: "update-status",
      data: {
        status: "submitted",
      },
    });
  };

  if (isProductPage) return null;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 bg-background flex shrink-0 items-center justify-between px-4 gap-2 border-b border-sidebar-border transition-[width,height,left] ease-linear duration-200",
        // Width and positioning that accounts for sidebar
        "left-0 right-0",
        "md:left-[var(--sidebar-width)] md:w-[calc(100%-var(--sidebar-width))]",
        "md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:left-[var(--sidebar-width-icon)] md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[calc(100%-var(--sidebar-width-icon))]",
        "md:group-has-[[data-collapsible=offcanvas]]/sidebar-wrapper:left-0 md:group-has-[[data-collapsible=offcanvas]]/sidebar-wrapper:w-full",
        // Height
        isProductPage
          ? "h-12 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
          : "h-12 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
      )}
    >
      <div className="flex w-full">
        <div className="flex w-full items-center gap-2">
          <SidebarTrigger className="" />
          {/^\/(departments|projects|products|source-files|bookmarked-products)\/.+/.test(
            pathname,
          ) ? (
            (() => {
              const section = pathname.split("/")[1];
              const sectionData = pathData.find(
                (item) => item.url === `/${section}`,
              );

              return (
                <div className="flex items-center gap-1">
                  <Breadcrumb>
                    <BreadcrumbList>
                      {/* <BreadcrumbSeparator /> */}
                      <BreadcrumbItem>
                        <GuardedLink href={`/${section}`}>
                          {sectionData?.title}
                        </GuardedLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              );
            })()
          ) : (
            <p className="text-sm font-medium">
              {pathData.find((item) => item.url === pathname)?.title || ""}
            </p>
          )}
        </div>
        <UserNav />
      </div>
    </header>
  );
}

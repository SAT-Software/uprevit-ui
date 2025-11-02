"use client";

import { useParams, usePathname } from "next/navigation";
import { NavUser } from "./nav-user";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  PiChatTeardropDotsDuotone,
  PiCirclesThreePlusDuotone,
  PiDiamondsFourDuotone,
  PiFolderOpenDuotone,
  PiGearDuotone,
  PiKanbanDuotone,
  PiLifebuoyDuotone,
  PiStackPlusDuotone,
  PiPresentationChartDuotone,
  PiArchiveDuotone,
  PiBookmarkSimpleDuotone,
} from "react-icons/pi";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { Product } from "@/types/product";

const pathData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: PiDiamondsFourDuotone,
  },
  {
    title: "Departments",
    url: "/departments",
    icon: PiCirclesThreePlusDuotone,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: PiKanbanDuotone,
  },
  {
    title: "Products",
    url: "/products",
    icon: PiStackPlusDuotone,
  },
  {
    title: "Source Files",
    url: "/source-files",
    icon: PiFolderOpenDuotone,
  },
  {
    title: "Bookmarked Products",
    url: "/bookmarked-products",
    icon: PiBookmarkSimpleDuotone,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: PiPresentationChartDuotone,
  },
  {
    title: "Archive",
    url: "/archive",
    icon: PiArchiveDuotone,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: PiGearDuotone,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: PiChatTeardropDotsDuotone,
  },
  {
    title: "Help Center",
    url: "/help-center",
    icon: PiLifebuoyDuotone,
  },
];

export function AppHeader() {
  const pathname = usePathname();
  const params = useParams();

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

  const isProductComplete = currentProduct?.status === "Submitted";

  // if (isProductPage) return null;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 bg-background flex shrink-0 items-center justify-between px-4 gap-2 border-b border-input transition-[width,height,left] ease-linear duration-200",
        // Width and positioning that accounts for sidebar
        "left-0 right-0",
        "md:left-[var(--sidebar-width)] md:w-[calc(100%-var(--sidebar-width))]",
        "md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:left-[var(--sidebar-width-icon)] md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[calc(100%-var(--sidebar-width-icon))]",
        "md:group-has-[[data-collapsible=offcanvas]]/sidebar-wrapper:left-0 md:group-has-[[data-collapsible=offcanvas]]/sidebar-wrapper:w-full",
        // Height
        isProductPage
          ? "h-12 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
          : "h-16 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16"
      )}
    >
      {isProductPage ? (
        <div className="flex w-full">
          <div className="flex w-full items-center gap-2 ">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-muted-foreground bg-muted" />

            <Separator orientation="vertical" className=" h-4" />

            <div className="flex w-full items-center justify-between gap-4">
              <p className="text-sm font-semibold">
                {currentProduct?.product_name}
              </p>
              <div className="flex gap-4 items-center">
                <p className="text-sm text-muted-foreground">
                  Master-{currentProduct?.master_version}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    Save Draft
                  </Button>
                  <Button
                    size="sm"
                    disabled={!isProductComplete}
                    className={cn(
                      !isProductComplete && "opacity-50 cursor-not-allowed"
                    )}
                    title={
                      !isProductComplete
                        ? "Complete all tabs to enable submission"
                        : "Submit product"
                    }
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full">
          <div className="flex w-full items-center gap-2 ">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-muted-foreground bg-muted" />
            {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
            <Separator orientation="vertical" className=" h-4" />
            {/* Breadcrumbs for dynamic routes, icon+title for static */}
            {/^\/(departments|projects|products|source-files|bookmarked-products)\/.+/.test(
              pathname
            ) ? (
              (() => {
                // Determine section (departments, projects, products)
                const section = pathname.split("/")[1];
                const sectionData = pathData.find(
                  (item) => item.url === `/${section}`
                );
                const Icon = sectionData?.icon;
                // Extract dynamic id
                const id = pathname.split("/")[2];
                return (
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="text-muted-foreground" />}
                    {/* <Separator orientation="vertical" className="h-4" /> */}
                    <Breadcrumb>
                      <BreadcrumbList>
                        {/* <BreadcrumbSeparator /> */}
                        <BreadcrumbItem>
                          <Link href={`/${section}`}>{sectionData?.title}</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>
                            <span className="flex items-center gap-1">
                              {id}
                            </span>
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                );
              })()
            ) : (
              <>
                {pathData.map(
                  (item) =>
                    item.url === pathname &&
                    item.icon && <item.icon key={item.title} />
                )}
                <p className="text-sm font-medium">
                  {pathData.find((item) => item.url === pathname)?.title || ""}
                </p>
              </>
            )}
          </div>
          <NavUser />
        </div>
      )}
    </header>
  );
}

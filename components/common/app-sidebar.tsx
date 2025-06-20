"use client";

import * as React from "react";

import { NavMain } from "@/components/common/nav-main";
import { NavProjects } from "@/components/common/nav-projects";
import {
  PiArchiveDuotone,
  PiBookmarkSimpleDuotone,
  PiChatTeardropDotsDuotone,
  PiCirclesThreePlusDuotone,
  PiDiamondsFourDuotone,
  PiFolderOpenDuotone,
  PiGearDuotone,
  PiKanbanDuotone,
  PiLifebuoyDuotone,
  PiPresentationChartDuotone,
  PiStackPlusDuotone,
} from "react-icons/pi";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { sampleProducts } from "@/app/(app)/products/page";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  ArrowLeftIcon,
  BookOpenCheck,
  GalleryVerticalEnd,
  Grid2X2,
  ImagePlus,
  LayoutGrid,
  LayoutList,
  Sheet,
  Tags,
} from "lucide-react";

const data = {
  navMain: [
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
  ],
  other: [
    {
      name: "Feedback",
      url: "/feedback",
      icon: PiChatTeardropDotsDuotone,
    },
    {
      name: "Help Center",
      url: "/help-center",
      icon: PiLifebuoyDuotone,
    },
  ],
  product: [
    {
      title: "Product information",
      url: "/product-information",
      icon: LayoutGrid,
    },
    {
      title: "Component details",
      url: "/component-details",
      icon: LayoutList,
    },
    {
      title: "Compliance information",
      url: "/compliance-information",
      icon: BookOpenCheck,
    },
    {
      title: "Product data",
      url: "/product-data",
      icon: Sheet,
    },
    {
      title: "Operational parameters",
      url: "/operational-parameters",
      icon: Grid2X2,
    },
    {
      title: "Label tags",
      url: "/label-tags",
      icon: Tags,
    },
    {
      title: "Graphics & components",
      url: "/schematics-symbols",
      icon: ImagePlus,
    },
  ],
};

const team = {
  name: "Acme Inc",
  logo: GalleryVerticalEnd,
  plan: "Enterprise",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const pathname = usePathname();
  const { open } = useSidebar();

  const productId =
    typeof params.productId === "string"
      ? params.productId
      : Array.isArray(params.productId)
      ? params.productId[0]
      : undefined;

  const isProductPage = Boolean(productId);

  const product = productId
    ? sampleProducts.find((p) => p.productId === productId)
    : undefined;

  return (
    <Sidebar
      collapsible="icon"
      className={cn("overflow-hidden [&>[data-sidebar=sidebar]]:flex-row")}
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible={isProductPage ? "none" : "icon"}
        className={cn(
          isProductPage && "!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
        )}
      >
        <SidebarHeader>
          <div className="flex items-center gap-4 p-1 rounded  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div className="relative flex aspect-square mb-1 size-6 items-center justify-center">
              <Image
                src="/log-no-bg-white.svg"
                alt="Uprevit logo"
                fill
                className=""
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-lg text-background font-black ">
                UPREVIT
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavMain
            items={data.navMain}
            open={open}
            isProductPage={isProductPage}
          />
          <NavProjects
            other={data.other}
            open={open}
            isProductPage={isProductPage}
          />
        </SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem className="px-1 py-1">
              <Link href={"/settings"}>
                <SidebarMenuButton
                  className={cn(
                    "hover:bg-sidebar-primary text-background hover:text-sidebar-primary-foreground"
                  )}
                >
                  <div>
                    <team.logo className="size-4" />
                  </div>
                  <span className="truncate font-medium">{team.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarRail />
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      {isProductPage && (
        <Sidebar
          collapsible="none"
          className={cn("hidden flex-1 md:flex bg-background")}
        >
          <SidebarHeader className="gap-4 border-b p-3">
            <div className="flex flex-col w-full items-start">
              <p className="text-xs">{product?.productId || "Id"}</p>
              <div className="text-sm font-semibold text-foreground">
                {product?.productName || "Product"}
              </div>
            </div>
            <div className="flex gap-2 w-full justify-between">
              <Link href="/products">
                <Button size="sm" variant="outline">
                  <ArrowLeftIcon className="size-4" />
                  Back
                </Button>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-0">
            <SidebarGroup className="px-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem className="py-2 flex flex-col gap-4">
                    {data.product &&
                      data.product.map((item) => (
                        <Link
                          key={item.title}
                          href={`/products/${productId}/${item.url}`}
                        >
                          <div
                            className={cn(
                              "border-y border-input flex flex-row items-center gap-2 py-5 px-3",
                              pathname.includes(item.url)
                                ? "text-primary bg-background"
                                : ""
                            )}
                          >
                            {item.icon && <item.icon className="size-4" />}
                            <span>{item.title}</span>
                          </div>
                        </Link>
                      ))}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
    </Sidebar>
  );
}

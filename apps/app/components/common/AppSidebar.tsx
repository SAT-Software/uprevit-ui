import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@uprevit/ui/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import {
  PiArchiveDuotone,
  PiBookmarkSimpleDuotone,
  PiBookOpenDuotone,
  PiBuildingsDuotone,
  PiPresentationChartDuotone,
  PiDatabaseDuotone,
  PiHouseDuotone,
  PiFolderOpenDuotone,
  PiGearDuotone,
  PiImageSquareDuotone,
  PiKanbanDuotone,
  PiLayoutDuotone,
  PiMicrosoftExcelLogoDuotone,
  PiPictureInPictureDuotone,
  PiPackageDuotone,
  PiTagChevronDuotone,
  PiDotsThreeOutlineVerticalDuotone,
  PiChartBarDuotone,
} from "react-icons/pi";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@uprevit/ui/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
} from "@uprevit/ui/components/ui/collapsible";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";
import { SidebarNavWorkspace } from "./SidebarNavWorkspace";

const data = {
  navMain: [
    {
      title: "Workspace",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: PiHouseDuotone,
        },
        {
          title: "Departments",
          url: "/departments",
          icon: PiBuildingsDuotone,
        },
        {
          title: "Projects",
          url: "/projects",
          icon: PiKanbanDuotone,
        },
        {
          title: "Products",
          url: "/products",
          icon: PiPackageDuotone,
        },
      ],
    },
    {
      title: "Supportive",
      items: [
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
          title: "Archive",
          url: "/archive",
          icon: PiArchiveDuotone,
        },
      ],
    },
    {
      title: "Insights",
      items: [
        {
          title: "Reports",
          url: "/reports",
          icon: PiPresentationChartDuotone,
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: PiChartBarDuotone,
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Settings",
          url: "/settings",
          icon: PiGearDuotone,
        },
      ],
    },
  ],
};

const productSubItems = [
  {
    title: "Product Information",
    url: "/product-information",
    icon: PiLayoutDuotone,
  },
  {
    title: "Compliance Information",
    url: "/compliance-information",
    icon: PiBookOpenDuotone,
  },
  {
    title: "Label Components",
    url: "/label-components",
    icon: PiPictureInPictureDuotone,
  },
  {
    title: "Symbols & Graphics",
    url: "/symbols-graphics",
    icon: PiImageSquareDuotone,
  },
  {
    title: "Product Specifications",
    url: "/product-specifications",
    icon: PiMicrosoftExcelLogoDuotone,
  },
  {
    title: "Operational Parameters",
    url: "/operational-parameters",
    icon: PiDatabaseDuotone,
  },
  {
    title: "Label Tags",
    url: "/label-tags",
    icon: PiTagChevronDuotone,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: workspaceData, isLoading } = useGetWorkspace();
  const workspace = workspaceData?.workspace;
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const pathSegments = pathname.split("/").filter(Boolean);
  const productId =
    pathSegments[0] === "products" && pathSegments[1] !== "exports"
      ? pathSegments[1]
      : undefined;
  const showProductSubNavigation = Boolean(productId);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border h-12">
        <Link
          href="/"
          className="flex items-center gap-4 p-1 rounded  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="relative flex aspect-square mb-1 size-6 items-center justify-center">
            <Image
              src="/log-no-bg-black.svg"
              alt="Uprevit logo"
              fill
              className="object-contain dark:hidden"
            />
            <Image
              src="/log-no-bg-white.svg"
              alt="Uprevit logo"
              fill
              className="hidden object-contain dark:block"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className="flex items-center gap-2">
              <span className="truncate text-lg text-foreground font-black ">
                UPREVIT
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    aria-label="Alpha release"
                    className="rounded-full border border-sidebar-border bg-sidebar-accent px-2 py-0.5 text-xs font-semibold text-sidebar-foreground/70"
                  >
                    α
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Early preview. Active updates are in progress.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-2 p-1">
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title} className="px-1 py-1">
            <SidebarGroupLabel className="h-6 px-2">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-7 border border-transparent",
                        pathname.startsWith(item.url)
                          ? "bg-sidebar-accent border-sidebar-border rounded text-sidebar-primary"
                          : ""
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        {item.icon && <item.icon />}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                    {item.title === "Products" && showProductSubNavigation && (
                        <Collapsible
                          key={item.title}
                          asChild
                          defaultOpen={showProductSubNavigation}
                          className="group/collapsible"
                        >
                          <CollapsibleContent>
                            <SidebarMenuSub className="gap-1 py-1">
                              {productSubItems?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    className={cn(
                                      pathname.includes(subItem.url)
                                        ? "bg-sidebar-border/50 rounded text-sidebar-foreground"
                                        : ""
                                    )}
                                    asChild
                                  >
                                    <Link
                                      href={`/products/${productId}${subItem.url}${
                                        compareVersionId ? `?compareVersion=${compareVersionId}` : ""
                                      }`}
                                    >
                                      {subItem.icon && <subItem.icon />}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarGroup className="px-2 py-1">
        {isLoading ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="border border-transparent cursor-default"
              >
                <Skeleton className="h-10 w-10 rounded-lg bg-border" />
                <div className="grid flex-1 text-left text-sm leading-tight gap-1">
                  <Skeleton className="h-6 w-28 bg-border" />
                  <Skeleton className="h-4 w-38 bg-border" />
                </div>
                <PiDotsThreeOutlineVerticalDuotone className="ml-auto size-4 text-muted-foreground" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <SidebarNavWorkspace workspace={workspace} />
        )}
      </SidebarGroup>
      <SidebarRail />
    </Sidebar>
  );
}

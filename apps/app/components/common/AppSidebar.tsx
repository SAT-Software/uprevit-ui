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
import { GuardedLink } from "@/components/common/GuardedLink";
import { UprevitLogo } from "@/components/common/UprevitLogo";
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
import { SidebarFeedbackButton } from "./AppSidebarFeedbackButton";
import { Badge } from "@uprevit/ui/components/ui/badge";

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
      title: "Help",

      items: [
        {
          title: "Settings",
          url: "/settings",
          icon: PiGearDuotone,
        },
        {
          title: "Documentation",
          url: "/docs",
          icon: PiBookOpenDuotone,
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
  const { data: workspaceData, isLoading: isWorkspaceLoading } =
    useGetWorkspace();
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
      <SidebarHeader className="border-b border-sidebar-border h-12 py-1">
        <GuardedLink
          href="/"
          className="flex items-center gap-1 p-0.5 rounded mt-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <UprevitLogo className="mb-1 rounded-xl" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <div className="flex items-center gap-2">
              <span className="truncate text-md text-foreground font-bold ">
                UPREVIT
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary">alpha</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Early preview. Active updates are in progress.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </GuardedLink>
      </SidebarHeader>
      <SidebarContent className="gap-2 p-1">
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title} className="px-1 py-1">
            <SidebarGroupLabel className="h-6 px-2">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        pathname.startsWith(item.url)
                          ? "bg-sidebar-accent text-accent-foreground"
                          : "text-sidebar-accent-foreground/40",
                      )}
                    >
                      <GuardedLink
                        href={item.url}
                        className="flex items-center gap-2"
                      >
                        <span>
                          {item.icon && <item.icon className="size-4" />}
                        </span>

                        <span
                          className={cn(
                            pathname.startsWith(item.url)
                              ? " text-accent-foreground"
                              : "text-sidebar-accent-foreground",
                          )}
                        >
                          {item.title}
                        </span>
                      </GuardedLink>
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
                                      ? "bg-sidebar-accent text-sidebar-foreground"
                                      : "text-sidebar-foreground/40",
                                  )}
                                  asChild
                                >
                                  <GuardedLink
                                    href={`/products/${productId}${subItem.url}${
                                      compareVersionId
                                        ? `?compareVersion=${compareVersionId}`
                                        : ""
                                    }`}
                                  >
                                    {subItem.icon && (
                                      <subItem.icon className="size-4" />
                                    )}
                                    <span
                                      className={cn(
                                        pathname.includes(subItem.url)
                                          ? "text-sidebar-foreground"
                                          : "text-sidebar-foreground",
                                      )}
                                    >
                                      {subItem.title}
                                    </span>
                                  </GuardedLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </SidebarMenuItem>
                ))}
                {item.title === "Help" && (
                  <SidebarMenuItem>
                    <SidebarFeedbackButton />
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarGroup className="px-2 py-1">
        {isWorkspaceLoading ? (
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

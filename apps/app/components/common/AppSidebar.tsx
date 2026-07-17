import * as React from "react";

import { GuardedLink } from "@/components/common/GuardedLink";
import { UprevitLogo } from "@/components/common/UprevitLogo";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";
import type { AllTabsData } from "@/types/product";
import {
  AiSheetsIcon,
  Album02Icon,
  Archive01Icon,
  ArchiveIcon,
  ArrowDown01Icon,
  Blockchain03Icon,
  Bookmark01Icon,
  BookOpen02Icon,
  Chart02Icon,
  ContractsIcon,
  FileDatabaseIcon,
  Folder02Icon,
  Home04Icon,
  KanbanIcon,
  LabelImportantIcon,
  LayerIcon,
  Layout01Icon,
  NewOfficeIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
} from "@uprevit/ui/components/ui/collapsible";
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
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { cn } from "@uprevit/ui/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { SidebarFeedbackButton } from "./AppSidebarFeedbackButton";
import { SidebarNavWorkspace } from "./SidebarNavWorkspace";

const data = {
  navMain: [
    {
      title: "Workspace",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={Home04Icon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
        {
          title: "Departments",
          url: "/departments",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={NewOfficeIcon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
        {
          title: "Projects",
          url: "/projects",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={KanbanIcon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
        {
          title: "Products",
          url: "/products",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={Blockchain03Icon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
      ],
    },
    {
      title: "Supportive",
      items: [
        {
          title: "Source Files",
          url: "/source-files",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={Folder02Icon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
        {
          title: "Bookmarked Products",
          url: "/bookmarked-products",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={Bookmark01Icon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
        {
          title: "Archive",
          url: "/archive",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={ArchiveIcon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
      ],
    },
    {
      title: "Insights",
      items: [
        {
          title: "Reports",
          url: "/reports",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={Archive01Icon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={Chart02Icon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
      ],
    },
    {
      title: "Help",

      items: [
        {
          title: "Settings",
          url: "/settings",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={Settings01Icon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
        {
          title: "Documentation",
          url: "/docs",
          icon: (
            <Icon
              className="transition-all delay-100 duration-200 ease-in-out"
              icon={BookOpen02Icon}
              size={16}
              strokeWidth={2}
            />
          ),
        },
      ],
    },
  ],
};

const productSubItems: {
  title: string;
  url: string;
  completionKey: keyof AllTabsData;
  icon: React.ReactNode;
}[] = [
  {
    title: "Product Information",
    url: "/product-information",
    completionKey: "product_information",
    icon: (
      <Icon
        className="transition-all delay-100 duration-200 ease-in-out"
        icon={Layout01Icon}
        size={16}
        strokeWidth={2}
      />
    ),
  },
  {
    title: "Compliance Information",
    url: "/compliance-information",
    completionKey: "compliance_information",
    icon: (
      <Icon
        className="transition-all delay-100 duration-200 ease-in-out"
        icon={ContractsIcon}
        size={16}
        strokeWidth={2}
      />
    ),
  },
  {
    title: "Label Components",
    url: "/label-components",
    completionKey: "label_components",
    icon: (
      <Icon
        className="transition-all delay-100 duration-200 ease-in-out"
        icon={LayerIcon}
        size={16}
        strokeWidth={2}
      />
    ),
  },
  {
    title: "Symbols & Graphics",
    url: "/symbols-graphics",
    completionKey: "symbols_graphics",
    icon: (
      <Icon
        className="transition-all delay-100 duration-200 ease-in-out"
        icon={Album02Icon}
        size={16}
        strokeWidth={2}
      />
    ),
  },
  {
    title: "Product Specifications",
    url: "/product-specifications",
    completionKey: "product_data",
    icon: (
      <Icon
        className="transition-all delay-100 duration-200 ease-in-out"
        icon={AiSheetsIcon}
        size={16}
        strokeWidth={2}
      />
    ),
  },
  {
    title: "Operational Parameters",
    url: "/operational-parameters",
    completionKey: "operational_parameters",
    icon: (
      <Icon
        className="transition-all delay-100 duration-200 ease-in-out"
        icon={FileDatabaseIcon}
        size={16}
        strokeWidth={2}
      />
    ),
  },
  {
    title: "Label Tags",
    url: "/label-tags",
    completionKey: "label_tags",
    icon: (
      <Icon
        className="transition-all delay-100 duration-200 ease-in-out"
        icon={LabelImportantIcon}
        size={16}
        strokeWidth={2}
      />
    ),
  },
];

function ProductTabCompletionDot({ isCompleted }: { isCompleted: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="img"
          aria-label={isCompleted ? "Marked complete" : "Not marked complete"}
          className={cn(
            "ml-auto size-1.5 shrink-0 rounded-full",
            isCompleted
              ? "bg-emerald-500"
              : "bg-transparent ring-1 ring-sidebar-foreground/30",
          )}
        />
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={6}
        className="pointer-events-none"
      >
        {isCompleted ? "Marked complete" : "Not marked complete"}
      </TooltipContent>
    </Tooltip>
  );
}

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
  const { data: productTabData } = useGetProductTabData(
    productId ?? "",
    "all-tabs",
  );

  const tabCompletionByUrl = React.useMemo(() => {
    const allTabsData = productTabData?.result?.data;
    if (!allTabsData) return null;

    return Object.fromEntries(
      productSubItems.map((subItem) => [
        subItem.url,
        Boolean(allTabsData[subItem.completionKey]?.tab_completed),
      ]),
    ) as Record<string, boolean>;
  }, [productTabData]);

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
                        <span>{item.icon}</span>

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
                                    className="flex w-full min-w-0 items-center gap-2"
                                  >
                                    {subItem.icon && (
                                      <span>{subItem.icon}</span>
                                    )}
                                    <span
                                      className={cn(
                                        "truncate",
                                        pathname.includes(subItem.url)
                                          ? "text-sidebar-foreground"
                                          : "text-sidebar-foreground",
                                      )}
                                    >
                                      {subItem.title}
                                    </span>
                                    {tabCompletionByUrl ? (
                                      <ProductTabCompletionDot
                                        isCompleted={
                                          tabCompletionByUrl[subItem.url]
                                        }
                                      />
                                    ) : null}
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
                <Icon icon={ArrowDown01Icon} size={16} strokeWidth={2} />
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

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
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import {
  PiArchiveDuotone,
  PiBookmarkSimpleDuotone,
  PiBookOpenDuotone,
  PiCirclesThreePlusDuotone,
  PiDatabaseDuotone,
  PiDiamondsFourDuotone,
  PiFolderOpenDuotone,
  PiGearDuotone,
  PiImageSquareDuotone,
  PiKanbanDuotone,
  PiLayoutDuotone,
  PiMicrosoftExcelLogoDuotone,
  PiPictureInPictureDuotone,
  PiStackPlusDuotone,
  PiTagChevronDuotone,
} from "react-icons/pi";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";

const data = {
  navMain: [
    {
      title: "Workspace",
      items: [
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
    title: "Product Data",
    url: "/product-data",
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
              className=""
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-lg text-foreground font-black ">
              UPREVIT
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        pathname.startsWith(item.url)
                          ? "bg-sidebar-accent border border-sidebar-border rounded text-sidebar-primary"
                          : ""
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-2">
                        {item.icon && <item.icon />}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                    {item.title === "Products" &&
                      pathname.startsWith("/products/") &&
                      pathname.split("/")[2] && (
                        <Collapsible
                          key={item.title}
                          asChild
                          defaultOpen={pathname.startsWith("/products/")}
                          className="group/collapsible"
                        >
                          <CollapsibleContent>
                            <SidebarMenuSub>
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
                                      href={`/products/${
                                        pathname.split("/")[2]
                                      }${subItem.url}`}
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
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem className="px-1 ">
            <Link href={"/settings"}>
              <button
                className={cn(
                  "cursor-pointer hover:bg-sidebar-border/50 rounded-lg py-1 flex items-center gap-2 w-full "
                )}
              >
                <div className="relative flex size-8 min-w-8 items-center justify-center overflow-hidden rounded-md bg-muted">
                  <Image
                    src="/avatars/workspace-logo.png"
                    alt="Workspace logo"
                    fill
                    className="object-cover p-1"
                  />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-medium">
                    {isLoading ? "Loading..." : workspace?.workspaceName}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {isLoading ? "Loading..." : workspace?.companyName}
                  </span>
                </div>
              </button>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarRail />
    </Sidebar>
  );
}

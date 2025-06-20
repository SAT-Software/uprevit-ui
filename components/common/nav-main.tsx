"use client";

import { ChevronRight } from "lucide-react";
import { IconType } from "react-icons";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
  open,
  isProductPage,
}: {
  items: {
    title: string;
    url: string;
    icon?: IconType;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  open: boolean;
  isProductPage: boolean;
}) {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <SidebarGroup>
      {!isProductPage && open && (
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items ? (
                <CollapsibleTrigger asChild>
                  <Link href={item.url}>
                    <SidebarMenuButton
                      className={cn(
                        pathname.startsWith(item.url)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : ""
                      )}
                      tooltip={
                        isProductPage
                          ? item.title
                          : open
                          ? undefined
                          : item.title
                      }
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>
              ) : (
                <Link href={item.url}>
                  <SidebarMenuButton
                    className={cn(
                      pathname.startsWith(item.url)
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : ""
                    )}
                    tooltip={
                      isProductPage ? item.title : open ? undefined : item.title
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              )}
              {item.items && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          className={cn(
                            pathname.includes(subItem.url)
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : ""
                          )}
                          asChild
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

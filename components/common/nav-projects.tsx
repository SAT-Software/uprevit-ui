"use client";

import { IconType } from "react-icons";

import {
  SidebarGroup,
  SidebarGroupLabel,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
export function NavProjects({
  other,
  open,
  isProductPage,
}: {
  other: {
    name: string;
    url: string;
    icon: IconType;
  }[];
  open: boolean;
  isProductPage: boolean;
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup className="">
      {!isProductPage && open && <SidebarGroupLabel>Other</SidebarGroupLabel>}

      <SidebarMenu>
        {other.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={cn(
                pathname.startsWith(item.url)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : ""
              )}
              tooltip={isProductPage ? item.name : open ? undefined : item.name}
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

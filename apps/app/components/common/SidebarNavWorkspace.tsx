"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  PiCreditCardDuotone,
  PiDotsThreeOutlineVerticalDuotone,
  PiGearDuotone,
  PiSquaresFourDuotone,
} from "react-icons/pi";
import type { Workspace } from "@/types/workspace";

export function SidebarNavWorkspace({
  workspace,
}: {
  workspace: Workspace | null | undefined;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="border border-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:border-sidebar-border data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={workspace?.logo}
                  alt={workspace?.workspaceName}
                />
                <AvatarFallback className="rounded-lg">
                  <PiSquaresFourDuotone size={20} />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {workspace?.workspaceName}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {workspace?.companyName}
                </span>
              </div>
              <PiDotsThreeOutlineVerticalDuotone className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={workspace?.logo}
                    alt={workspace?.workspaceName}
                  />
                  <AvatarFallback className="rounded-lg">
                    <PiSquaresFourDuotone size={20} />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {workspace?.workspaceName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {workspace?.companyName}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/settings?tab=workspace`}>
                  <PiGearDuotone />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/settings?tab=billing`}>
                  <PiCreditCardDuotone />
                  Billing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

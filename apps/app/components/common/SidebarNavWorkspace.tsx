"use client";

import type { Workspace } from "@/types/workspace";
import {
  ArrowDown01Icon,
  ComputerIcon,
  MenuSquareIcon,
  Moon02Icon,
  Settings01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@uprevit/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@uprevit/ui/components/ui/sidebar";
import { useTheme } from "next-themes";
import Link from "next/link";

export function SidebarNavWorkspace({
  workspace,
}: {
  workspace: Workspace | null | undefined;
}) {
  const { isMobile } = useSidebar();
  const { setTheme, theme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8  grayscale">
                <AvatarImage
                  src={workspace?.logo}
                  alt={workspace?.workspaceName}
                />
                <AvatarFallback>
                  <Icon icon={MenuSquareIcon} size={16} strokeWidth={2} />
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
              <Icon
                className="text-muted-foreground/60 group-hover:text-muted-foreground"
                icon={ArrowDown01Icon}
                size={16}
                strokeWidth={2}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 ">
                  <AvatarImage
                    src={workspace?.logo}
                    alt={workspace?.workspaceName}
                  />
                  <AvatarFallback className="">
                    <Icon icon={MenuSquareIcon} size={16} strokeWidth={2} />
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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2">
                  <Icon
                    icon={Sun01Icon}
                    size={16}
                    strokeWidth={2}
                    className="dark:hidden"
                  />
                  <Icon
                    icon={Moon02Icon}
                    size={16}
                    strokeWidth={2}
                    className="hidden dark:block"
                  />
                  Theme
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="light">
                      <Icon icon={Sun01Icon} size={16} strokeWidth={2} />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <Icon icon={Moon02Icon} size={16} strokeWidth={2} />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <Icon icon={ComputerIcon} size={16} strokeWidth={2} />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem asChild>
                <Link href={`/settings?tab=workspace`}>
                  <Icon icon={Settings01Icon} size={16} strokeWidth={2} />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

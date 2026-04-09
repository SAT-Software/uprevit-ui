"use client";

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@uprevit/ui/components/ui/sidebar";
import { useSignOut } from "@/hooks/auth/useSignOut";
import { useGetUser } from "@/hooks/user/useGetUser";
import Link from "next/link";
import {
  PiSignOutDuotone,
  PiSquaresFourDuotone,
  PiUserCircleGearDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

export function UserNav() {
  const { data: userData, isLoading } = useGetUser();
  const signOut = useSignOut();
  const user = userData?.user;

  if (isLoading)
    return <Skeleton className="h-7 w-7 rounded-full bg-border/80" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-auto p-0 hover:bg-transparent" asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="relative mr-1">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={user?.profileAvatar} alt={user?.name} />
              <AvatarFallback className="rounded-full border border-border bg-background text-foreground dark:bg-accent dark:text-accent-foreground">
                {user?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <span className="end-0 -top-0.5 absolute size-3 rounded-full border-2 border-background bg-emerald-500">
              <span className="sr-only">Online</span>
            </span>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={8}
        collisionPadding={8}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={user?.profileAvatar} alt={user?.name} />
              <AvatarFallback className="rounded-full border border-border bg-background text-foreground dark:bg-accent dark:text-accent-foreground">
                <PiUserCircleGearDuotone size={20} />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/settings?tab=profile`}>
              <PiUserDuotone />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/settings?tab=workspace`}>
              <PiSquaresFourDuotone />
              Workspace
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <PiSignOutDuotone />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

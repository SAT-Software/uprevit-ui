"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LogoutButton } from "@/components/auth/logout-button";
import { useAuthContext } from "@/hooks/use-auth";
import Link from "next/link";

export function NavUser() {
  const { user } = useAuthContext();

  const userName = user?.profile?.name || user?.profile?.preferred_username || "User";
  const userEmail = user?.profile?.email || "user@example.com";
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <SidebarMenu className="w-52">
      <SidebarMenuItem>
        <Link href="/settings">
          <SidebarMenuButton
            size="lg"
            variant="default"
            className="group hover:text-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={user?.profile?.picture} alt={userName} />
              <AvatarFallback className="rounded-full group-hover:bg-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userName}</span>
              <span className="truncate text-xs">{userEmail}</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <LogoutButton />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

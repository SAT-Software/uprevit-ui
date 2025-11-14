"use client";

// import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useGetUser } from "@/hooks/user/useGetUser";
import Link from "next/link";

export function NavUser() {
  const { data: userData } = useGetUser();
  const user = userData?.user;

  return (
    <SidebarMenu className="w-52">
      <SidebarMenuItem>
        <Link href="/settings">
          <SidebarMenuButton
            size="lg"
            variant="default"
            className="group hover:bg-accent hover:text-foreground duration-300 delay-300 ease-in-out data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={user?.profileAvatar} alt={user?.name} />
              <AvatarFallback className="rounded-full group-hover:bg-accent">
                {user?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
            {/* <ChevronsUpDown className="ml-auto size-4" /> */}
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

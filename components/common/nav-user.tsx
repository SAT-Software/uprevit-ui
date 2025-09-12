"use client";

// import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useGetUser } from "@/hooks/user/useGetUser";
import Link from "next/link";

const userDummy = {
const userDummy = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

export function NavUser() {
  const { data: userData } = useGetUser("68a1cf8c2cb63e45ad511688"); // Get the actual user id from user session when we implement auth

  const user = userData?.user;
  console.log("user", user);

  return (
    <SidebarMenu className="w-52">
      <SidebarMenuItem>
        <Link href="/settings">
          <SidebarMenuButton
            size="lg"
            variant="default"
            className="group hover:bg-accent hover:text-foreground duration-300 delay-300 ease-in-out data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            className="group hover:bg-accent hover:text-foreground duration-300 delay-300 ease-in-out data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={userDummy.avatar} alt={user?.name} />
              <AvatarFallback className="rounded-full group-hover:bg-accent">
                {user?.name.charAt(0)}
              <AvatarImage src={userDummy.avatar} alt={user?.name} />
              <AvatarFallback className="rounded-full group-hover:bg-accent">
                {user?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
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

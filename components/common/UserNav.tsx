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
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useGetUser } from "@/hooks/user/useGetUser";
import Link from "next/link";
import {
  PiCreditCardDuotone,
  PiSignOutDuotone,
  PiSquaresFourDuotone,
  PiUserCircleGearDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import { useAuth } from "react-oidc-context";
import { Skeleton } from "../ui/skeleton";

export function UserNav() {
  const auth = useAuth();
  const { isMobile } = useSidebar();
  const { data: userData, isLoading } = useGetUser();
  const user = userData?.user;

  const signOutRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
    const logoutUri = process.env.NEXT_PUBLIC_LOGOUT_URI!;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri,
    )}`;
  };

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
            <Avatar className="h-7 w-7 rounded-full">
              <AvatarImage src={user?.profileAvatar} alt={user?.name} />
              <AvatarFallback className="rounded-full">
                {user?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="-end-1 -top-1 absolute size-3 rounded-full border-2 border-background bg-emerald-500">
              <span className="sr-only">Online</span>
            </span>
          </div>
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
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={user?.profileAvatar} alt={user?.name} />
              <AvatarFallback className="rounded-full">
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
          <DropdownMenuItem asChild>
            <Link href={`/settings?tab=billing`}>
              <PiCreditCardDuotone />
              Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await auth.removeUser();
              signOutRedirect();
            }}
          >
            <PiSignOutDuotone />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

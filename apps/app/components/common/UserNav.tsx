"use client";

import { GuardedLink } from "@/components/common/GuardedLink";
import { useSignOut } from "@/hooks/auth/useSignOut";
import { useGetUser } from "@/hooks/user/useGetUser";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";
import {
  AccountSetting02Icon,
  Logout02Icon,
  MenuSquareIcon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { useAuth } from "react-oidc-context";

export function UserNav() {
  const auth = useAuth();
  const { data: userData, isLoading } = useGetUser();
  const signOut = useSignOut();
  const user = userData?.user;
  const isPlatformOperator = isPlatformOperatorProfile(auth.user?.profile);

  if (isLoading)
    return <Skeleton className="h-7 w-7 rounded-full bg-border/80" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-auto p-0 hover:bg-transparent" asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
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
                {user?.name?.charAt(0) ?? "U"}
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
            <GuardedLink href={`/settings?tab=profile`}>
              <HugeiconsIcon icon={User03Icon} size={16} strokeWidth={2} />
              Profile
            </GuardedLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <GuardedLink href={`/settings?tab=workspace`}>
              <HugeiconsIcon icon={MenuSquareIcon} size={16} strokeWidth={2} />
              Workspace
            </GuardedLink>
          </DropdownMenuItem>
          {isPlatformOperator ? (
            <DropdownMenuItem asChild>
              <GuardedLink href="/platform-admin">
                <HugeiconsIcon
                  icon={AccountSetting02Icon}
                  size={16}
                  strokeWidth={2}
                />
                Platform admin
              </GuardedLink>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <HugeiconsIcon icon={Logout02Icon} size={16} strokeWidth={2} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useGetUser } from "@/hooks/user/useGetUser";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@uprevit/ui/components/ui/avatar";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { DialogUpdateProfile } from "./DialogUpdateProfile";
import { Button } from "@uprevit/ui/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useSignOut } from "@/hooks/auth/useSignOut";
import {
  AlertCircleIcon,
  Briefcase01Icon,
  CallIcon,
  Location01Icon,
  Logout02Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { cn } from "@uprevit/ui/lib/utils";

const PROFILE_FIELDS = [
  {
    id: "designation",
    label: "Role / Designation",
    icon: Briefcase01Icon,
    key: "designation" as const,
  },
  {
    id: "email",
    label: "Email Address",
    icon: Mail01Icon,
    key: "email" as const,
  },
  {
    id: "location",
    label: "Location",
    icon: Location01Icon,
    key: "location" as const,
  },
  {
    id: "phone",
    label: "Phone Number",
    icon: CallIcon,
    key: "phone" as const,
  },
];

const profileFieldCellClassName = (index: number) =>
  cn(
    "group flex items-center gap-4 p-4",
    "border-b border-border md:[&:nth-last-child(-n+2)]:border-b-0 [&:last-child]:border-b-0",
    index % 2 === 0 && "md:border-r",
  );

function ProfileTab() {
  const auth = useAuth();
  const signOut = useSignOut();
  const { data, isLoading, error } = useGetUser();
  const userProfile = data?.user;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {/* Profile Header Skeleton */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        {/* Personal Information Skeleton */}
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex h-10 items-center justify-between border-b border-border pl-3 pr-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-7 w-24 rounded-md" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {PROFILE_FIELDS.map((field, index) => (
              <div key={field.id} className={profileFieldCellClassName(index)}>
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
          <Icon icon={AlertCircleIcon} size={16} strokeWidth={2} />
        </div>
        <div className="space-y-0.5">
          <div className="text-sm font-medium">Failed to load profile</div>
          <div className="text-sm text-muted-foreground">
            {error?.message || "An unexpected error occurred"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Profile Header */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-background p-4">
        <Avatar className="size-16">
          <AvatarImage
            src={userProfile?.profileAvatar}
            alt={userProfile?.name}
          />
          <AvatarFallback className="border border-border bg-accent text-base">{`${userProfile?.name
            ?.split(" ")[0]
            ?.slice(0, 1)}${
            userProfile?.name?.split(" ")[1]
              ? userProfile?.name?.split(" ")[1]?.slice(0, 1)?.toUpperCase()
              : ""
          }`}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h2 className="truncate text-base font-semibold">
              {userProfile?.name}
            </h2>
            <Badge variant="default">{userProfile?.userType}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your personal information and account settings.
          </p>
        </div>
        <DialogUpdateProfile userProfile={userProfile} />
      </div>

      {/* Personal Information */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border pl-3 pr-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Personal Information</p>
            <InfoTooltip content="Your personal details visible to other members of the workspace." />
          </div>
          {auth.isAuthenticated ? (
            <Button onClick={signOut} variant="destructive" size="sm" className="h-7">
              <Icon icon={Logout02Icon} size={14} strokeWidth={2} />
              Sign Out
            </Button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {PROFILE_FIELDS.map((field, index) => (
            <div key={field.id} className={profileFieldCellClassName(index)}>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-muted-foreground">
                <Icon icon={field.icon} size={16} strokeWidth={2} />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-normal text-muted-foreground/60">
                  {field.label}
                </p>
                <p className="truncate text-sm font-medium">
                  {userProfile?.[field.key] || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;

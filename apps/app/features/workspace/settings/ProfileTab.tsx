"use client";

import { useGetUser } from "@/hooks/user/useGetUser";
import { Avatar, AvatarFallback, AvatarImage } from "@uprevit/ui/components/ui/avatar";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { DialogUpdateProfile } from "./DialogUpdateProfile";
import { Button } from "@uprevit/ui/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useSignOut } from "@/hooks/auth/useSignOut";
import {
  PiEnvelopeDuotone,
  PiBriefcaseDuotone,
  PiMapPinDuotone,
  PiPhoneDuotone,
  PiSignOutDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

function ProfileTab() {
  const auth = useAuth();
  const signOut = useSignOut();
  const { data, isLoading, error } = useGetUser();
  const userProfile = data?.user;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Profile Header Skeleton */}
        <div className="flex items-center gap-6 p-6 bg-accent rounded-lg border">
          <Skeleton className="w-20 h-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        {/* Personal Information Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-44" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 border rounded-xl bg-background/50"
              >
                <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out Button Skeleton */}
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-4 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
        <div className="p-2.5 bg-destructive/10 rounded-lg shrink-0">
          <PiWarningCircleDuotone className="w-5 h-5 text-destructive" />
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
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 bg-accent rounded-lg border">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={userProfile?.profileAvatar}
              alt={userProfile?.name}
            />
            <AvatarFallback className="text-lg bg-background border border-border">{`${userProfile?.name
              ?.split(" ")[0]
              ?.slice(0, 1)}${
              userProfile?.name?.split(" ")[1]
                ? userProfile?.name?.split(" ")[1]?.slice(0, 1)?.toUpperCase()
                : ""
            }`}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-semibold">{userProfile?.name}</h2>
            <Badge variant="default">{userProfile?.userType}</Badge>
          </div>
          <p className="text-muted-foreground">
            Manage your personal information and account settings.
          </p>
        </div>
        <div>
          <DialogUpdateProfile userProfile={userProfile} />
        </div>
      </div>

      {/* Personal Information Read-Only View */}
      <div className="space-y-4">
        <div className="font-medium text-lg">Personal Information</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 hover:bg-muted/20 transition-colors">
            <div className="p-2.5 bg-muted rounded-lg shrink-0">
              <PiBriefcaseDuotone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Role / Designation
              </div>
              <div className="text-sm font-medium">
                {userProfile?.designation || "-"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 hover:bg-muted/20 transition-colors">
            <div className="p-2.5 bg-muted rounded-lg shrink-0">
              <PiEnvelopeDuotone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Email Address
              </div>
              <div className="text-sm font-medium">
                {userProfile?.email || "-"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 hover:bg-muted/20 transition-colors">
            <div className="p-2.5 bg-muted rounded-lg shrink-0">
              <PiMapPinDuotone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Location
              </div>
              <div className="text-sm font-medium">
                {userProfile?.location || "-"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border rounded-xl bg-background/50 hover:bg-muted/20 transition-colors">
            <div className="p-2.5 bg-muted rounded-lg shrink-0">
              <PiPhoneDuotone className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Phone Number
              </div>
              <div className="text-sm font-medium">
                {userProfile?.phone || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
      {auth.isAuthenticated && (
        <Button onClick={signOut} variant="destructive">
          <PiSignOutDuotone />
          Sign Out
        </Button>
      )}
    </div>
  );
}

export default ProfileTab;

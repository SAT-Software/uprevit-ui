"use client";

import { useGetUser } from "@/hooks/user/useGetUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DialogUpdateProfile } from "./DialogUpdateProfile";
import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";

function ProfileTab() {
  const auth = useAuth();
  const { data, isLoading, error } = useGetUser();
  const userProfile = data?.user;

  const signOutRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
    const logoutUri = process.env.NEXT_PUBLIC_LOGOUT_URI!;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message}</div>;

  if (!userProfile) return <div>No user profile found.</div>;

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
            <AvatarFallback className="text-lg bg-white border border-border">{`${userProfile?.name
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              Full Name
            </div>
            <div className="text-base">{userProfile?.name || "-"}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              Email Address
            </div>
            <div className="text-base">{userProfile?.email || "-"}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              Role / Designation
            </div>
            <div className="text-base">{userProfile?.designation || "-"}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              Location
            </div>
            <div className="text-base">{userProfile?.location || "-"}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              Phone Number
            </div>
            <div className="text-base">{userProfile?.phone || "-"}</div>
          </div>
        </div>
      </div>
      {auth.isAuthenticated && (
        <Button
          onClick={async () => {
            await auth.removeUser();
            signOutRedirect();
          }}
          variant="destructive"
        >
          Sign Out
        </Button>
      )}
    </div>
  );
}

export default ProfileTab;

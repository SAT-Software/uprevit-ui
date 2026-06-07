"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";

import { WorkspaceAccessFrozenScreen } from "@/components/common/WorkspaceAccessFrozenScreen";
import { useGetUser } from "@/hooks/user/useGetUser";
import { Button } from "@uprevit/ui/components/ui/button";
import { getProfileValue } from "@/utils/authProfile";
import { isWorkspaceAccessFrozenError } from "@/utils/workspaceAccessErrors";

const rippleRingSizes = [
  "h-[24rem] w-[24rem] sm:h-[42rem] sm:w-[42rem]",
  "h-[34rem] w-[34rem] sm:h-[58rem] sm:w-[58rem]",
  "h-[44rem] w-[44rem] sm:h-[75rem] sm:w-[75rem]",
  "h-[54rem] w-[54rem] sm:h-[90rem] sm:w-[90rem]",
];

export default function AppEntryPage() {
  const router = useRouter();
  const auth = useAuth();
  const {
    data: userProfileData,
    isFetching: isUserFetching,
    isError: isUserError,
    error: userError,
  } = useGetUser();

  const profile = auth.user?.profile as Record<string, unknown> | undefined;
  const userIdFromToken = getProfileValue(profile, "userId");
  const tokenWorkspaceId = getProfileValue(profile, "workspaceId");
  const tokenStatus = getProfileValue(profile, "status");
  const isAccessFrozen = isWorkspaceAccessFrozenError(userError);

  useEffect(() => {
    if (auth.isLoading || !auth.isAuthenticated || isAccessFrozen) return;
    if (userIdFromToken && isUserFetching && !isUserError) return;

    const status = userProfileData?.user?.status || tokenStatus;
    const workspaceId = userProfileData?.user?.workspaceId || tokenWorkspaceId;

    const targetPath =
      status === "invited"
        ? "/onboarding/onboard-user"
        : workspaceId
          ? "/dashboard"
          : "/onboarding/create-workspace";

    router.replace(targetPath);
  }, [
    auth.isAuthenticated,
    auth.isLoading,
    isAccessFrozen,
    isUserError,
    isUserFetching,
    router,
    tokenStatus,
    tokenWorkspaceId,
    userIdFromToken,
    userProfileData?.user?.status,
    userProfileData?.user?.workspaceId,
  ]);

  if (isAccessFrozen) {
    return <WorkspaceAccessFrozenScreen />;
  }

  const isCheckingAuthenticatedUser =
    auth.isLoading ||
    (auth.isAuthenticated &&
      userIdFromToken &&
      isUserFetching &&
      !isUserError &&
      !userProfileData);

  if (isCheckingAuthenticatedUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-accent/40">
        <p className="text-sm text-muted-foreground">
          Preparing your workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen h-full items-center justify-center overflow-hidden bg-accent/50 px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, hsl(var(--accent) / 0.36) 0%, hsl(var(--muted) / 0.22) 38%, hsl(var(--background) / 0.12) 72%, hsl(var(--background) / 0.28) 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center opacity-80">
          {rippleRingSizes.map((size) => (
            <div
              key={size}
              className={`absolute rounded-full border border-dashed border-foreground/15 bg-accent/5 ${size}`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <div className="mb-5 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-foreground shadow-lg shadow-foreground dark:bg-black">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
          Medical labeling workspace
        </div>

        <h1 className="text-balance text-5xl font-bold tracking-tighter md:text-6xl">
          Your QMS, Digitized
          <br />
          <span className="text-muted-foreground/70">
            Your Labeling, Validated
          </span>
        </h1>

        <div className="mt-6 flex max-w-2xl flex-col items-center gap-2">
          <p className="text-xl tracking-tight text-foreground">
            The unified cloud-based platform for total labeling governance
          </p>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            Streamline your global labeling process with a unified platform that
            manages labels at the data level, built for medical device teams.
          </p>
        </div>

        <Button
          size="lg"
          className="mt-10 min-w-52"
          onClick={() => auth.signinRedirect()}
        >
          Continue to sign in
        </Button>
      </div>
    </div>
  );
}

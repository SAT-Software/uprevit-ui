"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";

import { useGetUser } from "@/hooks/user/useGetUser";
import { Button } from "@uprevit/ui/components/ui/button";
import { Ripple } from "@uprevit/ui/components/ui/ripple";

const items = [
  {
    circleIndex: 0,
    content: (
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-foreground bg-neutral-100 dark:bg-neutral-500">
        <Image
          src="/CE.png"
          alt="CE symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 55,
    initialAngle: 0,
  },
  {
    circleIndex: 1,
    content: (
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-foreground bg-neutral-100 dark:bg-neutral-500">
        <Image
          src="/MD.png"
          alt="Medical device symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 35,
    reverse: true,
    initialAngle: 180,
  },
  {
    circleIndex: 2,
    content: (
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-foreground bg-neutral-100 dark:bg-neutral-500">
        <Image
          src="/DMGPKG.png"
          alt="Packaging symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 35,
    initialAngle: 90,
  },
  {
    circleIndex: 3,
    content: (
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-foreground bg-neutral-100 dark:bg-neutral-500">
        <Image
          src="/2DBarcode.png"
          alt="2D barcode"
          fill
          className="object-contain p-3"
        />
      </div>
    ),
    speed: 40,
    reverse: true,
    initialAngle: 160,
  },
  {
    circleIndex: 0,
    content: (
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-foreground bg-neutral-100 dark:bg-neutral-500">
        <Image
          src="/FDA.png"
          alt="FDA icon"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 50,
    reverse: true,
    initialAngle: 180,
  },
  {
    circleIndex: 1,
    content: (
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-foreground bg-neutral-100 dark:bg-neutral-500">
        <Image
          src="/DoNotReuse.png"
          alt="Do not reuse symbol"
          fill
          className="object-contain p-3"
        />
      </div>
    ),
    speed: 35,
    initialAngle: 0,
  },
  {
    circleIndex: 2,
    content: (
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-foreground bg-neutral-100 dark:bg-neutral-500">
        <Image
          src="/UKCA.png"
          alt="UKCA symbol"
          fill
          className="object-contain p-3"
        />
      </div>
    ),
    speed: 45,
    reverse: true,
    initialAngle: 200,
  },
  {
    circleIndex: 3,
    content: (
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-foreground bg-neutral-100 dark:bg-neutral-500">
        <Image
          src="/ISO.png"
          alt="ISO symbol"
          fill
          className="object-contain p-2"
        />
      </div>
    ),
    speed: 35,
    reverse: true,
    initialAngle: 90,
  },
];

const getProfileValue = (
  profile: Record<string, unknown> | undefined,
  key: string,
): string | undefined => {
  const value = profile?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
};

export default function AppEntryPage() {
  const router = useRouter();
  const auth = useAuth();
  const { data: userProfileData, isLoading: isUserLoading } = useGetUser();

  const profile = auth.user?.profile as Record<string, unknown> | undefined;
  const userIdFromToken = getProfileValue(profile, "userId");
  const tokenWorkspaceId = getProfileValue(profile, "workspaceId");
  const tokenStatus = getProfileValue(profile, "status");

  useEffect(() => {
    if (auth.isLoading || !auth.isAuthenticated) return;
    if (userIdFromToken && isUserLoading) return;

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
    isUserLoading,
    router,
    tokenStatus,
    tokenWorkspaceId,
    userIdFromToken,
    userProfileData?.user?.status,
    userProfileData?.user?.workspaceId,
  ]);

  const isCheckingAuthenticatedUser =
    auth.isLoading || (auth.isAuthenticated && userIdFromToken && isUserLoading);

  if (isCheckingAuthenticatedUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-accent/40">
        <p className="text-sm text-muted-foreground">Preparing your workspace...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-accent/50 px-6 py-16">
      <div className="pointer-events-none absolute inset-0">
        <Ripple items={items} />
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

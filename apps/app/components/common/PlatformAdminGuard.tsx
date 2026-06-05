"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";
import { usePlatformAdminSession } from "@/hooks/platform-admin/usePlatformAdminSession";
import { PlatformAdminLoadingShell } from "@/components/common/PlatformAdminLoadingShell";

export function PlatformAdminGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const hasCognitoGroup = isPlatformOperatorProfile(auth.user?.profile);
  const sessionQuery = usePlatformAdminSession();

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.isAuthenticated || !hasCognitoGroup) {
      toast.error("You do not have access to platform admin");
      router.replace("/dashboard");
      return;
    }

    if (sessionQuery.isError) {
      toast.error(
        sessionQuery.error instanceof Error
          ? sessionQuery.error.message
          : "Platform operator access is not enabled",
      );
      router.replace("/dashboard");
    }
  }, [
    auth.isAuthenticated,
    auth.isLoading,
    hasCognitoGroup,
    router,
    sessionQuery.error,
    sessionQuery.isError,
  ]);

  if (
    auth.isLoading ||
    !hasCognitoGroup ||
    sessionQuery.isPending ||
    sessionQuery.isError
  ) {
    return <PlatformAdminLoadingShell />;
  }

  return children;
}

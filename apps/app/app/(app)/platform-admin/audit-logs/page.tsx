"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminLoadingShell } from "@/components/common/PlatformAdminLoadingShell";

export default function PlatformAdminAuditLogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  useEffect(() => {
    if (workspaceId) {
      router.replace(`/platform-admin/workspaces/${workspaceId}`);
      return;
    }
    router.replace("/platform-admin");
  }, [router, workspaceId]);

  return (
    <PlatformAdminGuard>
      <PlatformAdminLoadingShell />
    </PlatformAdminGuard>
  );
}

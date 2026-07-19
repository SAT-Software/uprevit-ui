"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlatformAdminGuard } from "@/components/common/PlatformAdminGuard";
import { PlatformAdminLoadingShell } from "@/components/common/PlatformAdminLoadingShell";

export default function PlatformAdminWorkspaceLogsPage() {
  const params = useParams<{ workspaceId: string }>();
  const router = useRouter();
  const workspaceId = params.workspaceId;

  useEffect(() => {
    if (workspaceId) {
      router.replace(`/platform-admin/workspaces/${workspaceId}`);
    }
  }, [router, workspaceId]);

  return (
    <PlatformAdminGuard>
      <PlatformAdminLoadingShell />
    </PlatformAdminGuard>
  );
}

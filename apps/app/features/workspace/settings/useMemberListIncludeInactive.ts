"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";
import { isAdminProfile } from "@/utils/isAdmin";
import { useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";

export function useMemberListIncludeInactive() {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const { data: workspaceData } = useGetWorkspace();

  const workspace = workspaceData?.workspace;
  const workspaceId = auth.user?.profile?.workspaceId as string | undefined;
  const workspaceDefault = Boolean(workspace?.memberListIncludeInactive);

  const [includeInactive, setIncludeInactive] = useState(workspaceDefault);

  useEffect(() => {
    setIncludeInactive(workspaceDefault);
  }, [workspaceDefault]);

  const toggleIncludeInactive = useCallback(
    async (next: boolean) => {
      setIncludeInactive(next);

      if (!isAdmin || !workspace || !workspaceId) return;

      try {
        const accessToken = auth.user?.access_token;
        if (!accessToken) return;

        const response = await fetch(`/api/workspace`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...workspace,
            _id: workspaceId,
            memberListIncludeInactive: next,
          }),
        });

        if (!response.ok) {
          throw new Error(
            await getResponseErrorMessage(
              response,
              "Failed to save member list preference",
            ),
          );
        }

        queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      } catch (error) {
        setIncludeInactive(!next);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to save member list preference";
        toast.error(message);
      }
    },
    [auth.user?.access_token, isAdmin, queryClient, workspace, workspaceId],
  );

  return {
    isAdmin,
    includeInactive: isAdmin ? includeInactive : false,
    toggleIncludeInactive,
  };
}

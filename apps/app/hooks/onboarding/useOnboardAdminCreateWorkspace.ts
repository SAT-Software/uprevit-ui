"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

export type OnboardAdminWorkspacePayload = {
  workspaceName: string;
  companyName: string;
  description?: string;
  logo?: string;
  logoSizeBytes?: number;
  name?: string;
  email?: string;
  cognitoSub: string;
  profileAvatar?: string;
  designation?: string;
};

export function useOnboardAdminCreateWorkspace() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (payload: OnboardAdminWorkspacePayload) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) throw new Error("User is not authenticated");

      const response = await fetch("/api/onboarding/admin/workspace", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Failed to create workspace")
        );
      }

      return response.json().catch(() => null);
    },
    onSuccess: async () => {
      toast.success("Workspace created successfully");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["workspace"] }),
        queryClient.invalidateQueries({ queryKey: ["user"] }),
      ]);

      try {
        await auth.signinSilent();
        router.replace("/dashboard");
        return;
      } catch (silentRefreshError) {
        console.warn("Silent auth refresh failed, redirecting to refresh claims", silentRefreshError);
      }

      try {
        await auth.signinRedirect();
      } catch (redirectError) {
        console.error("Session refresh redirect failed", redirectError);
        router.replace("/auth/callback");
      }
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to create workspace");
      console.error(message);
      toast.error(message);
    },
  });
}

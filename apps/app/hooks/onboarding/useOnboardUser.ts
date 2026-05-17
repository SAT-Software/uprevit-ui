"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

export type OnboardUserPayload = {
  user_id: string;
  profileAvatar?: string;
  name: string;
  designation: string;
  location?: string;
  phone?: string;
};

export function useOnboardUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (payload: OnboardUserPayload) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) throw new Error("User is not authenticated");

      const response = await fetch("/api/onboarding/user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Failed to update user profile")
        );
      }

      return response.json().catch(() => null);
    },
    onSuccess: async () => {
      toast.success("Profile updated successfully");
      await queryClient.invalidateQueries({
        queryKey: ["user", auth.user?.profile.userId],
      });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Failed to update user profile");
      console.error(message);
      toast.error(message);
    },
  });
}

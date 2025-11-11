"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
        const text = await response.text().catch(() => "");
        throw new Error(text || "Failed to update user profile");
      }

      return response.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["user", auth.user?.profile.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error(error.message || "Failed to update user profile");
      toast.error(error.message || "Failed to update user profile");
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Workspace } from "@/types/workspace";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

async function updateWorkspace(
  workspaceData: Workspace,
  {
    signal,
    accessToken,
  }: {
    signal: AbortSignal;
    accessToken: string;
  }
) {
  const response = await fetch(`/api/workspace`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workspaceData),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to update workspace");
  }

  const data = await response.json();
  return data;
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (workspaceData: Workspace) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const controller = new AbortController();
      return updateWorkspace(workspaceData, {
        signal: controller.signal,
        accessToken,
      });
    },
    onSuccess: (_, data) => {
      toast.success("Workspace updated successfully");
      if (data?._id) {
        queryClient.invalidateQueries({ queryKey: ["workspace", data._id] });
      }
    },
    onError: (error) => {
      console.error(error.message || "Failed to update workspace");
      toast.error("Failed to update workspace");
    },
  });
}

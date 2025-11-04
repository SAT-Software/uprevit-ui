import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Workspace } from "@/types/workspace";
import { toast } from "sonner";

async function updateWorkspace(
  workspaceData: Workspace,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(`/api/workspace`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
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

  return useMutation({
    mutationFn: (workspaceData: Workspace) =>
      updateWorkspace(workspaceData, { signal: new AbortController().signal }),
    onSuccess: (_, data) => {
      toast.success("Workspace updated successfully");
      queryClient.invalidateQueries({ queryKey: ["workspace", data._id] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to update workspace");
      toast.error("Failed to update workspace");
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ isArchived: true }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to archive project");
      }
      return res.json().catch(() => null);
    },
    onSuccess: async (data) => {
      console.log("Project archived successfully", data);
      queryClient.invalidateQueries({ queryKey: ["projects"] }); // Need to review this in projects integration time
      queryClient.invalidateQueries({ queryKey: ["project-list"] }); // Need to review this in projects integration time
    },
  });
}

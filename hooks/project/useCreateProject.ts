import { Project } from "@/types/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProject: Project) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(newProject),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to create project");
      }
      return res.json().catch(() => null);
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
    },
    onError: (error) => {
      console.error(error.message || "Failed to create project");
      toast.error("Failed to create project");
    },
  });
}

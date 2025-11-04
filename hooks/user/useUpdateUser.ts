import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import { toast } from "sonner";

async function updateUser(
  userData: Partial<User>,
  { signal }: { signal: AbortSignal }
) {
  const response = await fetch(`/api/users`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to update user");
  }

  const data = await response.json();
  return data;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) =>
      updateUser(userData, { signal: new AbortController().signal }),
    onSuccess: (data) => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.setQueryData(["user", data.user?.id], data);
    },
    onError: (error) => {
      console.error(error.message || "Failed to update user profile");
      toast.error("Failed to update user profile");
    },
  });
}

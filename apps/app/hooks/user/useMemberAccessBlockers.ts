import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseError } from "@/lib/api-error";
import type { MemberAccess, MemberAccessBlockers } from "@/types/user";

export function useMemberAccessBlockers(
  userId: string | undefined,
  access: MemberAccess,
  enabled: boolean,
) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["member-access-blockers", userId, access],
    enabled: enabled && !!userId,
    staleTime: 0,
    gcTime: 0,
    queryFn: async ({ signal }): Promise<MemberAccessBlockers> => {
      const response = await fetch(`/api/users/${userId}/access`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...access, dryRun: true }),
        signal,
      });
      if (!response.ok) {
        throw await getResponseError(response, "Failed to check access");
      }
      const body = await response.json();
      return body.blockers;
    },
  });
}

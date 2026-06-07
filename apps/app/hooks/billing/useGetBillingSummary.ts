import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import type { WorkspaceBillingSummary } from "@/types/billing";

export function useGetBillingSummary() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["billing", "summary"],
    queryFn: async ({ signal }) => {
      const token = auth.user?.access_token;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch("/api/billing/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal,
      });

      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Failed to load billing summary"),
        );
      }

      const json = await response.json();
      return json.data as WorkspaceBillingSummary;
    },
    enabled: auth.isAuthenticated,
  });
}

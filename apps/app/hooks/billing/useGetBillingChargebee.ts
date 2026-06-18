import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import type { BillingChargebeeDetail } from "@/types/billing";

export function useGetBillingChargebee() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["billing", "chargebee"],
    queryFn: async ({ signal }) => {
      const token = auth.user?.access_token;
      if (!token) throw new Error("Not authenticated");

      const response = await fetch("/api/billing/chargebee", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal,
      });

      if (!response.ok) {
        throw new Error(
          await getResponseErrorMessage(response, "Failed to load billing information"),
        );
      }

      const json = await response.json();
      return json.data as BillingChargebeeDetail;
    },
    enabled: auth.isAuthenticated,
  });
}

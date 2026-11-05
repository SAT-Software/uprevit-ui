import { useMutation } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import type { ImportCheckResult } from "@/types/product-import";

export interface ImportCheckInput {
  plan_numbers: string[];
  projects: string[];
}

export function useCheckProductImport() {
  const auth = useAuth();

  return useMutation({
    mutationFn: async (input: ImportCheckInput): Promise<ImportCheckResult> => {
      const res = await fetch("/api/products/import/check", {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "The file couldn't be checked against your workspace. Check your connection and upload it again."),
        );
      }
      return res.json();
    },
  });
}

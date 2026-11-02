import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import type { ImportCreateResult } from "@/types/product-import";

export const IMPORT_BATCH_SIZE = 25;

export interface ImportProductPayload {
  product_plan_number: string;
  product_name: string;
  product_description: string;
  target_date: string | null;
  project_id?: string;
  new_project?: { department_name: string; project_name: string; project_number: string };
  product_information: Record<string, string>;
  custom_fields: Array<{ label: string; value: string }>;
  compliance: Array<{ standard: string; standard_description: string }>;
  languages: Array<{ code: string; name: string; country: string }>;
  label_components: Array<{
    component_number: string;
    component_type: string;
    component_description: string;
    dimensions: string;
    label_type: string[];
    print_direction: string;
  }>;
}

export function useImportProducts() {
  const auth = useAuth();
  const queryClient = useQueryClient();

  const importBatch = useCallback(
    async (products: ImportProductPayload[]): Promise<ImportCreateResult[]> => {
      const res = await fetch("/api/products/import", {
        method: "POST",
        body: JSON.stringify({ products }),
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(await getResponseErrorMessage(res, "The products couldn't be created"));
      }
      const data = await res.json();
      return data.results ?? [];
    },
    [auth.user?.access_token],
  );

  const refreshLists = useCallback(() => {
    for (const queryKey of [["all-products"], ["products-infinite"], ["all-projects"], ["projects-infinite"], ["all-departments"], ["departments-infinite"]]) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [queryClient]);

  return { importBatch, refreshLists };
}

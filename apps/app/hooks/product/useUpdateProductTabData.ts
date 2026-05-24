import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";
import type {
  LegendItem,
  OptimisticContext,
  ProductTabDataResponse,
  UpdateLegendPayload,
  UpdateProductTabDataParams,
} from "@/types/product-tab-data";

const isLegendUpdatePayload = (
  data: UpdateProductTabDataParams["data"],
): data is UpdateLegendPayload => {
  if (!data || Array.isArray(data) || typeof data !== "object") {
    return false;
  }
  const candidate = data as Partial<UpdateLegendPayload>;
  return (
    typeof candidate.id === "string" &&
    Array.isArray(candidate.legend_items)
  );
};

const updateLegendItemsInCache = (
  previousData: ProductTabDataResponse | undefined,
  labelTagId: string,
  legendItems: LegendItem[],
): ProductTabDataResponse | undefined => {
  if (!previousData?.result?.data) {
    return previousData;
  }

  const currentItems = previousData.result.data.data;
  if (!Array.isArray(currentItems)) {
    return previousData;
  }

  const nextItems = currentItems.map((item) =>
    item._id === labelTagId ? { ...item, legend_items: legendItems } : item,
  );

  return {
    ...previousData,
    result: {
      ...previousData.result,
      data: {
        ...previousData.result.data,
        data: nextItems,
      },
    },
  };
};

export function useUpdateProductTabData() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (params: UpdateProductTabDataParams) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch("/api/products/productData", {
        method: "PATCH",
        body: JSON.stringify(params),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to update product tab data"),
        );
      }
      return res.json().catch(() => null);
    },
    onMutate: async (
      params: UpdateProductTabDataParams,
    ): Promise<OptimisticContext | undefined> => {
      if (
        params.tab !== "label-tags" ||
        params.action !== "update_label_tag_legend" ||
        !isLegendUpdatePayload(params.data)
      ) {
        return undefined;
      }

      const queryKey = ["product-tab-data", params.id, params.tab] as const;
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<ProductTabDataResponse>(queryKey);
      const nextData = updateLegendItemsInCache(
        previousData,
        params.data.id,
        params.data.legend_items,
      );

      if (nextData && nextData !== previousData) {
        queryClient.setQueryData(queryKey, nextData);
      }

      return {
        queryKey,
        previousData,
        didOptimisticUpdate: nextData !== previousData,
      };
    },
    onSuccess: () => {
      toast.success("Changes were saved successfully");
      queryClient.invalidateQueries({ queryKey: ["product-tab-data"] });
      queryClient.invalidateQueries({ queryKey: ["product-diff-redline"] });
    },
    onError: (error, _params, context) => {
      const message = getErrorMessage(error, "Failed to make changes");
      console.error(message);
      if (context?.didOptimisticUpdate && context.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
        toast.error(`${message} Changes were reverted.`);
        return;
      }
      toast.error(message);
    },
  });
}

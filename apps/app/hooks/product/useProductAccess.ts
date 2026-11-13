import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import type { GetAllTabsResponse } from "@/types/product";

/** What the current user may do with the product open in the product pages. */
export function useProductAccess() {
  const params = useParams();
  const productId = typeof params.productId === "string" ? params.productId : "";
  const { data } = useGetProductTabData(productId, "all-tabs") as {
    data?: GetAllTabsResponse;
  };
  const product = data?.result?.data?.product_information?.product_data?.data;
  const capabilities = product?.capabilities;

  return {
    product,
    capabilities,
    canEdit: capabilities?.canEdit ?? false,
    canManageTeam: capabilities?.canManageTeam ?? false,
    lockedMessage: capabilities?.lockedReason ?? "This version can't be edited",
  };
}

import { useParams } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import type { GetAllTabsResponse, ProductTeam } from "@/types/product";
import { isAdminProfile } from "@/utils/isAdmin";
import {
  getProductLockedMessage,
  getProductRole,
  PRODUCT_EDIT_FORBIDDEN_MESSAGE,
} from "@/utils/product/product-lifecycle";

export function useProductRole(product?: ProductTeam) {
  const auth = useAuth();
  const role = getProductRole(
    product,
    auth.user?.profile?.userId as string | undefined,
    isAdminProfile(auth.user?.profile),
  );

  return {
    role,
    canEdit: role !== "viewer",
    canManageTeam: role === "owner" || role === "admin",
  };
}

/** Access of the current user to the product open in the product pages. */
export function useProductAccess() {
  const params = useParams();
  const productId = typeof params.productId === "string" ? params.productId : "";
  const { data } = useGetProductTabData(productId, "all-tabs") as {
    data?: GetAllTabsResponse;
  };
  const product = data?.result?.data?.product_information?.product_data?.data;
  const access = useProductRole(product);

  return {
    ...access,
    product,
    lockedMessage: access.canEdit
      ? getProductLockedMessage(product)
      : PRODUCT_EDIT_FORBIDDEN_MESSAGE,
  };
}

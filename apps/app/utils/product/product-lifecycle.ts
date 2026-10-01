import type { Product, ProductStatus, ProductTeam } from "@/types/product";

const CONTENT_LOCKED_STATUSES: ProductStatus[] = [
  "in_review",
  "released",
  "obsolete",
];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In Review",
  released: "Released",
  obsolete: "Obsolete",
};

export const isProductContentLocked = (status?: ProductStatus) =>
  !!status && CONTENT_LOCKED_STATUSES.includes(status);

export const canCreateProductVersion = (
  product: Pick<Product, "status" | "is_latest">,
) => product.status === "released" && product.is_latest !== false;

export type ProductRole = "owner" | "contributor" | "admin" | "viewer";

export const PRODUCT_EDIT_FORBIDDEN_MESSAGE =
  "Only the Product Owner, Contributors, or an admin can edit.";

export const getProductRole = (
  product: ProductTeam | undefined,
  userId: string | undefined,
  isAdmin: boolean,
): ProductRole => {
  if (userId && product?.owner_user_id === userId) return "owner";
  if (isAdmin) return "admin";
  if (userId && product?.contributor_user_ids?.includes(userId))
    return "contributor";
  return "viewer";
};

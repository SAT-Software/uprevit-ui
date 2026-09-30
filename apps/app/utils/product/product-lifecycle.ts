import type { Product, ProductStatus } from "@/types/product";

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

import type { ProductDataContent, ProductStatus } from "@/types/product";

const CONTENT_LOCKED_STATUSES: ProductStatus[] = ["released", "obsolete"];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In Review",
  released: "Released",
  obsolete: "Obsolete",
};

export const PRODUCT_COMPLETION_TAB_COUNT = 7;

export const getProductProgressColor = (
  percentage: number,
  status?: ProductStatus | null,
) => {
  if (status && status !== "draft")
    return "from-violet-400 via-violet-500 to-violet-600";
  if (percentage >= 100) return "from-emerald-400 via-emerald-500 to-emerald-600";
  if (percentage >= 70) return "from-sky-400 via-sky-500 to-sky-600";
  if (percentage >= 40) return "from-amber-400 via-amber-500 to-amber-600";
  return "from-slate-400 via-slate-500 to-slate-600";
};

export const isProductContentLocked = (status?: ProductStatus) =>
  !!status && CONTENT_LOCKED_STATUSES.includes(status);

export const getProductInReviewMessage = (
  product?: Pick<ProductDataContent, "active_workflow"> | null,
) =>
  `This product is in review${product?.active_workflow ? ` (${product.active_workflow.numberLabel})` : ""}. Approvers will be notified of any change you save.`;

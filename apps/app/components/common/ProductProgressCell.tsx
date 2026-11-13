"use client";

import {
  getCompletedProductTabs,
  getProductProgressBar,
  PRODUCT_TABS,
  type ProductTabCompletion,
} from "@/lib/product-tabs";
import { ProductProgressHoverCard } from "./ProductProgressHoverCard";

export function ProductProgressCell({
  product,
}: {
  product: ProductTabCompletion & {
    status?: string;
    complete_count?: number;
    product_name: string;
  };
}) {
  const progress = product.complete_count || 0;
  const percentage = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <ProductProgressHoverCard
      percentage={percentage}
      colorClass={getProductProgressBar(product.status, percentage)}
      size={18}
      strokeWidth={2}
      progress={progress}
      product_name={product.product_name}
      tabsCompleted={getCompletedProductTabs(product).length}
      totalTabs={PRODUCT_TABS.length}
    />
  );
}

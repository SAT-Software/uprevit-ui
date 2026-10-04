"use client";

import { ArrowRight01Icon, WorkflowIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { GuardedLink } from "@/components/common/GuardedLink";
import { useProductAccess } from "@/hooks/product/useProductAccess";
import { getProductInReviewMessage } from "@/utils/product/product-lifecycle";

export function ProductInReviewBanner() {
  const { product, canEdit } = useProductAccess();
  if (product?.status !== "in_review") return null;
  const workflow = product.active_workflow;

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
      <Icon icon={WorkflowIcon} size={16} className="shrink-0" />
      <p className="min-w-0 flex-1">
        {canEdit
          ? getProductInReviewMessage(product)
          : `This product is in review${workflow ? ` (${workflow.numberLabel})` : ""}.`}
      </p>
      {workflow ? (
        <GuardedLink
          href={`/workflows/${workflow.id}`}
          className="inline-flex shrink-0 items-center gap-1 font-medium underline-offset-4 hover:underline"
        >
          View workflow
          <Icon icon={ArrowRight01Icon} size={14} />
        </GuardedLink>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Blockchain03Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { toast } from "sonner";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { ProductCombobox } from "@/components/common/ProductCombobox";
import { ProductProgressHoverCard } from "@/components/common/ProductProgressHoverCard";
import { ProductStatusBadge } from "@/components/common/ProductStatusBadge";
import { AuditMetaCell } from "@/components/table/AuditMetaCell";
import { ProductOwnerCell } from "@/features/workspace/products/ProductMemberAvatar";
import { useUpdateWorkflow } from "@/hooks/workflow/useWorkflows";
import type { WorkflowDetail, WorkflowProductDetail } from "@/types/workflow";
import { ConfirmWorkflowRemovalDialog } from "./ConfirmWorkflowRemovalDialog";
import {
  getProductProgressColor,
  PRODUCT_COMPLETION_TAB_COUNT,
} from "@/utils/product/product-lifecycle";

function ProductNameCell({ product }: { product: WorkflowProductDetail }) {
  const warning = product.isArchived
    ? "Archived"
    : !product.isLatest
      ? "Newer version exists"
      : null;

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <Link
          href={`/products/${product.productVersionId}/product-information`}
          className="truncate text-sm font-medium hover:underline underline-offset-2"
          title={product.name}
        >
          {product.name}
        </Link>
        <Badge variant="secondary" className="font-mono text-[11px]">
          v{product.version}
        </Badge>
      </div>
      <span className="truncate text-xs text-muted-foreground">
        {product.planNumber}
        {warning ? (
          <span className="text-amber-600 dark:text-amber-400">
            {" "}
            · {warning}
          </span>
        ) : null}
      </span>
    </div>
  );
}

function ProductProgressCell({ product }: { product: WorkflowProductDetail }) {
  const percentage = Math.max(0, Math.min(100, product.completeCount ?? 0));

  return (
    <ProductProgressHoverCard
      percentage={percentage}
      colorClass={getProductProgressColor(percentage, product.status)}
      progress={percentage}
      product_name={product.name}
      tabsCompleted={Math.round(
        (percentage / 100) * PRODUCT_COMPLETION_TAB_COUNT,
      )}
      totalTabs={PRODUCT_COMPLETION_TAB_COUNT}
    />
  );
}

export function WorkflowProductsTab({ workflow }: { workflow: WorkflowDetail }) {
  const { mutate: updateWorkflow, isPending } = useUpdateWorkflow(workflow._id);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeTarget, setRemoveTarget] =
    useState<WorkflowProductDetail | null>(null);

  const confirmRemoveProduct = () => {
    if (!removeTarget) return;
    const { lineageId, name } = removeTarget;
    updateWorkflow(
      { action: "remove-product", lineageId },
      {
        onSuccess: () => {
          setRemoveOpen(false);
          toast.success(`${name} removed`);
        },
      },
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/60 py-1 pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Products</p>
          <InfoTooltip content="The latest version of each Product is reviewed and released together." />
        </div>
        {workflow.canEdit ? (
          <div className="w-72">
            <ProductCombobox
              value=""
              placeholder="Add a Product…"
              statuses={["draft", "submitted"]}
              excludeIds={workflow.products.flatMap((product) => [
                product.lineageId,
                product.productVersionId,
              ])}
              disabled={isPending}
              onValueChange={(productId, product) =>
                productId &&
                updateWorkflow(
                  { action: "add-product", productId },
                  {
                    onSuccess: () =>
                      toast.success(
                        `${product?.product_name ?? "Product"} added`,
                      ),
                  },
                )
              }
            />
          </div>
        ) : null}
      </div>

      {workflow.products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
          <div className="flex items-center justify-center rounded-full border border-border bg-background p-4 shadow-sm">
            <Icon icon={Blockchain03Icon} className="text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No Products yet</p>
            <p className="text-xs text-muted-foreground">
              {workflow.canEdit
                ? "Add the Products this workflow should approve."
                : "The Initiator hasn't added any Products."}
            </p>
          </div>
        </div>
      ) : (
        <Table className="min-w-200">
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[27%]">Product</TableHead>
              <TableHead className="w-[12%]">Status</TableHead>
              <TableHead className="w-[11%]">Progress</TableHead>
              <TableHead className="w-[18%]">Owner</TableHead>
              <TableHead className="w-[16%]">Created</TableHead>
              <TableHead className="w-[16%]">Modified</TableHead>
              {workflow.canEdit ? (
                <TableHead className="w-14 text-center">
                  <span className="sr-only">Actions</span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflow.products.map((product) => (
              <TableRow key={product.lineageId}>
                <TableCell>
                  <ProductNameCell product={product} />
                </TableCell>
                <TableCell>
                  {product.status ? (
                    <ProductStatusBadge status={product.status} />
                  ) : (
                    <span className="text-muted-foreground">Missing</span>
                  )}
                </TableCell>
                <TableCell className="py-0">
                  <ProductProgressCell product={product} />
                </TableCell>
                <TableCell>
                  <ProductOwnerCell
                    owner={product.team.find(
                      (member) => member.relationship === "product_owner",
                    )}
                  />
                </TableCell>
                <TableCell>
                  <AuditMetaCell
                    name={product.createdBy}
                    date={product.createdOn}
                  />
                </TableCell>
                <TableCell>
                  <AuditMetaCell
                    name={product.modifiedBy}
                    date={product.modifiedOn}
                  />
                </TableCell>
                {workflow.canEdit ? (
                  <TableCell className="py-0 text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Remove ${product.name}`}
                          disabled={isPending}
                          onClick={() => {
                            setRemoveTarget(product);
                            setRemoveOpen(true);
                          }}
                        >
                          <Icon icon={Delete02Icon} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Remove it and its Product Team approvers
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {workflow.canEdit ? (
        <ConfirmWorkflowRemovalDialog
          open={removeOpen}
          onOpenChange={setRemoveOpen}
          title="Remove Product"
          message={
            <>
              Are you sure you want to remove{" "}
              <strong>{removeTarget?.name}</strong> from this workflow? Its
              Product Team approvers will be removed too.
            </>
          }
          onConfirm={confirmRemoveProduct}
          isPending={isPending}
        />
      ) : null}
    </section>
  );
}

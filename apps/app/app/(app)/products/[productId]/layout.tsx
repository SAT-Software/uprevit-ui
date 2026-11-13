"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ExportJobsSheet from "@/features/workspace/exports/ExportJobsSheet";
import { ProductHeader } from "@/features/workspace/products/product/ProductHeader";
import { ProductInReviewBanner } from "@/features/workspace/products/product/ProductInReviewBanner";
import {
  ACTIVE_EXPORT_JOB_STATUSES,
  hasActiveExportJobs,
  useGetExportJobs,
} from "@/hooks/exports/useExportJobs";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [exportsOpen, setExportsOpen] = useState(false);
  const params = useParams();
  const productId =
    typeof params.productId === "string"
      ? params.productId
      : Array.isArray(params.productId)
        ? params.productId[0]
        : undefined;
  const compareVersionId = useSearchParams().get("compareVersion");
  const { isError: isComparisonError, refetch: retryComparison } =
    useGetProductDiffRedline(productId, compareVersionId);

  const { data: exportJobsData } = useGetExportJobs(
    "products",
    { status: ACTIVE_EXPORT_JOB_STATUSES, targetId: productId },
    { enabled: Boolean(productId), activePollIntervalMs: 10000 },
  );

  const hasActiveExport = hasActiveExportJobs(exportJobsData);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ProductHeader isExportLocked={hasActiveExport} />
      <ProductInReviewBanner />
      <ExportJobsSheet
        resource="products"
        open={exportsOpen}
        onOpenChange={setExportsOpen}
        showTrigger={false}
      />
      <div className="relative flex flex-1 flex-col min-h-0 bg-background">
        {compareVersionId && isComparisonError ? (
          <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <h2 className="text-base font-semibold">Unable to compare versions</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              One or more product versions could not be loaded. Try again or choose another version.
            </p>
            <Button variant="outline" onClick={() => void retryComparison()}>
              Try again
            </Button>
          </div>
        ) : children}
        {hasActiveExport ? (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-accent/80 backdrop-blur-[2px]">
            <div className="mx-4 flex max-w-md items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
              <Spinner className="mt-0.5 size-4" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Export in progress
                </p>
                <p className="text-xs text-muted-foreground">
                  Editing is temporarily disabled for this product until export
                  completes. You can switch to another product.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-3"
                  onClick={() => setExportsOpen(true)}
                >
                  View Exports
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

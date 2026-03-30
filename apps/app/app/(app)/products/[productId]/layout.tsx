"use client";

import Link from "next/link";
import { Button } from "@uprevit/ui/components/ui/button";
import { ProductHeader } from "@/features/workspace/products/product/ProductHeader";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useGetProductExportJobs } from "@/hooks/product/useGetProductExportJobs";
import { ExportJobStatus } from "@/types/export-job";
import { useParams } from "next/navigation";

const ACTIVE_EXPORT_JOB_STATUSES: ExportJobStatus[] = ["queued", "processing"];

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const productId =
    typeof params.productId === "string"
      ? params.productId
      : Array.isArray(params.productId)
        ? params.productId[0]
        : undefined;

  const { data: exportJobsData } = useGetProductExportJobs(
    {
      page: 1,
      status: ACTIVE_EXPORT_JOB_STATUSES,
      targetId: productId,
    },
    {
      enabled: Boolean(productId),
      pollWhenActive: true,
      activePollIntervalMs: 10000,
    },
  );

  const hasActiveExport =
    typeof exportJobsData?.result.hasActiveJobs === "boolean"
      ? exportJobsData.result.hasActiveJobs
      : (exportJobsData?.result.jobs ?? []).some((job) =>
          ACTIVE_EXPORT_JOB_STATUSES.includes(job.status),
        );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ProductHeader isExportLocked={hasActiveExport} />
      <div className="relative flex flex-1 flex-col min-h-0 bg-accent/60">
        {children}
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
                <Button asChild size="sm" variant="secondary" className="mt-3">
                  <Link href="/products/exports">View Export Jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

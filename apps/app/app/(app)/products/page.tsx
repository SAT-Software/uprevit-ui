"use client";

import ProductsPageProductTable from "@/features/workspace/products/ProductsPageProductTable";
import CreateProductDialog from "@/features/workspace/products/CreateProductDialog";
import { Button } from "@/components/ui/button";
import { useGetProductExportJobs } from "@/hooks/product/useGetProductExportJobs";
import { ExportJobStatus } from "@/types/export-job";
import Link from "next/link";
import { PiClockDuotone } from "react-icons/pi";

const ACTIVE_EXPORT_JOB_STATUSES: ExportJobStatus[] = ["queued", "processing"];

function ProductsPage() {
  const { data: exportJobsData } = useGetProductExportJobs(
    { page: 1 },
    { enabled: true, pollWhenActive: true },
  );

  const productExportJobs = exportJobsData?.result.jobs ?? [];
  const activeProductExportCount =
    typeof exportJobsData?.result.activeJobsCount === "number"
      ? exportJobsData.result.activeJobsCount
      : productExportJobs.filter((job) =>
          ACTIVE_EXPORT_JOB_STATUSES.includes(job.status),
        ).length;
  const latestProductExportJob = productExportJobs[0];

  const renderProductExportIndicator = () => {
    if (activeProductExportCount > 0) {
      return (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {activeProductExportCount}
        </span>
      );
    }

    if (latestProductExportJob?.status === "failed") {
      return <span className="h-2 w-2 rounded-full bg-destructive" />;
    }

    if (latestProductExportJob?.status === "completed") {
      return <span className="h-2 w-2 rounded-full bg-emerald-500" />;
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">All Products</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Manage and view all products in your workspace
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/products/exports" className="gap-1.5">
                <PiClockDuotone />
                Product Exports
                {renderProductExportIndicator()}
              </Link>
            </Button>
            <CreateProductDialog />
          </div>
        </div>
        <ProductsPageProductTable />
      </div>
    </div>
  );
}

export default ProductsPage;

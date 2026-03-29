"use client";

import { ProductExportsTable } from "@/features/workspace/products/ProductExportsTable";

export default function ProductExportsPage() {
  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">Product Exports</h1>
            <div className="hidden h-1 w-1 rounded-full border border-border bg-border sm:block" />
            <p className="hidden text-xs font-medium text-muted-foreground sm:block">
              Track queued exports and download completed files
            </p>
          </div>
        </div>

        <ProductExportsTable />
      </div>
    </div>
  );
}

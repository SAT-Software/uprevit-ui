"use client";

import { ProductExportsTable } from "@/features/workspace/products/ProductExportsTable";
import Link from "next/link";
import { PiArrowLeft } from "react-icons/pi";

export default function ProductExportsPage() {
  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/products"
              className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <PiArrowLeft className="h-3.5 w-3.5" />
              Go Back
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold">Product Exports</h1>
              <div className="hidden h-1 w-1 rounded-full border border-border bg-border sm:block" />
              <p className="hidden text-xs font-medium text-muted-foreground sm:block">
                Track queued exports and download completed files
              </p>
            </div>
          </div>
        </div>

        <ProductExportsTable />
      </div>
    </div>
  );
}

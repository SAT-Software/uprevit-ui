"use client";

import { ProductSpecificationDataTable } from "@/features/workspace/products/product/product-data-table/ProductSpecificationDataTable";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useParams } from "next/navigation";
import { PiTableDuotone, PiWarningCircleDuotone } from "react-icons/pi";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;

  const {
    data: productInfoData,
    isLoading,
    error,
  } = useGetProductTabData(productId, "product-information");

  const productName =
    productInfoData?.result?.data?.data?.product_name || "Product";

  const isSubmitted =
    productInfoData?.result?.data?.product_data?.data?.status === "submitted";

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
          </div>
          <div className="px-4 pb-4 flex-1">
            <div className="h-full w-full bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-destructive/10">
                <PiWarningCircleDuotone className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-destructive">
                  Error Loading Product Data
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {error.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2 p-2 min-h-0 overflow-hidden">
      <div className="flex flex-col border border-border bg-background rounded-xl w-full h-full min-h-0">
        <div className="flex items-center justify-between border-b border-border p-2 shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Product Data Table</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              Manage product data in the table below
            </p>
          </div>
          {/* Buttons will go here */}
        </div>

        <ProductSpecificationDataTable />
      </div>
    </div>
  );
}

"use client";

import AddStandardDialog from "@/features/workspace/products/product/compliance-information/AddStandardDialog";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import {
  PiShieldCheckDuotone,
  PiHouseDuotone,
  PiCaretRightDuotone,
  PiCertificateDuotone,
} from "react-icons/pi";
import EditStandardDialog from "@/features/workspace/products/product/compliance-information/EditStandardDialog";
import DeleteStandardDialog from "@/features/workspace/products/product/compliance-information/DeleteStandardDialog";
import Link from "next/link";

interface ComplianceItem {
  _id: string;
  standard: string;
  standard_description: string;
}

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;

  const { data, isLoading, error } = useGetProductTabData(
    productId,
    "all-tabs"
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        {/* Breadcrumbs Skeleton */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
          <div className="h-4 w-4 bg-background rounded animate-pulse" />
          <div className="h-3 w-3 bg-background rounded animate-pulse" />
          <div className="h-4 w-20 bg-background rounded animate-pulse" />
          <div className="h-3 w-3 bg-background rounded animate-pulse" />
          <div className="h-4 w-32 bg-background rounded animate-pulse" />
          <div className="h-3 w-3 bg-background rounded animate-pulse" />
          <div className="h-4 w-40 bg-background rounded animate-pulse" />
        </div>

        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          {/* Header Section Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 items-start justify-between border-b p-6 border-border">
            <div className="flex items-center gap-2">
              <div className="h-5 w-48 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
          </div>

          {/* Content Skeleton */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-4 border border-border rounded-xl bg-card"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                    <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors flex items-center"
          >
            <PiHouseDuotone className="w-4 h-4" />
          </Link>
          <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
          <Link
            href="/products"
            className="hover:text-foreground transition-colors"
          >
            Products
          </Link>
          <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-foreground font-medium">
            Compliance Information
          </span>
        </div>

        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-destructive/10">
                <PiShieldCheckDuotone className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-destructive">
                  Error Loading Standards
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

  const standards =
    (data?.result?.data?.compliance_information?.data as ComplianceItem[]) ||
    [];

  const productName =
    data?.result?.data?.product_information?.data?.product_name || "Product";

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors flex items-center"
        >
          <PiHouseDuotone className="w-4 h-4" />
        </Link>
        <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
        <Link
          href="/products"
          className="hover:text-foreground transition-colors"
        >
          Products
        </Link>
        <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
        <span className="truncate max-w-[200px]">{productName}</span>
        <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          Compliance Information
        </span>
      </div>

      <div className="flex flex-col gap-2 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-2 border-b border-border p-4">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Compliance Standards</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              Regulatory standards and certifications for this product
            </p>
          </div>
          <AddStandardDialog productId={productId} />
        </div>

        {/* Standards Content */}
        <div className="p-4">
          {standards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="p-4 rounded-full bg-muted">
                <PiCertificateDuotone className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  No Standards Added
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Add compliance standards and certifications to track
                  regulatory requirements for this product.
                </p>
              </div>
              <AddStandardDialog productId={productId} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {standards.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-3 p-4 border border-border rounded-xl bg-card hover:bg-accent/5 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10 text-green-600 group-hover:bg-green-500/20 transition-colors">
                        <PiShieldCheckDuotone className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-base text-foreground truncate">
                        {item.standard}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <EditStandardDialog
                        productId={productId}
                        standards={item}
                      />
                      <DeleteStandardDialog
                        productId={productId}
                        standardId={item._id}
                        standardName={item.standard}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {item.standard_description || "No description provided."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
  PiHouseDuotone,
  PiCaretRightDuotone,
  PiCalendarDuotone,
  PiGlobeDuotone,
  PiFlagDuotone,
  PiBuildingsDuotone,
  PiFlaskDuotone,
  PiTagDuotone,
} from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ProductInformationCustomFieldEditDialog from "@/features/workspace/products/product/product-information/ProductInfoCustomFieldEditDialog";
import EditProductDialog from "@/features/workspace/products/product/product-information/ProductInfoEditProductDialog";
import { AuditLog } from "@/types/audit-log";
import { useMemo } from "react";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;

  const { data, isLoading, isError } = useGetProductTabData(
    productId,
    "product-information"
  );

  const productData = { ...data?.result?.data?.data, id: productId };
  const productAuditLog = data?.result?.data?.auditLogs;

  console.log(productData, productAuditLog);

  const auditLogs = (productAuditLog as AuditLog[]) || [];
  const creationLog = auditLogs.find((log) => log.action === "create");
  const latestUpdateLog = auditLogs
    .filter((log) => log.action === "update")
    .sort(
      (a, b) => new Date(b.actionAt).getTime() - new Date(a.actionAt).getTime()
    )[0];

  const formatAuditDate = (isoDate: string) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return isoDate;
    }

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const fields = useMemo(() => {
    if (!productData) return [];
    const baseFields = [
      {
        label: "Market / Geography",
        value: productData.market_geography || "N/A",
        icon: PiGlobeDuotone,
      },
      {
        label: "Country of Origin",
        value: productData.country_of_origin || "N/A",
        icon: PiFlagDuotone,
      },
      {
        label: "OEM / Contract manufactured",
        value: productData.oem_contract_manufacturer || "N/A",
        icon: PiBuildingsDuotone,
      },
      {
        label: "Commercial / Clinical",
        value: productData.commercial_clinical || "N/A",
        icon: PiFlaskDuotone,
      },
    ];

    if (productData.custom_fields && productData.custom_fields.length > 0) {
      const customFieldsWithIcons = productData.custom_fields.map(
        (field: any) => ({
          ...field,
          icon: PiTagDuotone,
        })
      );
      return [...baseFields, ...customFieldsWithIcons];
    }

    return baseFields;
  }, [productData]);

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
        </div>

        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          {/* Header Section Skeleton */}
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b p-6 border-border">
            <div className="flex flex-col gap-3 w-full min-w-0">
              <div className="flex flex-col gap-1">
                <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-12 w-full max-w-2xl bg-muted rounded animate-pulse" />
            </div>

            {/* Actions & Meta Skeleton */}
            <div className="flex flex-col items-start md:items-end gap-4 shrink-0 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="h-9 w-24 bg-muted rounded-md animate-pulse" />
                <div className="h-9 w-24 bg-muted rounded-md animate-pulse" />
              </div>
              <div className="flex flex-col items-start md:items-end gap-2 w-full">
                <div className="h-7 w-48 bg-muted rounded-lg animate-pulse" />
                <div className="h-7 w-52 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6">
            <div className="h-64 w-full bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !productData) return notFound();

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
        <span className="truncate max-w-[200px]">
          {productData.product_name || "Product Details"}
        </span>
        <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          Product Information
        </span>
      </div>

      <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 justify-between border-b p-6 border-border">
          <div className="flex flex-col gap-3 w-full min-w-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {productData.product_name || "N/A"}
                </h1>
                <Badge variant="outline" className="font-normal">
                  <div
                    className={cn("w-2 h-2 rounded-full mr-1", {
                      "bg-green-500": productData.status === "submitted",
                      "bg-blue-500": productData.status === "draft",
                      "bg-gray-500": productData.status === "archived",
                    })}
                  />
                  {productData.status || "N/A"}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-none">
              {productData.product_description || "No description available."}
            </p>
            <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground w-full mt-auto">
              <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start ">
                <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Target:{" "}
                  <span className="font-semibold">
                    {productData?.target_date
                      ? productData?.target_date.slice(0, 10)
                      : "N/A"}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start ">
                <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Actual:{" "}
                  <span className="font-semibold">
                    {productData?.actual_completion_date
                      ? productData?.actual_completion_date.slice(0, 10)
                      : "N/A"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Meta */}
          <div className="flex flex-col items-start md:items-end gap-4 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <EditProductDialog product={productData!} />
              <ProductInformationCustomFieldEditDialog product={productData!} />
            </div>

            {/* Audit Badges */}
            <div className="flex flex-col items-start md:items-end gap-2 text-xs text-muted-foreground w-full mt-auto">
              {creationLog && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start md:justify-end">
                  <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Created {formatAuditDate(creationLog.actionAt)} -{" "}
                    <span className="font-semibold">
                      {creationLog.actionBy}
                    </span>
                  </span>
                </div>
              )}
              {latestUpdateLog && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start md:justify-end">
                  <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Updated {formatAuditDate(latestUpdateLog.actionAt)} -{" "}
                    <span className="font-semibold">
                      {latestUpdateLog.actionBy}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="flex flex-col gap-2 px-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Product Information</p>
              <div className="w-1 h-1 bg-border border border-border rounded-full" />
              <p className="text-xs text-muted-foreground font-medium">
                Key product details and custom fields
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-3 p-4 border border-border rounded-xl bg-card hover:bg-accent/5 transition-all duration-200 group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent text-foreground group-hover:bg-accent/60 transition-colors">
                    <field.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground truncate">
                    {field.label}
                  </span>
                </div>
                <div
                  className="font-semibold text-lg text-foreground pl-1 truncate"
                  title={field.value}
                >
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { ProductWorkbookTabPage } from "@/features/workspace/products/product/product-data-table/ProductWorkbookTabPage";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { type ProductDataTableSchema } from "@/types/product-data-table";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId ?? "";
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;

  const {
    data: productTabData,
    isLoading,
    error,
  } = useGetProductTabData(productId, "product-specifications");

  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId,
    compareVersionId,
  );

  const workbookData = productTabData?.result?.data?.data?.workbook_data as
    | ProductDataTableSchema
    | undefined;
  const isSubmitted =
    productTabData?.result?.data?.product_data?.data?.status === "submitted";
  const baseVersionWorkbook = diffData?.result?.base_version?.product_data?.data
    ?.workbook_data as ProductDataTableSchema | undefined;
  const nextVersionWorkbook = diffData?.result?.next_version?.product_data?.data
    ?.workbook_data as ProductDataTableSchema | undefined;

  return (
    <ProductWorkbookTabPage
      productId={productId}
      tab="product-specifications"
      action="add_product_data"
      title="Product Specifications"
      subtitle="Manage product data in the table below"
      redlineBannerLabel="Redline View: Product Specifications"
      errorTitle="Error Loading Product Data"
      isLoading={isLoading}
      error={error}
      workbookData={workbookData}
      isSubmitted={isSubmitted}
      isRedlineView={isRedlineView}
      isLoadingDiff={isLoadingDiff}
      baseVersionWorkbook={baseVersionWorkbook}
      nextVersionWorkbook={nextVersionWorkbook}
    />
  );
}

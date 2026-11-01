"use client";

import { ProductWorkbookTabPage } from "@/features/workspace/products/product/product-data-table/ProductWorkbookTabPage";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { type ProductDataTableSchema } from "@/types/product-data-table";
import { useParams, useSearchParams } from "next/navigation";
import { isProductContentLocked } from "@/utils/product/product-lifecycle";
import { useProductAccess } from "@/hooks/product/useProductAccess";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId ?? "";
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;

  const {
    data: operationalTabData,
    isPending: isLoading,
    error,
    refetch,
  } = useGetProductTabData(productId, "operational-parameters");

  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId,
    compareVersionId,
  );

  const workbookData = operationalTabData?.result?.data?.data
    ?.workbook_data as ProductDataTableSchema | undefined;
  const { canEdit } = useProductAccess();
  const isContentLocked =
    isProductContentLocked(
      operationalTabData?.result?.data?.product_data?.data?.status,
    ) || !canEdit;
  const baseVersionWorkbook =
    diffData?.result?.base_version?.operational_parameters?.data
      ?.workbook_data as ProductDataTableSchema | undefined;
  const nextVersionWorkbook =
    diffData?.result?.next_version?.operational_parameters?.data
      ?.workbook_data as ProductDataTableSchema | undefined;

  return (
    <ProductWorkbookTabPage
      productId={productId}
      tab="operational-parameters"
      action="add_operational_parameters"
      title="Operational Parameters"
      subtitle="Manage operational parameters in the table below"
      redlineBannerLabel="Redline View: Operational Parameters"
      errorTitle="Failed to load operational parameters"
      isLoading={isLoading}
      error={error}
      onRetry={() => refetch()}
      workbookData={workbookData}
      isContentLocked={isContentLocked}
      isRedlineView={isRedlineView}
      isLoadingDiff={isLoadingDiff}
      baseVersionWorkbook={baseVersionWorkbook}
      nextVersionWorkbook={nextVersionWorkbook}
    />
  );
}

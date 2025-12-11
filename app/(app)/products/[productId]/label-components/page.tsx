"use client";

import ProductComponentDetailsTable from "@/features/workspace/products/product/component-details/ProductComponentDetailsTable";
import AddComponentDialog from "@/features/workspace/products/product/component-details/AddComponentDialog";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import Link from "next/link";
import { PiHouseDuotone, PiCaretRightDuotone } from "react-icons/pi";

interface ComponentItem {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
}

interface LabelComponentItem {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
}

export default function Page() {
  const { productId } = useParams<{ productId: string }>();

  // Fetch Label Components Data
  const {
    data: componentsData,
    isLoading: isLoadingComponents,
    error: componentsError,
  } = useGetProductTabData(productId as string, "label-components");

  // Fetch Product Information for Header
  const { data: productInfoData, isLoading: isLoadingProduct } =
    useGetProductTabData(productId as string, "product-information");

  const productData = productInfoData?.result?.data?.data
    ? { ...productInfoData.result.data.data, id: productId }
    : null;

  // Check if product is submitted - disable editing buttons
  const isSubmitted =
    productInfoData?.result?.data?.product_data?.data?.status === "submitted";

  const isLoading = isLoadingComponents || isLoadingProduct;

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
          {/* Content Skeleton */}
          <div className="p-6">
            <div className="h-64 w-full bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (componentsError) {
    return (
      <div className="flex flex-col gap-4 p-4 text-destructive">
        Error loading label components: {componentsError.message}
      </div>
    );
  }

  const components = (componentsData?.result?.data?.data || []).map(
    (item: LabelComponentItem) => ({
      _id: item._id,
      component_number: item.component_number || "",
      image: item.image || "",
      component_description: item.component_description || "",
      label_type: item.label_type || [],
      dimensions: item.dimensions || "",
      component_type: item.component_type || "",
    })
  ) as ComponentItem[];

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
          {productData?.product_name || "Product Details"}
        </span>
        <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          Label Components
        </span>
      </div>

      <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        {/* Label Components Section */}
        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Label Components</p>
              <div className="w-1 h-1 bg-border border border-border rounded-full" />
              <p className="text-xs text-muted-foreground font-medium">
                Manage label components for this product
              </p>
            </div>
            <AddComponentDialog
              productId={productId as string}
              isSubmitted={isSubmitted}
            />
          </div>
          <ProductComponentDetailsTable
            data={components}
            isSubmitted={isSubmitted}
          />
        </div>
      </div>
    </div>
  );
}

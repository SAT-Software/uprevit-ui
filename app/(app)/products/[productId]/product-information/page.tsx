"use client";

import { Separator } from "@/components/ui/separator";
import ProductInformationCard from "@/features/products/product/product-information/ProductInfoCard";
import ProductInformationCustomFieldEditDialog from "@/features/products/product/product-information/ProductInfoCustomFieldEditDialog";
import EditProductDialog from "@/features/products/product/product-information/ProductInfoEditProductDialog";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { CalendarDays, User } from "lucide-react";
import { notFound, useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;

  const { data, isLoading, isError } = useGetProductTabData(
    productId,
    "product-information"
  );

  console.log("data", data);

  const productData = { ...data?.result?.data?.data, id: productId };

  if (isLoading || !productData) {
    return (
      <div className="w-full">
        <div className="flex flex-col mb-8">
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-semibold mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (isError) return notFound();

  return (
    <div className="w-full">
      <div className="flex flex-col mb-8">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-semibold mb-4">
            {productData?.product_name || "N/A"}
          </h1>
          <div className="flex items-center gap-2">
            <EditProductDialog product={productData!} />
            <ProductInformationCustomFieldEditDialog product={productData!} />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />{" "}
              <span>Target Date: {productData?.target_date || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />{" "}
              <span>
                Actual Completion:{" "}
                {productData?.actual_completion_date || "N/A"}
              </span>
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />{" "}
              <span>Status: {productData?.status || "N/A"}</span>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />{" "}
              <span>Complete Count: {productData?.complete_count || "0"}</span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-base font-medium mb-1">Description</h2>
          <p className="text-sm text-muted-foreground">
            {productData?.product_description || "No description available."}
          </p>
        </div>
      </div>
      <ProductInformationCard
        marketGeography={productData?.market_geography}
        countryOfOrigin={productData?.country_of_origin}
        oemContractManufacturer={productData?.oem_contract_manufacturer}
        commercialClinical={productData?.commercial_clinical}
        customFields={productData?.custom_fields}
      />
    </div>
  );
}

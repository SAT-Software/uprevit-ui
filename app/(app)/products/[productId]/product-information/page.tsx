"use client";

import { useMemo } from "react";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarDays, User } from "lucide-react";
import Link from "next/link";
import ProductInformationCard from "@/features/products/product/product-information/ProductInformationCard";
import EditProductDialog from "@/features/products/product/product-information/ProductInformationEditProductDialog";
import ProductInformationCustomFieldEditDialog from "@/features/products/product/product-information/ProductInformationCustomFieldEditDialog";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";

import { PiCirclesThreePlusDuotone, PiKanbanDuotone } from "react-icons/pi";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;

  const { data, isLoading, isError } = useGetProductTabData(
    productId,
    "product-information"
  );

  const productData = useMemo(() => data?.result?.data?.data, [data]);

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={
                      productData?.department_id
                        ? `/departments/${productData.department_id}`
                        : "#"
                    }
                  >
                    <Button size="icon" variant="ghost">
                      <PiCirclesThreePlusDuotone className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Department</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={
                      productData?.project_id
                        ? `/projects/${productData.project_id}`
                        : "#"
                    }
                  >
                    <Button size="icon" variant="ghost">
                      <PiKanbanDuotone className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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

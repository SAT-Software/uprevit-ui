"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PiCheckCircleDuotone,
  PiCircleDuotone,
  PiDownloadDuotone,
  PiGitBranchDuotone,
  PiGitMergeDuotone,
  PiPaperPlaneRightDuotone,
} from "react-icons/pi";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { Product } from "@/types/product";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProgressRadialChart } from "./ProgressRadialChart";

export type Item = {
  productId: string;
  createdOn: string;
  createdBy: string;
  modifiedOn: string;
  modifiedBy: string;
  productName: string;
  description: string;
  projectId: string;
  departmentId: string;
  version: string;
  status: "Submitted" | "Draft" | "Archived";
  targetDate: number;
  completionDate: number | null;
  delayReason: string | null;
  tabsCompleted: string[];
  completionPercentage: number;
};

const TOTAL_TABS = 7;

export function ProductHeader() {
  const params = useParams();
  const pathname = usePathname();
  const { data: productsData } = useGetAllProducts();
  const { mutateAsync: updateProductTabData, isPending: isUpdatingTab } =
    useUpdateProductTabData();
  const { mutateAsync: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct();

  const getCurrentTab = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  };

  const currentTab = getCurrentTab();
  const productId = params.productId as string;

  const { data } = useGetAllProducts();
  const currentProduct = productId
    ? data?.result.products?.find((p: Product) => p._id === productId)
    : null;

  const isProductComplete = currentProduct?.complete_count === 100;

  const handleSubmit = () => {
    if (!currentProduct?._id) return;
    updateProduct({
      _id: currentProduct._id,
      action: "update-status",
      data: {
        status: "submitted",
      },
    });
  };

  const foundProduct =
    productId && productsData?.result.products
      ? productsData.result.products.find((p: Product) => p._id === productId)
      : null;

  const [tabsCompleted, setTabsCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (foundProduct) {
      const completed: string[] = [];
      if (foundProduct.product_information?.tab_completed)
        completed.push("product-information");
      if (foundProduct.compliance_information?.tab_completed)
        completed.push("compliance-information");
      if (foundProduct.label_components?.tab_completed)
        completed.push("label-components");
      if (foundProduct.symbols_graphics?.tab_completed)
        completed.push("symbols-graphics");
      if (foundProduct.product_data?.tab_completed)
        completed.push("product-data");
      if (foundProduct.operational_parameters?.tab_completed)
        completed.push("operational-parameters");
      if (foundProduct.label_tags?.tab_completed) completed.push("label-tags");
      setTabsCompleted(completed);
    }
  }, [foundProduct]);

  const product: Item | null = foundProduct
    ? {
        productId: foundProduct._id || "",
        createdOn: foundProduct.action_at || "",
        createdBy: foundProduct.action_by || "",
        modifiedOn: foundProduct.action_at || "",
        modifiedBy: foundProduct.action_by || "",
        productName: foundProduct.product_name || "",
        description: "",
        projectId: foundProduct.project_id || "",
        departmentId: foundProduct.department_id || "",
        version: foundProduct.master_version || "1.0",
        status:
          (foundProduct.status as "Submitted" | "Draft" | "Archived") ||
          "Draft",
        targetDate: foundProduct.target_date || "N/A",
        completionDate: foundProduct.target_date || "N/A",
        delayReason: null,
        tabsCompleted: tabsCompleted,
        completionPercentage: Math.round(
          (tabsCompleted.length / TOTAL_TABS) * 100
        ),
      }
    : null;
  const completionPercentage = product?.completionPercentage ?? 0;

  const isCurrentTabCompleted =
    product && currentTab ? product.tabsCompleted.includes(currentTab) : false;

  const handleToggleTab = async () => {
    if (!currentTab || !product || isUpdatingTab || isUpdatingProduct) return;

    const updatedTabsCompleted = isCurrentTabCompleted
      ? tabsCompleted.filter((tab: string) => tab !== currentTab)
      : [...tabsCompleted, currentTab];

    const newCompletionPercentage = Math.round(
      (updatedTabsCompleted.length / TOTAL_TABS) * 100
    );

    // Map URL tab to backend tab name
    const tabMapping: Record<string, string> = {
      "product-information": "product-information",
      "compliance-information": "compliance-information",
      "label-components": "label-components",
      "symbols-graphics": "symbols-graphics",
      "product-data": "product-data",
      "operational-parameters": "operational-parameters",
      "label-tags": "label-tags",
    };

    const actionMapping: Record<string, string> = {
      "product-information": "update_product_information_completion",
      "compliance-information": "update_compliance_tab_completion",
      "label-components": "update_label_component_tab_completion",
      "symbols-graphics": "update_symbols_graphics_tab_completion",
      "product-data": "update_product_data_tab_completion",
      "operational-parameters": "update_operational_parameters_tab_completion",
      "label-tags": "update_label_tags_tab_completion",
    };

    const backendTabName = tabMapping[currentTab];
    const actionName = actionMapping[currentTab];

    if (backendTabName) {
      // Run both API calls in parallel
      // Each hook's onSuccess will invalidate queries automatically
      await Promise.all([
        updateProductTabData({
          id: productId,
          action: actionName,
          tab: backendTabName,
          data: {
            tab_completed: !isCurrentTabCompleted,
          },
        }),
        updateProduct({
          _id: productId,
          action: "update-product",
          data: {
            _id: productId,
            complete_count: newCompletionPercentage,
          },
        }),
      ]);
    }
  };

  return (
    <header
      className={cn(
        "flex w-full shrink-0 items-center justify-between px-2 gap-2 border-b border-input transition-[width,height] ease-linear ",
        "h-12 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-muted-foreground bg-muted" />

        <Separator orientation="vertical" className=" h-4" />
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <PiGitMergeDuotone />
            New version
          </Button>
          <Button variant="secondary" size="sm">
            <PiDownloadDuotone />
            Export
          </Button>
          <Select value={product?.version} disabled={!product}>
            <SelectTrigger className="h-7 rounded-lg gap-2 px-2 has-[>svg]:px-2 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80">
              <PiGitBranchDuotone />
              <SelectValue placeholder="View Versions" />
            </SelectTrigger>
            <SelectContent>
              {product?.version && (
                <SelectItem value={product.version}>
                  Version {product.version}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="flex items-center gap-0.5 h-7">
            <p className="text-xs font-normal mt-0.5">v</p>
            <p className="text-sm font-semibold text-foreground">
              {currentProduct?.master_version.slice(0, 1)}
            </p>
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <ProgressRadialChart completionPercentage={completionPercentage} />

          {/* <div className="flex items-center gap-2">
            <div
              className={cn(
                "text-xs font-medium",
                completionPercentage === 100
                  ? "text-green-600"
                  : completionPercentage >= 50
                  ? "text-yellow-600"
                  : "text-muted-foreground"
              )}
            >
              Progress: {completionPercentage}%
            </div>
            <div className="text-xs text-muted-foreground">
              {product?.tabsCompleted.length || 0}/{TOTAL_TABS}
            </div>
          </div> */}

          <Button
            variant={isCurrentTabCompleted ? "secondary" : "secondary"}
            size="sm"
            onClick={handleToggleTab}
            disabled={
              !currentTab || !product || isUpdatingTab || isUpdatingProduct
            }
            className={cn(
              "gap-2 text-xs",
              isCurrentTabCompleted
                ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isUpdatingTab || isUpdatingProduct ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {isCurrentTabCompleted ? "Uncompleting..." : "Completing..."}
              </>
            ) : isCurrentTabCompleted ? (
              <>
                <PiCheckCircleDuotone className="w-4 h-4" />
                Mark Incomplete
              </>
            ) : (
              <>
                <PiCircleDuotone className="w-4 h-4" />
                Mark Complete
              </>
            )}
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={!isProductComplete}
              onClick={handleSubmit}
              className={cn(
                !isProductComplete && "opacity-50 cursor-not-allowed"
              )}
              title={
                !isProductComplete
                  ? "Complete all tabs to enable submission"
                  : "Submit product"
              }
            >
              <PiPaperPlaneRightDuotone />
              Submit
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

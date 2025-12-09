"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PiCircleDuotone,
  PiDownloadDuotone,
  PiGitBranchDuotone,
  PiPaperPlaneRightDuotone,
  PiTextStrikethroughDuotone,
} from "react-icons/pi";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ProgressRadialChart } from "./ProgressRadialChart";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";

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
  const productId = params.productId as string;

  const { data: productData } = useGetProductTabData(productId, "all-tabs");
  const { mutateAsync: updateProductTabData, isPending: isUpdatingTab } =
    useUpdateProductTabData();
  const { mutateAsync: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct();

  const getCurrentTab = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  };

  const currentTab = getCurrentTab();

  // Extract data from the all-tabs API response
  // productData.result.data contains all tab objects with their tab_completed flags
  // Product info (status, master_version, complete_count, etc.) is in product_information.data
  const allTabsData = productData?.result?.data;
  const productInfo = allTabsData?.product_information?.data;

  const isProductComplete = productInfo?.complete_count === 100;

  const handleSubmit = () => {
    if (!productId) return;
    updateProduct({
      _id: productId,
      action: "update-status",
      data: {
        status: "submitted",
      },
    });
  };

  // Calculate completed tabs from the all-tabs response
  const tabsCompleted = useMemo(() => {
    if (!allTabsData) return [];
    const completed: string[] = [];
    if (allTabsData.product_information?.tab_completed)
      completed.push("product-information");
    if (allTabsData.compliance_information?.tab_completed)
      completed.push("compliance-information");
    if (allTabsData.label_components?.tab_completed)
      completed.push("label-components");
    if (allTabsData.symbols_graphics?.tab_completed)
      completed.push("symbols-graphics");
    if (allTabsData.product_data?.tab_completed) completed.push("product-data");
    if (allTabsData.operational_parameters?.tab_completed)
      completed.push("operational-parameters");
    if (allTabsData.label_tags?.tab_completed) completed.push("label-tags");
    return completed;
  }, [allTabsData]);

  const product: Item | null = productInfo
    ? {
        productId: productId || "",
        createdOn: "",
        createdBy: "",
        modifiedOn: "",
        modifiedBy: "",
        productName: productInfo.product_name || "",
        description: productInfo.product_description || "",
        projectId: "",
        departmentId: "",
        version: productInfo.master_version || "1.0",
        status:
          (productInfo.status as "Submitted" | "Draft" | "Archived") || "Draft",
        targetDate: productInfo.target_date || "N/A",
        completionDate: productInfo.actual_completion_date || "N/A",
        delayReason: null,
        tabsCompleted: tabsCompleted,
        completionPercentage: productInfo.complete_count ?? 0,
      }
    : null;

  const completionPercentage = productInfo?.complete_count ?? 0;

  const isCurrentTabCompleted = currentTab
    ? tabsCompleted.includes(currentTab)
    : false;

  const completedTabsCount = tabsCompleted.length;
  const isSyncingStatus = isUpdatingTab || isUpdatingProduct;

  const toggleButtonTitle = isSyncingStatus
    ? isCurrentTabCompleted
      ? "Unmarking..."
      : "Marking complete..."
    : isCurrentTabCompleted
    ? "Mark Incomplete"
    : "Mark Complete";

  const toggleButtonSubtitle = isSyncingStatus
    ? "Syncing with workspace"
    : isCurrentTabCompleted
    ? "Send back to in-progress"
    : "Mark this tab completed";

  const toggleButtonIcon = isSyncingStatus ? (
    <Spinner className="size-3" />
  ) : isCurrentTabCompleted ? (
    <PiCircleDuotone className="size-3 text-emerald-600" />
  ) : (
    <PiCircleDuotone className="size-3" />
  );

  const toggleButtonClasses = cn(
    "group text-left text-xs flex items-center gap-2 cursor-pointer font-semibold leading-tight transition-all disabled:text-muted-foreground py-1 px-2 rounded-lg border bg-accent",
    isCurrentTabCompleted ? "text-foreground" : "text-foreground"
  );

  const toggleButtonIconClasses = cn(
    "flex size-7 items-center justify-center rounded-xl border text-base transition-colors border-border bg-muted/60 text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground",
    isCurrentTabCompleted
      ? "dark:bg-emerald-500/20 dark:text-emerald-100"
      : "dark:border-border/80 dark:bg-muted/40"
  );

  const handleToggleTab = async () => {
    if (!currentTab || !product || isSyncingStatus) return;

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
        "flex w-full shrink-0 flex-wrap items-center justify-between gap-3 border-b border-input px-2 py-2 transition-[width,height] ease-linear md:flex-nowrap md:py-0",
        "md:h-12 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-muted-foreground bg-muted" />

        <Separator orientation="vertical" className=" h-4" />
        <div className="flex items-center gap-2">
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
          <Button variant="secondary" size="sm">
            <PiTextStrikethroughDuotone />
            View Redline
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
          <ProgressRadialChart
            completionPercentage={completionPercentage}
            completedTabsCount={completedTabsCount}
            totalTabs={TOTAL_TABS}
          />

          <button
            onClick={handleToggleTab}
            disabled={!currentTab || !product || isSyncingStatus}
            className={toggleButtonClasses}
          >
            <span className={toggleButtonIconClasses}>{toggleButtonIcon}</span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xs font-semibold">{toggleButtonTitle}</span>
              <span className="text-[0.65rem] font-medium text-muted-foreground">
                {toggleButtonSubtitle}
              </span>
            </span>
          </button>
          {/* <Button variant="secondary" size="sm">
            <PiCircleDuotone />
            {isCurrentTabCompleted ? "Tab Completed" : "Tab in Draft"}
          </Button> */}
        </div>
        <div className="flex items-center gap-4">
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

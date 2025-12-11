"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

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
  PiLockKeyDuotone,
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
import { Badge } from "@/components/ui/badge";
import { useGetAllProductVersions } from "@/hooks/product/useGetAllProductVersions";
import { Product } from "@/types/product";

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
  version: number;
  isLatest: boolean;
  parentId: string | null;
  status: "submitted" | "draft" | "archived";
  targetDate: string | null;
  completionDate: string | null;
  delayReason: string | null;
  tabsCompleted: string[];
  completionPercentage: number;
};

const TOTAL_TABS = 7;

export function ProductHeader() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const productId = params.productId as string;

  const { data: productData } = useGetProductTabData(productId, "all-tabs");
  const { data: versionsData, isLoading: isLoadingVersions } =
    useGetAllProductVersions(productId);
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
  // Each tab now has a product_data object with core product info including version fields
  const allTabsData = productData?.result?.data;

  // Product core data (including version, is_latest, status) is now in product_data.data
  const productCoreData = allTabsData?.product_information?.product_data?.data;

  // Tab-specific data is in the data field
  const productInfoData = allTabsData?.product_information?.data;

  const isProductComplete = productCoreData?.complete_count === 100;

  // READ-ONLY MODE: Submitted products cannot be edited
  const isReadOnly = productCoreData?.status === "submitted";

  const handleSubmit = () => {
    if (!productId || isReadOnly) return;
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

  const product: Item | null = productCoreData
    ? {
        productId: productId || "",
        createdOn: "",
        createdBy: "",
        modifiedOn: "",
        modifiedBy: "",
        productName: productCoreData.product_name || "",
        description: productCoreData.product_description || "",
        projectId: productCoreData.project_id || "",
        departmentId: productCoreData.department_id || "",
        version: productCoreData.version || 1,
        isLatest: productCoreData.is_latest ?? true,
        parentId: productCoreData.parent_id || null,
        status: productCoreData.status || "draft",
        targetDate: productCoreData.target_date || null,
        completionDate: productCoreData.actual_completion_date || null,
        delayReason: null,
        tabsCompleted: tabsCompleted,
        completionPercentage: productCoreData.complete_count ?? 0,
      }
    : null;

  const completionPercentage = productCoreData?.complete_count ?? 0;

  const isCurrentTabCompleted = currentTab
    ? tabsCompleted.includes(currentTab)
    : false;

  const completedTabsCount = tabsCompleted.length;
  const isSyncingStatus = isUpdatingTab || isUpdatingProduct;

  // Handle version change - navigate to different version
  const handleVersionChange = (versionId: string) => {
    if (versionId !== productId) {
      // Navigate to the same tab but with different product version
      router.push(`/products/${versionId}/${currentTab}`);
    }
  };

  const toggleButtonTitle = isSyncingStatus
    ? isCurrentTabCompleted
      ? "Unmarking..."
      : "Marking complete..."
    : isReadOnly
    ? "Submitted"
    : isCurrentTabCompleted
    ? "Mark Incomplete"
    : "Mark Complete";

  const toggleButtonSubtitle = isSyncingStatus
    ? "Syncing with workspace"
    : isReadOnly
    ? "This product is submitted"
    : isCurrentTabCompleted
    ? "Send back to in-progress"
    : "Mark this tab completed";

  const toggleButtonIcon = isSyncingStatus ? (
    <Spinner className="size-3" />
  ) : isReadOnly ? (
    <PiLockKeyDuotone className="size-3 text-amber-600" />
  ) : isCurrentTabCompleted ? (
    <PiCircleDuotone className="size-3 text-emerald-600" />
  ) : (
    <PiCircleDuotone className="size-3" />
  );

  const toggleButtonClasses = cn(
    "group text-left text-xs flex items-center gap-2 font-semibold leading-tight transition-all disabled:text-muted-foreground py-1 px-2 rounded-lg border bg-accent",
    isReadOnly ? "cursor-not-allowed opacity-70" : "cursor-pointer",
    isCurrentTabCompleted ? "text-foreground" : "text-foreground"
  );

  const toggleButtonIconClasses = cn(
    "flex size-7 items-center justify-center rounded-xl border text-base transition-colors border-border bg-muted/60 text-muted-foreground",
    isReadOnly
      ? "dark:bg-amber-500/20 dark:text-amber-100"
      : isCurrentTabCompleted
      ? "dark:bg-emerald-500/20 dark:text-emerald-100 group-hover:border-foreground/30 group-hover:text-foreground"
      : "dark:border-border/80 dark:bg-muted/40 group-hover:border-foreground/30 group-hover:text-foreground"
  );

  const handleToggleTab = async () => {
    // Prevent any changes if product is submitted (read-only)
    if (!currentTab || !product || isSyncingStatus || isReadOnly) return;

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

  // Get versions list for dropdown
  const versions = versionsData?.result?.versions || [];

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

          {/* Version Dropdown - Shows all versions */}
          <Select
            value={productId}
            onValueChange={handleVersionChange}
            disabled={!product || isLoadingVersions}
          >
            <SelectTrigger className="h-7 rounded-lg gap-2 px-2 has-[>svg]:px-2 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80">
              <PiGitBranchDuotone />
              <SelectValue placeholder="View Versions" />
            </SelectTrigger>
            <SelectContent>
              {versions.length > 0 ? (
                versions.map((v: Product & { _id: string }) => (
                  <SelectItem key={v._id} value={v._id}>
                    <div className="flex items-center gap-2">
                      <span>Version {v.version}</span>
                      {/* <Badge
                        variant={
                          v.status === "submitted" ? "default" : "outline"
                        }
                        className="text-[0.65rem] pt-0.5 mt-0.5"
                      >
                        {v.status}
                      </Badge> */}
                    </div>
                  </SelectItem>
                ))
              ) : product?.version ? (
                <SelectItem value={productId}>
                  Version {product.version}
                  {product.isLatest && " (Latest)"}
                </SelectItem>
              ) : null}
            </SelectContent>
          </Select>

          <Button variant="secondary" size="sm">
            <PiTextStrikethroughDuotone />
            View Redline
          </Button>

          {/* Show submitted badge when read-only */}
          {/* {isReadOnly && (
            <Badge
              variant="default"
              className="bg-green-600 hover:bg-green-600"
            >
              <PiLockKeyDuotone className="size-3 mr-1" />
              Submitted
            </Badge>
          )} */}
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
            disabled={!currentTab || !product || isSyncingStatus || isReadOnly}
            className={toggleButtonClasses}
            title={isReadOnly ? "Cannot edit submitted product" : undefined}
          >
            <span className={toggleButtonIconClasses}>{toggleButtonIcon}</span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xs font-semibold">{toggleButtonTitle}</span>
              <span className="text-[0.65rem] font-medium text-muted-foreground">
                {toggleButtonSubtitle}
              </span>
            </span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={!isProductComplete || isReadOnly}
              onClick={handleSubmit}
              className={cn(
                (!isProductComplete || isReadOnly) &&
                  "opacity-50 cursor-not-allowed"
              )}
              title={
                isReadOnly
                  ? "Product is already submitted"
                  : !isProductComplete
                  ? "Complete all tabs to enable submission"
                  : "Submit product"
              }
            >
              <PiPaperPlaneRightDuotone />
              {isReadOnly ? "Submitted" : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

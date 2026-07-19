"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type UIEvent } from "react";

import { Button } from "@uprevit/ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@uprevit/ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import { SidebarTrigger } from "@uprevit/ui/components/ui/sidebar";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useExportProductPDF } from "@/hooks/product/useExportProductPDF";
import { useGetProductVersionsInfinite } from "@/hooks/product/useGetProductVersionsInfinite";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { cn } from "@uprevit/ui/lib/utils";
import { Product } from "@/types/product";
import { useParams, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmSubmitProductDialog from "./ConfirmSubmitProductDialog";
import ToggleTabCompletionDialog from "./ToggleTabCompletionDialog";
import { ProductProgressHoverCard } from "@/components/common/ProductProgressHoverCard";
import { toast } from "sonner";
import { useProductWorkbookUnsavedGuardOptional } from "@/lib/product-workbook-unsaved-guard";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  ArrowDown01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  GitBranchIcon,
  GitCompareIcon,
  Pdf01Icon,
  SentIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@uprevit/ui/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

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

const PROGRESS_STATES = [
  {
    min: 100,
    label: "Ready to submit",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-300",
    bar: "from-emerald-400 via-emerald-500 to-emerald-600",
  },
  {
    min: 70,
    label: "On track",
    dot: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-300",
    bar: "from-sky-400 via-sky-500 to-sky-600",
  },
  {
    min: 40,
    label: "In progress",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-300",
    bar: "from-amber-400 via-amber-500 to-amber-600",
  },
  {
    min: 0,
    label: "Getting started",
    dot: "bg-slate-400",
    text: "text-slate-600 dark:text-slate-300",
    bar: "from-slate-400 via-slate-500 to-slate-600",
  },
] as const;

const SUBMITTED_STATE = {
  min: 100,
  label: "Submitted",
  dot: "bg-violet-500",
  text: "text-violet-600 dark:text-violet-300",
  bar: "from-violet-400 via-violet-500 to-violet-600",
} as const;

const getProgressState = (value: number) => {
  for (const state of PROGRESS_STATES) {
    if (value >= state.min) return state;
  }
  return PROGRESS_STATES[PROGRESS_STATES.length - 1];
};

interface ProductHeaderProps {
  isExportLocked?: boolean;
}

export function ProductHeader({ isExportLocked = false }: ProductHeaderProps) {
  const queryClient = useQueryClient();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const productId = params.productId as string;
  const [versionPopoverOpen, setVersionPopoverOpen] = useState(false);

  const { data: productData } = useGetProductTabData(productId, "all-tabs");
  const {
    data: versionsData,
    fetchNextPage: fetchNextVersionsPage,
    hasNextPage: hasNextVersionsPage,
    isFetching: isVersionsFetching,
    isFetchingNextPage: isFetchingNextVersionsPage,
    isPending: isVersionsPending,
    isError: isVersionsError,
  } = useGetProductVersionsInfinite(productId);
  const { mutateAsync: updateProductTabData, isPending: isUpdatingTab } =
    useUpdateProductTabData();
  const { mutateAsync: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct();
  const { mutate: exportPDF, isPending: isExportingPDF } =
    useExportProductPDF();
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;
  const workbookGuard = useProductWorkbookUnsavedGuardOptional();

  const getCurrentTab = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  };

  const currentTab = getCurrentTab();

  const tabCompletionConfig: Record<string, { tab: string; action: string }> = {
    "product-information": {
      tab: "product-information",
      action: "update_product_information_completion",
    },
    "compliance-information": {
      tab: "compliance-information",
      action: "update_compliance_tab_completion",
    },
    "label-components": {
      tab: "label-components",
      action: "update_label_component_tab_completion",
    },
    "symbols-graphics": {
      tab: "symbols-graphics",
      action: "update_symbols_graphics_tab_completion",
    },
    "product-specifications": {
      tab: "product-specifications",
      action: "update_product_data_tab_completion",
    },
    "operational-parameters": {
      tab: "operational-parameters",
      action: "update_operational_parameters_tab_completion",
    },
    "label-tags": {
      tab: "label-tags",
      action: "update_label_tags_tab_completion",
    },
  };

  const currentTabConfig = tabCompletionConfig[currentTab ?? ""];
  const isTabCompletionEnabled = Boolean(currentTabConfig);

  const allTabsData = productData?.result?.data;
  const productCoreData = allTabsData?.product_information?.product_data?.data;

  const isProductComplete = productCoreData?.complete_count === 100;
  const isReadOnly = productCoreData?.status === "submitted";
  const isEditLocked = isReadOnly || isExportLocked;

  const handleSubmit = async () => {
    if (!productId || isEditLocked) return;

    const today = new Date().toISOString();

    await Promise.all([
      updateProduct({
        _id: productId,
        action: "update-status",
        data: {
          status: "submitted",
        },
      }),
      updateProduct({
        _id: productId,
        action: "update-product",
        data: {
          _id: productId,
          actual_completion_date: today,
        },
      }),
    ]);
  };

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
    if (allTabsData.product_data?.tab_completed)
      completed.push("product-specifications");
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
  const clampedPercentage = Math.max(
    0,
    Math.min(100, Math.round(completionPercentage || 0)),
  );
  const progressState =
    productCoreData?.status === "submitted"
      ? SUBMITTED_STATE
      : getProgressState(clampedPercentage);

  const isCurrentTabCompleted = currentTab
    ? tabsCompleted.includes(currentTab)
    : false;

  const completedTabsCount = tabsCompleted.length;
  const isSyncingStatus = isUpdatingTab || isUpdatingProduct;

  const handleVersionChange = (versionId: string) => {
    setVersionPopoverOpen(false);
    if (versionId !== productId) {
      const href = `/products/${versionId}/${currentTab}`;
      if (workbookGuard) {
        workbookGuard.tryNavigate(href);
        return;
      }
      router.push(href);
    }
  };

  const toggleButtonTitle = isSyncingStatus
    ? isCurrentTabCompleted
      ? "Unmarking..."
      : "Marking complete..."
    : isExportLocked
      ? "Export in progress"
      : isReadOnly
        ? "Submitted"
        : isCurrentTabCompleted
          ? "Mark Incomplete"
          : "Mark Complete";

  const toggleButtonClasses = cn(
    "group text-left text-xs flex items-center gap-2 font-semibold leading-tight transition-all disabled:text-muted-foreground rounded-lg border bg-accent",
    isEditLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer",
    isCurrentTabCompleted ? "text-foreground" : "text-foreground",
  );

  const handleToggleTab = async () => {
    if (
      !currentTab ||
      !product ||
      !currentTabConfig ||
      !isTabCompletionEnabled ||
      isSyncingStatus ||
      isEditLocked
    ) {
      return;
    }

    const updatedTabsCompleted = isCurrentTabCompleted
      ? tabsCompleted.filter((tab: string) => tab !== currentTab)
      : [...tabsCompleted, currentTab];

    const newCompletionPercentage = Math.round(
      (updatedTabsCompleted.length / TOTAL_TABS) * 100,
    );

    const results = await Promise.allSettled([
      updateProductTabData({
        id: productId,
        action: currentTabConfig.action,
        tab: currentTabConfig.tab,
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

    const hasFailure = results.some((result) => result.status === "rejected");

    if (hasFailure) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["product-tab-data"] }),
        queryClient.invalidateQueries({ queryKey: ["all-products"] }),
        queryClient.invalidateQueries({ queryKey: ["product-diff-redline"] }),
      ]);
      toast.error("Failed to update tab completion. Please try again.");
    }
  };

  const versions = useMemo(
    () =>
      versionsData?.pages.flatMap((page) => page.result?.versions ?? []) ?? [],
    [versionsData],
  );

  const handleVersionListScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

    if (nearBottom && hasNextVersionsPage && !isVersionsFetching) {
      fetchNextVersionsPage();
    }
  };

  // Get previous versions for redline comparison (versions with lower version number)
  const currentVersion = product?.version ?? 1;
  const previousVersions = useMemo(() => {
    return versions.filter(
      (v: Product & { _id: string }) =>
        v.version !== undefined && v.version < currentVersion,
    );
  }, [versions, currentVersion]);

  // Handle redline version selection
  const handleRedlineVersionChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "clear") {
      params.delete("compareVersion");
    } else {
      params.set("compareVersion", value);
    }
    const href = `${pathname}?${params.toString()}`;
    if (workbookGuard) {
      workbookGuard.tryNavigate(href);
      return;
    }
    router.push(href);
    setVersionPopoverOpen(false);
  };

  // Get selected version info for display
  const selectedCompareVersion = useMemo(() => {
    if (!compareVersionId) return null;
    return versions.find(
      (v: Product & { _id: string }) => v._id === compareVersionId,
    );
  }, [compareVersionId, versions]);

  useEffect(() => {
    if (
      !compareVersionId ||
      selectedCompareVersion ||
      !hasNextVersionsPage ||
      isVersionsFetching
    ) {
      return;
    }

    fetchNextVersionsPage();
  }, [
    compareVersionId,
    selectedCompareVersion,
    hasNextVersionsPage,
    isVersionsFetching,
    fetchNextVersionsPage,
  ]);

  const versionTriggerLabel =
    isRedlineView && selectedCompareVersion
      ? `v${currentVersion} vs v${selectedCompareVersion.version}`
      : isRedlineView
        ? `v${currentVersion} vs …`
        : product?.version
          ? product.isLatest
            ? `v${product.version} `
            : `v${product.version}`
          : "Versions";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 bg-background flex w-full shrink-0 flex-wrap items-center justify-between gap-3 border-b border-sidebar-border px-2 py-2 transition-[width,height,left] ease-linear duration-200 md:flex-nowrap md:py-0",
        // Width and positioning that accounts for sidebar
        "left-0 right-0",
        "md:left-[var(--sidebar-width)] md:w-[calc(100%-var(--sidebar-width))]",
        "md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:left-[var(--sidebar-width-icon)] md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[calc(100%-var(--sidebar-width-icon))]",
        "md:group-has-[[data-collapsible=offcanvas]]/sidebar-wrapper:left-0 md:group-has-[[data-collapsible=offcanvas]]/sidebar-wrapper:w-full",
        // Height
        "md:h-12 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="bg-sidebar text-muted-foreground hover:text-muted-foreground" />
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="max-w-40 truncate text-sm font-semibold text-foreground">
              {product?.productName}
            </p>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            {product?.productName}
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-2 ml-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button
                  size="icon-xs"
                  variant="outline"
                  onClick={() => {
                    exportPDF(
                      { productId },
                      {
                        onSuccess: () => {
                          toast.success(
                            "PDF export queued. Open Exports to track status.",
                          );
                        },
                        onError: (error) => {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "Failed to queue PDF export",
                          );
                        },
                      },
                    );
                  }}
                  disabled={isExportingPDF || isExportLocked}
                >
                  {isExportingPDF ? (
                    <Spinner className="size-3" />
                  ) : (
                    <Icon icon={Pdf01Icon} size={14} />
                  )}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isExportLocked
                ? "An export is already in progress"
                : "Export product as PDF"}
            </TooltipContent>
          </Tooltip>

          <Popover
            open={versionPopoverOpen}
            onOpenChange={setVersionPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={versionPopoverOpen}
                disabled={!product || isVersionsPending}
                className={cn(
                  "group h-7 gap-1.5 px-2 font-normal whitespace-nowrap",
                  isRedlineView &&
                    "bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20 dark:text-amber-300",
                )}
              >
                <Icon
                  icon={isRedlineView ? GitCompareIcon : GitBranchIcon}
                  size={14}
                  className={cn(
                    "shrink-0",
                    isRedlineView &&
                      "text-amber-700/60! group-hover:text-amber-700! dark:text-amber-300/60! group-hover:dark:text-amber-300!",
                  )}
                />
                <p className="truncate">{versionTriggerLabel}</p>
                <Icon
                  icon={ArrowDown01Icon}
                  size={12}
                  className="shrink-0 opacity-50"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-72 p-0"
              align="start"
              onWheel={(event) => event.stopPropagation()}
            >
              <Command>
                <CommandInput
                  placeholder="Search versions..."
                  className="h-9"
                />
                <CommandList onScroll={handleVersionListScroll}>
                  <CommandEmpty>
                    {isVersionsPending
                      ? "Loading versions..."
                      : isVersionsError
                        ? "Failed to load versions."
                        : "No version found."}
                  </CommandEmpty>

                  {isRedlineView && (
                    <>
                      <CommandGroup>
                        <CommandItem
                          value="clear comparison"
                          onSelect={() => handleRedlineVersionChange("clear")}
                          className="text-muted-foreground"
                        >
                          <Icon icon={CancelCircleIcon} size={14} />
                          <span>Clear comparison</span>
                        </CommandItem>
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}

                  <CommandGroup heading="Product Versions">
                    {versions.length > 0 ? (
                      versions.map((v: Product & { _id: string }) => (
                        <CommandItem
                          key={`switch-${v._id}`}
                          value={`version ${v.version} ${v.status ?? "draft"}`}
                          onSelect={() => handleVersionChange(v._id)}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span>Version {v.version}</span>
                            {v.is_latest && (
                              <Badge variant="green" className="text-xs">
                                Latest
                              </Badge>
                            )}
                          </div>
                          {v._id === productId && (
                            <Icon
                              icon={Tick02Icon}
                              size={14}
                              className="shrink-0 text-muted-foreground"
                            />
                          )}
                        </CommandItem>
                      ))
                    ) : product?.version ? (
                      <CommandItem
                        value={`version ${product.version}`}
                        onSelect={() => handleVersionChange(productId)}
                        className="flex items-center justify-between gap-2"
                      >
                        <span>
                          Version {product.version}
                          {product.isLatest ? " · Latest" : ""}
                        </span>
                        <Icon
                          icon={Tick02Icon}
                          size={14}
                          className="shrink-0 text-muted-foreground"
                        />
                      </CommandItem>
                    ) : null}
                  </CommandGroup>

                  <CommandSeparator />

                  <CommandGroup heading="Compare with">
                    {previousVersions.length > 0 ? (
                      previousVersions.map((v: Product & { _id: string }) => (
                        <CommandItem
                          key={`compare-${v._id}`}
                          value={`compare version ${v.version} ${v.status ?? "draft"}`}
                          onSelect={() => handleRedlineVersionChange(v._id)}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span>Version {v.version}</span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {v.status}
                            </span>
                          </div>
                          {compareVersionId === v._id && (
                            <Icon
                              icon={Tick02Icon}
                              size={14}
                              className="shrink-0 text-muted-foreground"
                            />
                          )}
                        </CommandItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No previous versions
                      </div>
                    )}
                  </CommandGroup>

                  {isFetchingNextVersionsPage && (
                    <div className="flex items-center justify-center py-2">
                      <Spinner className="size-4" />
                    </div>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
        <ProductProgressHoverCard
          // variant="secondary"
          percentage={clampedPercentage}
          colorClass={progressState.bar}
          progress={clampedPercentage}
          product_name={product?.productName ?? ""}
          tabsCompleted={completedTabsCount}
          totalTabs={TOTAL_TABS}
          showActions={isTabCompletionEnabled}
          actions={
            isTabCompletionEnabled ? (
              <ToggleTabCompletionDialog
                tabName={currentTab}
                isCompleted={isCurrentTabCompleted}
                onConfirm={handleToggleTab}
                disabled={!product || isSyncingStatus || isEditLocked}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className={cn(
                    toggleButtonClasses,
                    "[&_svg]:text-muted-foreground/60 hover:[&_svg]:text-foreground ",
                  )}
                  disabled={!product || isSyncingStatus || isEditLocked}
                  title={
                    isExportLocked
                      ? "Editing is disabled while export is in progress"
                      : isReadOnly
                        ? "Cannot edit submitted product"
                        : undefined
                  }
                >
                  {isCurrentTabCompleted ? (
                    <Icon icon={CancelCircleIcon} />
                  ) : (
                    <Icon icon={CheckmarkCircle02Icon} />
                  )}
                  {toggleButtonTitle}
                </Button>
              </ToggleTabCompletionDialog>
            ) : undefined
          }
        />
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <ConfirmSubmitProductDialog
              productName={product?.productName}
              onConfirm={handleSubmit}
              disabled={!isProductComplete || isEditLocked}
            >
              <Button
                size="sm"
                disabled={!isProductComplete || isEditLocked}
                className={cn(
                  (!isProductComplete || isEditLocked) &&
                    "opacity-50 cursor-not-allowed",
                )}
                title={
                  isExportLocked
                    ? "Cannot submit while export is in progress"
                    : isReadOnly
                      ? "Product is already submitted"
                      : !isProductComplete
                        ? "Complete all tabs to enable submission"
                        : "Submit product"
                }
              >
                <Icon icon={SentIcon} size={14} />
                {isReadOnly ? "Submitted" : "Submit"}
              </Button>
            </ConfirmSubmitProductDialog>
          </div>
        </div>
      </div>
    </header>
  );
}

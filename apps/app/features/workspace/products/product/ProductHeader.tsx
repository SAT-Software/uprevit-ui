"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState, type UIEvent } from "react";

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
import type { Product, ProductStatus } from "@/types/product";
import { ProductStatusBadge } from "@/components/common/ProductStatusBadge";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import {
  PRODUCT_EDIT_FORBIDDEN_MESSAGE,
  PRODUCT_STATUS_LABELS,
  getProductInReviewMessage,
  getProductLockedMessage,
  isProductContentLocked,
} from "@/utils/product/product-lifecycle";
import { useProductAccess } from "@/hooks/product/useProductAccess";
import ProductTeamMenu from "./ProductTeamMenu";
import { GuardedLink } from "@/components/common/GuardedLink";
import { NotificationsBell } from "@/components/common/NotificationsBell";
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
  Undo02Icon,
  WorkflowIcon,
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
  status: ProductStatus;
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

const getVersionLifecycleNote = (version: Product) =>
  [
    version.released_at && `Released ${formatToLocalDate(version.released_at)}`,
    version.obsoleted_at &&
      `Obsolete ${formatToLocalDate(version.obsoleted_at)}`,
    version.legacy_release && "Released before workflows",
  ]
    .filter(Boolean)
    .join(" · ");

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
  const { canEdit, canManageTeam } = useProductAccess();

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

  const status: ProductStatus = productCoreData?.status ?? "draft";
  const statusLabel = PRODUCT_STATUS_LABELS[status];
  const isProductComplete = productCoreData?.complete_count === 100;
  const isReadOnly = isProductContentLocked(status);
  const activeWorkflow =
    status === "in_review" ? productCoreData?.active_workflow : null;
  const isEditLocked = isReadOnly || isExportLocked || !canEdit;
  const isSubmittable = status === "draft";
  const canSubmit =
    isSubmittable && isProductComplete && !isExportLocked && canEdit;
  const submitLabel = "Submit for approval";
  const releasedVersion =
    productCoreData?.released_version &&
    productCoreData.released_version.id !== productId
      ? productCoreData.released_version
      : null;

  const canReturnToDraft =
    status === "submitted" && canEdit && !isExportLocked && !isUpdatingProduct;

  const handleReturnToDraft = async () => {
    if (!productId || !canReturnToDraft) return;
    await updateProduct({ _id: productId, action: "return-to-draft" });
  };

  const handleSubmit = async () => {
    if (!productId || !canSubmit) return;
    if (workbookGuard?.isNavigationBlocked()) {
      toast.warning("Save your changes before submitting");
      return;
    }
    await updateProduct({ _id: productId, action: "submit" });
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
        status,
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
    status === "draft"
      ? getProgressState(clampedPercentage)
      : { ...SUBMITTED_STATE, label: statusLabel };

  const isCurrentTabCompleted = currentTab
    ? tabsCompleted.includes(currentTab)
    : false;
  const isCompletionLocked =
    (status === "submitted" || status === "in_review") && isCurrentTabCompleted;

  const completedTabsCount = tabsCompleted.length;
  const isSyncingStatus = isUpdatingTab || isUpdatingProduct;

  const navigateTo = (href: string) => {
    setVersionPopoverOpen(false);
    if (workbookGuard) {
      workbookGuard.tryNavigate(href);
      return;
    }
    router.push(href);
  };

  const handleVersionChange = (versionId: string) => {
    if (versionId === productId) {
      setVersionPopoverOpen(false);
      return;
    }
    navigateTo(`/products/${versionId}/${currentTab}`);
  };

  const toggleButtonTitle = isSyncingStatus
    ? isCurrentTabCompleted
      ? "Unmarking…"
      : "Marking complete…"
    : isExportLocked
      ? "Export in progress"
      : isReadOnly
        ? statusLabel
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
      isEditLocked ||
      isCompletionLocked
    ) {
      return;
    }

    try {
      await updateProductTabData({
        id: productId,
        action: currentTabConfig.action,
        tab: currentTabConfig.tab,
        data: {
          tab_completed: !isCurrentTabCompleted,
        },
      });
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["all-products"] });
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
    navigateTo(`${pathname}?${params.toString()}`);
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
            <h1 className="max-w-40 truncate text-sm font-semibold text-foreground">
              {product?.productName}
            </h1>
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
                  aria-label="Export product as PDF"
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
                  placeholder="Search versions…"
                  className="h-9"
                />
                <CommandList onScroll={handleVersionListScroll}>
                  <CommandEmpty>
                    {isVersionsPending
                      ? "Loading versions…"
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
                      versions.map((v: Product & { _id: string }) => {
                        const releasedBy = v.released_by_workflow;
                        return (
                          <Fragment key={`switch-${v._id}`}>
                            <CommandItem
                              value={`version ${v.version} ${v.status ?? "draft"}`}
                              onSelect={() => handleVersionChange(v._id)}
                              className="flex items-center justify-between gap-2"
                            >
                              <div className="flex min-w-0 flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                  <span>Version {v.version}</span>
                                  <ProductStatusBadge status={v.status} />
                                  {v.is_latest && (
                                    <Badge variant="outline" className="text-xs">
                                      Latest
                                    </Badge>
                                  )}
                                </div>
                                {getVersionLifecycleNote(v) ? (
                                  <span className="text-xs text-muted-foreground">
                                    {getVersionLifecycleNote(v)}
                                  </span>
                                ) : null}
                              </div>
                              {v._id === productId && (
                                <Icon
                                  icon={Tick02Icon}
                                  size={14}
                                  className="shrink-0 text-muted-foreground"
                                />
                              )}
                            </CommandItem>
                            {releasedBy ? (
                              <CommandItem
                                value={`version ${v.version} released by ${releasedBy.numberLabel}`}
                                onSelect={() =>
                                  navigateTo(`/workflows/${releasedBy.id}`)
                                }
                                className="gap-2 pl-6 text-xs text-muted-foreground"
                              >
                                <Icon icon={WorkflowIcon} size={14} />
                                <span className="truncate">
                                  Released by{" "}
                                  <span className="font-mono">
                                    {releasedBy.numberLabel}
                                  </span>
                                </span>
                              </CommandItem>
                            ) : null}
                          </Fragment>
                        );
                      })
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
                            <span className="text-xs text-muted-foreground">
                              {v.status && PRODUCT_STATUS_LABELS[v.status]}
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
          {releasedVersion ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs font-normal text-muted-foreground"
                  asChild
                >
                  <GuardedLink
                    href={`/products/${releasedVersion.id}/${currentTab}`}
                  >
                    Released v{releasedVersion.version}
                  </GuardedLink>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Open the released version
              </TooltipContent>
            </Tooltip>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
        {productCoreData ? (
          <ProductTeamMenu
            productId={productId}
            team={productCoreData}
            canManageTeam={canManageTeam}
          />
        ) : null}
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
                disabled={
                  !product ||
                  isSyncingStatus ||
                  isEditLocked ||
                  isCompletionLocked
                }
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className={cn(
                    toggleButtonClasses,
                    "[&_svg]:text-muted-foreground/60 hover:[&_svg]:text-foreground ",
                  )}
                  disabled={
                    !product ||
                    isSyncingStatus ||
                    isEditLocked ||
                    isCompletionLocked
                  }
                  title={
                    isExportLocked
                      ? "Editing is disabled while export is in progress"
                      : isReadOnly
                        ? getProductLockedMessage(productCoreData)
                        : !canEdit
                          ? PRODUCT_EDIT_FORBIDDEN_MESSAGE
                          : isCompletionLocked
                            ? status === "in_review"
                              ? "Tabs can't be marked incomplete while in review"
                              : "Return to draft to mark a tab incomplete"
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
            {status === "submitted" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex rounded-lg"
                    tabIndex={canReturnToDraft ? undefined : 0}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!canReturnToDraft}
                      onClick={handleReturnToDraft}
                    >
                      <Icon icon={Undo02Icon} size={14} />
                      Return to draft
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  {!canEdit
                    ? PRODUCT_EDIT_FORBIDDEN_MESSAGE
                    : isExportLocked
                      ? "Cannot change status while an export is in progress"
                      : "Move this version back to Draft"}
                </TooltipContent>
              </Tooltip>
            ) : null}
            {activeWorkflow ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" asChild>
                    <GuardedLink href={`/workflows/${activeWorkflow.id}`}>
                      <Icon icon={WorkflowIcon} size={14} />
                      {statusLabel} ·{" "}
                      <span className="font-mono">
                        {activeWorkflow.numberLabel}
                      </span>
                    </GuardedLink>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  {getProductInReviewMessage(productCoreData)}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex rounded-lg"
                    tabIndex={canSubmit ? undefined : 0}
                  >
                    <ConfirmSubmitProductDialog
                      productName={product?.productName}
                      title={submitLabel}
                      onConfirm={handleSubmit}
                      disabled={!canSubmit}
                    >
                      <Button size="sm" disabled={!canSubmit}>
                        <Icon icon={SentIcon} size={14} />
                        {isSubmittable ? submitLabel : statusLabel}
                      </Button>
                    </ConfirmSubmitProductDialog>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  {!isSubmittable
                    ? `This version is ${statusLabel.toLowerCase()}`
                    : !canEdit
                      ? PRODUCT_EDIT_FORBIDDEN_MESSAGE
                      : isExportLocked
                        ? "Cannot submit while an export is in progress"
                        : !isProductComplete
                          ? "Complete all tabs to enable submission"
                          : "An approval workflow will release this version"}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <NotificationsBell />
      </div>
    </header>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductInformationCustomFieldEditDialog from "@/features/workspace/products/product/product-information/ProductInfoCustomFieldEditDialog";
import EditProductDialog from "@/features/workspace/products/product/product-information/ProductInfoEditProductDialog";
import { PageInfoDialog } from "@/features/workspace/products/product/PageInfoDialog";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useGetAllSourceFileFolders } from "@/hooks/source-files/useGetAllSourceFileFolders";
import { cn } from "@/lib/utils";
import { AuditLog } from "@/types/audit-log";
import type { ProductMetadata } from "@/types/product";
import { SourceFilesFolder } from "@/types/source-files";
import {
  formatToLocalDate,
  formatToLocalDateTime,
} from "@/utils/formatDateAndTimeLocal";
import type { DiffItem } from "@/utils/deepDiff";
import { hasChangedRedlineStatus } from "@/utils/redlineCounts";
import { buildRedlineArray, type RedlineStatus } from "@/utils/redlineArray";
import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { IconType } from "react-icons";
import {
  PiArrowRightBold,
  PiBuildingsDuotone,
  PiCalendarDuotone,
  PiClockCounterClockwiseDuotone,
  PiFlagDuotone,
  PiFlaskDuotone,
  PiFolderSimpleDuotone,
  PiGlobeDuotone,
  PiMapPinDuotone,
  PiTagDuotone,
} from "react-icons/pi";

type ProductEditData = {
  id?: string;
  product_name?: string;
  product_description?: string;
  target_date?: string;
  completion_date?: string;
  market_geography?: string;
  country_of_origin?: string;
  oem_contract_manufacturer?: string;
  commercial_clinical?: string;
  manufacturing_location?: string;
};

type ProductCustomField = {
  _id?: string;
  label?: string;
  value?: string;
  field_name?: string;
  field_value?: string;
  parent_id?: string | null;
};

type ProductCustomFieldView = {
  _id?: string;
  label: string;
  value: string;
  parent_id?: string | null;
  _redlineStatus?: RedlineStatus;
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
};

type ProductMetadataView = Omit<ProductMetadata, "status"> & {
  status?: "draft" | "submitted" | "archived";
};

type ProductInformationTabPayload = {
  data?: ProductEditData;
  custom_fields?: ProductCustomField[];
  product_data?: { data?: ProductMetadataView };
  auditLogs?: AuditLog[];
};

type ProductInformationTabResponse = {
  result?: { data?: ProductInformationTabPayload };
};

type RedlineValueProps = {
  value: string;
  diff?: DiffItem | null;
  formatFn?: (v: unknown) => string;
  isRedlineView: boolean;
};

function RedlineValue({
  value,
  diff,
  formatFn,
  isRedlineView,
}: RedlineValueProps) {
  if (!isRedlineView || !diff) return <>{value}</>;
  const format =
    formatFn ||
    ((v: unknown) => {
      if (v && typeof v === "object" && "value" in v) {
        const objectValue = (v as { value?: unknown }).value;
        return typeof objectValue === "string"
          ? objectValue
          : objectValue != null
            ? String(objectValue)
            : "";
      }
      return typeof v === "string" ? v : v != null ? String(v) : "";
    });

  const isRemoved = diff.status === "removed";
  const isAdded = diff.status === "added";

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {(diff.old_value !== null || isRemoved) && (
        <span className="relative group/old">
          <span className="line-through text-sm text-red-600/70 bg-red-100/50 dark:bg-red-900/10 px-1.5 py-0.5 rounded border border-red-200/50 dark:border-red-800/20">
            {format(diff.old_value) || ""}
          </span>
        </span>
      )}

      {diff.old_value !== null &&
        diff.new_value !== null &&
        !isRemoved &&
        !isAdded && (
          <PiArrowRightBold className="text-muted-foreground/50 text-xs" />
        )}

      {(diff.new_value !== null || isAdded) && !isRemoved && (
        <span className="text-sm text-blue-700 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-semibold border border-blue-200 dark:border-blue-800/30 shadow-sm">
          {format(diff.new_value) || ""}
        </span>
      )}
    </span>
  );
}

type ProductInfoField = {
  label: string;
  value: string;
  icon: IconType;
  diffKey?: ProductInfoDiffKey;
  isCustomField?: boolean;
  redlineStatus?: RedlineStatus;
  redlineDiffs?: DiffItem[];
};

const PRODUCT_INFO_DIFF_PATHS = {
  productName: ["product_information.product_data.data.product_name"],
  productDescription: [
    "product_information.product_data.data.product_description",
  ],
  targetDate: ["product_information.product_data.data.target_date"],
  actualCompletionDate: [
    "product_information.product_data.data.actual_completion_date",
  ],
  marketGeography: ["product_information.data.market_geography"],
  countryOfOrigin: ["product_information.data.country_of_origin"],
  oemContractManufacturer: [
    "product_information.data.oem_contract_manufacturer",
  ],
  commercialClinical: ["product_information.data.commercial_clinical"],
  manufacturingLocation: ["product_information.data.manufacturing_location"],
} as const;

type ProductInfoDiffKey = keyof typeof PRODUCT_INFO_DIFF_PATHS;

const PRODUCT_INFO_COUNTED_DIFF_KEYS: ProductInfoDiffKey[] = [
  "productName",
  "productDescription",
  "targetDate",
  "actualCompletionDate",
  "marketGeography",
  "countryOfOrigin",
  "oemContractManufacturer",
  "commercialClinical",
  "manufacturingLocation",
];

const normalizeCustomField = (
  field?: ProductCustomField | null,
): ProductCustomFieldView | null => {
  if (!field) return null;
  return {
    _id: field._id,
    parent_id: field.parent_id ?? null,
    label: field.label ?? field.field_name ?? "Custom Field",
    value: field.value ?? field.field_value ?? "",
  };
};

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;

  const { data, isLoading, isError } = useGetProductTabData(
    productId,
    "product-information",
  );

  const { data: diffRedlineData, isLoading: diffRedlineLoading } =
    useGetProductDiffRedline(productId, compareVersionId);

  const { data: linkedFoldersData, isLoading: linkedFoldersLoading } =
    useGetAllSourceFileFolders(productId);

  const linkedFolders = (linkedFoldersData?.result ||
    []) as SourceFilesFolder[];

  const redlineDiffs = diffRedlineData?.result?.diffs;
  const productInfoDiffLookup = useMemo(() => {
    const lookup = new Map<ProductInfoDiffKey, DiffItem>();
    const diffs: DiffItem[] = redlineDiffs ?? [];

    for (const key of Object.keys(
      PRODUCT_INFO_DIFF_PATHS,
    ) as ProductInfoDiffKey[]) {
      const paths = PRODUCT_INFO_DIFF_PATHS[key] as readonly string[];
      const diff = diffs.find((item) => paths.includes(item.path));

      if (diff) {
        lookup.set(key, diff);
      }
    }

    return lookup;
  }, [redlineDiffs]);

  const getProductInfoDiff = (key: ProductInfoDiffKey) => {
    return productInfoDiffLookup.get(key) ?? null;
  };

  const getCustomFieldDiff = (
    field: ProductInfoField,
    key: "label" | "value",
  ) => {
    if (!isRedlineView || !field.isCustomField) return null;
    const status = field.redlineStatus;
    const rawValue = key === "label" ? field.label : field.value;
    if (status === "added") {
      return {
        path: key,
        status: "added",
        old_value: null,
        new_value: rawValue,
      } as DiffItem;
    }
    if (status === "removed") {
      return {
        path: key,
        status: "removed",
        old_value: rawValue,
        new_value: null,
      } as DiffItem;
    }
    return field.redlineDiffs?.find((d) => d.path === key) ?? null;
  };

  const productTabData = (data as ProductInformationTabResponse | undefined)
    ?.result?.data;
  const productData = useMemo(() => {
    const baseData = productTabData?.data;
    return baseData ? { ...baseData, id: productId } : undefined;
  }, [productTabData?.data, productId]);
  const customFieldsData = productTabData?.custom_fields;
  const productMetadata = productTabData?.product_data?.data;
  const productAuditLog = productTabData?.auditLogs;
  const productMetadataForDialog = productMetadata as
    | ProductMetadata
    | undefined;
  const customFieldsView = useMemo(() => {
    const normalizedCurrent = (customFieldsData ?? [])
      .map(normalizeCustomField)
      .filter((field): field is ProductCustomFieldView => field !== null);

    if (!isRedlineView) {
      return normalizedCurrent;
    }

    const baseCustomFields =
      diffRedlineData?.result?.base_version?.product_information
        ?.custom_fields ?? [];
    const nextCustomFields =
      diffRedlineData?.result?.next_version?.product_information
        ?.custom_fields ??
      customFieldsData ??
      [];

    const normalizedBase = (baseCustomFields ?? [])
      .map(normalizeCustomField)
      .filter((field): field is ProductCustomFieldView => field !== null);
    const normalizedNext = (nextCustomFields ?? [])
      .map(normalizeCustomField)
      .filter((field): field is ProductCustomFieldView => field !== null);

    const redlineItems = buildRedlineArray(normalizedBase, normalizedNext, {
      getId: (item) => item._id,
      getParentId: (item) => item.parent_id ?? undefined,
      getFallbackKey: (item) => item.label,
    });

    return redlineItems
      .map((item) => {
        const data = item.next ?? item.base;
        if (!data) return null;
        return {
          ...data,
          _redlineStatus: item.status,
          _redlineDiffs: item.diffs,
          _redlineId: item.id,
        };
      })
      .filter(Boolean) as ProductCustomFieldView[];
  }, [
    customFieldsData,
    diffRedlineData?.result?.base_version?.product_information?.custom_fields,
    diffRedlineData?.result?.next_version?.product_information?.custom_fields,
    isRedlineView,
  ]);
  const customFieldsForDialog = (customFieldsData ?? []).map(
    (field, index) => ({
      _id: field._id ?? `custom-${index}`,
      label: field.label ?? "",
      value: field.value ?? "",
    }),
  );

  const auditLogs = (productAuditLog as AuditLog[]) || [];
  const creationLog = auditLogs.find((log) => log.action === "create");
  const latestUpdateLog = auditLogs
    .filter((log) => log.action === "update")
    .sort(
      (a, b) => new Date(b.actionAt).getTime() - new Date(a.actionAt).getTime(),
    )[0];
  const productInfoChangeCount =
    PRODUCT_INFO_COUNTED_DIFF_KEYS.filter((key) =>
      productInfoDiffLookup.has(key),
    ).length +
    customFieldsView.filter((field) =>
      hasChangedRedlineStatus(field._redlineStatus),
    ).length;

  const fields = useMemo(() => {
    if (!productData) return [];
    const baseFields: ProductInfoField[] = [
      {
        label: "Market / Geography",
        value: productData.market_geography || "N/A",
        icon: PiGlobeDuotone,
        diffKey: "marketGeography",
      },
      {
        label: "Country of Origin",
        value: productData.country_of_origin || "N/A",
        icon: PiFlagDuotone,
        diffKey: "countryOfOrigin",
      },
      {
        label: "OEM / Contract manufactured",
        value: productData.oem_contract_manufacturer || "N/A",
        icon: PiBuildingsDuotone,
        diffKey: "oemContractManufacturer",
      },
      {
        label: "Commercial / Clinical",
        value: productData.commercial_clinical || "N/A",
        icon: PiFlaskDuotone,
        diffKey: "commercialClinical",
      },
      {
        label: "Manufacturing Location",
        value: productData.manufacturing_location || "N/A",
        icon: PiMapPinDuotone,
        diffKey: "manufacturingLocation",
      },
    ];

    if (customFieldsView.length > 0) {
      const customFieldsWithIcons: ProductInfoField[] = customFieldsView.map(
        (field) => ({
          label: field.label || "Custom Field",
          value: field.value || "N/A",
          icon: PiTagDuotone,
          isCustomField: true,
          redlineStatus: field._redlineStatus,
          redlineDiffs: field._redlineDiffs,
        }),
      );
      return [...baseFields, ...customFieldsWithIcons];
    }

    return baseFields;
  }, [customFieldsView, productData]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          {/* Header Section Skeleton */}
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b px-3 py-2 border-border">
            <div className="flex flex-col gap-3 w-full min-w-0">
              <div className="flex flex-col gap-1">
                <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-12 w-full max-w-2xl bg-muted rounded animate-pulse" />
            </div>

            {/* Actions & Meta Skeleton */}
            <div className="flex flex-col items-start md:items-end gap-4 shrink-0 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="h-9 w-24 bg-muted rounded-md animate-pulse" />
                <div className="h-9 w-24 bg-muted rounded-md animate-pulse" />
              </div>
              <div className="flex flex-col items-start md:items-end gap-2 w-full">
                <div className="h-7 w-48 bg-muted rounded-lg animate-pulse" />
                <div className="h-7 w-52 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-2">
            <div className="h-64 w-full bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !productData) return notFound();

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      {/* Redline Mode Banner */}
      {isRedlineView && (
        <div className=" px-2 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm">
          <span className="text-amber-600 font-medium">
            {diffRedlineLoading
              ? "Loading changes..."
              : `Redline View: ${productInfoChangeCount} changes in Product Information`}
          </span>
          <span className="text-muted-foreground text-xs">
            (comparing with previous version)
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-2 justify-between border-b p-2 border-border">
          <div className="flex flex-col gap-3 w-full min-w-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  <RedlineValue
                    value={productMetadata?.product_name || "N/A"}
                    diff={getProductInfoDiff("productName")}
                    isRedlineView={isRedlineView}
                  />
                </h1>
                <Badge variant="outline" className="font-normal">
                  <div
                    className={cn("w-2 h-2 rounded-full mr-1", {
                      "bg-green-500": productMetadata?.status === "submitted",
                      "bg-blue-500": productMetadata?.status === "draft",
                      "bg-gray-500": productMetadata?.status === "archived",
                    })}
                  />
                  {productMetadata?.status || "N/A"}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-none">
              <RedlineValue
                value={
                  productMetadata?.product_description ||
                  "No description available."
                }
                diff={getProductInfoDiff("productDescription")}
                isRedlineView={isRedlineView}
              />
            </p>
            <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground w-full mt-auto">
              <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start ">
                <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Target:{" "}
                  <span className="font-semibold">
                    <RedlineValue
                      value={
                        productMetadata?.target_date
                          ? formatToLocalDate(productMetadata.target_date)
                          : "N/A"
                      }
                      diff={getProductInfoDiff("targetDate")}
                      formatFn={(v) =>
                        typeof v === "string" && v
                          ? formatToLocalDate(v)
                          : "N/A"
                      }
                      isRedlineView={isRedlineView}
                    />
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start ">
                <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Actual:{" "}
                  <span className="font-semibold">
                    <RedlineValue
                      value={
                        formatToLocalDate(
                          productMetadata?.actual_completion_date,
                        ) || "N/A"
                      }
                      diff={getProductInfoDiff("actualCompletionDate")}
                      formatFn={(v) =>
                        typeof v === "string" && v
                          ? formatToLocalDate(v)
                          : "N/A"
                      }
                      isRedlineView={isRedlineView}
                    />
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Source files
                </span>
                {linkedFoldersLoading ? (
                  <span className="text-[11px] text-muted-foreground">
                    Loading...
                  </span>
                ) : linkedFolders.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground">
                    None linked
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {linkedFolders.slice(0, 3).map((folder) => (
                      <Link
                        key={folder._id}
                        href={`/source-files/view/${folder._id}`}
                        className="group"
                      >
                        <Badge
                          variant="outline"
                          className="px-1.5 py-0.5 text-[11px] font-medium flex items-center gap-1 hover:bg-muted/40"
                          title={folder.name}
                        >
                          <PiFolderSimpleDuotone className="w-3 h-3 text-muted-foreground" />
                          <span className="max-w-[120px] truncate">
                            {folder.name}
                          </span>
                        </Badge>
                      </Link>
                    ))}
                    {linkedFolders.length > 3 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0.5 text-[11px] font-medium cursor-pointer"
                            title="View all linked folders"
                          >
                            +{linkedFolders.length - 3}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent
                          side="right"
                          align="start"
                          className="p-2 w-56"
                        >
                          <div className="flex flex-col gap-1">
                            {linkedFolders.slice(3).map((folder) => (
                              <Link
                                key={folder._id}
                                href={`/source-files/view/${folder._id}`}
                                className="flex items-center gap-2 rounded-md px-2 py-1 text-xs hover:bg-muted/50"
                              >
                                <PiFolderSimpleDuotone className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="truncate">{folder.name}</span>
                              </Link>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions & Meta */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full md:w-auto">
              {productId ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/products/${productId}/logs`}>
                        <PiClockCounterClockwiseDuotone className="h-4 w-4" />
                        Logs
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show Product Logs</TooltipContent>
                </Tooltip>
              ) : null}
              {productData && productMetadataForDialog && (
                <>
                  <EditProductDialog
                    product={productData}
                    productMetadata={productMetadataForDialog}
                  />
                  <ProductInformationCustomFieldEditDialog
                    product={productData}
                    productMetadata={productMetadataForDialog}
                    customFieldsData={customFieldsForDialog}
                  />
                </>
              )}
            </div>

            {/* Audit Badges */}
            <div className="flex flex-col items-start md:items-end gap-2 text-xs text-muted-foreground w-full mt-auto">
              {creationLog && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start md:justify-end">
                  <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Created {formatToLocalDateTime(creationLog.actionAt)} -{" "}
                    <span className="font-semibold">
                      {creationLog.actionBy}
                    </span>
                  </span>
                </div>
              )}
              {latestUpdateLog && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start md:justify-end">
                  <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Updated {formatToLocalDateTime(latestUpdateLog.actionAt)} -{" "}
                    <span className="font-semibold">
                      {latestUpdateLog.actionBy}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-border pb-2 px-2">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Product Information</p>
              <div className="w-1 h-1 bg-border border border-border rounded-full" />
              <p className="text-xs text-muted-foreground font-medium">
                Key product details and custom fields
              </p>
              <PageInfoDialog
                title="Product Information"
                content="View and edit core product information and custom fields for this product."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mx-2">
            {fields.map((field, idx) => {
              const isCustomField = Boolean(field.isCustomField);

              const fieldStatus = isCustomField
                ? field.redlineStatus && field.redlineStatus !== "unchanged"
                  ? field.redlineStatus
                  : null
                : field.diffKey
                  ? getProductInfoDiff(field.diffKey)?.status || null
                  : null;

              const valueDiff = isCustomField
                ? getCustomFieldDiff(field, "value")
                : field.diffKey
                  ? getProductInfoDiff(field.diffKey)
                  : null;

              const labelDiff = isCustomField
                ? getCustomFieldDiff(field, "label")
                : null;

              const isRemoved = fieldStatus === "removed";
              const isAdded = fieldStatus === "added";
              const isModified = fieldStatus === "modified";

              return (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col gap-3 p-4 border rounded-xl bg-card hover:bg-accent/5 transition-all duration-200 group",
                    isRedlineView &&
                      isRemoved &&
                      "border-red-500/50 bg-red-100/5 opacity-60",
                    isRedlineView &&
                      isAdded &&
                      "border-blue-500/50 bg-blue-100/5",
                    isRedlineView &&
                      isModified &&
                      "border-amber-500/50 bg-amber-100/10",
                    !isRedlineView || !fieldStatus ? "border-border" : "",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "p-2 rounded-lg bg-accent text-foreground group-hover:bg-accent/60 transition-colors",
                        isRedlineView &&
                          isRemoved &&
                          "bg-red-200/40 text-destructive",
                        isRedlineView &&
                          isAdded &&
                          "bg-blue-200/40 text-blue-500",
                        isRedlineView &&
                          isModified &&
                          "bg-amber-200/40 text-amber-500",
                        !isRedlineView || !fieldStatus ? "border-border" : "",
                      )}
                    >
                      <field.icon className="w-4 h-4" />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium text-muted-foreground truncate",
                        isRedlineView &&
                          isRemoved &&
                          "line-through text-red-500/70",
                      )}
                    >
                      {labelDiff ? (
                        <RedlineValue
                          value={field.label}
                          diff={labelDiff}
                          isRedlineView={isRedlineView}
                        />
                      ) : (
                        field.label
                      )}
                    </span>
                    {isRedlineView && isAdded && (
                      <span className="text-[10px] font-bold tracking-wider text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full shadow-sm">
                        NEW
                      </span>
                    )}
                    {isRedlineView && isRemoved && (
                      <span className="text-[10px] font-bold tracking-wider text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full shadow-sm">
                        REMOVED
                      </span>
                    )}
                    {isRedlineView && isModified && (
                      <span className="text-[10px] font-bold tracking-wider text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full shadow-sm">
                        MODIFIED
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      "font-semibold text-lg text-foreground pl-1",
                      isRedlineView &&
                        isRemoved &&
                        "line-through text-red-500/70",
                    )}
                    title={field.value}
                  >
                    <RedlineValue
                      value={field.value}
                      diff={valueDiff}
                      isRedlineView={isRedlineView}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

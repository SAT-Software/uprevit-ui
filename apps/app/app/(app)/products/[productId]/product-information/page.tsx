"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { RedlineStatusBadge } from "@/components/common/RedlineBadge";
import { RedlineValue } from "@/components/common/RedlineValue";
import ActivityLogsSheet from "@/features/workspace/common/ActivityLogsSheet";
import ProductInformationCustomFieldEditDialog from "@/features/workspace/products/product/product-information/ProductInfoCustomFieldEditDialog";
import ProductInfoEditMetadataDialog from "@/features/workspace/products/product/product-information/ProductInfoEditMetadataDialog";
import EditProductDialog from "@/features/workspace/products/product/product-information/ProductInfoEditProductDialog";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useGetAllSourceFileFolders } from "@/hooks/source-files/useGetAllSourceFileFolders";
import { AuditLog } from "@/types/audit-log";
import type { ProductMetadata } from "@/types/product";
import { SourceFilesFolder } from "@/types/source-files";
import {
  formatToLocalDate,
  formatToLocalDateTime,
} from "@/utils/formatDateAndTimeLocal";
import type { DiffItem } from "@/utils/deepDiff";
import { isAdminProfile } from "@/utils/isAdmin";
import { hasChangedRedlineStatus } from "@/utils/redlineCounts";
import { buildRedlineArray, type RedlineStatus } from "@/utils/redlineArray";
import {
  redlineBannerText,
  redlineCardAdded,
  redlineCardModified,
  redlineCardRemoved,
  redlineFieldHighlightAdded,
  redlineFieldHighlightModified,
  redlineFieldHighlightRemoved,
} from "@/utils/redlineStyles";
import {
  Building03Icon,
  CalendarDownload01Icon,
  CalendarUpload01Icon,
  Factory01Icon,
  MapPinHouseIcon,
  Folder01Icon,
  FolderOpenIcon,
  GlobalIcon,
  BarcodeScanIcon,
  ProfileIcon,
  ShieldBlockchainIcon,
  CustomFieldIcon,
  MedicalFileIcon,
  CalendarUserIcon,
  Flag03Icon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconProps } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { File, Folder, Tree } from "@uprevit/ui/components/ui/file-tree";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@uprevit/ui/components/ui/hover-card";
import { Separator } from "@uprevit/ui/components/ui/separator";
import { cn } from "@uprevit/ui/lib/utils";
import {
  notFound,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "react-oidc-context";

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
  class_of_device?: string;
  basic_udi_di?: string;
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
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: string;
  modifiedAt?: string;
};

type ProductInformationTabResponse = {
  result?: { data?: ProductInformationTabPayload };
};

type ProductInfoField = {
  label: string;
  value: string;
  icon: IconProps["icon"];
  diffKey?: ProductInfoDiffKey;
  isCustomField?: boolean;
  redlineStatus?: RedlineStatus;
  redlineDiffs?: DiffItem[];
};

function statusBadgeVariant(
  status?: "draft" | "submitted" | "archived",
): "blue" | "green" | "gray" {
  if (status === "submitted") return "green";
  if (status === "archived") return "gray";
  return "blue";
}

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
  classOfDevice: ["product_information.data.class_of_device"],
  basicUdiDi: ["product_information.data.basic_udi_di"],
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
  "classOfDevice",
  "basicUdiDi",
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
  const auth = useAuth();
  const router = useRouter();
  const isAdmin = isAdminProfile(auth.user?.profile);
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
      parent_id: field.parent_id ?? null,
      label: field.label ?? field.field_name ?? "",
      value: field.value ?? field.field_value ?? "",
    }),
  );

  const auditLogs = (productAuditLog as AuditLog[]) || [];
  const legacyCreationLog = auditLogs.find((log) => log.action === "create");
  const legacyUpdateLog = auditLogs
    .filter((log) => log.action === "update")
    .sort(
      (a, b) => new Date(b.actionAt).getTime() - new Date(a.actionAt).getTime(),
    )[0];
  const creationLog =
    productTabData?.createdBy && productTabData?.createdAt
      ? {
          actionAt: productTabData.createdAt,
          actionBy: productTabData.createdBy,
        }
      : legacyCreationLog;
  const latestUpdateLog =
    productTabData?.modifiedBy && productTabData?.modifiedAt
      ? {
          actionAt: productTabData.modifiedAt,
          actionBy: productTabData.modifiedBy,
        }
      : legacyUpdateLog;
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
        icon: GlobalIcon,
        diffKey: "marketGeography",
      },
      {
        label: "Country of Origin",
        value: productData.country_of_origin || "N/A",
        icon: MapPinHouseIcon,
        diffKey: "countryOfOrigin",
      },
      {
        label: "OEM / Contract manufactured",
        value: productData.oem_contract_manufacturer || "N/A",
        icon: Building03Icon,
        diffKey: "oemContractManufacturer",
      },
      {
        label: "Commercial / Clinical",
        value: productData.commercial_clinical || "N/A",
        icon: MedicalFileIcon,
        diffKey: "commercialClinical",
      },
      {
        label: "Manufacturing Location",
        value: productData.manufacturing_location || "N/A",
        icon: Factory01Icon,
        diffKey: "manufacturingLocation",
      },
      {
        label: "Class of Device",
        value: productData.class_of_device || "N/A",
        icon: ShieldBlockchainIcon,
        diffKey: "classOfDevice",
      },
      {
        label: "Basic UDI-DI",
        value: productData.basic_udi_di || "N/A",
        icon: BarcodeScanIcon,
        diffKey: "basicUdiDi",
      },
    ];

    if (customFieldsView.length > 0) {
      const customFieldsWithIcons: ProductInfoField[] = customFieldsView.map(
        (field) => ({
          label: field.label || "Custom Field",
          value: field.value || "N/A",
          icon: CustomFieldIcon,
          isCustomField: true,
          redlineStatus: field._redlineStatus,
          redlineDiffs: field._redlineDiffs,
        }),
      );
      return [...baseFields, ...customFieldsWithIcons];
    }

    return baseFields;
  }, [customFieldsView, productData]);

  const fieldRows = useMemo(() => {
    const rows: [ProductInfoField | null, ProductInfoField | null][] = [];
    for (let i = 0; i < fields.length; i += 2) {
      rows.push([fields[i], fields[i + 1] ?? null]);
    }
    return rows;
  }, [fields]);

  const renderProductInfoField = (
    field: ProductInfoField,
    fieldKey: string,
  ) => {
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

    const labelDiff = isCustomField ? getCustomFieldDiff(field, "label") : null;

    const isRemoved = fieldStatus === "removed";
    const isAdded = fieldStatus === "added";
    const isModified = fieldStatus === "modified";
    const showBadge = isRedlineView && hasChangedRedlineStatus(fieldStatus);

    return (
      <div
        key={fieldKey}
        className={cn(
          "group relative flex min-h-22 items-start gap-3.5 px-4 py-4 transition-colors hover:bg-accent/40",
          isRedlineView && isRemoved && redlineCardRemoved,
          isRedlineView && isAdded && redlineCardAdded,
          isRedlineView && isModified && redlineCardModified,
        )}
      >
        {showBadge && <RedlineStatusBadge status={fieldStatus} />}

        <Icon
          icon={field.icon}
          size={20}
          strokeWidth={2}
          className={cn(
            "mt-0.5 shrink-0 text-muted-foreground/70",
            isRedlineView && isRemoved && redlineFieldHighlightRemoved,
            isRedlineView && isAdded && redlineFieldHighlightAdded,
            isRedlineView && isModified && redlineFieldHighlightModified,
          )}
        />

        <div className="min-w-0 flex-1 space-y-1.5">
          <p
            className={cn(
              "text-sm font-medium text-muted-foreground",
              isRedlineView &&
                isRemoved &&
                "line-through text-red-500/70 dark:text-red-400/80",
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
          </p>
          <p
            className={cn(
              "text-base font-semibold leading-snug wrap-break-word text-foreground",
              isRedlineView &&
                isRemoved &&
                "line-through text-red-500/70 dark:text-red-400/80",
            )}
            title={field.value}
          >
            <RedlineValue
              value={field.value}
              diff={valueDiff}
              isRedlineView={isRedlineView}
            />
          </p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-2">
        <div className="flex flex-col gap-2 border-b border-border px-2 pb-2">
          <div className="flex flex-col gap-0.5 pt-2">
            <div className="h-7 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-2/3 max-w-2xl animate-pulse rounded bg-muted" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
        <div className="px-2 py-2">
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="flex h-10 items-center justify-between border-b border-border bg-muted/60 px-3">
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
                <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {Array.from({ length: 4 }).map((_, row) => (
                <div
                  key={row}
                  className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-border"
                >
                  {Array.from({ length: 2 }).map((_, col) => (
                    <div
                      key={col}
                      className="flex min-h-22 items-start gap-3.5 px-4 py-4"
                    >
                      <div className="mt-0.5 size-5 shrink-0 animate-pulse rounded bg-muted" />
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                        <div className="h-5 w-44 max-w-full animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !productData) return notFound();

  const productStatus = productMetadata?.status;
  const targetDateLabel = productMetadata?.target_date
    ? formatToLocalDate(productMetadata.target_date)
    : "N/A";
  const actualDateLabel =
    formatToLocalDate(productMetadata?.actual_completion_date) || "N/A";

  return (
    <div className="flex h-full flex-col">
      {isRedlineView && (
        <div className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 p-2 text-sm">
          <span className={cn("font-medium", redlineBannerText)}>
            {diffRedlineLoading
              ? "Loading changes..."
              : `Redline View: ${productInfoChangeCount} changes in Product Information`}
          </span>
          <span className="text-xs text-muted-foreground">
            (comparing with previous version)
          </span>
        </div>
      )}

      <div className="flex h-full w-full flex-col overflow-y-auto">
        <div className="flex flex-col border-b border-border">
          <div className="flex flex-col gap-0.5 p-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              <RedlineValue
                value={productMetadata?.product_name || "N/A"}
                diff={getProductInfoDiff("productName")}
                isRedlineView={isRedlineView}
              />
            </h1>
            <p className="max-w-2xl text-sm leading-snug text-muted-foreground line-clamp-3 md:line-clamp-none">
              <RedlineValue
                value={
                  productMetadata?.product_description ||
                  "No description available."
                }
                diff={getProductInfoDiff("productDescription")}
                isRedlineView={isRedlineView}
                oldValueClassName="font-medium"
                newValueClassName="font-medium"
              />
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border h-10 px-2">
            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && productId && (
                <ActivityLogsSheet
                  scopeType="product"
                  scopeId={productId}
                  title="Product Logs"
                  tooltip="All the timeline logs for this product. When it was created or updated. What was updated/created/deleted. The user/admin who took the action. Date and time"
                  trigger={
                    <Button type="button" variant="outline" size="sm">
                      <Icon
                        className="transition-colors delay-100 duration-200 ease-in-out"
                        icon={ProfileIcon}
                        size={16}
                        strokeWidth={2}
                      />
                      Logs
                    </Button>
                  }
                />
              )}
              {productId && productMetadataForDialog && (
                <ProductInfoEditMetadataDialog
                  productId={productId}
                  productMetadata={productMetadataForDialog}
                />
              )}
            </div>

            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="group text-xs font-normal text-muted-foreground hover:text-foreground"
                >
                  <Badge
                    variant={statusBadgeVariant(productStatus)}
                    className="capitalize -ml-1"
                  >
                    {productStatus || "N/A"}
                  </Badge>
                  <span className="inline-flex items-center gap-1">
                    <Icon
                      icon={CalendarDownload01Icon}
                      size={12}
                      strokeWidth={2}
                      className="text-muted-foreground/60 group-hover:text-muted-foreground"
                    />
                    Target{" "}
                    <span className="font-medium text-foreground">
                      <RedlineValue
                        value={targetDateLabel}
                        diff={getProductInfoDiff("targetDate")}
                        formatFn={(v) =>
                          typeof v === "string" && v
                            ? formatToLocalDate(v)
                            : "N/A"
                        }
                        isRedlineView={isRedlineView}
                        oldValueClassName="text-xs"
                        newValueClassName="text-xs"
                      />
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon
                      icon={CalendarUpload01Icon}
                      size={12}
                      strokeWidth={2}
                      className="text-muted-foreground/60 group-hover:text-muted-foreground"
                    />
                    Actual{" "}
                    <span className="font-medium text-foreground">
                      <RedlineValue
                        value={actualDateLabel}
                        diff={getProductInfoDiff("actualCompletionDate")}
                        formatFn={(v) =>
                          typeof v === "string" && v
                            ? formatToLocalDate(v)
                            : "N/A"
                        }
                        isRedlineView={isRedlineView}
                        oldValueClassName="text-xs"
                        newValueClassName="text-xs"
                      />
                    </span>
                  </span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 gap-0 p-0" align="end">
                <div className="flex flex-col">
                  <div className="flex flex-col gap-2 px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Icon
                          icon={Flag03Icon}
                          size={12}
                          strokeWidth={2}
                          className="shrink-0 text-muted-foreground/60"
                        />
                        <p className="text-xs text-muted-foreground">Status</p>
                      </div>
                      <Badge
                        variant={statusBadgeVariant(productStatus)}
                        className="capitalize"
                      >
                        {productStatus || "N/A"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Icon
                          icon={CalendarDownload01Icon}
                          size={12}
                          strokeWidth={2}
                          className="shrink-0 text-muted-foreground/60"
                        />
                        <p className="text-xs text-muted-foreground">
                          Target date
                        </p>
                      </div>
                      <p className="text-xs font-medium text-foreground">
                        {targetDateLabel}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Icon
                          icon={CalendarUpload01Icon}
                          size={12}
                          strokeWidth={2}
                          className="shrink-0 text-muted-foreground/60"
                        />
                        <p className="text-xs text-muted-foreground">
                          Actual date
                        </p>
                      </div>
                      <p className="text-xs font-medium text-foreground">
                        {actualDateLabel}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2 px-4 py-3">
                    {creationLog ? (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1.5">
                          <Icon
                            icon={CalendarUserIcon}
                            size={12}
                            strokeWidth={2}
                            className="mt-0.5 shrink-0 text-muted-foreground/60"
                          />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Created by
                            </p>
                            <p className="text-[11px] text-muted-foreground/80">
                              Created at
                            </p>
                          </div>
                        </div>
                        <div className="min-w-0 text-right">
                          <p className="truncate text-xs font-medium text-foreground">
                            {creationLog.actionBy}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {formatToLocalDateTime(creationLog.actionAt)}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {latestUpdateLog ? (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1.5">
                          <Icon
                            icon={CalendarUserIcon}
                            size={12}
                            strokeWidth={2}
                            className="mt-0.5 shrink-0 text-muted-foreground/60"
                          />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Updated by
                            </p>
                            <p className="text-[11px] text-muted-foreground/80">
                              Updated at
                            </p>
                          </div>
                        </div>
                        <div className="min-w-0 text-right">
                          <p className="truncate text-xs font-medium text-foreground">
                            {latestUpdateLog.actionBy}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {formatToLocalDateTime(latestUpdateLog.actionAt)}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {!creationLog && !latestUpdateLog ? (
                      <p className="text-xs text-muted-foreground">
                        No audit information available
                      </p>
                    ) : null}
                  </div>

                  <Separator />

                  <div className="p-2">
                    {linkedFoldersLoading ? (
                      <p className="text-xs text-muted-foreground">
                        Loading...
                      </p>
                    ) : linkedFolders.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        None linked
                      </p>
                    ) : (
                      <Tree
                        className="h-auto max-h-36 group"
                        initialExpandedItems={["source-files"]}
                        openIcon={
                          <Icon
                            icon={FolderOpenIcon}
                            size={12}
                            strokeWidth={2}
                            className="shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground"
                          />
                        }
                        closeIcon={
                          <Icon
                            icon={Folder01Icon}
                            size={12}
                            strokeWidth={2}
                            className="shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground"
                          />
                        }
                      >
                        <Folder
                          element="Source files"
                          value="source-files"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          {linkedFolders.map((folder) => (
                            <File
                              key={folder._id}
                              value={folder._id}
                              className="w-full max-w-full text-xs text-foreground"
                              fileIcon={
                                <Icon
                                  icon={Folder01Icon}
                                  size={12}
                                  strokeWidth={2}
                                  className="shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground"
                                />
                              }
                              onClick={() => {
                                router.push(`/source-files/view/${folder._id}`);
                              }}
                            >
                              <span className="truncate">{folder.name}</span>
                            </File>
                          ))}
                        </Folder>
                      </Tree>
                    )}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        <div className="px-2 py-2">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
            <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Product Information</p>
                <InfoTooltip
                  content="View and edit core product information and custom fields for this product."
                  className="mt-0.5"
                />
              </div>
              {productData && productMetadataForDialog ? (
                <div className="flex items-center gap-2">
                  <EditProductDialog
                    product={productData}
                    productMetadata={productMetadataForDialog}
                  />
                  <ProductInformationCustomFieldEditDialog
                    product={productData}
                    productMetadata={productMetadataForDialog}
                    customFieldsData={customFieldsForDialog}
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col divide-y divide-border">
              {fieldRows.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-border"
                >
                  {row.map((field, colIdx) =>
                    field ? (
                      renderProductInfoField(
                        field,
                        `${field.label}-${rowIdx}-${colIdx}`,
                      )
                    ) : (
                      <div
                        key={`empty-${rowIdx}-${colIdx}`}
                        className="hidden min-h-22 md:block"
                        aria-hidden
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Alert02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@uprevit/ui/components/ui/sheet";
import type { ImportRow } from "@/utils/product/product-import-review";
import { ProductImportDestination } from "./ProductImportDestination";
import { ProductImportStatusBadge } from "./ProductImportStatusBadge";

const INFO_LABELS: Array<[keyof ImportRow["product"]["product_information"], string]> = [
  ["market_geography", "Market / Geography"],
  ["country_of_origin", "Country of Origin"],
  ["oem_contract_manufacturer", "OEM / Contract Manufacturer"],
  ["commercial_clinical", "Commercial / Clinical"],
  ["manufacturing_location", "Manufacturing Location"],
  ["class_of_device", "Class of Device"],
  ["basic_udi_di", "Basic UDI-DI"],
];

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="space-y-2 border-b border-border px-4 py-4 last:border-0">
      <h3 className="flex items-center gap-2 text-sm font-medium">
        {title}
        {count !== undefined && <span className="text-muted-foreground text-xs tabular-nums">{count}</span>}
      </h3>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground text-xs">{children}</p>;
}

interface ProductImportDetailsSheetProps {
  row: ImportRow | null;
  excludedColumns: Set<string>;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus: (event: Event) => void;
}

export function ProductImportDetailsSheet({ row, excludedColumns, onOpenChange, onCloseAutoFocus }: ProductImportDetailsSheetProps) {
  const product = row?.product;
  const customFields = product?.custom_fields.filter((field) => !excludedColumns.has(field.label)) ?? [];

  return (
    <Sheet open={!!row} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-lg" onCloseAutoFocus={onCloseAutoFocus}>
        <SheetHeader>
          <SheetTitle className="min-w-0 truncate pr-8 text-sm" title={product?.product_plan_number}>{product?.product_plan_number}</SheetTitle>
          <SheetDescription className="sr-only">Everything the import read for this product</SheetDescription>
        </SheetHeader>
        {row && product && (
          <div className="min-h-0 flex-1 overflow-y-auto pt-10">
            <div className="space-y-2 border-b border-border px-4 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <ProductImportStatusBadge row={row} />
                <span className="text-muted-foreground text-xs">Row {product.row} on Products</span>
              </div>
              <p className="text-base font-semibold text-pretty">{product.product_name || "No product name"}</p>
              <p className="text-muted-foreground text-sm text-pretty">{product.product_description || "No description"}</p>
            </div>

            {row.issues.length > 0 && (
              <Section title="Problems" count={row.issues.length}>
                <ul className="space-y-2">
                  {row.issues.map((issue, index) => (
                    <li key={index} className="flex gap-2 text-sm">
                      <Icon
                        icon={issue.level === "error" ? AlertCircleIcon : Alert02Icon}
                        className={issue.level === "error" ? "mt-0.5 shrink-0 text-destructive" : "mt-0.5 shrink-0 text-amber-600 dark:text-amber-500"}
                      />
                      <span className="text-pretty">
                        <span className="sr-only">{issue.level === "error" ? "Error: " : "Warning: "}</span>
                        {issue.message}
                      </span>
                    </li>
                  ))}
                </ul>
                {row.issues.some((issue) => issue.level === "error") && (
                  <p className="text-muted-foreground text-xs text-pretty">
                    Products with errors aren&apos;t created. Fix them in the file and upload it again, or assign an existing project when the project isn&apos;t found.
                  </p>
                )}
              </Section>
            )}

            <Section title="Project">
              <ProductImportDestination row={row} />
            </Section>

            <Section title="Product information">
              <dl className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-3 gap-y-1.5 text-sm">
                <dt className="text-muted-foreground">Target Date</dt>
                <dd className="tabular-nums">{product.target_date ?? "—"}</dd>
                {INFO_LABELS.map(([field, label]) => (
                  <div key={field} className="contents">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="break-words">{product.product_information[field] || "—"}</dd>
                  </div>
                ))}
                {customFields.map((field) => (
                  <div key={field.label} className="contents">
                    <dt className="text-muted-foreground break-words">{field.label}</dt>
                    <dd className="break-words">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section title="Standards" count={product.compliance.length}>
              {product.compliance.length ? (
                <ul className="flex flex-wrap gap-1.5">
                  {product.compliance.map((item) => (
                    <li key={item.standard}>
                      <Badge variant="outline" className="h-auto max-w-full whitespace-normal py-0.5 text-left">
                        {item.standard}
                        {item.custom && <span className="text-muted-foreground">· Custom</span>}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty>No standards marked Yes.</Empty>
              )}
            </Section>

            <Section title="Languages" count={product.languages.length}>
              {product.languages.length ? (
                <p className="text-sm text-pretty">{product.languages.map((language) => language.name).join(", ")}</p>
              ) : (
                <Empty>No languages marked Yes.</Empty>
              )}
            </Section>

            <Section title="Label components" count={product.label_components.length}>
              {product.label_components.length ? (
                <ul className="divide-y divide-border rounded-lg border border-border">
                  {product.label_components.map((component, index) => (
                    <li key={`${component.component_number}-${index}`} className="space-y-0.5 px-3 py-2 text-sm">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className="font-medium tabular-nums">{component.component_number || "No number"}</span>
                        <span className="text-muted-foreground text-xs">{component.component_type === "Preprinted" ? "Pre-printed" : component.component_type}</span>
                      </div>
                      {component.component_description && <p className="text-pretty">{component.component_description}</p>}
                      <p className="text-muted-foreground text-xs">
                        {[component.label_type.join(", "), component.dimensions, component.print_direction].filter(Boolean).join(" · ") || "No other details"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty>No label components.</Empty>
              )}
            </Section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

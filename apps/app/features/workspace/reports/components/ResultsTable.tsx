"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ColumnsThreeCogIcon, Search02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { ReportsProduct } from "@/types/reports";
import { ProductStatusBadge } from "@/components/common/ProductStatusBadge";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import { useRouter } from "next/navigation";
import { cn } from "@uprevit/ui/lib/utils";

interface ResultsTableProps {
  products: ReportsProduct[];
  isLoading?: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  headerActions?: React.ReactNode;
}

type ReportColumn = {
  key: string;
  title: string;
  width: number;
  render: (product: ReportsProduct) => ReactNode;
};

const productHref = (product: ReportsProduct) =>
  `/products/${product._id}/product-information`;

const text = (value?: string | null) => (
  <span className="text-muted-foreground">{value || "—"}</span>
);
const date = (value?: string | null) => text(formatToLocalDate(value));

const REPORT_COLUMNS: ReportColumn[] = [
  {
    key: "product_plan_number",
    title: "PPN",
    width: 110,
    render: (product) => (
      <span className="font-medium">{product.product_plan_number}</span>
    ),
  },
  {
    key: "product_name",
    title: "Product Name",
    width: 190,
    render: (product) => (
      <Link
        href={productHref(product)}
        className="rounded-sm font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={(event) => event.stopPropagation()}
      >
        {product.product_name}
      </Link>
    ),
  },
  { key: "product_description", title: "Description", width: 200, render: (product) => text(product.product_description) },
  { key: "project_name", title: "Project", width: 150, render: (product) => text(product.project_name) },
  { key: "department_name", title: "Department", width: 150, render: (product) => text(product.department_name) },
  {
    key: "status",
    title: "Status",
    width: 110,
    render: (product) => (
      <div className="flex items-center gap-1">
        <ProductStatusBadge status={product.status} />
        {product.is_archived ? <Badge variant="outline">Archived</Badge> : null}
      </div>
    ),
  },
  {
    key: "version",
    title: "Version",
    width: 80,
    render: (product) => (
      <Badge variant="secondary" className="font-mono text-xs">
        v{product.version || 1}
      </Badge>
    ),
  },
  { key: "owner_name", title: "Owner", width: 150, render: (product) => text(product.owner_name) },
  { key: "target_date", title: "Target Date", width: 120, render: (product) => date(product.target_date) },
  { key: "actual_completion_date", title: "Completion Date", width: 130, render: (product) => date(product.actual_completion_date) },
  { key: "released_at", title: "Released", width: 120, render: (product) => date(product.released_at) },
  { key: "market_geography", title: "Market/Geography", width: 150, render: (product) => text(product.market_geography) },
  { key: "country_of_origin", title: "Country of Origin", width: 150, render: (product) => text(product.country_of_origin) },
  { key: "commercial_clinical", title: "Commercial/Clinical", width: 150, render: (product) => text(product.commercial_clinical) },
  { key: "manufacturing_location", title: "Manufacturing Location", width: 170, render: (product) => text(product.manufacturing_location) },
  { key: "oem_contract_manufacturer", title: "OEM/Contract Manufacturer", width: 190, render: (product) => text(product.oem_contract_manufacturer) },
  { key: "class_of_device", title: "Class of Device", width: 150, render: (product) => text(product.class_of_device) },
  { key: "basic_udi_di", title: "Basic UDI-DI", width: 150, render: (product) => text(product.basic_udi_di) },
  { key: "languages", title: "Languages", width: 200, render: (product) => text(product.languages?.join(", ")) },
];

const DEFAULT_COLUMNS = [
  "product_plan_number",
  "product_name",
  "project_name",
  "department_name",
  "status",
  "version",
];

const REQUIRED_COLUMNS = ["product_name"];
const COLUMNS_STORAGE_KEY = "uprevit:reports:columns";

const readStoredColumns = () => {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(COLUMNS_STORAGE_KEY) ?? "null",
    );
    if (Array.isArray(stored) && stored.length > 0) return stored as string[];
  } catch {}
  return DEFAULT_COLUMNS;
};

function useReportColumns() {
  const [visibleKeys, setVisibleKeys] = useState<string[]>(readStoredColumns);

  const toggleColumn = (key: string, visible: boolean) => {
    setVisibleKeys((previous) => {
      const next = visible
        ? [...previous, key]
        : previous.filter((visibleKey) => visibleKey !== key);
      try {
        window.localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const columns = REPORT_COLUMNS.filter(
    (column) =>
      REQUIRED_COLUMNS.includes(column.key) || visibleKeys.includes(column.key),
  );

  return { columns, visibleKeys, toggleColumn };
}

function ReportColumnsMenu({
  visibleKeys,
  onToggle,
}: {
  visibleKeys: string[];
  onToggle: (key: string, visible: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-1.5">
          <Icon icon={ColumnsThreeCogIcon} size={14} strokeWidth={2} />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
        <DropdownMenuLabel>Show columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {REPORT_COLUMNS.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={
              REQUIRED_COLUMNS.includes(column.key) ||
              visibleKeys.includes(column.key)
            }
            disabled={REQUIRED_COLUMNS.includes(column.key)}
            onCheckedChange={(checked) => onToggle(column.key, Boolean(checked))}
            onSelect={(event) => event.preventDefault()}
          >
            {column.title}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ResultsTable({
  products,
  isLoading,
  pagination,
  onPageChange,
  headerActions,
}: ResultsTableProps) {
  const router = useRouter();
  const { columns, visibleKeys, toggleColumn } = useReportColumns();
  const tableWidth = columns.reduce((total, column) => total + column.width, 0);

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className="border-r border-border last:border-r-0"
                >
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (products.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="p-0">
              <EmptyState
                embedded
                icon={Search02Icon}
                title="No products match your criteria"
                description="Try adjusting your filters or adding different conditions"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {products.map((product) => (
          <TableRow
            key={product._id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => router.push(productHref(product))}
          >
            {columns.map((column) => (
              <TableCell
                key={column.key}
                className="truncate border-r border-border last:border-r-0"
              >
                {column.render(product)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Results</p>
          {pagination ? (
            <Badge variant="secondary" className="font-normal">
              {pagination.total} found
            </Badge>
          ) : (
            <Skeleton className="h-5 w-16 rounded-md" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <ReportColumnsMenu visibleKeys={visibleKeys} onToggle={toggleColumn} />
          {headerActions}
        </div>
      </div>

      <div className="w-full overflow-x-auto border-y border-border">
        <Table
          className="table-fixed"
          style={{ width: "100%", minWidth: `${tableWidth}px` }}
        >
          <colgroup>
            {columns.map((column) => (
              <col key={column.key} style={{ width: `${column.width}px` }} />
            ))}
          </colgroup>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              {columns.map((column, index) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "text-muted-foreground/60",
                    index < columns.length - 1 && "border-r border-border",
                  )}
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
      </div>

      <div className="flex h-10 w-full shrink-0 items-center">
        <WorkspaceListPagination
          pagination={
            pagination && {
              currentPage: pagination.page,
              totalPages: pagination.totalPages,
              totalCount: pagination.total,
              limit: pagination.limit,
              hasNextPage: pagination.page < pagination.totalPages,
              hasPrevPage: pagination.page > 1,
            }
          }
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

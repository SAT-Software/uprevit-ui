"use client";

import { Search02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { ReportsProduct } from "@/types/reports";
import { useRouter } from "next/navigation";
import { cn } from "@uprevit/ui/lib/utils";

interface ResultsTableProps {
  products: ReportsProduct[];
  isLoading?: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  headerActions?: React.ReactNode;
}

const reportResultColumns = [
  { title: "PPN", width: 110 },
  { title: "Product Name", width: 190 },
  { title: "Project", width: 150 },
  { title: "Department", width: 150 },
  { title: "Status", width: 100 },
  { title: "Version", width: 80 },
] as const;

function getStatusColor(status: string) {
  switch (status) {
    case "draft":
      return "bg-blue-500";
    case "submitted":
      return "bg-emerald-500";
    case "archived":
      return "bg-muted-foreground";
    default:
      return "bg-muted-foreground";
  }
}

export function ResultsTable({
  products,
  isLoading,
  pagination,
  onPageChange,
  headerActions,
}: ResultsTableProps) {
  const router = useRouter();

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              {reportResultColumns.map((column) => (
                <TableCell
                  key={column.title}
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
            <TableCell
              colSpan={reportResultColumns.length}
              className="h-40 text-center"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  <Icon
                    icon={Search02Icon}
                    size={20}
                    strokeWidth={2}
                    className="text-muted-foreground/60"
                  />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No products match your criteria
                </p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your filters or adding different conditions
                </p>
              </div>
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
            onClick={() => {
              router.push(`/products/${product._id}/product-information`);
            }}
          >
            <TableCell className="border-r border-border font-medium">
              {product.product_plan_number}
            </TableCell>
            <TableCell className="border-r border-border font-medium">
              {product.product_name}
            </TableCell>
            <TableCell className="border-r border-border text-muted-foreground">
              {product.project_name || "—"}
            </TableCell>
            <TableCell className="border-r border-border text-muted-foreground">
              {product.department_name || "—"}
            </TableCell>
            <TableCell className="border-r border-border">
              <Badge variant="outline" className="gap-1.5 font-normal">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    getStatusColor(product.status),
                  )}
                />
                <span className="capitalize">{product.status}</span>
              </Badge>
            </TableCell>
            <TableCell className="border-r border-border">
              <Badge variant="secondary" className="font-mono text-xs">
                v{product.version || 1}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border">
      <div className="flex h-10 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Results</p>
          <Badge variant="secondary" className="font-normal">
            {pagination.total} found
          </Badge>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="w-full overflow-hidden border-b border-border">
        <Table className="table-fixed w-full">
          <colgroup>
            {reportResultColumns.map((column) => (
              <col key={column.title} style={{ width: `${column.width}px` }} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {reportResultColumns.map((column, index) => {
                const isLastColumn = index === reportResultColumns.length - 1;
                return (
                  <TableHead
                    key={column.title}
                    className={cn(!isLastColumn && "border-r border-border")}
                  >
                    <div className="flex h-10 items-center">
                      <span className="text-sm text-muted-foreground/60">
                        {column.title}
                      </span>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          {renderTableBody()}
        </Table>
      </div>

      {pagination.totalPages > 1 ? (
        <WorkspaceListPagination
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            totalCount: pagination.total,
            limit: pagination.limit,
            hasNextPage: pagination.page < pagination.totalPages,
            hasPrevPage: pagination.page > 1,
          }}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}

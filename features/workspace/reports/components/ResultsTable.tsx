"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportsProduct } from "@/types/reports";
import { PiFileTextDuotone } from "react-icons/pi";
import { PiHashDuotone, PiPackageDuotone, PiBuildingsDuotone, PiKanbanDuotone, PiInfoDuotone, PiGitBranchDuotone } from "react-icons/pi";
import { useRouter } from "next/navigation";

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
}

function getStatusColor(status: string) {
  switch (status) {
    case "draft":
      return "bg-blue-500";
    case "submitted":
      return "bg-green-500";
    case "archived":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
}

const SortableHeader = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon: any;
}) => {
  return (
    <div className="flex items-center gap-2 h-8">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{title}</span>
    </div>
  );
};

export function ResultsTable({
  products,
  isLoading,
  pagination,
  onPageChange,
}: ResultsTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg bg-muted/20">
        <PiFileTextDuotone
          size={48}
          className="text-muted-foreground/50 mb-4"
        />
        <p className="text-sm font-medium text-muted-foreground">
          No products match your criteria
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Try adjusting your filters or adding different conditions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found{" "}
          <span className="font-medium text-foreground">
            {pagination.total}
          </span>{" "}
          products
        </p>
      </div>

      <div className="bg-background overflow-hidden rounded-xl border">
        <Table className="table-fixed">
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="h-11 border-r border-border w-[110px]">
                <SortableHeader title="PPN" icon={PiHashDuotone} />
              </TableHead>
              <TableHead className="h-11 border-r border-border w-[190px]">
                <SortableHeader title="Product Name" icon={PiPackageDuotone} />
              </TableHead>
              <TableHead className="h-11 border-r border-border w-[150px]">
                <SortableHeader title="Project" icon={PiKanbanDuotone} />
              </TableHead>
              <TableHead className="h-11 border-r border-border w-[150px]">
                <SortableHeader title="Department" icon={PiBuildingsDuotone} />
              </TableHead>
              <TableHead className="h-11 border-r border-border w-[90px]">
                <SortableHeader title="Status" icon={PiInfoDuotone} />
              </TableHead>
              <TableHead className="h-11 border-r border-border w-[80px]">
                <SortableHeader title="Version" icon={PiGitBranchDuotone} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  router.push(
                    `/products/${product._id}/product-information`
                  );
                }}
              >
                <TableCell className="border-r border-border last:border-r-0 font-medium">
                  {product.product_plan_number}
                </TableCell>
                <TableCell className="border-r border-border last:border-r-0 font-medium">
                  {product.product_name}
                </TableCell>
                <TableCell className="border-r border-border last:border-r-0 text-muted-foreground">
                  {product.project_name || "—"}
                </TableCell>
                <TableCell className="border-r border-border last:border-r-0 text-muted-foreground">
                  {product.department_name || "—"}
                </TableCell>
                <TableCell className="border-r border-border last:border-r-0">
                  <Badge variant="outline" className="font-normal">
                    <div
                      className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(product.status)}`}
                    />
                    <span className="capitalize">{product.status}</span>
                  </Badge>
                </TableCell>
                <TableCell className="border-r border-border last:border-r-0">
                  <Badge variant="secondary" className="font-mono text-sm">
                    <span className="mr-0 text-muted-foreground">v</span>
                    {product.version || 1}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

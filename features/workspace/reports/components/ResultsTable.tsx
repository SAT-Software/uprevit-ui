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
import { PiArrowRightDuotone, PiFileTextDuotone } from "react-icons/pi";
import Link from "next/link";

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
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "submitted":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "archived":
      return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
}

export function ResultsTable({
  products,
  isLoading,
  pagination,
  onPageChange,
}: ResultsTableProps) {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found{" "}
          <span className="font-medium text-foreground">
            {pagination.total}
          </span>{" "}
          products
        </p>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Product Name</TableHead>
              <TableHead>PPN</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Version</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">
                  {product.product_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.product_plan_number}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.product_information?.market_geography || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getStatusColor(product.status)}`}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  v{product.version || 1}
                </TableCell>
                <TableCell>
                  <Link href={`/products/${product._id}/product-information`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PiArrowRightDuotone size={16} />
                    </Button>
                  </Link>
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

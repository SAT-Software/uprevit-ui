"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { ProductStatusBadge } from "@/components/common/ProductStatusBadge";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import {
  ANALYTICS_METRIC_TITLES,
  STAGE_CHART_CONFIG,
  TAB_LABELS,
} from "@/data/analytics-config";
import { analyticsSearchParams } from "@/hooks/analytics/useGetAnalytics";
import { useGetAnalyticsProducts } from "@/hooks/analytics/useGetAnalyticsProducts";
import type { AnalyticsFilters } from "@/types/analytics";
import { formatToLocalDate } from "@/utils/formatDateAndTimeLocal";
import { ArrowLeft01Icon, Blockchain03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";

function valueLabel(metric: string, value?: string) {
  if (!value) return null;
  if (metric === "status")
    return STAGE_CHART_CONFIG[value as keyof typeof STAGE_CHART_CONFIG]?.label;
  if (metric === "tab") return TAB_LABELS[value as keyof typeof TAB_LABELS];
  if (metric === "due") return formatToLocalDate(`${value}T00:00:00`);
  if (metric === "created" || metric === "released")
    return new Date(`${value}-01T00:00:00`).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  return null;
}

export default function AnalyticsDrillDownPage() {
  const { metric } = useParams<{ metric: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Math.max(1, Math.floor(Number(searchParams.get("page"))) || 1);
  const value = searchParams.get("value") ?? undefined;
  const filters: AnalyticsFilters = {
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    departmentId: searchParams.get("departmentId") ?? undefined,
    projectId: searchParams.get("projectId") ?? undefined,
  };
  const {
    data,
    isPending: isLoading,
    isError: isQueryError,
    refetch,
  } = useGetAnalyticsProducts({ ...filters, metric, value }, page);
  const isError = isQueryError && !data;
  const products = data?.data ?? [];
  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(next));
    router.replace(`${pathname}?${params}`);
  };
  const backQuery = analyticsSearchParams(filters).toString();
  const subtitle = valueLabel(metric, value);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 p-2">
        <Button asChild variant="ghost" size="icon-xs" aria-label="Back to analytics">
          <Link href={`/analytics${backQuery ? `?${backQuery}` : ""}`}>
            <Icon icon={ArrowLeft01Icon} size={16} />
          </Link>
        </Button>
        <p className="text-sm font-medium">
          {ANALYTICS_METRIC_TITLES[metric] ?? "Products"}
          {subtitle ? (
            <span className="text-muted-foreground"> · {subtitle}</span>
          ) : null}
        </p>
        {data && (
          <span className="text-sm tabular-nums text-muted-foreground">
            ({data?.pagination?.totalCount ?? 0})
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        {isError ? (
          <ErrorState
            variant="panel"
            icon={Blockchain03Icon}
            title="Failed to load products"
            onRetry={() => refetch()}
            fill
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Plan number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Target date</TableHead>
                <TableHead>Released</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }, (_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={8}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/products/${product._id}/product-information`}
                          className="hover:underline"
                        >
                          {product.product_name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.product_plan_number ?? "—"}
                      </TableCell>
                      <TableCell>
                        <ProductStatusBadge status={product.status} />
                      </TableCell>
                      <TableCell className="tabular-nums">
                        v{product.version}
                      </TableCell>
                      <TableCell>{product.department_name ?? "—"}</TableCell>
                      <TableCell>{product.project_name ?? "—"}</TableCell>
                      <TableCell className="tabular-nums">
                        {formatToLocalDate(product.target_date) || "—"}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {formatToLocalDate(product.released_at) || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
              {!isLoading && !products.length && (
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <EmptyState
                      embedded
                      icon={Blockchain03Icon}
                      title="No products match this selection"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      {!isError && (
        <div className="flex h-10 shrink-0 items-center border-t border-border">
          <WorkspaceListPagination
            pagination={data?.pagination}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

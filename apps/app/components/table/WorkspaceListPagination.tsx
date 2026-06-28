"use client";

import {
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@uprevit/ui/components/ui/pagination";
import { cn } from "@uprevit/ui/lib/utils";

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type WorkspaceListPaginationProps = {
  pagination?: PaginationInfo;
  onPageChange: (page: number) => void;
};

export function WorkspaceListPagination({
  pagination,
  onPageChange,
}: WorkspaceListPaginationProps) {
  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const totalCount = pagination?.totalCount ?? 0;
  const limit = pagination?.limit ?? 10;
  const start = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalCount);
  const canPrevious = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="text-muted-foreground flex text-sm whitespace-nowrap">
        <p
          className="text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          <span className="text-foreground">
            {start} <span className="mx-1 text-muted-foreground">to</span>
            {end}
          </span>{" "}
          of <span className="text-foreground">{totalCount} items</span>
        </p>
      </div>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              className="group disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(1)}
              disabled={!canPrevious}
              aria-label="Go to first page"
            >
              <HugeiconsIcon
                icon={ArrowLeftDoubleIcon}
                className="text-muted-foreground/60 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
                size={16}
                strokeWidth={2}
              />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              className="group disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canPrevious}
              aria-label="Go to previous page"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                className="text-muted-foreground/60 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
                size={16}
                strokeWidth={2}
              />
            </Button>
          </PaginationItem>
          <div className="flex items-center gap-2 mx-2">
            <div className={cn("flex items-center gap-2 text-sm")}>
              {Array.from({ length: totalPages })
                .map((_, i) => {
                  return (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className={cn(
                        "cursor-pointer",
                        i + 1 === currentPage
                          ? "text-foreground"
                          : "text-muted-foreground/60",
                      )}
                      onClick={() => onPageChange(i + 1)}
                      key={i}
                    >
                      {i + 1}
                    </Button>
                  );
                })
                .slice(0, 4)}
            </div>
            {totalPages > 4 && (
              <span className="text-muted-foreground">...</span>
            )}
            {totalPages > 4 && (
              <span
                onClick={() => onPageChange(totalPages)}
                className={cn(
                  "cursor-pointer",
                  totalPages === currentPage
                    ? "text-foreground"
                    : "text-muted-foreground/60",
                )}
              >
                {totalPages}
              </span>
            )}
          </div>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              className="group disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canNext}
              aria-label="Go to next page"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="text-muted-foreground/60 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
                size={16}
                strokeWidth={2}
              />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              className="group disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(totalPages)}
              disabled={!canNext}
              aria-label="Go to last page"
            >
              <HugeiconsIcon
                icon={ArrowRightDoubleIcon}
                className="text-muted-foreground/60 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
                size={16}
                strokeWidth={2}
              />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

"use client";

import {
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
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

function getPageItems(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  const items: (number | "ellipsis")[] = [1];

  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page++) items.push(page);
  if (end < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);

  return items;
}

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
    <div className="flex w-full items-center justify-between gap-3 pl-3 pr-2">
      <div className="text-muted-foreground flex text-sm whitespace-nowrap">
        <p
          className="text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          <span className="text-foreground tabular-nums">
            {start}–{end}
          </span>{" "}
          of{" "}
          <span className="text-foreground tabular-nums">
            {totalCount} {totalCount === 1 ? "item" : "items"}
          </span>
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
              <Icon
                icon={ArrowLeftDoubleIcon}
                className="text-muted-foreground group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
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
              <Icon
                icon={ArrowLeft01Icon}
                className="text-muted-foreground group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
                size={16}
                strokeWidth={2}
              />
            </Button>
          </PaginationItem>
          <PaginationItem className="mx-2 flex items-center gap-1 text-sm">
            {getPageItems(currentPage, totalPages).map((item, index) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  aria-hidden
                  className="px-1 text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  variant={item === currentPage ? "outline" : "ghost"}
                  size="icon-sm"
                  className={cn(
                    "tabular-nums",
                    item === currentPage
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                  aria-label={`Page ${item}`}
                  aria-current={item === currentPage ? "page" : undefined}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </Button>
              ),
            )}
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              className="group disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canNext}
              aria-label="Go to next page"
            >
              <Icon
                icon={ArrowRight01Icon}
                className="text-muted-foreground group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
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
              <Icon
                icon={ArrowRightDoubleIcon}
                className="text-muted-foreground group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
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

"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@uprevit/ui/components/ui/pagination";
import {
  PiCaretCircleDoubleLeftDuotone,
  PiCaretCircleDoubleRightDuotone,
  PiCaretCircleLeftDuotone,
  PiCaretCircleRightDuotone,
} from "react-icons/pi";

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
    <div className="flex w-full items-center justify-end gap-3">
      <div className="text-muted-foreground flex text-sm whitespace-nowrap">
        <p
          className="text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          <span className="text-foreground">
            {start}-{end}
          </span>{" "}
          of <span className="text-foreground">{totalCount}</span>
        </p>
      </div>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="secondary"
              size="sm"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(1)}
              disabled={!canPrevious}
              aria-label="Go to first page"
            >
              <PiCaretCircleDoubleLeftDuotone aria-hidden="true" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="secondary"
              size="sm"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canPrevious}
              aria-label="Go to previous page"
            >
              <PiCaretCircleLeftDuotone aria-hidden="true" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="secondary"
              size="sm"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canNext}
              aria-label="Go to next page"
            >
              <PiCaretCircleRightDuotone aria-hidden="true" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="secondary"
              size="sm"
              className="disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onPageChange(totalPages)}
              disabled={!canNext}
              aria-label="Go to last page"
            >
              <PiCaretCircleDoubleRightDuotone aria-hidden="true" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

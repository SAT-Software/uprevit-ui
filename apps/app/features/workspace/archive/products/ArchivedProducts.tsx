"use client";

import React, { useState } from "react";
import { useEffect, useMemo } from "react";
import type { SortingState } from "@tanstack/react-table";

import {
  ArchivedProductsTable,
  ProductArchiveRow,
} from "@/features/workspace/archive/products/ArchivedProductsTable";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { RestoreEntityDialog } from "@/features/workspace/archive/RestoreEntityDialog";
import { useGetArchivedProducts } from "@/hooks/archive/useGetArchivedProducts";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import {
  ListFilterColumn,
  useWorkspaceListQuery,
} from "@/lib/workspace-list-query";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { toast } from "sonner";

export type ArchivedProductsProps = {
  onRowClick?: (row: ProductArchiveRow) => void;
};

const ARCHIVED_PRODUCT_FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "product_plan_number", label: "PPN", type: "text" },
  { name: "product_name", label: "Product Name", type: "text" },
  { name: "project_name", label: "Project Name", type: "text" },
  { name: "department_name", label: "Department Name", type: "text" },
  { name: "version", label: "Version", type: "number" },
  { name: "archivedBy", label: "Archived By", type: "text" },
  { name: "archivedOn", label: "Archived On", type: "date" },
];

const ARCHIVED_PRODUCT_SORT_FIELDS = [
  "product_name",
  "product_plan_number",
  "project_name",
  "department_name",
  "version",
  "archivedBy",
  "actionBy",
  "archivedOn",
  "actionAt",
  "_id",
];

export function ArchivedProducts({ onRowClick }: ArchivedProductsProps) {
  const listState = useWorkspaceListQuery({
    defaultSort: "archivedOn",
    defaultOrder: "desc",
    allowedSortFields: ARCHIVED_PRODUCT_SORT_FIELDS,
    filterColumns: ARCHIVED_PRODUCT_FILTER_COLUMNS,
  });
  const { data: archivedProducts } = useGetArchivedProducts(listState.query);
  const { mutate: updateProductStatus, isPending } = useUpdateProduct();
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedItemToRestore, setSelectedItemToRestore] =
    useState<ProductArchiveRow | null>(null);

  const handleRestoreClick = (row: ProductArchiveRow) => {
    if (!isAdmin) {
      toast.warning("Insufficient privileges, contact Admin");
      return;
    }
    setSelectedItemToRestore(row);
    setRestoreDialogOpen(true);
  };

  const handleConfirmRestore = () => {
    if (!selectedItemToRestore) return;

    updateProductStatus(
      {
        _id: selectedItemToRestore._id,
        action: "update-status",
        data: {
          status: "draft",
        },
      },
      {
        onSuccess: () => setRestoreDialogOpen(false),
        onError: () => setRestoreDialogOpen(false),
      }
    );
  };

  const items: ProductArchiveRow[] = archivedProducts?.result?.products ?? [];
  const pagination = archivedProducts?.result?.pagination;
  const sorting = useMemo<SortingState>(
    () => [{ id: listState.query.sort, desc: listState.query.order === "desc" }],
    [listState.query.order, listState.query.sort],
  );

  useEffect(() => {
    if (!pagination) return;
    if (pagination.totalPages === 0) {
      if (listState.query.page !== 1) listState.setPage(1);
      return;
    }
    if (listState.query.page > pagination.totalPages) {
      listState.setPage(1);
    }
  }, [listState.query.page, listState.setPage, pagination?.totalPages]);

  return (
    <>
      <div className="flex flex-col gap-1 pt-3">
        <WorkspaceListControls
          filters={listState.query.filters}
          filterColumns={ARCHIVED_PRODUCT_FILTER_COLUMNS}
          onApplyFilters={listState.setFilters}
          onClearFilters={listState.clearFilters}
        />
        <ArchivedProductsTable
          data={items}
          onRowClick={onRowClick}
          onRestore={handleRestoreClick}
          loadingRowId={isPending ? selectedItemToRestore?._id : null}
          sorting={sorting}
          onSortingChange={(updater) => {
            const nextSorting =
              typeof updater === "function" ? updater(sorting) : updater;
            const next = nextSorting[0];
            if (!next) return;
            listState.setSort(next.id, next.desc ? "desc" : "asc");
          }}
        />
        {pagination ? (
          <WorkspaceListPagination
            pagination={pagination}
            onPageChange={listState.setPage}
          />
        ) : null}
      </div>

      <RestoreEntityDialog
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
        entityName={selectedItemToRestore?.product_name || ""}
        onConfirm={handleConfirmRestore}
        isPending={isPending}
      />
    </>
  );
}

export default ArchivedProducts;

"use client";

import { useEffect, useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";

import {
  ArchivedDepartmentsTable,
  DepartmentArchiveRow,
} from "@/features/workspace/archive/departments/ArchivedDepartmentsTable";
import { RestoreEntityDialog } from "@/features/workspace/archive/RestoreEntityDialog";
import { useGetArchivedDepartments } from "@/hooks/archive/useGetArchivedDepartments";
import { useRestoreDepartment } from "@/hooks/department/useRestoreDepartment";
import {
  ListFilterColumn,
  useWorkspaceListQuery,
} from "@/lib/workspace-list-query";

const ARCHIVED_DEPARTMENT_FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "department_name", label: "Department Name", type: "text" },
  { name: "department_description", label: "Description", type: "text" },
  { name: "manager", label: "Manager", type: "text" },
  { name: "archivedBy", label: "Archived By", type: "text" },
  { name: "archivedOn", label: "Archived On", type: "date" },
];

const ARCHIVED_DEPARTMENT_SORT_FIELDS = [
  "department_name",
  "department_description",
  "manager",
  "users",
  "actionBy",
  "actionAt",
  "_id",
];

export function ArchivedDepartments() {
  const listState = useWorkspaceListQuery({
    defaultSort: "actionAt",
    defaultOrder: "desc",
    allowedSortFields: ARCHIVED_DEPARTMENT_SORT_FIELDS,
    filterColumns: ARCHIVED_DEPARTMENT_FILTER_COLUMNS,
  });
  const {
    data: archivedDepartments,
    isFetching,
    isPending,
    isError,
  } = useGetArchivedDepartments(listState.query);
  const restoreDepartment = useRestoreDepartment();

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedItemToRestore, setSelectedItemToRestore] =
    useState<DepartmentArchiveRow | null>(null);

  const handleRestoreClick = (row: DepartmentArchiveRow) => {
    setSelectedItemToRestore(row);
    setRestoreDialogOpen(true);
  };

  const handleConfirmRestore = () => {
    if (!selectedItemToRestore) return;

    restoreDepartment.mutate(selectedItemToRestore._id, {
      onSuccess: () => setRestoreDialogOpen(false),
      onError: () => setRestoreDialogOpen(false),
    });
  };

  const items: DepartmentArchiveRow[] =
    archivedDepartments?.result?.departments ?? [];
  const pagination = archivedDepartments?.result?.pagination;
  const isListBusy = isPending || isFetching;
  const hasItemsToList =
    isListBusy ||
    isError ||
    (pagination?.totalCount ?? 0) > 0 ||
    listState.query.filters.length > 0;

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
      <ArchivedDepartmentsTable
        data={items}
        onRestore={handleRestoreClick}
        loadingRowId={
          restoreDepartment.isPending ? selectedItemToRestore?._id : null
        }
        sorting={sorting}
        onSortingChange={(updater) => {
          const nextSorting =
            typeof updater === "function" ? updater(sorting) : updater;
          const next = nextSorting[0];
          if (!next) return;
          listState.setSort(next.id, next.desc ? "desc" : "asc");
        }}
        filters={listState.query.filters}
        filterColumns={ARCHIVED_DEPARTMENT_FILTER_COLUMNS}
        onApplyFilters={listState.setFilters}
        onClearFilters={listState.clearFilters}
        isLoading={isListBusy}
        isError={isError}
        hasItemsToList={hasItemsToList}
        pagination={pagination}
        onPageChange={listState.setPage}
      />

      <RestoreEntityDialog
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
        entityName={selectedItemToRestore?.department_name || ""}
        onConfirm={handleConfirmRestore}
        isPending={restoreDepartment.isPending}
      />
    </>
  );
}

export default ArchivedDepartments;

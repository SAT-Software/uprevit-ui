"use client";

import React, { useState } from "react";
import { useEffect, useMemo } from "react";
import type { SortingState } from "@tanstack/react-table";

import {
  ArchivedDepartmentsTable,
  DepartmentArchiveRow,
} from "@/features/workspace/archive/departments/ArchivedDepartmentsTable";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { RestoreEntityDialog } from "@/features/workspace/archive/RestoreEntityDialog";
import { useGetArchivedDepartments } from "@/hooks/archive/useGetArchivedDepartments";
import { useRestoreDepartment } from "@/hooks/department/useRestoreDepartment";
import {
  ListFilterColumn,
  useWorkspaceListQuery,
} from "@/lib/workspace-list-query";

export type ArchivedDepartmentsProps = {
  onRowClick?: (row: DepartmentArchiveRow) => void;
};

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
  "actionAt",
  "_id",
];

export function ArchivedDepartments({ onRowClick }: ArchivedDepartmentsProps) {
  const listState = useWorkspaceListQuery({
    defaultSort: "actionAt",
    defaultOrder: "desc",
    allowedSortFields: ARCHIVED_DEPARTMENT_SORT_FIELDS,
    filterColumns: ARCHIVED_DEPARTMENT_FILTER_COLUMNS,
  });
  const { data: archivedDepartments } =
    useGetArchivedDepartments(listState.query);
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
  const sorting = useMemo<SortingState>(
    () => [{ id: listState.query.sort, desc: listState.query.order === "desc" }],
    [listState.query.order, listState.query.sort],
  );

  useEffect(() => {
    if (
      pagination?.totalPages === 0 ||
      !pagination?.totalPages ||
      listState.query.page <= pagination.totalPages
    ) {
      return;
    }

    listState.setPage(1);
  }, [listState.query.page, listState.setPage, pagination?.totalPages]);

  return (
    <>
      <div className="flex flex-col gap-1 pt-3">
        <WorkspaceListControls
          filters={listState.query.filters}
          filterColumns={ARCHIVED_DEPARTMENT_FILTER_COLUMNS}
          onApplyFilters={listState.setFilters}
          onClearFilters={listState.clearFilters}
        />
        <ArchivedDepartmentsTable
          data={items}
          onRowClick={onRowClick}
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
        entityName={selectedItemToRestore?.department_name || ""}
        onConfirm={handleConfirmRestore}
        isPending={restoreDepartment.isPending}
      />
    </>
  );
}

export default ArchivedDepartments;

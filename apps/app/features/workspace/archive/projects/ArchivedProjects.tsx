"use client";

import React, { useState } from "react";
import { useEffect, useMemo } from "react";
import type { SortingState } from "@tanstack/react-table";

import {
  ArchivedProjectsTable,
  ProjectArchiveRow,
} from "@/features/workspace/archive/projects/ArchivedProjectsTable";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { RestoreEntityDialog } from "@/features/workspace/archive/RestoreEntityDialog";
import { useGetArchivedProjects } from "@/hooks/archive/useGetArchivedProjects";
import { useRestoreProject } from "@/hooks/project/useRestoreProject";
import {
  ListFilterColumn,
  useWorkspaceListQuery,
} from "@/lib/workspace-list-query";

export type ArchivedProjectsProps = {
  onRowClick?: (row: ProjectArchiveRow) => void;
};

const ARCHIVED_PROJECT_FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "project_name", label: "Project Name", type: "text" },
  { name: "project_description", label: "Description", type: "text" },
  { name: "project_manager", label: "Project Manager", type: "text" },
  { name: "archivedBy", label: "Archived By", type: "text" },
  { name: "archivedOn", label: "Archived On", type: "date" },
];

const ARCHIVED_PROJECT_SORT_FIELDS = [
  "project_number",
  "project_name",
  "project_description",
  "project_manager",
  "users",
  "actionBy",
  "actionAt",
  "_id",
];

export function ArchivedProjects({ onRowClick }: ArchivedProjectsProps) {
  const listState = useWorkspaceListQuery({
    defaultSort: "actionAt",
    defaultOrder: "desc",
    allowedSortFields: ARCHIVED_PROJECT_SORT_FIELDS,
    filterColumns: ARCHIVED_PROJECT_FILTER_COLUMNS,
  });
  const { data: archivedProjects } = useGetArchivedProjects(listState.query);
  const restoreProject = useRestoreProject();

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedItemToRestore, setSelectedItemToRestore] =
    useState<ProjectArchiveRow | null>(null);

  const handleRestoreClick = (row: ProjectArchiveRow) => {
    setSelectedItemToRestore(row);
    setRestoreDialogOpen(true);
  };

  const handleConfirmRestore = () => {
    if (!selectedItemToRestore) return;

    restoreProject.mutate(selectedItemToRestore._id, {
      onSuccess: () => setRestoreDialogOpen(false),
    });
  };

  const items: ProjectArchiveRow[] = archivedProjects?.result?.projects ?? [];
  const pagination = archivedProjects?.result?.pagination;
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
          filterColumns={ARCHIVED_PROJECT_FILTER_COLUMNS}
          onApplyFilters={listState.setFilters}
          onClearFilters={listState.clearFilters}
        />
        <ArchivedProjectsTable
          data={items}
          onRowClick={onRowClick}
          onRestore={handleRestoreClick}
          loadingRowId={
            restoreProject.isPending ? selectedItemToRestore?._id : null
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
        entityName={selectedItemToRestore?.project_name || ""}
        onConfirm={handleConfirmRestore}
        isPending={restoreProject.isPending}
      />
    </>
  );
}

export default ArchivedProjects;

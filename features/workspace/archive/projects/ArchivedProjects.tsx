"use client";

import React, { useState } from "react";

import {
  ArchivedProjectsTable,
  ProjectArchiveRow,
} from "@/features/workspace/archive/projects/ArchivedProjectsTable";
import { RestoreEntityDialog } from "@/features/workspace/archive/RestoreEntityDialog";
import { useGetArchivedProjects } from "@/hooks/archive/useGetArchivedProjects";
import { useRestoreProject } from "@/hooks/project/useRestoreProject";

export type ArchivedProjectsProps = {
  onRowClick?: (row: ProjectArchiveRow) => void;
};

export function ArchivedProjects({ onRowClick }: ArchivedProjectsProps) {
  const { data: archivedProjects } = useGetArchivedProjects();
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

  return (
    <>
      <ArchivedProjectsTable
        data={items}
        onRowClick={onRowClick}
        onRestore={handleRestoreClick}
        loadingRowId={
          restoreProject.isPending ? selectedItemToRestore?._id : null
        }
      />

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

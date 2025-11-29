"use client";

import React, { useState } from "react";
import { PiArchiveDuotone, PiKanbanDuotone } from "react-icons/pi";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <Card className="bg-background border rounded-xl shadow-none">
        <div className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full border">
              <PiArchiveDuotone className="size-4 opacity-80" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">Archived Projects</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Projects kept for record; restore to bring them back.
              </p>
            </div>
          </div>
          <PiKanbanDuotone className="size-5 opacity-70" aria-hidden="true" />
        </div>
        <Separator />
        <div className="p-5">
          <ArchivedProjectsTable
            data={items}
            onRowClick={onRowClick}
            onRestore={handleRestoreClick}
          />
        </div>
      </Card>

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

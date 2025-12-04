"use client";

import React, { useState } from "react";
import { PiArchiveDuotone, PiBuildingsDuotone } from "react-icons/pi";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArchivedDepartmentsTable,
  DepartmentArchiveRow,
} from "@/features/workspace/archive/departments/ArchivedDepartmentsTable";
import { RestoreEntityDialog } from "@/features/workspace/archive/RestoreEntityDialog";
import { useGetArchivedDepartments } from "@/hooks/archive/useGetArchivedDepartments";
import { useRestoreDepartment } from "@/hooks/department/useRestoreDepartment";

export type ArchivedDepartmentsProps = {
  onRowClick?: (row: DepartmentArchiveRow) => void;
};

export function ArchivedDepartments({ onRowClick }: ArchivedDepartmentsProps) {
  const { data: archivedDepartments } = useGetArchivedDepartments();
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
                <h2 className="text-base font-semibold">
                  Archived Departments
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                These departments are hidden from active views until restored.
              </p>
            </div>
          </div>
          <PiBuildingsDuotone
            className="size-5 opacity-70"
            aria-hidden="true"
          />
        </div>
        <Separator />
        <div className="p-5">
          <ArchivedDepartmentsTable
            data={items}
            onRowClick={onRowClick}
            onRestore={handleRestoreClick}
          />
        </div>
      </Card>

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

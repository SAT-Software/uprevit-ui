"use client";

import React, { useState } from "react";

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
      <ArchivedDepartmentsTable
        data={items}
        onRowClick={onRowClick}
        onRestore={handleRestoreClick}
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

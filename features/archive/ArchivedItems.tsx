"use client";

import React, { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  PiArchiveDuotone,
  PiCirclesThreePlusDuotone,
  PiKanbanDuotone,
  PiStackPlusDuotone,
} from "react-icons/pi";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArchiveTable } from "@/features/archive/ArchiveTable";
import type { ArchiveEntityType } from "@/features/archive/DialogArchiveEntity";
import { useGetArchivedDepartments } from "@/hooks/archive/useGetArchivedDepartments";
import { useGetArchivedProjects } from "@/hooks/archive/useGetArchivedProjects";

type ArchiveRow = {
  _id: string;
  department_name?: string;
  project_name?: string;
  product_name?: string;
  archivedBy?: string;
  archivedOn?: string;
  version?: string; // product
  products?: number; // project
  manager?: string; // department
  users?: unknown[]; // department
};

export type ArchivedItemsProps = {
  type: ArchiveEntityType;
  onRowClick?: (row: ArchiveRow) => void;
};

export function ArchivedItems({ type, onRowClick }: ArchivedItemsProps) {
  const { data: archivedDepartments } = useGetArchivedDepartments();
  const { data: archivedProjects } = useGetArchivedProjects();

  const items: ArchiveRow[] = useMemo(() => {
    if (type === "department") {
      return archivedDepartments?.result?.departments ?? [];
    }
    if (type === "project") {
      return archivedProjects?.result?.projects ?? [];
    }
    return [];
  }, [type, archivedDepartments, archivedProjects]);

  // Unified column configuration based on type
  const columns: ColumnDef<ArchiveRow>[] = useMemo(() => {
    const idKey: keyof ArchiveRow = "_id";
    const nameKey: keyof ArchiveRow =
      type === "product"
        ? "product_name"
        : type === "department"
        ? "department_name"
        : "project_name";

    const base: ColumnDef<ArchiveRow>[] = [
      {
        header:
          type === "product"
            ? "Product ID"
            : type === "department"
            ? "Department ID"
            : "Project ID",
        accessorKey: idKey,
        size: 160,
        cell: ({ row }) => (
          <div className="text-xs font-medium">{row.getValue(idKey)}</div>
        ),
      },
      {
        header:
          type === "product"
            ? "Product Name"
            : type === "department"
            ? "Department Name"
            : "Project Name",
        accessorKey: nameKey,
        size: 260,
        cell: ({ row }) => (
          <div className="text-xs font-medium">{row.getValue(nameKey)}</div>
        ),
      },
    ];

    if (type === "department") {
      const deptExtras: ColumnDef<ArchiveRow>[] = [
        {
          header: "Manager",
          accessorKey: "manager",
          size: 180,
          cell: ({ row }) => (
            <div className="text-xs">{row.getValue("manager")}</div>
          ),
        },
        {
          id: "usersCount",
          header: "Users",
          accessorFn: (row) =>
            Array.isArray(row.users) ? row.users.length : 0,
          size: 100,
          cell: ({ cell }) => (
            <div className="text-xs font-medium">{cell.getValue<number>()}</div>
          ),
        },
      ];
      return [...base, ...deptExtras];
    }

    if (type === "product") {
      const prodExtras: ColumnDef<ArchiveRow>[] = [
        {
          header: "Archived By",
          accessorKey: "archivedBy",
          size: 160,
          cell: ({ row }) => (
            <div className="text-xs">{row.getValue("archivedBy")}</div>
          ),
        },
        {
          header: "Archived On",
          accessorKey: "archivedOn",
          size: 140,
          cell: ({ row }) => (
            <div className="text-xs text-muted-foreground">
              {row.getValue("archivedOn")}
            </div>
          ),
        },
        {
          header: "Version",
          accessorKey: "version",
          size: 120,
          cell: ({ row }) => (
            <div className="text-xs font-medium">{row.getValue("version")}</div>
          ),
        },
      ];
      return [...base, ...prodExtras];
    }

    const projExtras: ColumnDef<ArchiveRow>[] = [
      {
        header: "Archived By",
        accessorKey: "archivedBy",
        size: 160,
        cell: ({ row }) => (
          <div className="text-xs">{row.getValue("archivedBy")}</div>
        ),
      },
      {
        header: "Archived On",
        accessorKey: "archivedOn",
        size: 140,
        cell: ({ row }) => (
          <div className="text-xs text-muted-foreground">
            {row.getValue("archivedOn")}
          </div>
        ),
      },
      {
        header: "Products",
        accessorKey: "products",
        size: 120,
        cell: ({ row }) => (
          <div className="text-xs font-medium">{row.getValue("products")}</div>
        ),
      },
    ];
    return [...base, ...projExtras];
  }, [type]);

  const MetaIcon = useMemo(() => {
    if (type === "product") return PiStackPlusDuotone;
    if (type === "department") return PiCirclesThreePlusDuotone;
    return PiKanbanDuotone;
  }, [type]);

  const prettyTitle = useMemo(() => {
    if (type === "product") return "Archived Products";
    if (type === "department") return "Archived Departments";
    return "Archived Projects";
  }, [type]);

  const prettyHint = useMemo(() => {
    if (type === "product")
      return "Manage and restore archived products when needed.";
    if (type === "department")
      return "These departments are hidden from active views until restored.";
    return "Projects kept for record; restore to bring them back.";
  }, [type]);

  return (
    <Card className="bg-background border rounded-xl shadow-none">
      <div className="flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full border">
            <PiArchiveDuotone className="size-4 opacity-80" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">{prettyTitle}</h2>
            </div>
            <p className="text-xs text-muted-foreground">{prettyHint}</p>
          </div>
        </div>
        <MetaIcon className="size-5 opacity-70" aria-hidden="true" />
      </div>
      <Separator />
      <div className="p-5">
        <ArchiveTable<ArchiveRow>
          data={items}
          columns={columns}
          onRowClick={onRowClick}
        />
      </div>
    </Card>
  );
}

export default ArchivedItems;

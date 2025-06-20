"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArchiveTable } from "@/features/archive/ArchiveTable";

const archiveProducts = [
  {
    id: "PRD-001",
    name: "Archived Product A",
    archivedBy: "John Doe",
    archivedOn: "2024-01-20",
    version: "1.0.0",
  },
  {
    id: "PRD-002",
    name: "Archived Product B",
    archivedBy: "Jane Smith",
    archivedOn: "2024-03-02",
    version: "2.1.3",
  },
  {
    id: "PRD-003",
    name: "Archived Product C",
    archivedBy: "Alice Johnson",
    archivedOn: "2024-04-11",
    version: "0.9.8",
  },
];

const productColumns: ColumnDef<(typeof archiveProducts)[0]>[] = [
  {
    header: "Product ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <div className="text-xs font-medium">{row.getValue("id")}</div>
    ),
    size: 120,
  },
  {
    header: "Product Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="text-xs font-medium">{row.getValue("name")}</div>
    ),
    size: 200,
  },
  {
    header: "Archived By",
    accessorKey: "archivedBy",
    cell: ({ row }) => (
      <div className="text-xs font-medium">{row.getValue("archivedBy")}</div>
    ),
    size: 150,
  },
  {
    header: "Archived On",
    accessorKey: "archivedOn",
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {row.getValue("archivedOn")}
      </div>
    ),
    size: 120,
  },
  {
    header: "Version",
    accessorKey: "version",
    cell: ({ row }) => (
      <div className="text-xs font-medium">{row.getValue("version")}</div>
    ),
    size: 100,
  },
];

function ArchivePage() {
  return (
    <div className="flex flex-col gap-8 p-4">
      {/* Archived Products */}
      <div className="space-y-4 bg-background border rounded-xl p-6">
        <h2 className="text-lg font-semibold">Archived Products</h2>
        <ArchiveTable
          data={archiveProducts}
          columns={productColumns}
          onRowClick={(prod) => console.log("Clicked product:", prod)}
        />
      </div>
    </div>
  );
}

export default ArchivePage;

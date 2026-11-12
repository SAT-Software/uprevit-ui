"use client";

import type { ListFilterColumn } from "@/lib/workspace-list-query";
import AddBarcodesDialog from "./AddBarcodesDialog";
import EditBarcodesDialog from "./EditBarcodesDialog";
import DeleteSymbolsSchematicsDialog from "./DeleteSymbolsSchematicsDialog";
import SymbolsGraphicsTable, {
  getPersistentItemId,
  graphicsCountColumn,
  graphicsDescriptionColumn,
  graphicsImageColumn,
  graphicsNameColumn,
  graphicsPresenceColumn,
  type SymbolsGraphicsTableItem,
} from "./SymbolsGraphicsTable";

type Item = SymbolsGraphicsTableItem & {
  componentDescription: string;
  note?: string;
  presentOnLabels: string[];
  count?: number;
};

const FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "componentName", label: "Barcode Type", type: "text" },
  { name: "componentDescription", label: "Barcode Data", type: "text" },
  { name: "presentOnLabels", label: "Presence on Labels", type: "text" },
  { name: "count", label: "Count", type: "number" },
];

const columns = [
  graphicsImageColumn<Item>(),
  graphicsNameColumn<Item>("Barcode Type"),
  graphicsDescriptionColumn<Item>("Barcode Data"),
  graphicsPresenceColumn<Item>("Presence on Labels", "presentOnLabels"),
  graphicsCountColumn<Item>("Count"),
];

const toBarcodeItem = (item: Item) => ({
  id: item.id,
  componentName: item.componentName,
  description: item.componentDescription,
  componentImage: item.componentImage,
  key: item.key,
  labelPresence: item.presentOnLabels,
  count: item.count,
});

export default function SymbolsGraphicsPageBarcodesTable({
  data,
  productId,
  isContentLocked = false,
  isRedlineView = false,
}: {
  data?: Item[];
  productId: string;
  isContentLocked?: boolean;
  isRedlineView?: boolean;
}) {
  return (
    <SymbolsGraphicsTable
      title="Barcodes"
      info="Add and manage barcodes used on product labels and packaging."
      emptyMessage="No barcodes found."
      data={data}
      columns={columns}
      filterColumns={FILTER_COLUMNS}
      isContentLocked={isContentLocked}
      isRedlineView={isRedlineView}
      addDialog={
        <AddBarcodesDialog
          productId={productId}
          isContentLocked={isContentLocked}
        />
      }
      renderEditDialog={(item, open, onOpenChange) => (
        <EditBarcodesDialog
          key={`edit-${getPersistentItemId(item)}`}
          productId={productId}
          barcode={toBarcodeItem(item)}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
      renderDeleteDialog={(item, open, onOpenChange) => (
        <DeleteSymbolsSchematicsDialog
          key={`delete-${getPersistentItemId(item)}`}
          productId={productId}
          graphics={toBarcodeItem(item)}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
    />
  );
}

"use client";

import type { ListFilterColumn } from "@/lib/workspace-list-query";
import AddSchematicsDialog from "./AddSchematicsDialog";
import EditSchematicsDialog from "./EditSchematicsDialog";
import DeleteSymbolsSchematicsDialog from "./DeleteSymbolsSchematicsDialog";
import SymbolsGraphicsTable, {
  getPersistentItemId,
  graphicsDescriptionColumn,
  graphicsImageColumn,
  graphicsNameColumn,
  graphicsPresenceColumn,
  type SymbolsGraphicsTableItem,
} from "./SymbolsGraphicsTable";

type Item = SymbolsGraphicsTableItem & {
  componentDescription: string;
  presentOnLabels: string[];
};

const FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "componentName", label: "Schematic Name", type: "text" },
  { name: "componentDescription", label: "Description", type: "text" },
  { name: "presentOnLabels", label: "Presence on Labels", type: "text" },
];

const columns = [
  graphicsImageColumn<Item>(),
  graphicsNameColumn<Item>("Schematic Name"),
  graphicsDescriptionColumn<Item>("Description"),
  graphicsPresenceColumn<Item>("Presence on Labels", "presentOnLabels"),
];

const toSchematicItem = (item: Item) => ({
  id: item.id,
  componentName: item.componentName,
  description: item.componentDescription,
  componentImage: item.componentImage,
  key: item.key,
  labelPresence: item.presentOnLabels,
});

export default function SymbolsGraphicsPageSchematicsTable({
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
      title="Schematics"
      info="Add and manage product schematics and diagrams used on labels and documentation."
      emptyMessage="No schematics found."
      data={data}
      columns={columns}
      filterColumns={FILTER_COLUMNS}
      isContentLocked={isContentLocked}
      isRedlineView={isRedlineView}
      addDialog={
        <AddSchematicsDialog
          productId={productId}
          isContentLocked={isContentLocked}
        />
      }
      renderEditDialog={(item, open, onOpenChange) => (
        <EditSchematicsDialog
          key={`edit-${getPersistentItemId(item)}-${open}`}
          productId={productId}
          schematic={toSchematicItem(item)}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
      renderDeleteDialog={(item, open, onOpenChange) => (
        <DeleteSymbolsSchematicsDialog
          key={`delete-${getPersistentItemId(item)}`}
          productId={productId}
          graphics={toSchematicItem(item)}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
    />
  );
}

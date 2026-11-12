"use client";

import type { ListFilterColumn } from "@/lib/workspace-list-query";
import AddOtherCompsDialog from "./AddOtherCompsDialog";
import EditOtherComponentsDialog from "./EditOtherComponentsDialog";
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
  note?: string;
  presentOnLabels: string[];
};

const FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "componentName", label: "Component Name", type: "text" },
  { name: "componentDescription", label: "Description", type: "text" },
  { name: "presentOnLabels", label: "Presence on Labels", type: "text" },
];

const columns = [
  graphicsImageColumn<Item>(),
  graphicsNameColumn<Item>("Component Name"),
  graphicsDescriptionColumn<Item>("Description"),
  graphicsPresenceColumn<Item>("Presence on Labels", "presentOnLabels"),
];

const toOtherComponentItem = (item: Item) => ({
  id: item.id,
  componentName: item.componentName,
  description: item.componentDescription,
  componentImage: item.componentImage,
  key: item.key,
  labelPresence: item.presentOnLabels,
});

export default function SymbolsGraphicsPageOtherComponentsTable({
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
      title="Other Components"
      info="Add and manage other graphical components used on product labels."
      emptyMessage="No other components found."
      data={data}
      columns={columns}
      filterColumns={FILTER_COLUMNS}
      isContentLocked={isContentLocked}
      isRedlineView={isRedlineView}
      addDialog={
        <AddOtherCompsDialog
          productId={productId}
          isContentLocked={isContentLocked}
        />
      }
      renderEditDialog={(item, open, onOpenChange) => (
        <EditOtherComponentsDialog
          key={`edit-${getPersistentItemId(item)}-${open}`}
          productId={productId}
          otherComponent={toOtherComponentItem(item)}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
      renderDeleteDialog={(item, open, onOpenChange) => (
        <DeleteSymbolsSchematicsDialog
          key={`delete-${getPersistentItemId(item)}`}
          productId={productId}
          graphics={toOtherComponentItem(item)}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
    />
  );
}

"use client";

import type { ListFilterColumn } from "@/lib/workspace-list-query";
import AddSymbolsDialog from "./AddSymbolsDialog";
import EditSymbolsDialog from "./EditSymbolsDialog";
import DeleteSymbolsSchematicsDialog from "./DeleteSymbolsSchematicsDialog";
import SymbolsGraphicsTable, {
  getPersistentItemId,
  graphicsImageColumn,
  graphicsNameColumn,
  graphicsPresenceColumn,
  graphicsYesNoColumn,
  type SymbolsGraphicsTableItem,
} from "./SymbolsGraphicsTable";

type Item = SymbolsGraphicsTableItem & {
  symbolsTextPresent: string[];
  textPresent: boolean;
  standard_symbol_id?: string;
  standard_ref_number?: string;
};

const FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "componentName", label: "Symbol Text", type: "text" },
  { name: "textPresent", label: "Text Present", type: "boolean" },
  { name: "symbolsTextPresent", label: "Presence on Labels", type: "text" },
];

const columns = [
  graphicsImageColumn<Item>(),
  graphicsNameColumn<Item>("Symbol Text"),
  graphicsYesNoColumn<Item>("Text Present"),
  graphicsPresenceColumn<Item>("Presence on Labels", "symbolsTextPresent"),
];

export default function SymbolsGraphicsPageSymbolsTable({
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
      title="Symbols"
      info="Add and manage regulatory and product symbols used on labels and packaging."
      emptyMessage="No symbols found."
      data={data}
      columns={columns}
      filterColumns={FILTER_COLUMNS}
      isContentLocked={isContentLocked}
      isRedlineView={isRedlineView}
      addDialog={
        <AddSymbolsDialog
          productId={productId}
          isContentLocked={isContentLocked}
          existingSymbols={data || []}
        />
      }
      renderEditDialog={(item, open, onOpenChange) => (
        <EditSymbolsDialog
          key={`edit-${getPersistentItemId(item)}`}
          productId={productId}
          symbol={item}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
      renderDeleteDialog={(item, open, onOpenChange) => (
        <DeleteSymbolsSchematicsDialog
          key={`delete-${getPersistentItemId(item)}`}
          productId={productId}
          graphics={item}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
    />
  );
}

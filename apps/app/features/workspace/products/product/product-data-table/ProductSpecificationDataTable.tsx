"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@uprevit/ui/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  ProductSpecificationDataTableProps,
  type CellFormat,
  type WorkbookConditionalRule,
  type ColumnFilter,
  type DataType,
} from "@/types/product-data-table";
import { sparseProductSpecDataForDatabase } from "@/utils/product/product-spec";
import {
  formatWorkbookValue,
  createWorkbookFormatResolver,
  MAX_DECIMAL_PLACES,
  parseWorkbookClipboard,
  workbookDecimalPlaces,
  createWorkbookFill,
  workbookNumber,
  placeRemovedAtBasePosition,
} from "@/utils/product/workbook-cell-utils";
import { WorkbookConditionalFormatDialog } from "./WorkbookConditionalFormatDialog";
import { WorkbookHeaderMenu } from "./WorkbookHeaderMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { WorkbookTextFormatToolbar } from "./WorkbookTextFormatToolbar";
import {
  getRedlineHighlightInsetShadow,
  redlineHighlightBorder,
  redlineHighlightRing,
  redlineOldValueCompact,
  redlineNewValueCompact,
} from "@/utils/redlineStyles";
import {
  getWorkbookFillPalette,
  getWorkbookSelectionFillState,
  getWorkbookSelectionKeys,
  getWorkbookSelectionTextState,
  getWorkbookTextPalette,
  getWorkbookTheme,
  isDefaultWorkbookTextColor,
  NO_FILL_COLOR,
  resolveWorkbookFillColor,
  resolveWorkbookTextColor,
  type WorkbookTheme,
} from "@/utils/product/workbook-cell-colors";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnSizingState,
  type FilterFn,
  type Header,
  type Row,
  type Table,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme } from "next-themes";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  DragDropVerticalIcon,
  FileExportIcon,
  FileImportIcon,
  PaintBucketIcon,
  Redo02Icon,
  Search02Icon,
  SearchReplaceIcon,
  TextSquareIcon,
  Undo02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { toast } from "sonner";
import { applyFilter, detectColumnDataType } from "./column-filter-utils";
import { ColumnFilterPopover } from "./ColumnFilterPopover";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { ConfirmFileImportAlertDialog } from "./ConfirmFileImportAlertDialog";
import { FindReplaceDialog } from "./FindReplaceDialog";
import { WorkbookColorPopover } from "./WorkbookColorPopover";

// History entry types (delta-based)
type CellEditEntry = {
  type: "cell";
  changes: Array<{
    key: string;
    prev: string | undefined;
    next: string | undefined;
  }>;
};

type HeaderEditEntry = {
  type: "header";
  colIndex: number;
  prev: string;
  next: string;
};

type ColumnTypeEntry = {
  type: "columnType";
  colIndex: number;
  prev: DataType | undefined;
  next: DataType | undefined;
};

type ColumnSizingEntry = {
  type: "columnSizing";
  prev: ColumnSizingState;
  next: ColumnSizingState;
};

type ColumnOrderEntry = {
  type: "columnOrder";
  prev: string[];
  next: string[];
};

type CellFormatEntry = {
  type: "cellFormat";
  changes: Array<{
    key: string;
    prev: CellFormat | undefined;
    next: CellFormat | undefined;
  }>;
};

type FindReplaceEntry = {
  type: "findReplace";
  changes: Array<{
    key: string;
    prev: string | undefined;
    next: string | undefined;
  }>;
  replaceAll: boolean;
};

type StructureState = {
  cellData: Record<string, string>;
  cellFormats: Record<string, CellFormat>;
  headerData: Record<number, string>;
  columnTypeData: Record<number, DataType>;
  columnSizing: ColumnSizingState;
  columnOrder: string[];
  rowOrder: number[];
  rowHeights: Record<number, number>;
  conditionalRules: WorkbookConditionalRule[];
  selectedCells: string[];
  activeCell: { row: number; col: number } | null;
  columnFilters: Record<number, ColumnFilter>;
  sorting: SortingState;
};

type HistoryEntry =
  | { type: "structure"; prev: StructureState; next: StructureState }
  | {
      type: "rowHeights";
      prev: Record<number, number>;
      next: Record<number, number>;
    }
  | {
      type: "conditionalRules";
      prev: WorkbookConditionalRule[];
      next: WorkbookConditionalRule[];
    }
  | CellEditEntry
  | HeaderEditEntry
  | ColumnTypeEntry
  | ColumnSizingEntry
  | ColumnOrderEntry
  | CellFormatEntry
  | FindReplaceEntry;

type HistoryState = {
  past: HistoryEntry[];
  future: HistoryEntry[];
  maxDepth: number;
  lastCommitTime: number;
};

const COLUMN_COUNT = 150;
const ROW_COUNT = 5000;
const COL_WIDTH = 150;
const ROW_HEIGHT = 34;
const ROW_NUMBER_WIDTH = 56;
const MIN_COL_WIDTH = 50;
const MAX_COL_WIDTH = 500;

// Row data type for the table
type RowData = { rowIndex: number };

type RedlineDiff<T extends string> = {
  status: "added" | "removed" | "modified";
  oldValue: T;
  newValue: T;
};

// Table meta interface for type-safe access to custom table metadata
interface TableMeta {
  headerData: Record<number, string>;
  setHeaderData: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  cellData: Record<string, string>;
  isRedlineView?: boolean;
  redlineMode?: "inline" | "highlight";
  headerDiffs: Record<number, RedlineDiff<string>>;
  columnFilters: Record<number, ColumnFilter>;
  setColumnFilters: React.Dispatch<
    React.SetStateAction<Record<number, ColumnFilter>>
  >;
  isReadOnly?: boolean;
  workbookTheme: WorkbookTheme;
  onColumnInsert: (column: number, after: boolean) => void;
  onColumnDelete: (column: number) => void;
}

function DiffValueDisplay<T extends string>({
  diff,
  formatValue,
}: {
  diff: RedlineDiff<T>;
  formatValue: (value: T) => string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {diff.status !== "added" && (
        <span className={cn("truncate", redlineOldValueCompact)}>
          {formatValue(diff.oldValue)}
        </span>
      )}
      {diff.status !== "removed" && (
        <span className={cn("truncate font-semibold", redlineNewValueCompact)}>
          {formatValue(diff.newValue)}
        </span>
      )}
    </div>
  );
}

const EditableHeaderContent = ({
  column,
  table,
}: {
  column: Column<RowData, unknown>;
  table: Table<RowData>;
}) => {
  const colIndex = parseInt(column.id.split("-")[1]);
  const meta = table.options.meta as TableMeta;
  const [isFocused, setIsFocused] = useState(false);

  const dataType = useMemo(
    () => detectColumnDataType(meta.cellData, colIndex, ROW_COUNT),
    [meta.cellData, colIndex],
  );
  const diff = meta.isRedlineView ? meta.headerDiffs[colIndex] : undefined;
  const showInlineDiff =
    meta.isRedlineView &&
    meta.redlineMode === "inline" &&
    diff &&
    !(isFocused && !meta.isReadOnly);
  const showHighlightDiff =
    meta.isRedlineView && meta.redlineMode === "highlight" && diff;

  const headerInput = (
    <div className="relative flex-1 min-w-0 h-full">
      <input
        className={cn(
          "h-full w-full bg-transparent outline-none text-xs font-medium placeholder:text-muted-foreground",
          showHighlightDiff && redlineHighlightRing,
          showInlineDiff && "caret-transparent",
        )}
        style={{
          boxShadow: showHighlightDiff
            ? getRedlineHighlightInsetShadow(meta.workbookTheme)
            : undefined,
          color: showInlineDiff ? "transparent" : undefined,
          caretColor: showInlineDiff ? "transparent" : undefined,
        }}
        value={meta.headerData[colIndex] ?? ""}
        readOnly={meta.isReadOnly}
        onChange={(e) => {
          if (meta.isReadOnly) return;
          meta.setHeaderData((d) => ({ ...d, [colIndex]: e.target.value }));
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={`Column ${table.getVisibleLeafColumns().findIndex((item) => item.id === column.id) + 1}`}
        aria-label={`Column ${table.getVisibleLeafColumns().findIndex((item) => item.id === column.id) + 1} name`}
      />
      {showInlineDiff && diff && (
        <div className="absolute inset-0 pointer-events-none px-1 py-0.5 flex flex-col justify-center text-[10px] leading-tight">
          <DiffValueDisplay diff={diff} formatValue={(value) => value || "—"} />
        </div>
      )}
    </div>
  );

  return (
    <>
      {showHighlightDiff && diff ? (
        <Tooltip>
          <TooltipTrigger asChild>{headerInput}</TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            <DiffValueDisplay
              diff={diff}
              formatValue={(value) => value || "—"}
            />
          </TooltipContent>
        </Tooltip>
      ) : (
        headerInput
      )}
      <div className="flex shrink-0 items-center">
        <Button
          variant="ghost"
          size="icon-2xs"
          aria-label={
            column.getIsSorted() === "asc"
              ? "Sorted ascending, sort descending"
              : column.getIsSorted() === "desc"
                ? "Sorted descending, sort ascending"
                : "Sort column"
          }
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent-foreground/10"
        >
          {column.getIsSorted() === "desc" ? (
            <Icon
              icon={ArrowDown01Icon}
              size={10}
              strokeWidth={2}
              className="size-2.5"
            />
          ) : column.getIsSorted() === "asc" ? (
            <Icon
              icon={ArrowUp01Icon}
              size={10}
              strokeWidth={2}
              className="size-2.5"
            />
          ) : (
            <Icon
              icon={UnfoldMoreIcon}
              size={10}
              strokeWidth={2}
              className="size-2.5 opacity-50"
            />
          )}
        </Button>
        {!meta.isReadOnly && (
          <WorkbookHeaderMenu
            label={`Column ${table.getVisibleLeafColumns().findIndex((col) => col.id === column.id) + 1} options`}
            axis="column"
            onInsert={(after) => meta.onColumnInsert(colIndex, after)}
            onDelete={() => meta.onColumnDelete(colIndex)}
          />
        )}
        <ColumnFilterPopover
          dataType={dataType}
          filter={meta.columnFilters[colIndex]}
          onApply={(filter) =>
            meta.setColumnFilters((f) => ({ ...f, [colIndex]: filter }))
          }
          onClear={() =>
            meta.setColumnFilters((f) => {
              const updated = { ...f };
              delete updated[colIndex];
              return updated;
            })
          }
        />
      </div>
    </>
  );
};

const DraggableHeader = ({
  header,
  virtualCol,
  colIndex,
  showChangeIndicator = false,
  isReadOnly = false,
}: {
  header: Header<RowData, unknown>;
  virtualCol: { start: number; size: number };
  colIndex: number;
  showChangeIndicator?: boolean;
  isReadOnly?: boolean;
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: header.column.id,
    disabled: isReadOnly,
  });

  const style: React.CSSProperties = {
    position: "absolute",
    left: virtualCol.start,
    width: virtualCol.size,
    height: ROW_HEIGHT,
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      role="columnheader"
      aria-colindex={colIndex}
      className="border-r border-b border-border flex items-center text-xs font-medium text-muted-foreground bg-muted group select-none relative"
      style={style}
    >
      {showChangeIndicator && (
        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
      )}
      <Button
        aria-label="Drag to reorder column"
        variant="ghost"
        size="icon-2xs"
        disabled={isReadOnly}
        className={`shrink-0 hover:bg-accent-foreground/10 ml-0.5 ${
          isReadOnly ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
        {...attributes}
        {...listeners}
      >
        <Icon
          icon={DragDropVerticalIcon}
          size={10}
          strokeWidth={2}
          className="size-2.5 opacity-50"
        />
      </Button>

      <div className="flex items-center flex-1 min-w-0 gap-1 pr-1">
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>

      {!isReadOnly && header.column.getCanResize() && (
        <div
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          onDoubleClick={() => header.column.resetSize()}
          className={`absolute right-0 top-0 h-full w-2 cursor-col-resize select-none touch-none ${
            header.column.getIsResizing()
              ? "bg-primary"
              : "bg-transparent hover:bg-primary/50"
          }`}
          style={{ transform: "translateX(50%)" }}
        />
      )}
    </div>
  );
};

const EditableHeader = ({
  column,
  table,
}: {
  column: Column<RowData, unknown>;
  table: Table<RowData>;
}) => {
  return <EditableHeaderContent column={column} table={table} />;
};

const DATA_TYPE_OPTIONS = [
  { value: "blank", label: "Blank" },
  { value: "constant", label: "Constant Data" },
  { value: "variable", label: "Variable Data" },
  { value: "na", label: "NA" },
] as const;

const DATA_TYPE_LABELS = DATA_TYPE_OPTIONS.reduce(
  (labels, option) => ({
    ...labels,
    [option.value]: option.label,
  }),
  {} as Record<DataType, string>,
);

const DataTypeSelect = ({
  colIndex,
  visibleIndex,
  value,
  onChange,
  isReadOnly = false,
}: {
  colIndex: number;
  visibleIndex: number;
  value: DataType | undefined;
  onChange: (colIndex: number, value: DataType) => void;
  isReadOnly?: boolean;
}) => (
  <Select
    disabled={isReadOnly}
    value={value ?? ""}
    onValueChange={(val) => onChange(colIndex, val as DataType)}
  >
    <SelectTrigger
      aria-label={`Column ${visibleIndex + 1} data type`}
      className="h-full w-full border-0 rounded-none shadow-none text-xs text-muted-foreground/90 focus:ring-0 py-1 pl-1 pr-2 [&_svg]:size-2.5!"
    >
      <SelectValue placeholder="" />
    </SelectTrigger>
    <SelectContent>
      {DATA_TYPE_OPTIONS.map((opt) => (
        <SelectItem className="text-xs" key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export function WorkbookSheetGrid({
  initialData,
  onDataChange,
  onSaveSuccess,
  resetKey = 0,
  isRedlineView = false,
  isReadOnly = false,
  isSavePending,
  redlineMode = "inline",
  redlineBaseData,
  onWorkbookImport,
  onWorkbookExport,
  hasOtherSheets = false,
  getWorkbookRevision,
  onSelectionCountChange,
}: ProductSpecificationDataTableProps & {
  onWorkbookImport?: (data: import("@/types/product-data-table").ProductDataTableSchema) => void;
  onWorkbookExport?: () => void;
  hasOtherSheets?: boolean;
  getWorkbookRevision?: () => string;
  onSelectionCountChange?: (count: number) => void;
}) {
  const { resolvedTheme } = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasLoadedData = useRef(false);
  const dndContextId = useId();
  const workbookTheme = getWorkbookTheme(resolvedTheme);
  const fillColors = getWorkbookFillPalette(workbookTheme);
  const textColors = getWorkbookTextPalette(workbookTheme);

  useEffect(() => {
    if (!hasLoadedData.current && initialData) {
      setCellData(initialData.cellData ?? {});
      setHeaderData(initialData.headerData ?? {});
      setColumnTypeData(initialData.columnTypeData ?? {});
      setColumnSizing(initialData.columnSizing ?? {});
      setColumnOrder(
        initialData.columnOrder ??
          Array.from({ length: COLUMN_COUNT }, (_, i) => `col-${i}`),
      );
      setCellFormats(initialData.cellFormats ?? {});
      setRowOrder(
        initialData.rowOrder ?? Array.from({ length: ROW_COUNT }, (_, i) => i),
      );
      setRowHeights(initialData.rowHeights ?? {});
      setConditionalRules(initialData.conditionalRules ?? []);
      hasLoadedData.current = true;
    }
  }, [initialData]);

  const [cellData, setCellData] = useState<Record<string, string>>(
    initialData?.cellData ?? {},
  );
  const cellDataRef = useRef<Record<string, string>>({});
  cellDataRef.current = cellData;

  const [headerData, setHeaderData] = useState<Record<number, string>>(
    initialData?.headerData ?? {},
  );

  const [columnTypeData, setColumnTypeData] = useState<
    Record<number, DataType>
  >(initialData?.columnTypeData ?? {});

  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editingCellRef = useRef<string | null>(null);
  const composingRef = useRef(false);
  const pendingFocusRef = useRef<string | null>(null);

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    initialData?.columnSizing ?? {},
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    initialData?.columnOrder ??
      Array.from({ length: COLUMN_COUNT }, (_, i) => `col-${i}`),
  );

  const [cellFormats, setCellFormats] = useState<Record<string, CellFormat>>(
    initialData?.cellFormats ?? {},
  );

  const [rowOrder, setRowOrder] = useState<number[]>(
    initialData?.rowOrder ?? Array.from({ length: ROW_COUNT }, (_, i) => i),
  );
  const [rowHeights, setRowHeights] = useState<Record<number, number>>(
    initialData?.rowHeights ?? {},
  );
  const [conditionalRules, setConditionalRules] = useState<
    WorkbookConditionalRule[]
  >(initialData?.conditionalRules ?? []);
  const resolveCellFormat = useMemo(
    () => createWorkbookFormatResolver(conditionalRules),
    [conditionalRules],
  );
  const [heightEditor, setHeightEditor] = useState<{
    row: number;
    value: string;
  } | null>(null);
  const gestureCleanupRef = useRef<(() => void) | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);

  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  useEffect(() => { onSelectionCountChange?.(selectedCells.size); }, [selectedCells.size, onSelectionCountChange]);
  const [selectionStartVisual, setSelectionStartVisual] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeSearchKey, setActiveSearchKey] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<
    Record<number, ColumnFilter>
  >({});
  useEffect(
    () => () => {
      gestureCleanupRef.current?.();
      resizeCleanupRef.current?.();
    },
    [resetKey, isReadOnly, sorting, columnFilters, columnOrder, rowOrder],
  );

  const pendingFileRef = useRef<File | null>(null);
  const [importLayout, setImportLayout] = useState<{ file: File; sheets: { name: string; rows: number; offset: number; known: boolean }[] } | null>(null);
  const importRevision = useMemo(() => ({ cellData, headerData, columnTypeData, cellFormats, columnOrder, columnSizing, rowOrder, rowHeights, conditionalRules, editingCell, editValue }), [cellData, headerData, columnTypeData, cellFormats, columnOrder, columnSizing, rowOrder, rowHeights, conditionalRules, editingCell, editValue]);
  const importGuardRef = useRef({ isReadOnly, resetKey, importRevision });
  importGuardRef.current = { isReadOnly, resetKey, importRevision };
  useEffect(() => () => { importGuardRef.current.isReadOnly = true; }, []);

  // History state
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    future: [],
    maxDepth: 100,
    lastCommitTime: 0,
  });
  const historyRef = useRef(history);
  historyRef.current = history;

  // Refs for tracking cell edit state
  const cellDraftRef = useRef<Record<string, string>>({});
  const cellInitialValueRef = useRef<Record<string, string>>({});

  const redlineDiffs = useMemo(() => {
    if (!isRedlineView || !redlineBaseData) {
      return {
        cellDiffs: {},
        headerDiffs: {},
        columnTypeDiffs: {},
        changedRows: new Set<number>(),
        changedCols: new Set<number>(),
      };
    }

    const cellDiffs: Record<
      string,
      {
        status: "added" | "removed" | "modified";
        oldValue: string;
        newValue: string;
      }
    > = {};
    const headerDiffs: Record<
      number,
      {
        status: "added" | "removed" | "modified";
        oldValue: string;
        newValue: string;
      }
    > = {};
    const columnTypeDiffs: Record<
      number,
      {
        status: "added" | "removed" | "modified";
        oldValue: DataType;
        newValue: DataType;
      }
    > = {};
    const changedRows = new Set<number>();
    const changedCols = new Set<number>();

    const baseCells = redlineBaseData.cellData ?? {};
    const nextCells = cellData ?? {};
    const cellKeys = new Set([
      ...Object.keys(baseCells),
      ...Object.keys(nextCells),
    ]);
    cellKeys.forEach((key) => {
      const oldValue = baseCells[key] ?? "";
      const newValue = nextCells[key] ?? "";
      if (oldValue === newValue) return;
      const status =
        oldValue === "" ? "added" : newValue === "" ? "removed" : "modified";
      cellDiffs[key] = { status, oldValue, newValue };

      const [rowStr, colStr] = key.split(",");
      const rowIndex = Number.parseInt(rowStr, 10);
      const colIndex = Number.parseInt(colStr, 10);
      if (!Number.isNaN(rowIndex)) changedRows.add(rowIndex);
      if (!Number.isNaN(colIndex)) changedCols.add(colIndex);
    });

    const baseHeaders = redlineBaseData.headerData ?? {};
    const headerKeys = new Set([
      ...Object.keys(baseHeaders),
      ...Object.keys(headerData),
    ]);
    headerKeys.forEach((key) => {
      const colIndex = Number.parseInt(key, 10);
      if (Number.isNaN(colIndex)) return;
      const oldValue = baseHeaders[colIndex] ?? "";
      const newValue = headerData[colIndex] ?? "";
      if (oldValue === newValue) return;
      const status =
        oldValue === "" ? "added" : newValue === "" ? "removed" : "modified";
      headerDiffs[colIndex] = { status, oldValue, newValue };
      changedCols.add(colIndex);
    });

    const baseTypes = redlineBaseData.columnTypeData ?? {};
    const typeKeys = new Set([
      ...Object.keys(baseTypes),
      ...Object.keys(columnTypeData),
    ]);
    typeKeys.forEach((key) => {
      const colIndex = Number.parseInt(key, 10);
      if (Number.isNaN(colIndex)) return;
      const oldValue = baseTypes[colIndex] ?? "blank";
      const newValue = columnTypeData[colIndex] ?? "blank";
      if (oldValue === newValue) return;
      const status =
        oldValue === "blank"
          ? "added"
          : newValue === "blank"
            ? "removed"
            : "modified";
      columnTypeDiffs[colIndex] = { status, oldValue, newValue };
      changedCols.add(colIndex);
    });

    return {
      cellDiffs,
      headerDiffs,
      columnTypeDiffs,
      changedRows,
      changedCols,
    };
  }, [isRedlineView, redlineBaseData, cellData, headerData, columnTypeData]);

  const redlineOrders = useMemo(() => {
    if (!isRedlineView || !redlineBaseData) return null;
    const occupied = (
      cells: Record<string, string>,
      headers: Record<number, string>,
      types: Record<number, DataType>,
    ) => {
      const rows = new Set<number>();
      const columns = new Set<string>();
      Object.entries(cells).forEach(([key, value]) => {
        if (!value) return;
        const [row, col] = key.split(",");
        rows.add(Number(row));
        columns.add(`col-${col}`);
      });
      Object.entries(headers).forEach(([col, value]) => {
        if (value) columns.add(`col-${col}`);
      });
      Object.entries(types).forEach(([col, value]) => {
        if (value && value !== "blank") columns.add(`col-${col}`);
      });
      return { rows, columns };
    };
    const base = occupied(
      redlineBaseData.cellData,
      redlineBaseData.headerData,
      redlineBaseData.columnTypeData,
    );
    const next = occupied(cellData, headerData, columnTypeData);
    return {
      rowOrder: placeRemovedAtBasePosition(
        rowOrder,
        redlineBaseData.rowOrder ??
          Array.from({ length: ROW_COUNT }, (_, i) => i),
        (row) => base.rows.has(row) && !next.rows.has(row),
      ),
      columnOrder: placeRemovedAtBasePosition(
        columnOrder,
        redlineBaseData.columnOrder ??
          Array.from({ length: COLUMN_COUNT }, (_, i) => `col-${i}`),
        (col) => base.columns.has(col) && !next.columns.has(col),
      ),
    };
  }, [
    isRedlineView,
    redlineBaseData,
    cellData,
    headerData,
    columnTypeData,
    rowOrder,
    columnOrder,
  ]);
  const displayRowOrder = redlineOrders?.rowOrder ?? rowOrder;
  const displayColumnOrder = redlineOrders?.columnOrder ?? columnOrder;

  const formatDiffValue = (value: string) => {
    if (!value) return "—";
    return value;
  };

  const formatColumnTypeDiffValue = (value: DataType) => {
    return DATA_TYPE_LABELS[value] ?? value;
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!hasLoadedData.current) {
      return;
    }

    if (onDataChange) {
      const data = sparseProductSpecDataForDatabase(
        headerData,
        columnTypeData,
        editingCell ? { ...cellData, [editingCell]: editValue } : cellData,
        cellFormats,
        columnOrder,
        columnSizing,
        { rowOrder, rowHeights, conditionalRules },
      );
      onDataChange(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    headerData,
    columnTypeData,
    cellData,
    editingCell,
    editValue,
    cellFormats,
    columnOrder,
    columnSizing,
    rowOrder,
    rowHeights,
    conditionalRules,
  ]);

  // History API functions
  const record = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => ({
      ...prev,
      past: [...prev.past.slice(-prev.maxDepth + 1), entry],
      future: [],
      lastCommitTime: Date.now(),
    }));
  }, []);

  const applyEntry = useCallback(
    (entry: HistoryEntry, direction: "undo" | "redo") => {
      const isUndo = direction === "undo";
      switch (entry.type) {
        case "structure": {
          const state = isUndo ? entry.prev : entry.next;
          setCellData(state.cellData);
          setCellFormats(state.cellFormats);
          setHeaderData(state.headerData);
          setColumnTypeData(state.columnTypeData);
          setColumnSizing(state.columnSizing);
          setColumnOrder(state.columnOrder);
          setRowOrder(state.rowOrder);
          setRowHeights(state.rowHeights);
          setConditionalRules(state.conditionalRules);
          setSelectedCells(new Set(state.selectedCells));
          setActiveCell(state.activeCell);
          setColumnFilters(state.columnFilters);
          setSorting(state.sorting);
          setSelectionStartVisual(null);
          break;
        }
        case "rowHeights":
          setRowHeights(isUndo ? entry.prev : entry.next);
          break;
        case "conditionalRules":
          setConditionalRules(isUndo ? entry.prev : entry.next);
          break;
        case "cell":
        case "findReplace":
          setCellData((data) => {
            const updated = { ...data };
            entry.changes.forEach(({ key, prev, next }) => {
              updated[key] = (isUndo ? prev : next) ?? "";
            });
            return updated;
          });
          break;
        case "header":
          setHeaderData((d) => ({
            ...d,
            [entry.colIndex]: isUndo ? entry.prev : entry.next,
          }));
          break;
        case "columnType":
          setColumnTypeData((d) => {
            const updated = { ...d };
            const value = isUndo ? entry.prev : entry.next;
            if (value === undefined) delete updated[entry.colIndex];
            else updated[entry.colIndex] = value;
            return updated;
          });
          break;
        case "columnSizing":
          setColumnSizing(isUndo ? entry.prev : entry.next);
          break;
        case "columnOrder":
          setColumnOrder(isUndo ? entry.prev : entry.next);
          break;
        case "cellFormat":
          setCellFormats((data) => {
            const updated = { ...data };
            entry.changes.forEach(({ key, prev, next }) => {
              const value = isUndo ? prev : next;
              if (value === undefined) delete updated[key];
              else updated[key] = value;
            });
            return updated;
          });
          break;
      }
    },
    [],
  );

  const undo = useCallback(() => {
    const entry = history.past[history.past.length - 1];
    if (!entry) return;
    applyEntry(entry, "undo");
    setHistory((prev) => ({
      ...prev,
      past: prev.past.slice(0, -1),
      future: [...prev.future, entry],
    }));
  }, [history, applyEntry]);

  const redo = useCallback(() => {
    const entry = history.future[history.future.length - 1];
    if (!entry) return;
    applyEntry(entry, "redo");
    setHistory((prev) => ({
      ...prev,
      past: [...prev.past, entry],
      future: prev.future.slice(0, -1),
    }));
  }, [history, applyEntry]);

  const clearHistory = useCallback(() => {
    setHistory((prev) => ({ ...prev, past: [], future: [] }));
  }, []);

  useEffect(() => {
    if (resetKey === 0 || !initialData) return;

    setCellData(initialData.cellData ?? {});
    setHeaderData(initialData.headerData ?? {});
    setColumnTypeData(initialData.columnTypeData ?? {});
    setColumnSizing(initialData.columnSizing ?? {});
    setColumnOrder(
      initialData.columnOrder ??
        Array.from({ length: COLUMN_COUNT }, (_, i) => `col-${i}`),
    );
    setCellFormats(initialData.cellFormats ?? {});
    setRowOrder(
      initialData.rowOrder ?? Array.from({ length: ROW_COUNT }, (_, i) => i),
    );
    setRowHeights(initialData.rowHeights ?? {});
    setConditionalRules(initialData.conditionalRules ?? []);
    setHeightEditor(null);
    editingCellRef.current = null;
    setEditingCell(null);
    cellDraftRef.current = {};
    cellInitialValueRef.current = {};
    setSelectedCells(new Set());
    setActiveCell(null);
    setSelectionStartVisual(null);
    setSearchQuery("");
    setDebouncedSearch("");
    clearHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when parent discards unsaved edits
  }, [resetKey]);

  const handleFindReplace = useCallback(
    (updatedCells: Record<string, string>) => {
      if (isReadOnly) return;

      const changes: Array<{
        key: string;
        prev: string | undefined;
        next: string | undefined;
      }> = [];

      for (const [key, nextValue] of Object.entries(updatedCells)) {
        const prevValue = cellData[key];
        if (prevValue !== nextValue) {
          changes.push({ key, prev: prevValue, next: nextValue });
        }
      }

      if (changes.length > 0) {
        record({ type: "findReplace", changes, replaceAll: true });
      }

      setCellData(updatedCells);
    },
    [cellData, isReadOnly, record],
  );

  // Wrapped setHeaderData that records history
  const setHeaderDataWithRecord = useCallback(
    (updater: React.SetStateAction<Record<number, string>>) => {
      if (isReadOnly) return;

      setHeaderData((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        // Find which column changed
        for (const colIndex of Object.keys(next)) {
          const col = parseInt(colIndex);
          if (prev[col] !== next[col]) {
            record({
              type: "header",
              colIndex: col,
              prev: prev[col] ?? "",
              next: next[col] ?? "",
            });
            break; // Only record the first changed column
          }
        }
        return next;
      });
    },
    [isReadOnly, record],
  );

  // Ref for table container to manage cell focus
  const tableRef = useRef<HTMLDivElement>(null);

  const finishEdit = useCallback(
    (cancel = false) => {
      const key = editingCellRef.current;
      if (!key) return;
      const prev = cellInitialValueRef.current[key];
      const next = cellDraftRef.current[key] ?? cellDataRef.current[key];
      if (!cancel && !isReadOnly && !isSavePending?.() && prev !== next) {
        record({ type: "cell", changes: [{ key, prev, next }] });
        setCellData((data) => ({ ...data, [key]: next ?? "" }));
      }
      delete cellDraftRef.current[key];
      delete cellInitialValueRef.current[key];
      editingCellRef.current = null;
      setEditingCell(null);
    },
    [record, isReadOnly, isSavePending],
  );

  const startEdit = useCallback(
    (key: string, value?: string) => {
      if (isReadOnly || isSavePending?.()) return;
      if (editingCellRef.current !== key) {
        finishEdit();
        cellInitialValueRef.current[key] = cellDataRef.current[key];
        editingCellRef.current = key;
        setEditingCell(key);
        setEditValue(cellDataRef.current[key] ?? "");
      }
      if (value !== undefined) {
        cellDraftRef.current[key] = value;
        setEditValue(value);
      }
    },
    [finishEdit, isReadOnly, isSavePending],
  );

  useLayoutEffect(() => {
    if (!editingCell) return;
    const input = tableRef.current?.querySelector<HTMLTextAreaElement>(
      `textarea[data-cell-key="${editingCell}"]`,
    );
    input?.focus({ preventScroll: true });
    input?.setSelectionRange(input.value.length, input.value.length);
  }, [editingCell]);

  const applyValues = useCallback(
    (values: Record<string, string>) => {
      if (isReadOnly || isSavePending?.()) return;
      finishEdit(true);
      const changes = Object.entries(values).flatMap(([key, next]) => {
        const prev = cellDataRef.current[key];
        return (prev ?? "") === next ? [] : [{ key, prev, next }];
      });
      if (!changes.length) return;
      record({ type: "cell", changes });
      setCellData((data) => ({ ...data, ...values }));
    },
    [finishEdit, isReadOnly, isSavePending, record],
  );

  function changeStructure(
    axis: "row" | "column",
    target: number,
    after: boolean | null,
  ) {
    if (isReadOnly || isSavePending?.()) return;
    finishEdit(true);
    gestureCleanupRef.current?.();
    resizeCleanupRef.current?.();
    const prev: StructureState = {
      cellData,
      cellFormats,
      headerData,
      columnTypeData,
      columnSizing,
      columnOrder,
      rowOrder,
      rowHeights,
      conditionalRules,
      selectedCells: [...selectedCells],
      activeCell,
      columnFilters,
      sorting,
    };
    const next: StructureState = { ...prev };
    const order =
      axis === "row"
        ? [...rowOrder]
        : columnOrder.map((id) => Number(id.split("-")[1]));
    const at = order.indexOf(target);
    if (at < 0) return;
    const affected = (key: string, id: number) =>
      Number(key.split(",")[axis === "row" ? 0 : 1]) === id;
    if (after !== null) {
      const spare = order[order.length - 1];
      const occupied =
        Object.entries(cellData).some(
          ([key, value]) => value !== "" && affected(key, spare),
        ) ||
        Object.keys(cellFormats).some((key) => affected(key, spare)) ||
        conditionalRules.some((rule) =>
          (axis === "row" ? rule.rows : rule.columns).includes(spare),
        ) ||
        (axis === "row"
          ? rowHeights[spare] !== undefined
          : Boolean(
              headerData[spare] ||
                (columnTypeData[spare] && columnTypeData[spare] !== "blank") ||
                columnSizing[`col-${spare}`] !== undefined,
            ));
      if (occupied || spare === target) {
        toast.error(
          `Cannot insert: the final ${axis} must be empty and have no formatting, sizing or rule targets. The grid limit is ${axis === "row" ? ROW_COUNT : COLUMN_COUNT} ${axis}s.`,
        );
        return;
      }
      order.pop();
      order.splice(at + (after ? 1 : 0), 0, spare);
      if (
        axis === "row" &&
        (sorting.length || Object.keys(columnFilters).length)
      )
        toast.info(
          "Row inserted beside the original row. Sorting or column filters may move or hide the new blank row.",
        );
    } else {
      order.splice(at, 1);
      order.push(target);
      next.cellData = Object.fromEntries(
        Object.entries(cellData).filter(([key]) => !affected(key, target)),
      );
      next.cellFormats = Object.fromEntries(
        Object.entries(cellFormats).filter(([key]) => !affected(key, target)),
      );
      next.selectedCells = prev.selectedCells.filter(
        (key) => !affected(key, target),
      );
      if (
        activeCell &&
        (axis === "row" ? activeCell.row : activeCell.col) === target
      )
        next.activeCell = null;
      next.conditionalRules = conditionalRules
        .map((rule) => ({
          ...rule,
          ...(axis === "row"
            ? { rows: rule.rows.filter((id) => id !== target) }
            : { columns: rule.columns.filter((id) => id !== target) }),
        }))
        .filter((rule) => rule.rows.length && rule.columns.length);
      if (axis === "row") {
        next.rowHeights = { ...rowHeights };
        delete next.rowHeights[target];
      } else {
        next.headerData = { ...headerData };
        next.columnTypeData = { ...columnTypeData };
        next.columnSizing = { ...columnSizing };
        next.columnFilters = { ...columnFilters };
        delete next.headerData[target];
        delete next.columnTypeData[target];
        delete next.columnSizing[`col-${target}`];
        delete next.columnFilters[target];
        next.sorting = sorting.filter((sort) => sort.id !== `col-${target}`);
      }
    }
    if (axis === "row") next.rowOrder = order;
    else next.columnOrder = order.map((id) => `col-${id}`);
    const entry: HistoryEntry = { type: "structure", prev, next };
    applyEntry(entry, "redo");
    record(entry);
  }

  function setRowHeight(row: number, height?: number) {
    if (isReadOnly || isSavePending?.()) return;
    const next = { ...rowHeights };
    if (height === undefined || height === ROW_HEIGHT) delete next[row];
    else next[row] = Math.max(24, Math.min(300, Math.round(height)));
    if (JSON.stringify(next) === JSON.stringify(rowHeights)) return;
    record({ type: "rowHeights", prev: rowHeights, next });
    setRowHeights(next);
  }

  function startRowResize(row: number, event: React.PointerEvent) {
    if (event.button !== 0 || isReadOnly || isSavePending?.()) return;
    event.preventDefault();
    event.stopPropagation();
    resizeCleanupRef.current?.();
    const prev = rowHeights;
    const initial = rowHeights[row] ?? ROW_HEIGHT;
    const y = event.clientY;
    const pointerId = event.pointerId;
    let next = prev;
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const height = Math.max(
        24,
        Math.min(300, Math.round(initial + e.clientY - y)),
      );
      next = { ...prev };
      if (height === ROW_HEIGHT) delete next[row];
      else next[row] = height;
      setRowHeights(next);
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", complete);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("blur", cancel);
      resizeCleanupRef.current = null;
    };
    const complete = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      cleanup();
      if (JSON.stringify(prev) !== JSON.stringify(next))
        record({ type: "rowHeights", prev, next });
    };
    const cancel = () => {
      cleanup();
      setRowHeights(prev);
    };
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", complete);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", keydown);
    window.addEventListener("blur", cancel);
    resizeCleanupRef.current = cancel;
  }

  // Keyboard shortcuts (global - for undo/redo/find-replace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.isComposing ||
        composingRef.current ||
        !(e.target instanceof HTMLElement) ||
        !tableRef.current?.contains(e.target)
      )
        return;
      // Allow Ctrl/Cmd combinations
      const isCtrlCombo = (e.metaKey || e.ctrlKey) && !e.altKey;
      const key = e.key.toLowerCase();

      if (isCtrlCombo) {
        if (key === "z") {
          if (isReadOnly || editingCellRef.current) return;
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          return;
        } else if (key === "y") {
          if (isReadOnly) return;
          if (editingCellRef.current) return;
          e.preventDefault();
          redo();
          return;
        } else if (key === "r") {
          if (isReadOnly) return;
          e.preventDefault();
          finishEdit();
          setShowFindReplace(true);
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, isReadOnly, finishEdit]);

  // Handle onSaveSuccess callback - register clearHistory with parent
  useEffect(() => {
    if (onSaveSuccess) {
      onSaveSuccess(clearHistory);
    }
  }, [onSaveSuccess, clearHistory]);

  const selectionKeys = useMemo(
    () => getWorkbookSelectionKeys(selectedCells, activeCell),
    [selectedCells, activeCell],
  );

  const selectionFillState = useMemo(
    () =>
      getWorkbookSelectionFillState(selectionKeys, cellFormats, workbookTheme),
    [selectionKeys, cellFormats, workbookTheme],
  );

  const selectionTextState = useMemo(
    () =>
      getWorkbookSelectionTextState(
        selectionKeys,
        cellFormats,
        workbookTheme,
        textColors[0],
      ),
    [selectionKeys, cellFormats, workbookTheme, textColors],
  );

  const applyCellFormat = (getFormat: (key: string) => Partial<CellFormat>) => {
    if (isReadOnly || isSavePending?.()) return;
    finishEdit();
    const changes = selectionKeys.flatMap((key) => {
      const prev = cellFormats[key];
      const next = { ...prev, ...getFormat(key) };
      return JSON.stringify(prev ?? {}) === JSON.stringify(next)
        ? []
        : [{ key, prev, next }];
    });
    if (!changes.length) return;
    record({ type: "cellFormat", changes });
    setCellFormats((data) => ({
      ...data,
      ...Object.fromEntries(changes.map(({ key, next }) => [key, next])),
    }));
  };

  // Refresh TanStack's cached accessor values after a committed value change.
  const rows = useMemo(
    () =>
      displayRowOrder.map((rowIndex) => ({
        rowIndex,
        values: cellData,
      })),
    [cellData, displayRowOrder],
  );

  const columns: ColumnDef<{ rowIndex: number }>[] = useMemo(() => {
    return Array.from({ length: COLUMN_COUNT }, (_, colIndex) => ({
      id: `col-${colIndex}`,
      accessorFn: (row) =>
        cellDataRef.current[`${row.rowIndex},${colIndex}`] || undefined,
      sortUndefined: "last",
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as string | undefined;
        const b = rowB.getValue(columnId) as string | undefined;
        if (!a || !b) return 0;
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      },
      header: ({ column, table }) => (
        <EditableHeader column={column} table={table} />
      ),
      size: COL_WIDTH,
      minSize: MIN_COL_WIDTH,
      maxSize: MAX_COL_WIDTH,
    }));
  }, []);

  const globalFilterFn: FilterFn<{ rowIndex: number }> = useCallback(
    (
      row: Row<{ rowIndex: number }>,
      _columnId: string,
      filterValue: {
        columnFilters: Record<number, ColumnFilter>;
      },
    ) => {
      const rowIndex = row.original.rowIndex;
      const { columnFilters: filters } = filterValue || { columnFilters: {} };

      for (const [colIndexStr, filter] of Object.entries(filters)) {
        const colIndex = parseInt(colIndexStr);
        const cellValue = cellData[`${rowIndex},${colIndex}`];
        if (!applyFilter(cellValue, filter)) return false;
      }

      return true;
    },
    [cellData],
  );

  const globalFilterValue = useMemo(
    () => ({ columnFilters, cellData }),
    [columnFilters, cellData],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getRowId: (row) => String(row.rowIndex),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn,
    // The custom filter checks the whole row, even when its first cell is empty.
    getColumnCanGlobalFilter: (column) => column.id === "col-0",
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    meta: {
      headerData,
      setHeaderData: setHeaderDataWithRecord,
      cellData,
      isRedlineView,
      redlineMode,
      headerDiffs: redlineDiffs.headerDiffs,
      columnFilters,
      setColumnFilters,
      isReadOnly,
      workbookTheme,
      onColumnInsert: (column: number, after: boolean) =>
        changeStructure("column", column, after),
      onColumnDelete: (column: number) =>
        changeStructure("column", column, null),
    },
    state: {
      columnSizing,
      sorting,
      columnOrder: displayColumnOrder,
      globalFilter: globalFilterValue,
    },
    onColumnSizingChange: (updater) => {
      if (isReadOnly) return;

      const prev = columnSizing;
      const next = typeof updater === "function" ? updater(prev) : updater;
      // Coalesce: if same type within 500ms, replace last entry
      if (
        Date.now() - history.lastCommitTime < 500 &&
        history.past.length > 0
      ) {
        const last = history.past[history.past.length - 1];
        if (last.type === "columnSizing") {
          // Create new entry instead of mutating
          const updatedEntry: ColumnSizingEntry = { ...last, next };
          setHistory((prev) => ({
            ...prev,
            past: [...prev.past.slice(0, -1), updatedEntry],
          }));
          setColumnSizing(next);
          return;
        }
      }
      setColumnSizing(next);
      record({ type: "columnSizing", prev, next });
    },
  });

  const columnSizes = table.getVisibleLeafColumns().map((col) => col.getSize());

  const handlePaste = (e: React.ClipboardEvent, vRow: number, vCol: number) => {
    if (isReadOnly || isSavePending?.()) {
      e.preventDefault();
      return;
    }
    try {
      const html = e.clipboardData.getData("text/html");
      const text = e.clipboardData.getData("text/plain");
      if (editingCellRef.current && !/<table[\s>]/i.test(html) && !text.includes("\t")) return;
      const pastedRows = parseWorkbookClipboard(html, text);
      if (
        editingCellRef.current &&
        pastedRows.length === 1 &&
        pastedRows[0]?.length === 1
      )
        return;
      e.preventDefault();
      if (
        vRow + pastedRows.length > tableRows.length ||
        vCol + (pastedRows[0]?.length ?? 0) > visibleColumns.length
      ) {
        toast.error(
          "The pasted cells exceed the visible grid. Choose a smaller range or clear column filters.",
        );
        return;
      }
      const values: Record<string, string> = {};
      pastedRows.forEach((row, r) =>
        row.forEach((value, c) => {
          values[visualCellKey(vRow + r, vCol + c)] = value;
        }),
      );
      applyValues(values);
      setSelectedCells(new Set(Object.keys(values)));
    } catch (error) {
      e.preventDefault();
      toast.error(
        error instanceof Error ? error.message : "Could not paste cells",
      );
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    if (isReadOnly) return;
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const prev = columnOrder;
      const newOrder = arrayMove(
        columnOrder,
        columnOrder.indexOf(active.id as string),
        columnOrder.indexOf(over.id as string),
      );
      setColumnOrder(newOrder);
      record({ type: "columnOrder", prev, next: newOrder });
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (isReadOnly) return;

    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    const workbook = sparseProductSpecDataForDatabase(
      headerData,
      columnTypeData,
      editingCell ? { ...cellData, [editingCell]: editValue } : cellData,
      cellFormats,
      columnOrder,
      columnSizing,
      { rowOrder, rowHeights, conditionalRules },
    );
    const hasData = Object.values(workbook).some(
      (value) => value && Object.keys(value).length > 0,
    );

    if (hasData || hasOtherSheets) {
      pendingFileRef.current = file;
      setShowImportConfirm(true);
    } else {
      processImport(file);
    }
  }

  async function processImport(file: File, layouts?: Record<string, number>) {
    if (isReadOnly) return;
    const workbookRevision = getWorkbookRevision?.();

    try {
      const [buffer, { parseWorkbookToTableData, inspectWorkbookLayouts }] = await Promise.all([
        file.arrayBuffer(),
        import("@/lib/import-export"),
      ]);
      const guard = importGuardRef.current;
      if (
        guard.isReadOnly ||
        isSavePending?.() ||
        guard.resetKey !== resetKey ||
        guard.importRevision !== importRevision ||
        getWorkbookRevision?.() !== workbookRevision
      ) {
        toast.error(
          "The workbook changed while the file was loading. Please import it again.",
        );
        return;
      }
      if (!layouts) {
        const sheets = inspectWorkbookLayouts(buffer);
        if (sheets.some((sheet) => !sheet.known)) { setImportLayout({ file, sheets }); return; }
      }
      const imported = parseWorkbookToTableData(buffer, layouts);
      if (onWorkbookImport) {
        finishEdit(true);
        onWorkbookImport(imported);
        return;
      }
      const { headers, columnTypes, cells, cellFormats: formats } = imported;

      setHeaderData(headers);
      setColumnTypeData(columnTypes);
      setCellData(cells);
      setCellFormats(formats ?? {});
      setRowOrder(Array.from({ length: ROW_COUNT }, (_, i) => i));
      setRowHeights(imported.rowHeights ?? {});
      setConditionalRules([]);
      setColumnSizing({});
      setColumnFilters({});
      setSorting([]);
      finishEdit(true);
      setColumnOrder(
        Array.from({ length: COLUMN_COUNT }, (_, i) => `col-${i}`),
      );
      setSelectedCells(new Set());
      setActiveCell(null);
      setSelectionStartVisual(null);
      clearHistory();
    } catch (err) {
      console.error("Import failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to import file");
    }
  }

  function handleImportConfirm() {
    if (isReadOnly) return;

    setShowImportConfirm(false);
    if (pendingFileRef.current) {
      processImport(pendingFileRef.current);
      pendingFileRef.current = null;
    }
  }

  async function handleExport() {
    if (onWorkbookExport) { finishEdit(); onWorkbookExport(); return; }
    try {
      const { exportTableToWorkbook } = await import("@/lib/import-export");
      const filename = `product-data-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      exportTableToWorkbook(
        {
          headers: headerData,
          columnTypes: columnTypeData,
          cells: cellData,
          cellFormats,
          columnOrder,
          columnCount: COLUMN_COUNT,
          rowOrder,
          rowHeights,
          conditionalRules,
          columnSizing,
        },
        filename,
      );
    } catch (err) {
      console.error("Export failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to export file");
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {}),
  );

  const tableRows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => parentRef.current,
    getItemKey: (index) => tableRows[index].original.rowIndex,
    estimateSize: (index) =>
      rowHeights[tableRows[index].original.rowIndex] ?? ROW_HEIGHT,
    overscan: 5,
  });

  const visibleColumns = table.getVisibleLeafColumns();

  const colVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => columnSizes[index] ?? COL_WIDTH,
    horizontal: true,
    overscan: 2,
  });

  useEffect(() => {
    colVirtualizer.measure();
  }, [columnSizing, displayColumnOrder, colVirtualizer]);

  const headerGroup = table.getHeaderGroups()[0];
  const totalColumnWidth = columnSizes.reduce((sum, size) => sum + size, 0);

  const rowOffsets = useMemo(() => {
    const offsets = [0];
    for (const row of tableRows)
      offsets.push(
        offsets[offsets.length - 1] +
          (rowHeights[row.original.rowIndex] ?? ROW_HEIGHT),
      );
    return offsets;
  }, [tableRows, rowHeights]);

  useLayoutEffect(() => {
    rowVirtualizer.measure();
  }, [rowOffsets, rowVirtualizer]);

  function rowAtOffset(offset: number, offsets = rowOffsets) {
    let low = 0,
      high = offsets.length - 2;
    while (low < high) {
      const middle = Math.floor((low + high + 1) / 2);
      if (offsets[middle] <= offset) low = middle;
      else high = middle - 1;
    }
    return low;
  }

  function handleCellPointerDown(
    vRow: number,
    vCol: number,
    event: React.PointerEvent,
  ) {
    if (event.button !== 0) return;
    const key = visualCellKey(vRow, vCol);
    if (
      editingCellRef.current === key &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey
    ) {
      if (!(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        tableRef.current
          ?.querySelector<HTMLTextAreaElement>(`textarea[data-cell-key="${key}"]`)
          ?.focus({ preventScroll: true });
      }
      return;
    }
    event.preventDefault();
    gestureCleanupRef.current?.();
    finishEdit();
    const viewport = parentRef.current;
    if (!viewport) return;
    const anchor =
      event.shiftKey && selectionStartVisual
        ? selectionStartVisual
        : { row: vRow, col: vCol };
    const additive = event.ctrlKey || event.metaKey;
    const base = additive ? new Set(selectedCells) : new Set<string>();
    if (additive && base.has(key)) base.delete(key);
    else base.add(key);
    const before = selectedCells;
    const beforeActive = activeCell;
    const beforeAnchor = selectionStartVisual;
    const select = (r: number, c: number) => {
      const keys = additive ? new Set(base) : new Set<string>();
      for (
        let row = Math.min(anchor.row, r);
        row <= Math.max(anchor.row, r);
        row++
      )
        for (
          let col = Math.min(anchor.col, c);
          col <= Math.max(anchor.col, c);
          col++
        )
          keys.add(visualCellKey(row, col));
      setSelectedCells(keys);
    };
    if (event.shiftKey) select(vRow, vCol);
    else setSelectedCells(base);
    const [row, col] = key.split(",").map(Number);
    setActiveCell({ row, col });
    setSelectionStartVisual(anchor);
    pendingFocusRef.current = key;
    const pointerId = event.pointerId;
    const origin = { x: event.clientX, y: event.clientY };
    let pointer = origin;
    let dragging = false;
    let frame = 0;
    let lastRow = vRow,
      lastCol = vCol;
    const update = () => {
      if (!dragging) return;
      const rect = viewport.getBoundingClientRect();
      const x = pointer.x - rect.left,
        y = pointer.y - rect.top;
      if (y > rect.height - 28) viewport.scrollTop += 18;
      else if (y < ROW_HEIGHT * 2 + 20) viewport.scrollTop -= 18;
      if (x > rect.width - 28) viewport.scrollLeft += 18;
      else if (x < ROW_NUMBER_WIDTH + 20) viewport.scrollLeft -= 18;
      const r = rowAtOffset(y + viewport.scrollTop - ROW_HEIGHT * 2);
      let offset = ROW_NUMBER_WIDTH;
      let c = columnSizes.findIndex((width) => {
        offset += width;
        return x + viewport.scrollLeft < offset;
      });
      if (c < 0) c = visibleColumns.length - 1;
      if (r !== lastRow || c !== lastCol) {
        select(r, c);
        lastRow = r;
        lastCol = c;
      }
    };
    const tick = () => {
      update();
      frame = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointer = { x: e.clientX, y: e.clientY };
      if (Math.hypot(pointer.x - origin.x, pointer.y - origin.y) > 3)
        dragging = true;
      if (dragging) e.preventDefault();
      update();
    };
    const cleanup = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", complete);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("blur", cancel);
      gestureCleanupRef.current = null;
    };
    const complete = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      cleanup();
      if (dragging) {
        const end = visualCellKey(lastRow, lastCol);
        const [row, col] = end.split(",").map(Number);
        pendingFocusRef.current = end;
        setActiveCell({ row, col });
      }
    };
    const cancel = () => {
      cleanup();
      setSelectedCells(before);
      pendingFocusRef.current = beforeActive
        ? `${beforeActive.row},${beforeActive.col}`
        : null;
      setActiveCell(beforeActive);
      setSelectionStartVisual(beforeAnchor);
    };
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", complete);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", keydown);
    window.addEventListener("blur", cancel);
    gestureCleanupRef.current = cleanup;
    frame = requestAnimationFrame(tick);
  }

  function visualCellKey(row: number, col: number) {
    return `${tableRows[row].original.rowIndex},${visibleColumns[col].id.split("-")[1]}`;
  }

  const focusVisualCell = (row: number, col: number, extend = false) => {
    if (!tableRows.length || !visibleColumns.length) return;
    row = Math.max(0, Math.min(row, tableRows.length - 1));
    col = Math.max(0, Math.min(col, visibleColumns.length - 1));
    const key = visualCellKey(row, col);
    const [originalRow, originalCol] = key.split(",").map(Number);
    const anchor =
      selectionStartVisual ??
      (activeCell
        ? {
            row: rowPositions.get(activeCell.row) ?? row,
            col: colPositions.get(activeCell.col) ?? col,
          }
        : null);
    if (extend && anchor) {
      setSelectionStartVisual(anchor);
      const keys = new Set<string>();
      for (
        let r = Math.min(row, anchor.row);
        r <= Math.max(row, anchor.row);
        r++
      ) {
        for (
          let c = Math.min(col, anchor.col);
          c <= Math.max(col, anchor.col);
          c++
        )
          keys.add(visualCellKey(r, c));
      }
      setSelectedCells(keys);
    } else {
      setSelectedCells(new Set([key]));
      setSelectionStartVisual({ row, col });
    }
    setActiveCell({ row: originalRow, col: originalCol });
    pendingFocusRef.current = key;
    const viewport = parentRef.current;
    if (viewport) {
      const top = rowOffsets[row] + ROW_HEIGHT * 2;
      const height = rowOffsets[row + 1] - rowOffsets[row];
      const left = columnSizes
        .slice(0, col)
        .reduce((sum, size) => sum + size, ROW_NUMBER_WIDTH);
      if (top < viewport.scrollTop + ROW_HEIGHT * 2)
        viewport.scrollTop = top - ROW_HEIGHT * 2;
      else if (top + height > viewport.scrollTop + viewport.clientHeight)
        viewport.scrollTop = top + height - viewport.clientHeight;
      if (left < viewport.scrollLeft + ROW_NUMBER_WIDTH)
        viewport.scrollLeft = left - ROW_NUMBER_WIDTH;
      else if (
        left + columnSizes[col] >
        viewport.scrollLeft + viewport.clientWidth
      )
        viewport.scrollLeft = left + columnSizes[col] - viewport.clientWidth;
    }
  };

  // Virtualizers render synchronously. Retry focus after scrolling mounts the target.
  useLayoutEffect(() => {
    let frame = 0;
    let attempts = 0;
    const focus = () => {
      const key = pendingFocusRef.current;
      if (!key) return;
      const input = tableRef.current?.querySelector<HTMLTextAreaElement>(
        `textarea[data-cell-key="${key}"]`,
      );
      if (input) {
        input.focus({ preventScroll: true });
        pendingFocusRef.current = null;
      } else if (++attempts < 8) frame = requestAnimationFrame(focus);
    };
    focus();
    return () => cancelAnimationFrame(frame);
  });

  const rowPositions = useMemo(
    () =>
      new Map(tableRows.map((row, index) => [row.original.rowIndex, index])),
    [tableRows],
  );
  const colPositions = useMemo(
    () =>
      new Map(
        visibleColumns.map((col, index) => [
          Number(col.id.split("-")[1]),
          index,
        ]),
      ),
    [visibleColumns],
  );
  const mountedRows = rowVirtualizer.getVirtualItems();
  const mountedCols = colVirtualizer.getVirtualItems();
  const isMounted = (row?: number, col?: number) =>
    row !== undefined &&
    col !== undefined &&
    row >= (mountedRows[0]?.index ?? 0) &&
    row <= (mountedRows.at(-1)?.index ?? -1) &&
    col >= (mountedCols[0]?.index ?? 0) &&
    col <= (mountedCols.at(-1)?.index ?? -1);
  const tabStopKey =
    activeCell &&
    isMounted(rowPositions.get(activeCell.row), colPositions.get(activeCell.col))
      ? `${activeCell.row},${activeCell.col}`
      : mountedRows.length && mountedCols.length
        ? visualCellKey(mountedRows[0].index, mountedCols[0].index)
        : null;
  const searchMatches = useMemo(() => {
    if (!debouncedSearch) return [];
    const query = debouncedSearch.toLowerCase();
    return Object.entries(cellData)
      .flatMap(([key, value]) => {
        if (!value.toLowerCase().includes(query)) return [];
        const [row, col] = key.split(",").map(Number);
        const r = rowPositions.get(row);
        const c = colPositions.get(col);
        return r === undefined || c === undefined
          ? []
          : [{ key, row: r, col: c }];
      })
      .sort((a, b) => a.row - b.row || a.col - b.col);
  }, [debouncedSearch, cellData, rowPositions, colPositions]);
  const searchMatchKeys = useMemo(
    () => new Set(searchMatches.map(({ key }) => key)),
    [searchMatches],
  );
  const activeMatchIndex = searchMatches.findIndex(
    ({ key }) => key === activeSearchKey,
  );
  const navigateSearch = (step: number) => {
    if (!searchMatches.length) return;
    finishEdit();
    const index =
      activeMatchIndex < 0
        ? step > 0
          ? 0
          : searchMatches.length - 1
        : (activeMatchIndex + step + searchMatches.length) %
          searchMatches.length;
    const match = searchMatches[index];
    setActiveSearchKey(match.key);
    focusVisualCell(match.row, match.col);
  };

  useEffect(() => {
    const isVisible = (key: string) => {
      const [row, col] = key.split(",").map(Number);
      return rowPositions.has(row) && colPositions.has(col);
    };
    setActiveCell((cell) =>
      cell && !isVisible(`${cell.row},${cell.col}`) ? null : cell,
    );
    setSelectedCells((keys) => {
      const next = new Set([...keys].filter(isVisible));
      return next.size === keys.size ? keys : next;
    });
  }, [rowPositions, colPositions]);

  useEffect(() => {
    setSelectionStartVisual(null);
  }, [columnFilters, columnOrder, rowOrder, sorting]);

  type FillRange = { top: number; bottom: number; left: number; right: number };
  const selectionBounds = useMemo<FillRange | null>(() => {
    if (!selectedCells.size) return null;
    let top = Infinity,
      bottom = -1,
      left = Infinity,
      right = -1;
    for (const key of selectedCells) {
      const [r, c] = key.split(",").map(Number);
      const row = rowPositions.get(r),
        col = colPositions.get(c);
      if (row === undefined || col === undefined) return null;
      top = Math.min(top, row);
      bottom = Math.max(bottom, row);
      left = Math.min(left, col);
      right = Math.max(right, col);
    }
    return (bottom - top + 1) * (right - left + 1) === selectedCells.size
      ? { top, bottom, left, right }
      : null;
  }, [selectedCells, rowPositions, colPositions]);
  const [fillSource, setFillSource] = useState<FillRange | null>(null);
  const [fillPreview, setFillPreview] = useState<FillRange | null>(null);
  const fillContextRef = useRef<{
    pointerId: number;
    rows: number[];
    cols: number[];
    values: Record<string, string>;
    widths: number[];
    offsets: number[];
  } | null>(null);

  useEffect(() => {
    if (!fillSource || !fillContextRef.current || isReadOnly) return;
    const context = fillContextRef.current;
    const keyAt = (r: number, c: number) =>
      `${context.rows[r]},${context.cols[c]}`;
    const viewport = parentRef.current;
    if (!viewport) return;
    let preview = fillSource;
    let axis: "row" | "col" = "row";
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    const update = () => {
      if (!pointer) return;
      const rect = viewport.getBoundingClientRect();
      const x = pointer.x - rect.left;
      const y = pointer.y - rect.top;
      if (y > rect.height - 28) viewport.scrollTop += 18;
      else if (y < ROW_HEIGHT * 2 + 20) viewport.scrollTop -= 18;
      if (x > rect.width - 28) viewport.scrollLeft += 18;
      else if (x < ROW_NUMBER_WIDTH + 20) viewport.scrollLeft -= 18;
      const row = Math.max(
        fillSource.bottom,
        Math.min(
          context.rows.length - 1,
          rowAtOffset(y + viewport.scrollTop - ROW_HEIGHT * 2, context.offsets),
        ),
      );
      let offset = ROW_NUMBER_WIDTH;
      let col = context.widths.findIndex((width) => {
        offset += width;
        return x + viewport.scrollLeft < offset;
      });
      if (col < 0) col = context.widths.length - 1;
      col = Math.max(fillSource.right, col);
      axis = row - fillSource.bottom >= col - fillSource.right ? "row" : "col";
      const next = {
        ...fillSource,
        bottom: axis === "row" ? row : fillSource.bottom,
        right: axis === "col" ? col : fillSource.right,
      };
      if (preview.bottom !== next.bottom || preview.right !== next.right) {
        preview = next;
        setFillPreview(next);
      }
    };
    const tick = () => {
      update();
      frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerId !== context.pointerId) return;
      pointer = { x: event.clientX, y: event.clientY };
      update();
    };
    const cleanup = () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", complete);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
      window.removeEventListener("keydown", cancelOnKey);
    };
    const cancel = () => {
      cleanup();
      setFillSource(null);
      setFillPreview(null);
    };
    const cancelOnKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancel();
      }
    };
    const complete = (event: PointerEvent) => {
      if (event.pointerId !== context.pointerId) return;
      cleanup();
      if (!importGuardRef.current.isReadOnly && !isSavePending?.()) {
        const values: Record<string, string> = {};
        const keys = new Set<string>();
        const lanes = new Map<number, (index: number) => string>();
        for (let r = preview.top; r <= preview.bottom; r++) {
          for (let c = preview.left; c <= preview.right; c++) {
            const key = keyAt(r, c);
            keys.add(key);
            if (r <= fillSource.bottom && c <= fillSource.right) continue;
            const lane = axis === "row" ? c : r;
            if (!lanes.has(lane)) {
              const seeds =
                axis === "row"
                  ? context.rows
                      .slice(fillSource.top, fillSource.bottom + 1)
                      .map(
                        (_, i) =>
                          context.values[keyAt(fillSource.top + i, c)] ?? "",
                      )
                  : context.cols
                      .slice(fillSource.left, fillSource.right + 1)
                      .map(
                        (_, i) =>
                          context.values[keyAt(r, fillSource.left + i)] ?? "",
                      );
              lanes.set(lane, createWorkbookFill(seeds));
            }
            values[key] = lanes.get(lane)!(
              axis === "row" ? r - fillSource.top : c - fillSource.left,
            );
          }
        }
        applyValues(values);
        setSelectedCells(keys);
      }
      setFillSource(null);
      setFillPreview(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", complete);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
    window.addEventListener("keydown", cancelOnKey);
    frame = requestAnimationFrame(tick);
    return cleanup;
    // Keep the visible-coordinate snapshot stable for this drag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fillSource, isReadOnly, resetKey]);

  useEffect(() => {
    setFillSource(null);
    setFillPreview(null);
  }, [
    sorting,
    columnFilters,
    columnOrder,
    rowOrder,
    rowHeights,
    resetKey,
    isReadOnly,
  ]);

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 border-b border-border bg-muted/50 shrink-0">
        <WorkbookTextFormatToolbar
          formats={selectionKeys.map((key) => cellFormats[key] ?? {})}
          disabled={isReadOnly || !selectionKeys.length}
          onFormat={(format) => applyCellFormat((key) => ({ ...format, ...(format.dateFormat ? { date1904: cellFormats[key]?.date1904 } : {}) }))}
          onDecimals={(change) =>
            applyCellFormat((key) => {
              const raw = cellData[key] ?? "";
              if (workbookNumber(raw) === undefined) return {};
              return {
                decimalPlaces: Math.max(
                  0,
                  Math.min(
                    MAX_DECIMAL_PLACES,
                    (cellFormats[key]?.decimalPlaces ??
                      workbookDecimalPlaces(raw)) + change,
                  ),
                ),
              };
            })
          }
        >
          <WorkbookColorPopover
            icon={PaintBucketIcon}
            label="Fill color"
            colors={fillColors}
            currentColor={selectionFillState.color}
            isMixed={selectionFillState.isMixed}
            disabled={isReadOnly || !selectionKeys.length}
            variant="fill"
            onSelect={(color) =>
              applyCellFormat(() => ({
                bgColor: color === NO_FILL_COLOR ? undefined : color,
              }))
            }
          />
          <WorkbookColorPopover
            icon={TextSquareIcon}
            label="Text color"
            colors={textColors}
            currentColor={selectionTextState.color}
            isMixed={selectionTextState.isMixed}
            disabled={isReadOnly || !selectionKeys.length}
            variant="text"
            onSelect={(color) =>
              applyCellFormat(() => ({
                textColor: isDefaultWorkbookTextColor(color)
                  ? undefined
                  : color,
              }))
            }
          />
        </WorkbookTextFormatToolbar>


        <div className="w-px h-4 bg-border" />

        <WorkbookConditionalFormatDialog
          rules={conditionalRules}
          scope={
            selectionBounds
              ? {
                  rows: tableRows
                    .slice(selectionBounds.top, selectionBounds.bottom + 1)
                    .map((row) => row.original.rowIndex),
                  columns: visibleColumns
                    .slice(selectionBounds.left, selectionBounds.right + 1)
                    .map((col) => Number(col.id.split("-")[1])),
                }
              : null
          }
          rowOrder={rowOrder}
          columnOrder={columnOrder}
          fillColors={fillColors}
          textColors={textColors}
          disabled={isReadOnly || !!isSavePending?.()}
          onChange={(next) => {
            if (isReadOnly || isSavePending?.()) return;
            record({ type: "conditionalRules", prev: conditionalRules, next });
            setConditionalRules(next);
          }}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Undo"
              variant="outline"
              size="icon-xs"
              onClick={undo}
              disabled={isReadOnly || history.past.length === 0}
              className="hover:bg-accent-foreground/10"
            >
              <Icon icon={Undo02Icon} size={16} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Cmd+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Redo"
              variant="outline"
              size="icon-xs"
              onClick={redo}
              disabled={isReadOnly || history.future.length === 0}
              className="hover:bg-accent-foreground/10"
            >
              <Icon icon={Redo02Icon} size={16} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Cmd+Shift+Z)</TooltipContent>
        </Tooltip>

        <div className="flex-1" />

        <InputGroup className="h-7 w-64 max-w-full min-w-48">
          <InputGroupInput
            aria-label="Search table"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveSearchKey(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                navigateSearch(e.shiftKey ? -1 : 1);
              }
            }}
            className=" text-xs"
          />
          <InputGroupAddon className="pl-2">
            <Icon icon={Search02Icon} size={14} strokeWidth={2} />
          </InputGroupAddon>
          {searchQuery && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                aria-label="Clear search"
                size="icon-xs"
                onClick={() => {
                  setSearchQuery("");
                  setDebouncedSearch("");
                }}
              >
                <Icon icon={Cancel01Icon} size={14} strokeWidth={2} />
              </InputGroupButton>
            </InputGroupAddon>
          )}
          <InputGroupAddon align="inline-end" className="gap-0 pr-1">
            <span
              className="text-xs text-muted-foreground whitespace-nowrap"
              role="status"
              aria-live="polite"
            >
              {debouncedSearch
                ? `${activeMatchIndex < 0 ? 0 : activeMatchIndex + 1} / ${searchMatches.length}`
                : ""}
            </span>
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              aria-label="Previous search match"
              disabled={!searchMatches.length}
              onClick={() => navigateSearch(-1)}
            >
              <Icon icon={ArrowUp01Icon} size={14} strokeWidth={2} />
            </InputGroupButton>
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              aria-label="Next search match"
              disabled={!searchMatches.length}
              onClick={() => navigateSearch(1)}
            >
              <Icon icon={ArrowDown01Icon} size={14} strokeWidth={2} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-xs"
              aria-label="Find and replace"
              onClick={() => setShowFindReplace(true)}
              disabled={isReadOnly}
            >
              <Icon icon={SearchReplaceIcon} size={14} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Find &amp; Replace</TooltipContent>
        </Tooltip>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.numbers"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-xs"
              aria-label="Import file"
              onClick={() => fileInputRef.current?.click()}
              disabled={isReadOnly}
            >
              <Icon icon={FileImportIcon} size={14} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Import file</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-xs"
              aria-label="Export this table"
              onClick={handleExport}
            >
              <Icon icon={FileExportIcon} size={14} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export this table</TooltipContent>
        </Tooltip>
      </div>

      <DndContext
        id={dndContextId}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <ScrollAreaPrimitive.Root
          type="always"
          className="relative flex-1 min-h-0 min-w-0 overflow-hidden"
        >
          <ScrollAreaPrimitive.Viewport
            ref={parentRef}
            className="absolute inset-0 overscroll-contain [&>div]:!block"
          >
            <div
              ref={tableRef}
              role="grid"
              aria-label="Workbook sheet"
              aria-rowcount={tableRows.length + 2}
              aria-colcount={visibleColumns.length + 1}
              style={{
                height: rowVirtualizer.getTotalSize() + ROW_HEIGHT * 2,
                width: totalColumnWidth + ROW_NUMBER_WIDTH,
                position: "relative",
              }}
            >
              <div
                role="rowgroup"
                className="sticky top-0 z-20 bg-muted"
                style={{ height: ROW_HEIGHT * 2 }}
              >
                <div role="row" aria-rowindex={1} className="flex" style={{ height: ROW_HEIGHT }}>
                  <div
                    role="rowheader"
                    aria-colindex={1}
                    className="sticky left-0 z-30 bg-muted border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground"
                    style={{
                      width: ROW_NUMBER_WIDTH,
                      height: ROW_HEIGHT,
                      minWidth: ROW_NUMBER_WIDTH,
                    }}
                  >
                    1
                  </div>
                  <SortableContext
                    items={displayColumnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div
                      className="relative"
                      style={{ width: totalColumnWidth, height: ROW_HEIGHT }}
                    >
                      {colVirtualizer.getVirtualItems().map((virtualCol) => {
                        const header = headerGroup?.headers[virtualCol.index];
                        if (!header) return null;

                        const originalColIndex = parseInt(
                          header.column.id.split("-")[1],
                        );
                        const showChangeIndicator =
                          isRedlineView &&
                          redlineDiffs.changedCols.has(originalColIndex);

                        return (
                          <DraggableHeader
                            key={header.id}
                            header={header}
                            virtualCol={{
                              start: virtualCol.start,
                              size: virtualCol.size,
                            }}
                            colIndex={virtualCol.index + 2}
                            showChangeIndicator={showChangeIndicator}
                            isReadOnly={isReadOnly}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </div>

                <div role="row" aria-rowindex={2} className="flex" style={{ height: ROW_HEIGHT }}>
                  <div
                    role="rowheader"
                    aria-colindex={1}
                    className="sticky left-0 z-30 bg-muted border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground"
                    style={{
                      width: ROW_NUMBER_WIDTH,
                      height: ROW_HEIGHT,
                      minWidth: ROW_NUMBER_WIDTH,
                    }}
                  >
                    2
                  </div>
                  <div
                    className="relative"
                    style={{ width: totalColumnWidth, height: ROW_HEIGHT }}
                  >
                    {colVirtualizer.getVirtualItems().map((virtualCol) => {
                      const column = visibleColumns[virtualCol.index];
                      const originalColIndex = parseInt(
                        column.id.split("-")[1],
                      );
                      const diff = isRedlineView
                        ? redlineDiffs.columnTypeDiffs[originalColIndex]
                        : undefined;
                      const showInlineDiff =
                        isRedlineView && redlineMode === "inline" && diff;
                      const showHighlightDiff =
                        isRedlineView && redlineMode === "highlight" && diff;

                      const select = (
                        <div
                          key={`type-${column.id}`}
                          role="gridcell"
                          aria-colindex={virtualCol.index + 2}
                          className={cn(
                            "border-r border-b border-border flex items-center bg-muted",
                            showHighlightDiff && redlineHighlightRing,
                          )}
                          style={{
                            position: "absolute",
                            left: virtualCol.start,
                            width: virtualCol.size,
                            height: ROW_HEIGHT,
                            boxShadow: showHighlightDiff
                              ? getRedlineHighlightInsetShadow(workbookTheme)
                              : undefined,
                          }}
                        >
                          <DataTypeSelect
                            visibleIndex={virtualCol.index}
                            colIndex={originalColIndex}
                            value={
                              columnTypeData[originalColIndex] !== "blank"
                                ? columnTypeData[originalColIndex]
                                : undefined
                            }
                            isReadOnly={isReadOnly}
                            onChange={(col, val) => {
                              if (isReadOnly) return;
                              const prev = columnTypeData[col];
                              setColumnTypeData((d) => ({ ...d, [col]: val }));
                              if (prev !== val) {
                                record({
                                  type: "columnType",
                                  colIndex: col,
                                  prev,
                                  next: val,
                                });
                              }
                            }}
                          />
                          {showInlineDiff && diff && (
                            <div className="absolute inset-0 pointer-events-none bg-muted px-2 py-0.5 flex flex-col justify-center text-[10px] leading-tight">
                              <DiffValueDisplay
                                diff={diff}
                                formatValue={formatColumnTypeDiffValue}
                              />
                            </div>
                          )}
                        </div>
                      );

                      return showHighlightDiff && diff ? (
                        <Tooltip key={`type-${column.id}`}>
                          <TooltipTrigger asChild>{select}</TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <DiffValueDisplay
                              diff={diff}
                              formatValue={formatColumnTypeDiffValue}
                            />
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        select
                      );
                    })}
                  </div>
                </div>
              </div>

              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = tableRows[virtualRow.index];
                if (!row) return null;
                const rowIndex = row.original.rowIndex;

                return (
                  <div
                    key={row.id}
                    role="row"
                    aria-rowindex={virtualRow.index + 3}
                    className="flex"
                    style={{
                      position: "absolute",
                      top: virtualRow.start + ROW_HEIGHT * 2,
                      height: virtualRow.size,
                      width: totalColumnWidth + ROW_NUMBER_WIDTH,
                    }}
                  >
                    <div
                      role="rowheader"
                      aria-colindex={1}
                      className="sticky left-0 z-10 bg-muted border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground"
                      style={{
                        width: ROW_NUMBER_WIDTH,
                        minWidth: ROW_NUMBER_WIDTH,
                        height: virtualRow.size,
                      }}
                    >
                      {isRedlineView &&
                        redlineDiffs.changedRows.has(rowIndex) && (
                          <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                        )}
                      <span className="absolute start-0 w-8 text-center tabular-nums">{virtualRow.index + 3}</span>
                      {!isReadOnly && (
                        <>
                          <div className="absolute end-1 top-1/2 -translate-y-1/2">
                          <WorkbookHeaderMenu
                            label={`Row ${virtualRow.index + 3} options`}
                            axis="row"
                            onInsert={(after) =>
                              changeStructure("row", rowIndex, after)
                            }
                            onDelete={() =>
                              changeStructure("row", rowIndex, null)
                            }
                            onHeight={(reset) =>
                              reset
                                ? setRowHeight(rowIndex)
                                : setHeightEditor({
                                    row: rowIndex,
                                    value: String(
                                      rowHeights[rowIndex] ?? ROW_HEIGHT,
                                    ),
                                  })
                            }
                          />
                          </div>
                          <div
                            role="separator"
                            aria-orientation="horizontal"
                            aria-label={`Resize row ${virtualRow.index + 3}`}
                            className="absolute -bottom-1 left-0 z-20 h-2 w-full cursor-row-resize touch-none hover:bg-primary/50"
                            onPointerDown={(event) =>
                              startRowResize(rowIndex, event)
                            }
                            onDoubleClick={() => setRowHeight(rowIndex)}
                          />
                        </>
                      )}
                    </div>

                    <div
                      className="relative"
                      style={{
                        width: totalColumnWidth,
                        height: virtualRow.size,
                      }}
                    >
                      {colVirtualizer.getVirtualItems().map((virtualCol) => {
                        const column = visibleColumns[virtualCol.index];
                        const originalColIndex = parseInt(
                          column.id.split("-")[1],
                        );
                        const cellKey = `${rowIndex},${originalColIndex}`;
                        const format = resolveCellFormat(
                          cellKey,
                          cellData[cellKey] ?? "",
                          cellFormats[cellKey],
                        );
                        const isSelected = selectedCells.has(cellKey);
                        const diff = isRedlineView
                          ? redlineDiffs.cellDiffs[cellKey]
                          : undefined;
                        const isActiveDiffCell =
                          activeCell?.row === rowIndex &&
                          activeCell?.col === originalColIndex;
                        const showInlineDiff =
                          isRedlineView &&
                          redlineMode === "inline" &&
                          diff &&
                          !(isActiveDiffCell && !isReadOnly);
                        const showHighlightDiff =
                          isRedlineView && redlineMode === "highlight" && diff;

                        const resolvedBg = resolveWorkbookFillColor(
                          format?.bgColor,
                          workbookTheme,
                        );
                        const resolvedText = resolveWorkbookTextColor(
                          format?.textColor,
                          workbookTheme,
                        );

                        const cellValue =
                          editingCell === cellKey
                            ? editValue
                            : formatWorkbookValue(cellData[cellKey] ?? "", format);
                        const input = (
                          <textarea
                            rows={1}
                            wrap="off"
                            data-cell-key={cellKey}
                            tabIndex={cellKey === tabStopKey ? 0 : -1}
                            aria-label={`Row ${virtualRow.index + 3}, column ${virtualCol.index + 1}`}
                            readOnly={isReadOnly || editingCell !== cellKey}
                            onCompositionStart={() => {
                              composingRef.current = true;
                              startEdit(cellKey);
                            }}
                            onCompositionEnd={() => {
                              composingRef.current = false;
                            }}
                            className={cn(
                              "w-full resize-none border-0 bg-transparent outline-none px-2 text-sm leading-[1.5]",
                              showInlineDiff && "caret-transparent",
                              editingCell !== cellKey
                                ? "caret-transparent cursor-default select-none overflow-hidden"
                                : "cursor-text overflow-auto",
                            )}
                            style={{
                              height: Math.min(
                                virtualRow.size - 4,
                                Math.ceil((format.fontSize ?? 14) * 1.5) *
                                  cellValue.split("\n").length,
                              ),
                              flexShrink: 0,
                              backgroundColor: "transparent",
                              fontWeight: format?.bold ? "bold" : undefined,
                              fontStyle: format?.italic ? "italic" : undefined,
                              textDecoration: format?.underline
                                ? "underline"
                                : undefined,
                              fontSize: format?.fontSize,
                              textAlign: format?.alignment,
                              color: showInlineDiff || editingCell !== cellKey
                                ? "transparent"
                                : resolvedText || "inherit",
                              caretColor: showInlineDiff
                                ? "transparent"
                                : undefined,
                            }}
                            value={cellValue}
                            onChange={(e) => {
                              if (isReadOnly) return;
                              startEdit(cellKey);
                              cellDraftRef.current[cellKey] = e.target.value;
                              setEditValue(e.target.value);
                            }}
                            onContextMenu={(e) => {
                              if (e.ctrlKey || e.metaKey) e.preventDefault();
                            }}
                            onFocus={() => {
                              setActiveCell({
                                row: rowIndex,
                                col: originalColIndex,
                              });
                            }}
                            onBlur={() => {
                              if (editingCellRef.current === cellKey)
                                finishEdit();
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.nativeEvent.isComposing ||
                                composingRef.current
                              )
                                return;
                              if (e.keyCode === 229 || e.key === "Process") {
                                if (editingCellRef.current !== cellKey)
                                  startEdit(cellKey, "");
                                return;
                              }
                              const editing =
                                editingCellRef.current === cellKey;
                              if (e.key === "Escape" && editing) {
                                e.preventDefault();
                                finishEdit(true);
                                return;
                              }
                              if (e.key === "F2") {
                                e.preventDefault();
                                startEdit(cellKey);
                                return;
                              }
                              if (
                                e.key === "Enter" ||
                                (e.key === "Tab" && editing)
                              ) {
                                e.preventDefault();
                                finishEdit();
                                let r = virtualRow.index;
                                let c = virtualCol.index;
                                const step = e.shiftKey ? -1 : 1;
                                if (e.key === "Enter") r += step;
                                else {
                                  c += step;
                                  if (
                                    c >= visibleColumns.length &&
                                    r < tableRows.length - 1
                                  ) {
                                    c = 0;
                                    r++;
                                  } else if (c < 0 && r > 0) {
                                    c = visibleColumns.length - 1;
                                    r--;
                                  }
                                }
                                focusVisualCell(r, c);
                                return;
                              }
                              if (editing) return;
                              if (
                                [
                                  "ArrowUp",
                                  "ArrowDown",
                                  "ArrowLeft",
                                  "ArrowRight",
                                ].includes(e.key) &&
                                !e.ctrlKey &&
                                !e.metaKey &&
                                !e.altKey
                              ) {
                                e.preventDefault();
                                focusVisualCell(
                                  virtualRow.index +
                                    (e.key === "ArrowUp"
                                      ? -1
                                      : e.key === "ArrowDown"
                                        ? 1
                                        : 0),
                                  virtualCol.index +
                                    (e.key === "ArrowLeft"
                                      ? -1
                                      : e.key === "ArrowRight"
                                        ? 1
                                        : 0),
                                  e.shiftKey,
                                );
                                return;
                              }
                              if (isReadOnly || isSavePending?.()) return;
                              if (e.key === "Delete" || e.key === "Backspace") {
                                e.preventDefault();
                                const keys = selectionKeys.filter((key) => {
                                  const [r, c] = key.split(",").map(Number);
                                  return (
                                    rowPositions.has(r) && colPositions.has(c)
                                  );
                                });
                                applyValues(
                                  Object.fromEntries(
                                    keys.map((key) => [key, ""]),
                                  ),
                                );
                              } else if (
                                e.key.length === 1 &&
                                !e.ctrlKey &&
                                !e.metaKey &&
                                !e.altKey
                              ) {
                                e.preventDefault();
                                startEdit(cellKey, e.key);
                              }
                            }}
                            onPaste={(e) =>
                              handlePaste(e, virtualRow.index, virtualCol.index)
                            }
                          />
                        );

                        return (
                          <div
                            key={`${rowIndex}-${column.id}`}
                            role="gridcell"
                            aria-colindex={virtualCol.index + 2}
                            style={{
                              position: "absolute",
                              left: virtualCol.start,
                              width: virtualCol.size,
                              height: virtualRow.size,
                              backgroundColor:
                                resolvedBg || "var(--background)",
                              backgroundImage: searchMatchKeys.has(cellKey)
                                ? "linear-gradient(hsl(45 95% 55% / 0.35), hsl(45 95% 55% / 0.35))"
                                : undefined,
                              outline:
                                activeSearchKey === cellKey &&
                                searchMatchKeys.has(cellKey)
                                  ? "2px solid var(--primary)"
                                  : undefined,
                              outlineOffset: -2,

                              boxShadow: showHighlightDiff
                                ? getRedlineHighlightInsetShadow(workbookTheme)
                                : undefined,
                              justifyContent:
                                format.verticalAlignment === "top"
                                  ? "flex-start"
                                  : format.verticalAlignment === "bottom"
                                    ? "flex-end"
                                    : "center",
                              paddingBlock: 2,
                            }}
                            className={cn(
                              "relative flex flex-col border border-border cursor-default focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary",
                              editingCell === cellKey
                                ? "touch-auto"
                                : "touch-none",
                              showHighlightDiff && redlineHighlightBorder,
                              isSelected &&
                                "ring-1 ring-primary ring-inset border-foreground/60",
                            )}
                            onPointerDown={(event) =>
                              handleCellPointerDown(
                                virtualRow.index,
                                virtualCol.index,
                                event,
                              )
                            }
                            onDoubleClick={() => startEdit(cellKey)}
                          >
                            {showHighlightDiff ? (
                              <Tooltip>
                                <TooltipTrigger asChild>{input}</TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  <DiffValueDisplay
                                    diff={diff}
                                    formatValue={formatDiffValue}
                                  />
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              input
                            )}

                            {editingCell !== cellKey && !showInlineDiff && (
                              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 inset-y-0.5 flex flex-col overflow-hidden px-2 text-sm leading-[1.5]"
                                style={{ color: resolvedText || "inherit", fontSize: format.fontSize, fontWeight: format.bold ? "bold" : undefined, fontStyle: format.italic ? "italic" : undefined,
                                  justifyContent: format.verticalAlignment === "top" ? "flex-start" : format.verticalAlignment === "bottom" ? "safe flex-end" : "safe center" }}>
                                <div className="shrink-0">
                                  {cellValue.split("\n").map((line, index) => <div key={index} className="flex whitespace-pre" style={{ minHeight: "1.5em", justifyContent: format.alignment === "right" ? "flex-end" : format.alignment === "center" ? "center" : "flex-start" }}>
                                    <span className="shrink-0" style={{ textDecoration: format.underline ? "underline" : undefined }}>{line || "\u00a0"}</span>
                                  </div>)}
                                </div>
                              </div>
                            )}

                            {fillPreview &&
                              virtualRow.index >= fillPreview.top &&
                              virtualRow.index <= fillPreview.bottom &&
                              virtualCol.index >= fillPreview.left &&
                              virtualCol.index <= fillPreview.right && (
                                <div className="pointer-events-none absolute inset-0 border border-primary bg-primary/15" />
                              )}
                            {!isReadOnly &&
                              !editingCell &&
                              selectionBounds?.bottom === virtualRow.index &&
                              selectionBounds.right === virtualCol.index && (
                                <button
                                  type="button"
                                  tabIndex={-1}
                                  aria-label="Drag to autofill selected cells"
                                  title="Drag down or right to fill"
                                  className="absolute -bottom-0.5 -right-0.5 z-10 h-2.5 w-2.5 touch-none cursor-crosshair border border-background bg-primary"
                                  onDoubleClick={(e) => e.stopPropagation()}
                                  onPointerDown={(e) => {
                                    if (e.button !== 0 || isSavePending?.())
                                      return;
                                    e.preventDefault();
                                    e.stopPropagation();
                                    finishEdit();
                                    fillContextRef.current = {
                                      pointerId: e.pointerId,
                                      rows: tableRows.map(
                                        (row) => row.original.rowIndex,
                                      ),
                                      cols: visibleColumns.map((col) =>
                                        Number(col.id.split("-")[1]),
                                      ),
                                      values: cellDataRef.current,
                                      widths: columnSizes,
                                      offsets: rowOffsets,
                                    };
                                    setFillSource(selectionBounds);
                                    setFillPreview(selectionBounds);
                                  }}
                                />
                              )}
                            {showInlineDiff && diff && (
                              <div className="absolute inset-0 pointer-events-none px-2 py-1 flex flex-col justify-center gap-0.5 text-[10px]">
                                <DiffValueDisplay
                                  diff={diff}
                                  formatValue={formatDiffValue}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollAreaPrimitive.Viewport>
          <ScrollBar
            orientation="horizontal"
            className="z-40 [&>[data-slot=scroll-area-thumb]]:bg-foreground/40 hover:[&>[data-slot=scroll-area-thumb]]:bg-foreground/60"
          />
          <ScrollBar orientation="vertical" className="z-40" />
          <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
      </DndContext>

      <Dialog
        open={!!heightEditor}
        onOpenChange={(open) => {
          if (!open) setHeightEditor(null);
        }}
      >
        <DialogContent className="sm:max-w-xs">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (heightEditor)
                setRowHeight(heightEditor.row, Number(heightEditor.value));
              setHeightEditor(null);
            }}
          >
            <DialogHeader>
              <DialogTitle>Row height</DialogTitle>
              <DialogDescription>
                Set a height from 24 to 300 pixels. Default is 34.
              </DialogDescription>
            </DialogHeader>
            <Label htmlFor="workbook-row-height">Height in pixels</Label>
            <Input
              id="workbook-row-height"
              type="number"
              min={24}
              max={300}
              value={heightEditor?.value ?? ""}
              onChange={(event) =>
                setHeightEditor(
                  (state) => state && { ...state, value: event.target.value },
                )
              }
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setHeightEditor(null)}>Cancel</Button>
              <Button
                type="submit"
                disabled={
                  !heightEditor ||
                  !Number.isFinite(Number(heightEditor.value)) ||
                  Number(heightEditor.value) < 24 ||
                  Number(heightEditor.value) > 300
                }
              >
                Set row height
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!importLayout} onOpenChange={(open) => { if (!open) setImportLayout(null); }}>
        <AppDialogContent title="Import sheet layouts" description="Choose how each sheet stores its headers." size="md"
          primaryAction={{ label: "Import workbook", onClick: () => { if (!importLayout) return; const { file, sheets } = importLayout; setImportLayout(null); void processImport(file, Object.fromEntries(sheets.map((sheet) => [sheet.name, sheet.offset]))); } }}
          secondaryAction={{ label: "Cancel", onClick: () => setImportLayout(null) }}>
          <div className="space-y-4 p-4">
            <p className="text-sm text-muted-foreground">Raw cells keeps every row. For older Uprevit exports, choose the header layout explicitly. Each sheet supports 5,000 data rows and 150 columns; the workbook supports 750,000 data cells and 5 MiB.</p>
            {importLayout?.sheets.map((sheet, index) => <div key={sheet.name} className="space-y-2 rounded-md border p-3">
              <Label htmlFor={`import-layout-${index}`}>{sheet.name}</Label>
              <Select value={String(sheet.offset)} onValueChange={(value) => setImportLayout((current) => current && ({ ...current, sheets: current.sheets.map((item, at) => at === index ? { ...item, offset: Number(value) } : item) }))}>
                <SelectTrigger id={`import-layout-${index}`}><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="0">Raw cells — keep all rows</SelectItem><SelectItem value="1">First row contains column names</SelectItem><SelectItem value="2">First two rows contain names and classifications</SelectItem></SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{sheet.rows.toLocaleString()} file rows; {Math.max(0, sheet.rows - sheet.offset).toLocaleString()} data rows. {sheet.known ? "Uprevit layout detected." : "Header styling and sizing are retained for export."}</p>
            </div>)}
          </div>
        </AppDialogContent>
      </Dialog>
      <ConfirmFileImportAlertDialog
        open={showImportConfirm}
        onOpenChange={setShowImportConfirm}
        onConfirm={handleImportConfirm}
        onCancel={() => (pendingFileRef.current = null)}
      />

      <FindReplaceDialog
        open={showFindReplace}
        onOpenChange={setShowFindReplace}
        cellData={cellData}
        onReplace={handleFindReplace}
      />
    </div>
  );
}

export { ProductWorkbookSheets as ProductSpecificationDataTable } from "./ProductWorkbookSheets";

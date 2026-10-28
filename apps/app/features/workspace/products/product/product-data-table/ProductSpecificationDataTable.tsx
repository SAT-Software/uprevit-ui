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
  type ColumnFilter,
  type DataType,
} from "@/types/product-data-table";
import { sparseProductSpecDataForDatabase } from "@/utils/product/product-spec";
import {
  formatWorkbookValue,
  MAX_DECIMAL_PLACES,
  parseWorkbookClipboard,
  workbookDecimalPlaces,
  createWorkbookFill,
  workbookNumber,
} from "@/utils/product/workbook-cell-utils";
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

type HistoryEntry =
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
const ROW_NUMBER_WIDTH = 60;
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
        placeholder={`Column ${colIndex + 1}`}
        aria-label={`Column ${colIndex + 1} name`}
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
  showChangeIndicator = false,
  isReadOnly = false,
}: {
  header: Header<RowData, unknown>;
  virtualCol: { start: number; size: number };
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
  value,
  onChange,
  isReadOnly = false,
}: {
  colIndex: number;
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
      aria-label={`Column ${colIndex + 1} data type`}
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

export function ProductSpecificationDataTable({
  initialData,
  onDataChange,
  onSaveSuccess,
  resetKey = 0,
  isRedlineView = false,
  isReadOnly = false,
  isSavePending,
  redlineMode = "inline",
  redlineBaseData,
}: ProductSpecificationDataTableProps) {
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

  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
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
  const pendingFileRef = useRef<File | null>(null);
  const importGuardRef = useRef({ isReadOnly, resetKey, initialData });
  importGuardRef.current = { isReadOnly, resetKey, initialData };

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
  const tableRef = useRef<HTMLTableElement>(null);

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
          if (isReadOnly) return;
          e.preventDefault();
          if (editingCellRef.current) {
            finishEdit(true);
            return;
          }
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
      Array.from({ length: ROW_COUNT }, (_, rowIndex) => ({
        rowIndex,
        values: cellData,
      })),
    [cellData],
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
    },
    state: {
      columnSizing,
      sorting,
      columnOrder,
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

    const hasData =
      Object.keys(cellData).length > 0 || Object.keys(headerData).length > 0;

    if (hasData) {
      pendingFileRef.current = file;
      setShowImportConfirm(true);
    } else {
      processImport(file);
    }
  }

  async function processImport(file: File) {
    if (isReadOnly) return;

    try {
      const [buffer, { parseWorkbookToTableData }] = await Promise.all([
        file.arrayBuffer(),
        import("@/lib/import-export"),
      ]);
      const guard = importGuardRef.current;
      if (
        guard.isReadOnly ||
        isSavePending?.() ||
        guard.resetKey !== resetKey ||
        guard.initialData !== initialData
      ) {
        toast.error(
          "The workbook changed while the file was loading. Please import it again.",
        );
        return;
      }
      const {
        headers,
        columnTypes,
        cells,
        cellFormats: formats,
      } = parseWorkbookToTableData(buffer);

      setHeaderData(headers);
      setColumnTypeData(columnTypes);
      setCellData(cells);
      setCellFormats(formats ?? {});
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
    estimateSize: () => ROW_HEIGHT,
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
  }, [columnSizing, columnOrder, colVirtualizer]);

  const headerGroup = table.getHeaderGroups()[0];
  const totalColumnWidth = columnSizes.reduce((sum, size) => sum + size, 0);

  // Handle cell multi-selection via mouse down (fires before focus changes)
  const handleCellMouseDown = useCallback(
    (vRow: number, vCol: number, e: React.MouseEvent) => {
      const row = tableRows[vRow];
      const col = visibleColumns[vCol];
      if (!row || !col) return;

      const rowIndex = row.original.rowIndex;
      const colIndex = parseInt(col.id.split("-")[1]);
      const cellKey = `${rowIndex},${colIndex}`;
      if (
        editingCellRef.current === cellKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      )
        return;
      finishEdit();

      if (e.ctrlKey || e.metaKey) {
        // Prevent default to avoid context menu on Mac with Ctrl+Click
        e.preventDefault();
        const newSelected = new Set(selectedCells);
        if (newSelected.has(cellKey)) {
          newSelected.delete(cellKey);
        } else {
          newSelected.add(cellKey);
        }
        setSelectedCells(newSelected);
        setSelectionStartVisual({ row: vRow, col: vCol });
        setActiveCell({ row: rowIndex, col: colIndex });
        pendingFocusRef.current = cellKey;
      } else if (e.shiftKey && selectionStartVisual) {
        e.preventDefault();
        const minVRow = Math.min(selectionStartVisual.row, vRow);
        const maxVRow = Math.max(selectionStartVisual.row, vRow);
        const minVCol = Math.min(selectionStartVisual.col, vCol);
        const maxVCol = Math.max(selectionStartVisual.col, vCol);

        const newSelection = new Set<string>();
        for (let vr = minVRow; vr <= maxVRow; vr++) {
          for (let vc = minVCol; vc <= maxVCol; vc++) {
            const r = tableRows[vr].original.rowIndex;
            const c = parseInt(visibleColumns[vc].id.split("-")[1]);
            newSelection.add(`${r},${c}`);
          }
        }
        setSelectedCells(newSelection);
        setActiveCell({ row: rowIndex, col: colIndex });
        pendingFocusRef.current = cellKey;
      } else {
        // Normal click - single selection (let default focus behavior proceed)
        setSelectedCells(new Set([cellKey]));
        setSelectionStartVisual({ row: vRow, col: vCol });
        setActiveCell({ row: rowIndex, col: colIndex });
      }
    },
    [
      selectionStartVisual,
      selectedCells,
      tableRows,
      visibleColumns,
      finishEdit,
    ],
  );

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
      const top = row * ROW_HEIGHT + ROW_HEIGHT * 2;
      const left = columnSizes
        .slice(0, col)
        .reduce((sum, size) => sum + size, ROW_NUMBER_WIDTH);
      if (top < viewport.scrollTop + ROW_HEIGHT * 2)
        viewport.scrollTop = top - ROW_HEIGHT * 2;
      else if (top + ROW_HEIGHT > viewport.scrollTop + viewport.clientHeight)
        viewport.scrollTop = top + ROW_HEIGHT - viewport.clientHeight;
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
      const input = tableRef.current?.querySelector<HTMLInputElement>(
        `input[data-cell-key="${key}"]`,
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
  }, [columnFilters, columnOrder, sorting]);

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
          Math.floor((y + viewport.scrollTop - ROW_HEIGHT * 2) / ROW_HEIGHT),
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
  }, [sorting, columnFilters, columnOrder, resetKey, isReadOnly]);

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-border bg-muted/50 shrink-0">
        <WorkbookColorPopover
          icon={PaintBucketIcon}
          label="Fill color"
          colors={fillColors}
          currentColor={selectionFillState.color}
          isMixed={selectionFillState.isMixed}
          disabled={isReadOnly}
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
          disabled={isReadOnly}
          variant="text"
          onSelect={(color) =>
            applyCellFormat(() => ({
              textColor: isDefaultWorkbookTextColor(color) ? undefined : color,
            }))
          }
        />
        <WorkbookTextFormatToolbar
          formats={selectionKeys.map((key) => cellFormats[key] ?? {})}
          disabled={isReadOnly || !selectionKeys.length}
          onFormat={(format) => applyCellFormat(() => format)}
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
        />
        {selectedCells.size > 1 && (
          <>
            <div className="w-px h-5 bg-border" />
            <span className="text-xs text-muted-foreground">
              {selectedCells.size} cells selected
            </span>
          </>
        )}

        <div className="w-px h-5 bg-border" />

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

        <InputGroup className="max-w-48">
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
        </InputGroup>

        <span
          className="text-xs text-muted-foreground whitespace-nowrap"
          role="status"
          aria-live="polite"
        >
          {debouncedSearch
            ? `${activeMatchIndex < 0 ? 0 : activeMatchIndex + 1} / ${searchMatches.length} matches`
            : ""}
        </span>
        <Button
          variant="outline"
          size="icon-xs"
          aria-label="Previous search match"
          disabled={!searchMatches.length}
          onClick={() => navigateSearch(-1)}
        >
          <Icon icon={ArrowUp01Icon} size={14} strokeWidth={2} />
        </Button>
        <Button
          variant="outline"
          size="icon-xs"
          aria-label="Next search match"
          disabled={!searchMatches.length}
          onClick={() => navigateSearch(1)}
        >
          <Icon icon={ArrowDown01Icon} size={14} strokeWidth={2} />
        </Button>
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
            <table
              ref={tableRef}
              style={{
                height: rowVirtualizer.getTotalSize() + ROW_HEIGHT * 2,
                width: totalColumnWidth + ROW_NUMBER_WIDTH,
                position: "relative",
              }}
            >
              <thead
                className="sticky top-0 z-20 bg-muted"
                style={{ height: ROW_HEIGHT * 2 }}
              >
                <tr className="flex" style={{ height: ROW_HEIGHT }}>
                  <div
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
                    items={columnOrder}
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
                            showChangeIndicator={showChangeIndicator}
                            isReadOnly={isReadOnly}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </tr>

                <tr className="flex" style={{ height: ROW_HEIGHT }}>
                  <div
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
                </tr>
              </thead>

              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = tableRows[virtualRow.index];
                if (!row) return null;
                const rowIndex = row.original.rowIndex;

                return (
                  <tbody
                    key={row.id}
                    className="flex"
                    style={{
                      position: "absolute",
                      top: virtualRow.start + ROW_HEIGHT * 2,
                      height: virtualRow.size,
                      width: totalColumnWidth + ROW_NUMBER_WIDTH,
                    }}
                  >
                    <div
                      className="sticky left-0 z-10 bg-muted border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground relative"
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
                      {virtualRow.index + 3}
                    </div>

                    <tr
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
                        const format = cellFormats[cellKey];
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

                        const input = (
                          <input
                            data-cell-key={cellKey}
                            aria-label={`Row ${rowIndex + 1}, column ${originalColIndex + 1}`}
                            readOnly={isReadOnly}
                            onDoubleClick={() => startEdit(cellKey)}
                            onCompositionStart={() => {
                              composingRef.current = true;
                              startEdit(cellKey);
                            }}
                            onCompositionEnd={() => {
                              composingRef.current = false;
                            }}
                            className={cn(
                              "h-full w-full border border-border/60 outline-none px-2 text-sm",
                              isSelected
                                ? "ring-1 ring-primary ring-inset border-foreground/60"
                                : "border-border",
                              showHighlightDiff && redlineHighlightBorder,
                              showInlineDiff && "caret-transparent",
                              editingCell !== cellKey && "caret-transparent",
                            )}
                            style={{
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
                              fontWeight: format?.bold ? "bold" : undefined,
                              fontStyle: format?.italic ? "italic" : undefined,
                              textDecoration: format?.underline
                                ? "underline"
                                : undefined,
                              fontSize: format?.fontSize,
                              textAlign: format?.alignment,
                              boxShadow: showHighlightDiff
                                ? getRedlineHighlightInsetShadow(workbookTheme)
                                : undefined,
                              color: showInlineDiff
                                ? "transparent"
                                : resolvedText || "inherit",
                              caretColor: showInlineDiff
                                ? "transparent"
                                : undefined,
                            }}
                            value={
                              editingCell === cellKey
                                ? editValue
                                : formatWorkbookValue(
                                    cellData[cellKey] ?? "",
                                    format,
                                  )
                            }
                            onChange={(e) => {
                              if (isReadOnly) return;
                              startEdit(cellKey);
                              cellDraftRef.current[cellKey] = e.target.value;
                              setEditValue(e.target.value);
                            }}
                            onMouseDown={(e) =>
                              handleCellMouseDown(
                                virtualRow.index,
                                virtualCol.index,
                                e,
                              )
                            }
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
                                composingRef.current ||
                                e.keyCode === 229
                              )
                                return;
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
                              if (e.key === "Enter" || e.key === "Tab") {
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
                            style={{
                              position: "absolute",
                              left: virtualCol.start,
                              width: virtualCol.size,
                              height: virtualRow.size,
                            }}
                            className="relative"
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
                                  aria-label="Drag to autofill selected cells"
                                  title="Drag down or right to fill"
                                  className="absolute -bottom-0.5 -right-0.5 z-10 h-2.5 w-2.5 touch-none cursor-crosshair border border-background bg-primary"
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
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </ScrollAreaPrimitive.Viewport>
          <ScrollBar
            orientation="horizontal"
            className="z-40 [&>[data-slot=scroll-area-thumb]]:bg-foreground/40 hover:[&>[data-slot=scroll-area-thumb]]:bg-foreground/60"
          />
          <ScrollBar orientation="vertical" className="z-40" />
          <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
      </DndContext>

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

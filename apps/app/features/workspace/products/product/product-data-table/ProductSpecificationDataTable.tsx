"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import {
  InputGroup,
  InputGroupAddon,
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
  exportTableToWorkbook,
  parseWorkbookToTableData,
} from "@/lib/import-export";
import {
  ProductSpecificationDataTableProps,
  type CellFormat,
  type ColumnFilter,
  type DataType,
} from "@/types/product-data-table";
import { sparseProductSpecDataForDatabase } from "@/utils/product/product-spec";
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
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme } from "next-themes";
import {
  PiArrowClockwiseBold,
  PiArrowCounterClockwiseBold,
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiDotsSixVerticalBold,
  PiDownloadSimpleDuotone,
  PiMagnifyingGlassDuotone,
  PiUploadSimpleDuotone,
} from "react-icons/pi";
import { toast } from "sonner";
import { applyFilter, detectColumnDataType } from "./column-filter-utils";
import { ColumnFilterPopover } from "./ColumnFilterPopover";
import { ConfirmFileImportAlertDialog } from "./ConfirmFileImportAlertDialog";
import { FindReplaceDialog } from "./FindReplaceDialog";

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

const NO_FILL_COLOR = "transparent";

const LIGHT_FILL_COLORS = [
  NO_FILL_COLOR,
  "#f9fafb",
  "#fffbeb",
  "#f0fdf4",
  "#eff6ff",
  "#fdf2f8",
  "#fef2f2",
  "#eef2ff",
];

const DARK_FILL_COLORS = [
  NO_FILL_COLOR,
  "#27272a",
  "#422006",
  "#052e16",
  "#172554",
  "#4a044e",
  "#450a0a",
  "#312e81",
];

const DEFAULT_TEXT_COLORS = [
  "#000000",
  "#4b5563",
  "#d97706",
  "#16a34a",
  "#2563eb",
  "#db2777",
  "#dc2626",
  "#4f46e5",
];

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
        <span className="truncate text-red-600/80 line-through">
          {formatValue(diff.oldValue)}
        </span>
      )}
      {diff.status !== "removed" && (
        <span className="truncate text-blue-700 font-semibold">
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
        className={`h-full w-full bg-transparent outline-none text-xs font-medium placeholder:text-muted-foreground ${
          showHighlightDiff ? "ring-1 ring-amber-400/60 ring-inset" : ""
        } ${showInlineDiff ? "caret-transparent" : ""}`}
        style={{
          boxShadow: showHighlightDiff
            ? "inset 0 0 0 9999px rgba(251, 191, 36, 0.12)"
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
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="shrink-0 hover:bg-accent-foreground/10 rounded size-6"
      >
        {column.getIsSorted() === "desc" ? (
          <PiCaretDownDuotone className="h-3 w-3" />
        ) : column.getIsSorted() === "asc" ? (
          <PiCaretUpDuotone className="h-3 w-3" />
        ) : (
          <PiCaretUpDownDuotone className="h-3 w-3 opacity-50" />
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
        variant="ghost"
        size="icon-sm"
        disabled={isReadOnly}
        className={`shrink-0 hover:bg-accent-foreground/10 rounded size-6 ml-0.5 ${
          isReadOnly ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
        {...attributes}
        {...listeners}
      >
        <PiDotsSixVerticalBold className="h-3 w-3 opacity-50" />
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
    <SelectTrigger className="h-full w-full border-0 rounded-none shadow-none text-xs text-muted-foreground/90 focus:ring-0 py-1 pl-1 pr-2">
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
  isRedlineView = false,
  isReadOnly = false,
  redlineMode = "inline",
  redlineBaseData,
}: ProductSpecificationDataTableProps) {
  const { resolvedTheme } = useTheme();
  const parentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasLoadedData = useRef(false);
  const dndContextId = useId();
  const fillColors =
    resolvedTheme === "dark" ? DARK_FILL_COLORS : LIGHT_FILL_COLORS;

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
  const [columnFilters, setColumnFilters] = useState<
    Record<number, ColumnFilter>
  >({});
  const pendingFileRef = useRef<File | null>(null);

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
        cellData,
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
          entry.changes.forEach(({ key, prev, next }) => {
            const value = isUndo ? prev : next;
            setCellData((d) => ({ ...d, [key]: value ?? "" }));
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
          entry.changes.forEach(({ key, prev, next }) => {
            const value = isUndo ? prev : next;
            setCellFormats((d) => {
              const updated = { ...d };
              if (value === undefined) delete updated[key];
              else updated[key] = value;
              return updated;
            });
          });
          break;
        case "findReplace":
          entry.changes.forEach(({ key, prev, next }) => {
            const value = isUndo ? prev : next;
            setCellData((d) => ({ ...d, [key]: value ?? "" }));
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

  // Keyboard shortcuts (global - for undo/redo/find-replace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Ctrl/Cmd combinations
      const isCtrlCombo = (e.metaKey || e.ctrlKey) && !e.altKey;

      if (isCtrlCombo) {
        if (e.key === "z") {
          if (isReadOnly) return;
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          return;
        } else if (e.key === "y") {
          if (isReadOnly) return;
          e.preventDefault();
          redo();
          return;
        } else if (e.key === "r") {
          if (isReadOnly) return;
          e.preventDefault();
          setShowFindReplace(true);
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, isReadOnly]);

  // Handle onSaveSuccess callback - register clearHistory with parent
  useEffect(() => {
    if (onSaveSuccess) {
      onSaveSuccess(clearHistory);
    }
  }, [onSaveSuccess, clearHistory]);

  const applyBgColor = useCallback(
    (color: string) => {
      if (isReadOnly) return;

      const changes: Array<{
        key: string;
        prev: CellFormat | undefined;
        next: CellFormat;
      }> = [];
      if (selectedCells.size === 0 && activeCell) {
        const key = `${activeCell.row},${activeCell.col}`;
        const prev = cellFormats[key];
        const next = {
          ...prev,
          bgColor: color === NO_FILL_COLOR ? undefined : color,
        };
        changes.push({ key, prev, next });
        setCellFormats((f) => ({ ...f, [key]: next }));
      } else {
        selectedCells.forEach((key) => {
          const prev = cellFormats[key];
          const next = {
            ...prev,
            bgColor: color === NO_FILL_COLOR ? undefined : color,
          };
          changes.push({ key, prev, next });
        });
        setCellFormats((f) => {
          const updated = { ...f };
          selectedCells.forEach((key) => {
            updated[key] = {
              ...updated[key],
              bgColor: color === NO_FILL_COLOR ? undefined : color,
            };
          });
          return updated;
        });
      }
      if (changes.length > 0) {
        record({ type: "cellFormat", changes });
      }
    },
    [selectedCells, activeCell, cellFormats, isReadOnly, record],
  );

  const applyTextColor = useCallback(
    (color: string) => {
      if (isReadOnly) return;

      const changes: Array<{
        key: string;
        prev: CellFormat | undefined;
        next: CellFormat;
      }> = [];
      if (selectedCells.size === 0 && activeCell) {
        const key = `${activeCell.row},${activeCell.col}`;
        const prev = cellFormats[key];
        const next = {
          ...prev,
          textColor: color === "#000000" ? undefined : color,
        };
        changes.push({ key, prev, next });
        setCellFormats((f) => ({ ...f, [key]: next }));
      } else {
        selectedCells.forEach((key) => {
          const prev = cellFormats[key];
          const next = {
            ...prev,
            textColor: color === "#000000" ? undefined : color,
          };
          changes.push({ key, prev, next });
        });
        setCellFormats((f) => {
          const updated = { ...f };
          selectedCells.forEach((key) => {
            updated[key] = {
              ...updated[key],
              textColor: color === "#000000" ? undefined : color,
            };
          });
          return updated;
        });
      }
      if (changes.length > 0) {
        record({ type: "cellFormat", changes });
      }
    },
    [selectedCells, activeCell, cellFormats, isReadOnly, record],
  );

  const rows: { rowIndex: number }[] = useMemo(() => {
    return Array.from({ length: ROW_COUNT }, (_, i) => ({
      rowIndex: i,
    }));
  }, []);

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
        search: string;
        columnFilters: Record<number, ColumnFilter>;
      },
    ) => {
      const rowIndex = row.original.rowIndex;
      const { search, columnFilters: filters } = filterValue || {
        search: "",
        columnFilters: {},
      };

      for (const [colIndexStr, filter] of Object.entries(filters)) {
        const colIndex = parseInt(colIndexStr);
        const cellValue = cellData[`${rowIndex},${colIndex}`];
        if (!applyFilter(cellValue, filter)) return false;
      }

      if (!search) return true;
      const searchTerm = search.toLowerCase();
      for (let col = 0; col < COLUMN_COUNT; col++) {
        const cellValue = cellData[`${rowIndex},${col}`];
        if (cellValue?.toLowerCase().includes(searchTerm)) return true;
      }
      return false;
    },
    [cellData],
  );

  const globalFilterValue = useMemo(
    () => ({ search: debouncedSearch, columnFilters }),
    [debouncedSearch, columnFilters],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn,
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

  const handlePaste = useCallback(
    (e: React.ClipboardEvent, rowIndex: number, colIndex: number) => {
      if (isReadOnly) return;
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      const pastedRows = text.split("\n").map((r) => r.split("\t"));

      const changes: Array<{
        key: string;
        prev: string | undefined;
        next: string;
      }> = [];
      setCellData((d) => {
        const updated = { ...d };
        pastedRows.forEach((cols, ri) => {
          cols.forEach((val, ci) => {
            const key = `${rowIndex + ri},${colIndex + ci}`;
            if (d[key] !== val) {
              changes.push({ key, prev: d[key], next: val });
              updated[key] = val;
            }
          });
        });
        return updated;
      });

      if (changes.length > 0) {
        record({ type: "cell", changes });
      }
    },
    [isReadOnly, record],
  );

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
      const buffer = await file.arrayBuffer();
      const { headers, columnTypes, cells } = parseWorkbookToTableData(buffer);

      setHeaderData(headers);
      setColumnTypeData(columnTypes);
      setCellData(cells);
      setCellFormats({});
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

  function handleExport() {
    try {
      const filename = `product-data-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      exportTableToWorkbook(
        {
          headers: headerData,
          columnTypes: columnTypeData,
          cells: cellData,
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

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const atLeft = el.scrollLeft === 0;
      const atRight = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      const scrollingLeft = e.deltaX < 0;
      const scrollingRight = e.deltaX > 0;

      if ((atLeft && scrollingLeft) || (atRight && scrollingRight)) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const tableRows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const visibleColumns = table.getVisibleLeafColumns();

  const colVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => columnSizes[index] ?? COL_WIDTH,
    horizontal: true,
    overscan: 5,
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
      } else {
        // Normal click - single selection (let default focus behavior proceed)
        setSelectedCells(new Set([cellKey]));
        setSelectionStartVisual({ row: vRow, col: vCol });
        setActiveCell({ row: rowIndex, col: colIndex });
      }
    },
    [selectionStartVisual, selectedCells, tableRows, visibleColumns],
  );

  // Move to adjacent cell and focus it (using visual indices)
  const moveToCellAndFocus = useCallback(
    (
      currentVRow: number,
      currentVCol: number,
      direction: "up" | "down" | "left" | "right",
    ) => {
      let newVRow = currentVRow;
      let newVCol = currentVCol;

      switch (direction) {
        case "up":
          newVRow = Math.max(0, currentVRow - 1);
          break;
        case "down":
          newVRow = Math.min(tableRows.length - 1, currentVRow + 1);
          break;
        case "left":
          newVCol = Math.max(0, currentVCol - 1);
          break;
        case "right":
          newVCol = Math.min(visibleColumns.length - 1, currentVCol + 1);
          break;
      }

      if (newVRow !== currentVRow || newVCol !== currentVCol) {
        const row = tableRows[newVRow];
        const col = visibleColumns[newVCol];
        const rowIndex = row.original.rowIndex;
        const colIndex = parseInt(col.id.split("-")[1]);
        const cellKey = `${rowIndex},${colIndex}`;

        setSelectedCells(new Set([cellKey]));
        setSelectionStartVisual({ row: newVRow, col: newVCol });
        setActiveCell({ row: rowIndex, col: colIndex });

        // Only scroll if the target cell is not currently visible/rendered
        const isRowVisible = rowVirtualizer
          .getVirtualItems()
          .some((item) => item.index === newVRow);
        const isColVisible = colVirtualizer
          .getVirtualItems()
          .some((item) => item.index === newVCol);

        if (!isRowVisible) {
          rowVirtualizer.scrollToIndex(newVRow, { align: "auto" });
        }
        if (!isColVisible) {
          colVirtualizer.scrollToIndex(newVCol, { align: "auto" });
        }

        // Focus the new cell input after state update and potential scroll
        requestAnimationFrame(() => {
          const newCellInput = tableRef.current?.querySelector(
            `input[data-cell-key="${cellKey}"]`,
          ) as HTMLInputElement | null;
          // preventScroll: true is critical to stop browser-native jumpy scrolling
          newCellInput?.focus({ preventScroll: true });
        });
      }
    },
    [tableRows, visibleColumns, rowVirtualizer, colVirtualizer],
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-2 px-2 py-2 border-b border-border bg-muted/50 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Fill:</span>
          <div className="flex gap-0.5">
            {fillColors.map((color) => (
              <button
                key={`bg-${color}`}
                onClick={() => applyBgColor(color)}
                disabled={isReadOnly}
                className="size-5 rounded border border-border hover:ring-2 hover:ring-primary/50 transition-all"
                style={
                  color === NO_FILL_COLOR
                    ? {
                        backgroundColor: "var(--background)",
                        backgroundImage:
                          "linear-gradient(135deg, transparent 44%, rgba(248, 113, 113, 0.9) 44%, rgba(248, 113, 113, 0.9) 56%, transparent 56%)",
                      }
                    : { backgroundColor: color }
                }
                title={color === NO_FILL_COLOR ? "No fill" : color}
              />
            ))}
          </div>
        </div>
        <div className="w-px h-5 bg-border" />
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Text:</span>
          <div className="flex gap-0.5">
            {DEFAULT_TEXT_COLORS.map((color) => (
              <button
                key={`text-${color}`}
                onClick={() => applyTextColor(color)}
                disabled={isReadOnly}
                className="size-5 rounded border border-border hover:ring-2 hover:ring-primary/50 transition-all flex items-center justify-center"
                title={color === "#000000" ? "Default" : color}
              >
                <span className="text-xs font-bold" style={{ color }}>
                  A
                </span>
              </button>
            ))}
          </div>
        </div>
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
              variant="ghost"
              size="icon-sm"
              onClick={undo}
              disabled={isReadOnly || history.past.length === 0}
              className="hover:bg-accent-foreground/10"
            >
              <PiArrowCounterClockwiseBold className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Cmd+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={redo}
              disabled={isReadOnly || history.future.length === 0}
              className="hover:bg-accent-foreground/10"
            >
              <PiArrowClockwiseBold className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Cmd+Shift+Z)</TooltipContent>
        </Tooltip>

        <div className="flex-1" />

        <InputGroup className="max-w-48 h-7">
          <InputGroupInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" text-xs"
          />
          <InputGroupAddon className="pl-2">
            <PiMagnifyingGlassDuotone className="size-3" />
          </InputGroupAddon>
        </InputGroup>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowFindReplace(true)}
          disabled={isReadOnly}
        >
          <PiMagnifyingGlassDuotone className="size-3" />
          Find & Replace
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.numbers"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isReadOnly}
          // className="gap-1.5"
        >
          <PiUploadSimpleDuotone className="size-3" />
          Import
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          // className="gap-1.5"
        >
          <PiDownloadSimpleDuotone className="size-3" />
          Export
        </Button>
      </div>

      <DndContext
        id={dndContextId}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div
          ref={parentRef}
          className="flex-1 min-h-0 overflow-auto overscroll-contain"
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
                    const originalColIndex = parseInt(column.id.split("-")[1]);
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
                        className={`border-r border-b border-border flex items-center bg-muted ${
                          showHighlightDiff
                            ? "ring-1 ring-amber-400/60 ring-inset"
                            : ""
                        }`}
                        style={{
                          position: "absolute",
                          left: virtualCol.start,
                          width: virtualCol.size,
                          height: ROW_HEIGHT,
                          boxShadow: showHighlightDiff
                            ? "inset 0 0 0 9999px rgba(251, 191, 36, 0.12)"
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

                      const input = (
                        <input
                          data-cell-key={cellKey}
                          readOnly={isReadOnly}
                          className={`h-full w-full border border-border/60 outline-none px-2 text-sm ${
                            isSelected
                              ? "ring-1 ring-primary ring-inset border-foreground/60"
                              : "border-border"
                          } ${
                            showHighlightDiff
                              ? "ring-1 ring-amber-400/60 border-amber-400/70"
                              : ""
                          } ${showInlineDiff ? "caret-transparent" : ""}`}
                          style={{
                            backgroundColor:
                              format?.bgColor || "var(--background)",
                            boxShadow: showHighlightDiff
                              ? "inset 0 0 0 9999px rgba(251, 191, 36, 0.12)"
                              : undefined,
                            color: showInlineDiff
                              ? "transparent"
                              : format?.textColor || "inherit",
                            caretColor: showInlineDiff
                              ? "transparent"
                              : undefined,
                          }}
                          value={
                            cellDraftRef.current[cellKey] ??
                            cellData[cellKey] ??
                            ""
                          }
                          onChange={(e) => {
                            if (isReadOnly) return;
                            cellDraftRef.current[cellKey] = e.target.value;
                            setCellData((d) => ({
                              ...d,
                              [cellKey]: e.target.value,
                            }));
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
                            cellInitialValueRef.current[cellKey] =
                              cellData[cellKey];
                            setActiveCell({
                              row: rowIndex,
                              col: originalColIndex,
                            });
                          }}
                          onBlur={() => {
                            if (isReadOnly) return;
                            const prev = cellInitialValueRef.current[cellKey];
                            const next =
                              cellDraftRef.current[cellKey] ??
                              cellData[cellKey];
                            if (prev !== next) {
                              record({
                                type: "cell",
                                changes: [{ key: cellKey, prev, next }],
                              });
                            }
                            delete cellDraftRef.current[cellKey];
                            delete cellInitialValueRef.current[cellKey];
                          }}
                          onKeyDown={(e) => {
                            // Arrow key cell navigation
                            if (
                              [
                                "ArrowUp",
                                "ArrowDown",
                                "ArrowLeft",
                                "ArrowRight",
                              ].includes(e.key)
                            ) {
                              e.preventDefault();
                              const direction = e.key
                                .replace("Arrow", "")
                                .toLowerCase() as
                                | "up"
                                | "down"
                                | "left"
                                | "right";
                              moveToCellAndFocus(
                                virtualRow.index,
                                virtualCol.index,
                                direction,
                              );
                              return;
                            }

                            if (isReadOnly) return;

                            if (e.key === "Enter") {
                              const prev = cellInitialValueRef.current[cellKey];
                              const next =
                                cellDraftRef.current[cellKey] ??
                                cellData[cellKey];
                              if (prev !== next) {
                                record({
                                  type: "cell",
                                  changes: [{ key: cellKey, prev, next }],
                                });
                              }
                              delete cellDraftRef.current[cellKey];
                              // Re-capture initial value for subsequent edits
                              cellInitialValueRef.current[cellKey] = next;
                            }
                          }}
                          onPaste={(e) =>
                            handlePaste(e, rowIndex, originalColIndex)
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
        </div>
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

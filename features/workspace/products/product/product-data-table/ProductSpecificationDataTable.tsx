"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ColumnDef,
  type ColumnSizingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
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
import {
  PiCaretDownDuotone,
  PiCaretUpDownDuotone,
  PiCaretUpDuotone,
  PiDotsSixVerticalBold,
} from "react-icons/pi";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
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
  ProductSpecificationDataTableProps,
  sparseProductSpecDataForDatabase,
  type CellFormat,
  type DataType,
  type ProductDataTableSchema,
} from "@/types/product-data-table";

const COLUMN_COUNT = 150;
const ROW_COUNT = 5000;
const COL_WIDTH = 150;
const ROW_HEIGHT = 34;
const ROW_NUMBER_WIDTH = 50;
const MIN_COL_WIDTH = 50;
const MAX_COL_WIDTH = 500;

const DEFAULT_COLORS = [
  "#ffffff",
  "#f9fafb",
  "#fffbeb",
  "#f0fdf4",
  "#eff6ff",
  "#fdf2f8",
  "#fef2f2",
  "#eef2ff",
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

const EditableHeaderContent = ({
  column,
  table,
}: {
  column: any;
  table: any;
}) => {
  const colIndex = parseInt(column.id.split("-")[1]);
  const meta = table.options.meta as {
    headerData: Record<number, string>;
    setHeaderData: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  };

  return (
    <>
      <input
        className="flex-1 min-w-0 bg-transparent outline-none text-xs font-medium placeholder:text-muted-foreground"
        value={meta.headerData[colIndex] ?? ""}
        onChange={(e) =>
          meta.setHeaderData((d) => ({ ...d, [colIndex]: e.target.value }))
        }
        placeholder={`Column ${colIndex + 1}`}
      />
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
    </>
  );
};

const DraggableHeader = ({
  header,
  virtualCol,
}: {
  header: any;
  virtualCol: { start: number; size: number };
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
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 cursor-grab active:cursor-grabbing hover:bg-accent-foreground/10 rounded size-6 ml-0.5"
        {...attributes}
        {...listeners}
      >
        <PiDotsSixVerticalBold className="h-3 w-3 opacity-50" />
      </Button>

      <div className="flex items-center flex-1 min-w-0 gap-1 pr-1">
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>

      {header.column.getCanResize() && (
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

const EditableHeader = ({ column, table }: { column: any; table: any }) => {
  return <EditableHeaderContent column={column} table={table} />;
};

const DATA_TYPE_OPTIONS = [
  { value: "blank", label: "Blank" },
  { value: "constant", label: "Constant Data" },
  { value: "variable", label: "Variable Data" },
  { value: "na", label: "NA" },
] as const;

const DataTypeSelect = ({
  colIndex,
  value,
  onChange,
}: {
  colIndex: number;
  value: DataType | undefined;
  onChange: (colIndex: number, value: DataType) => void;
}) => (
  <Select
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
}: ProductSpecificationDataTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const [cellData, setCellData] = useState<Record<string, string>>(
    initialData?.cellData ?? {}
  );
  const cellDataRef = useRef<Record<string, string>>({});
  cellDataRef.current = cellData;

  const [headerData, setHeaderData] = useState<Record<number, string>>(
    initialData?.headerData ?? {}
  );

  const [columnTypeData, setColumnTypeData] = useState<
    Record<number, DataType>
  >(initialData?.columnTypeData ?? {});

  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    initialData?.columnSizing ?? {}
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    initialData?.columnOrder ??
      Array.from({ length: COLUMN_COUNT }, (_, i) => `col-${i}`)
  );

  const [cellFormats, setCellFormats] = useState<Record<string, CellFormat>>(
    initialData?.cellFormats ?? {}
  );

  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [selectionStart, setSelectionStart] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    if (onDataChange) {
      const data = sparseProductSpecDataForDatabase(
        headerData,
        columnTypeData,
        cellData,
        cellFormats,
        columnOrder,
        columnSizing
      );
      onDataChange(data);
    }
  }, [
    headerData,
    columnTypeData,
    cellData,
    cellFormats,
    columnOrder,
    columnSizing,
    onDataChange,
  ]);

  const applyBgColor = useCallback(
    (color: string) => {
      if (selectedCells.size === 0 && activeCell) {
        const key = `${activeCell.row},${activeCell.col}`;
        setCellFormats((f) => ({
          ...f,
          [key]: {
            ...f[key],
            bgColor: color === "#ffffff" ? undefined : color,
          },
        }));
      } else {
        setCellFormats((f) => {
          const updated = { ...f };
          selectedCells.forEach((key) => {
            updated[key] = {
              ...updated[key],
              bgColor: color === "#ffffff" ? undefined : color,
            };
          });
          return updated;
        });
      }
    },
    [selectedCells, activeCell]
  );

  const applyTextColor = useCallback(
    (color: string) => {
      if (selectedCells.size === 0 && activeCell) {
        const key = `${activeCell.row},${activeCell.col}`;
        setCellFormats((f) => ({
          ...f,
          [key]: {
            ...f[key],
            textColor: color === "#000000" ? undefined : color,
          },
        }));
      } else {
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
    },
    [selectedCells, activeCell]
  );

  const handleCellClick = useCallback(
    (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
      const cellKey = `${rowIndex},${colIndex}`;

      if (e.shiftKey && selectionStart) {
        const minRow = Math.min(selectionStart.row, rowIndex);
        const maxRow = Math.max(selectionStart.row, rowIndex);
        const minCol = Math.min(selectionStart.col, colIndex);
        const maxCol = Math.max(selectionStart.col, colIndex);

        const newSelection = new Set<string>();
        for (let r = minRow; r <= maxRow; r++) {
          for (let c = minCol; c <= maxCol; c++) {
            newSelection.add(`${r},${c}`);
          }
        }
        setSelectedCells(newSelection);
      } else {
        setSelectedCells(new Set([cellKey]));
        setSelectionStart({ row: rowIndex, col: colIndex });
      }
      setActiveCell({ row: rowIndex, col: colIndex });
    },
    [selectionStart]
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

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnOrderChange: setColumnOrder,
    meta: {
      headerData,
      setHeaderData,
    },
    state: {
      columnSizing,
      sorting,
      columnOrder,
    },
    onColumnSizingChange: setColumnSizing,
  });

  const columnSizes = useMemo(() => {
    return table.getVisibleLeafColumns().map((col) => col.getSize());
  }, [table.getState().columnSizing]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent, rowIndex: number, colIndex: number) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      const pastedRows = text.split("\n").map((r) => r.split("\t"));
      setCellData((d) => {
        const updated = { ...d };
        pastedRows.forEach((cols, ri) => {
          cols.forEach((val, ci) => {
            updated[`${rowIndex + ri},${colIndex + ci}`] = val;
          });
        });
        return updated;
      });
    },
    []
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
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
    useSensor(KeyboardSensor, {})
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
  }, [columnSizes]);

  const headerGroup = table.getHeaderGroups()[0];
  const totalColumnWidth = columnSizes.reduce((sum, size) => sum + size, 0);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-4 px-3 py-2 border-b border-border bg-muted/50 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Fill:</span>
          <div className="flex gap-0.5">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={`bg-${color}`}
                onClick={() => applyBgColor(color)}
                className="size-5 rounded border border-border hover:ring-2 hover:ring-primary/50 transition-all"
                style={{ backgroundColor: color }}
                title={color === "#ffffff" ? "No fill" : color}
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
      </div>

      <DndContext
        collisionDetection={closestCenter}
        id={useId()}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div
          ref={parentRef}
          className="flex-1 min-h-0 overflow-auto overscroll-contain"
        >
          <table
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

                      return (
                        <DraggableHeader
                          key={header.id}
                          header={header}
                          virtualCol={{
                            start: virtualCol.start,
                            size: virtualCol.size,
                          }}
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

                    return (
                      <div
                        key={`type-${column.id}`}
                        className="border-r border-b border-border flex items-center bg-muted"
                        style={{
                          position: "absolute",
                          left: virtualCol.start,
                          width: virtualCol.size,
                          height: ROW_HEIGHT,
                        }}
                      >
                        <DataTypeSelect
                          colIndex={originalColIndex}
                          value={
                            columnTypeData[originalColIndex] !== "blank"
                              ? columnTypeData[originalColIndex]
                              : undefined
                          }
                          onChange={(col, val) =>
                            setColumnTypeData((d) => ({ ...d, [col]: val }))
                          }
                        />
                      </div>
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
                    className="sticky left-0 z-10 bg-muted border-r border-b border-border flex items-center justify-center text-xs font-medium text-muted-foreground"
                    style={{
                      width: ROW_NUMBER_WIDTH,
                      minWidth: ROW_NUMBER_WIDTH,
                      height: virtualRow.size,
                    }}
                  >
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
                        column.id.split("-")[1]
                      );
                      const cellKey = `${rowIndex},${originalColIndex}`;
                      const format = cellFormats[cellKey];
                      const isSelected = selectedCells.has(cellKey);

                      return (
                        <input
                          key={`${rowIndex}-${column.id}`}
                          className={`border border-border/60 outline-none px-2 text-sm ${
                            isSelected
                              ? "ring-1 ring-primary ring-inset border-foreground/60"
                              : "border-border"
                          }`}
                          style={{
                            position: "absolute",
                            left: virtualCol.start,
                            width: virtualCol.size,
                            height: virtualRow.size,
                            backgroundColor:
                              format?.bgColor || "var(--background)",
                            color: format?.textColor || "inherit",
                          }}
                          value={cellData[cellKey] ?? ""}
                          onChange={(e) =>
                            setCellData((d) => ({
                              ...d,
                              [cellKey]: e.target.value,
                            }))
                          }
                          onClick={(e) =>
                            handleCellClick(rowIndex, originalColIndex, e)
                          }
                          onFocus={() =>
                            setActiveCell({
                              row: rowIndex,
                              col: originalColIndex,
                            })
                          }
                          onPaste={(e) =>
                            handlePaste(e, rowIndex, originalColIndex)
                          }
                        />
                      );
                    })}
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      </DndContext>
    </div>
  );
}

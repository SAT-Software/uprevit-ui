"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ProductDataTableSchema, ProductSpecificationDataTableProps, WorkbookSheet } from "@/types/product-data-table";
import { parseProductSpecDataFromDatabase, sparseProductSpecDataForDatabase } from "@/utils/product/product-spec";
import { WorkbookSheetGrid } from "./ProductSpecificationDataTable";
import { Button } from "@uprevit/ui/components/ui/button";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Add01Icon, ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Tooltip, TooltipTrigger, TooltipContent } from "@uprevit/ui/components/ui/tooltip";
import { formatWorkbookValue } from "@/utils/product/workbook-cell-utils";
import { toast } from "sonner";
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@uprevit/ui/components/ui/context-menu";

const emptySheet = (): ProductDataTableSchema => ({ headers: {}, columnTypes: {}, cells: {} });

function initialSheets(data: ProductSpecificationDataTableProps["initialData"]): WorkbookSheet[] {
  return data?.sheets ?? [{ id: "sheet-1", name: "Sheet1", data: data ? sparseProductSpecDataForDatabase(data.headerData, data.columnTypeData, data.cellData, data.cellFormats, data.columnOrder, data.columnSizing, data) : emptySheet() }];
}

export function ProductWorkbookSheets(props: ProductSpecificationDataTableProps) {
  const [source, setSource] = useState(props.sourceRevision);
  const [revision, setRevision] = useState(0);
  if (source !== props.sourceRevision) { setSource(props.sourceRevision); setRevision((value) => value + 1); }
  return <WorkbookSheets key={`${props.resetKey ?? 0}-${revision}`} {...props} />;
}

function WorkbookSheets(props: ProductSpecificationDataTableProps) {
  const [sheets, setSheets] = useState(() => initialSheets(props.initialData));
  const sheetsRef = useRef(sheets);
  const mutationRevision = useRef(0);
  const getWorkbookRevision = useCallback(() => mutationRevision.current, []);
  const [active, setActive] = useState(sheets[0].id);
  const sheetRailRef = useRef<HTMLDivElement>(null);
  const sheetScrollRef = useRef<HTMLDivElement>(null);
  const sheetContentsRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ overflow: false, left: false, right: false });
  const updateSheetScroll = useCallback(() => {
    const rail = sheetRailRef.current;
    const viewport = sheetScrollRef.current;
    const contents = sheetContentsRef.current;
    if (!rail || !viewport || !contents) return;
    const next = { overflow: contents.scrollWidth > rail.clientWidth + 1, left: viewport.scrollLeft > 1, right: viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 1 };
    setScrollState((previous) => previous.overflow === next.overflow && previous.left === next.left && previous.right === next.right ? previous : next);
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(updateSheetScroll);
    if (sheetRailRef.current) observer.observe(sheetRailRef.current);
    if (sheetContentsRef.current) observer.observe(sheetContentsRef.current);
    updateSheetScroll();
    return () => observer.disconnect();
  }, [updateSheetScroll]);
  const scrollSheets = (direction: -1 | 1) => {
    const viewport = sheetScrollRef.current;
    if (viewport) viewport.scrollBy({ left: direction * Math.max(100, viewport.clientWidth * 0.75), behavior: "instant" });
  };
  const [selectionCounts, setSelectionCounts] = useState<Record<string, number>>({});
  const [generation, setGeneration] = useState(0);
  const [rename, setRename] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [deleteSheet, setDeleteSheet] = useState<string | null>(null);
  const canEdit = !props.isReadOnly && !props.isRedlineView && !props.isSavePending?.();
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }));
  const clearers = useRef(new Map<string, () => void>());
  const loaded = useRef(!!props.initialData);
  const emit = (next: WorkbookSheet[]) => {
    const previous = sheetsRef.current;
    if (next.length !== previous.length || next.some((sheet, index) => {
      const old = previous[index];
      return !old || sheet.id !== old.id || sheet.name !== old.name || (sheet.data !== old.data && JSON.stringify(sheet.data) !== JSON.stringify(old.data));
    })) mutationRevision.current++;
    sheetsRef.current = next;
    // Preserve the legacy representation until the user creates or imports sheets.
    props.onDataChange?.(next.length === 1 && !props.initialData?.sheets && next[0].name === "Sheet1" ? next[0].data : { ...emptySheet(), sheets: next });
  };
  const reorder = (id: string, targetId: string) => {
    if (!canEdit || id === targetId) return;
    const current = sheetsRef.current;
    const from = current.findIndex((sheet) => sheet.id === id);
    const to = current.findIndex((sheet) => sheet.id === targetId);
    if (from < 0 || to < 0) return;
    const next = arrayMove(current, from, to);
    emit(next); setSheets(next);
  };
  const openRename = (sheet: WorkbookSheet) => {
    if (!canEdit) return;
    setRename(sheet.id); setName(sheet.name);
  };
  useEffect(() => {
    if (loaded.current || !props.initialData) return;
    const next = initialSheets(props.initialData);
    sheetsRef.current = next;
    setSheets(next);
    setActive(next[0].id);
    setGeneration((value) => value + 1);
    loaded.current = true;
  }, [props.initialData]);
  const onSaveSuccess = props.onSaveSuccess;
  useEffect(() => {
    onSaveSuccess?.(() => clearers.current.forEach((clear) => clear()));
  }, [onSaveSuccess]);
  const baseSheets: WorkbookSheet[] = props.redlineBaseData?.sheets ?? (props.redlineBaseData ? [{
    id: "sheet-1", name: "Sheet1", data: {
      headers: props.redlineBaseData.headerData,
      columnTypes: Object.fromEntries(Object.entries(props.redlineBaseData.columnTypeData).filter(([, value]) => value !== "blank")) as ProductDataTableSchema["columnTypes"],
      cells: props.redlineBaseData.cellData,
    },
  }] : []);
  const displaySheets = props.isRedlineView ? [...sheets, ...baseSheets.filter((base) => !sheets.some((sheet) => sheet.id === base.id)).map((base) => ({ ...base, data: emptySheet() }))] : sheets;
  const candidate = name.trim();
  const error = !candidate ? "Enter a sheet name." : candidate.length > 31 ? "Use 31 characters or fewer." : /[\\/?:*\[\]]/.test(candidate) || candidate.startsWith("'") || candidate.endsWith("'") ? "Avoid \\ / ? : * [ ] and leading or trailing apostrophes." : sheets.some((sheet) => sheet.id !== rename && sheet.name.toLowerCase() === name.trim().toLowerCase()) ? "A sheet already uses this name." : null;
  return <div className="flex min-h-0 min-w-0 flex-1 flex-col">
    {displaySheets.map((sheet) => <div key={`${generation}-${sheet.id}`} className={sheet.id === active ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
      <StableWorkbookSheetGrid {...props}
        isReadOnly={props.isReadOnly || props.isRedlineView}
        hasOtherSheets={sheets.length > 1}
        getWorkbookRevision={getWorkbookRevision}
        sheetData={sheet.data}
        onSelectionCountChange={(count) => setSelectionCounts((current) => current[sheet.id] === count ? current : { ...current, [sheet.id]: count })}
        redlineBaseData={props.isRedlineView ? parseProductSpecDataFromDatabase(baseSheets.find((base) => base.id === sheet.id)?.data ?? emptySheet()) : undefined}
        onSaveSuccess={(clear) => clearers.current.set(sheet.id, clear)}
        onDataChange={(data) => {
          const cellFormats = Object.fromEntries(Object.entries(data.cellFormats ?? {}).map(([key, format]) => {
            const raw = data.cells[key] ?? "";
            return [key, format.dateFormat ? { ...format, dateRaw: raw, dateDisplay: formatWorkbookValue(raw, format) } : format];
          }));
          emit(sheetsRef.current.map((item) => item.id === sheet.id ? { ...item, data: { ...data, cellFormats: Object.keys(cellFormats).length ? cellFormats : undefined, sheetLayout: item.data.sheetLayout, headerRows: item.data.headerRows } } : item));
        }}
        onWorkbookImport={(data) => {
          const next = data.sheets ?? [{ id: crypto.randomUUID(), name: "Sheet1", data }];
          emit(next); setSheets(next); setActive(next[0].id); setGeneration((value) => value + 1);
        }}
        onWorkbookExport={async () => {
          try {
            const { exportWorkbookSheets } = await import("@/lib/import-export");
            exportWorkbookSheets(sheetsRef.current, "product-data.xlsx");
          } catch (error) { toast.error(error instanceof Error ? error.message : "Export failed"); }
        }}
      />
    </div>)}
    <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[restrictToHorizontalAxis]} onDragEnd={({ active, over }) => { if (over) reorder(String(active.id), String(over.id)); }}>
    <div className="flex shrink-0 items-center gap-2 border-t bg-muted/50 p-1.5">
    <div ref={sheetRailRef} className="flex min-w-0 flex-1 items-center gap-1">
    {scrollState.overflow && <Button size="icon-xs" variant="outline" className="shrink-0" aria-label="Scroll sheets left" disabled={!scrollState.left} onClick={() => scrollSheets(-1)}><Icon icon={ArrowLeft01Icon} size={14} /></Button>}
    <div ref={sheetScrollRef} onScroll={updateSheetScroll} className="min-w-0 flex-1 overflow-x-auto" aria-label="Workbook sheets">
    <div ref={sheetContentsRef} className="flex w-max items-center gap-1">
      <SortableContext items={displaySheets.map((sheet) => sheet.id)} strategy={horizontalListSortingStrategy}>
      {displaySheets.map((sheet, index) => <WorkbookSheetTab key={sheet.id} sheet={sheet} status={props.isRedlineView ? !sheets.some((current) => current.id === sheet.id) ? "Deleted" : !baseSheets.some((base) => base.id === sheet.id) ? "Added" : undefined : undefined} active={active === sheet.id} disabled={!canEdit} canDelete={sheets.length > 1} canMoveLeft={index > 0} canMoveRight={index < sheets.length - 1}
        onSelect={() => setActive(sheet.id)} onRename={() => openRename(sheet)} onDelete={() => setDeleteSheet(sheet.id)}
        onMove={(direction) => reorder(sheet.id, sheets[index + direction].id)} />)}
      </SortableContext>
      {!props.isReadOnly && !props.isRedlineView && <>
        <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="ghost" aria-label="Add sheet" disabled={props.isSavePending?.()} onClick={() => {
          let index = sheets.length + 1;
          while (sheets.some((sheet) => sheet.name.toLowerCase() === `sheet${index}`)) index++;
          const sheet = { id: crypto.randomUUID(), name: `Sheet${index}`, data: emptySheet() };
          const next = [...sheetsRef.current, sheet]; emit(next); setSheets(next); setActive(sheet.id);
        }}><Icon icon={Add01Icon} /></Button></TooltipTrigger><TooltipContent>Add a new sheet</TooltipContent></Tooltip>
      </>}
    </div>
    </div>
    {scrollState.overflow && <Button size="icon-xs" variant="outline" className="shrink-0" aria-label="Scroll sheets right" disabled={!scrollState.right} onClick={() => scrollSheets(1)}><Icon icon={ArrowRight01Icon} size={14} /></Button>}
    </div>
    <span role="status" className="w-32 shrink-0 px-2 text-end text-xs text-muted-foreground tabular-nums">{selectionCounts[active] > 1 ? `${selectionCounts[active]} cells selected` : ""}</span>
    </div>
    </DndContext>
    <Dialog open={!!rename} onOpenChange={(open) => { if (!open) setRename(null); }}>
      <AppDialogContent title="Rename sheet" description="Choose a unique sheet name." size="sm"
        primaryAction={{ label: "Save name", disabled: !!error || !canEdit, onClick: () => { if (!canEdit || error) return; const next = sheetsRef.current.map((sheet) => sheet.id === rename ? { ...sheet, name: candidate } : sheet); emit(next); setSheets(next); setRename(null); } }}
        secondaryAction={{ label: "Cancel", onClick: () => setRename(null) }}>
        <div className="space-y-2 p-4"><Label htmlFor="workbook-sheet-name">Sheet name</Label><Input id="workbook-sheet-name" value={name} onChange={(event) => setName(event.target.value)} aria-invalid={!!error} aria-describedby="workbook-sheet-error" /><p id="workbook-sheet-error" className="text-xs text-muted-foreground" role="status">{error ?? "Use a unique name of up to 31 characters."}</p></div>
      </AppDialogContent>
    </Dialog>
    <Dialog open={!!deleteSheet} onOpenChange={(open) => { if (!open) setDeleteSheet(null); }}>
      <AppDialogContent title="Delete sheet?" description="Delete this sheet and all of its contents." variant="confirm-destructive" size="sm"
        confirmContent={{ message: `“${sheets.find((sheet) => sheet.id === deleteSheet)?.name ?? ""}” and all its contents will be removed. Save the workbook to keep this change.` }}
        secondaryAction={{ label: "Cancel", onClick: () => setDeleteSheet(null) }}
        primaryAction={{ label: "Delete sheet", variant: "destructive", disabled: !canEdit || sheets.length <= 1, onClick: () => {
          if (!canEdit || sheetsRef.current.length <= 1) return;
          const index = sheetsRef.current.findIndex((sheet) => sheet.id === deleteSheet);
          if (index < 0) return;
          const next = sheetsRef.current.filter((sheet) => sheet.id !== deleteSheet);
          clearers.current.delete(deleteSheet!);
          if (active === deleteSheet) setActive(next[Math.min(index, next.length - 1)].id);
          emit(next); setSheets(next); setDeleteSheet(null);
        } }} />
    </Dialog>
  </div>;
}

function StableWorkbookSheetGrid({ sheetData, ...props }: Omit<Parameters<typeof WorkbookSheetGrid>[0], "initialData"> & { sheetData: ProductDataTableSchema }) {
  const initialData = useMemo(() => parseProductSpecDataFromDatabase(sheetData), [sheetData]);
  return <WorkbookSheetGrid {...props} initialData={initialData} />;
}

function WorkbookSheetTab({ sheet, status, active, disabled, canDelete, canMoveLeft, canMoveRight, onSelect, onRename, onDelete, onMove }: {
  sheet: WorkbookSheet; status?: "Added" | "Deleted"; active: boolean; disabled: boolean; canDelete: boolean; canMoveLeft: boolean; canMoveRight: boolean;
  onSelect: () => void; onRename: () => void; onDelete: () => void; onMove: (direction: -1 | 1) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sheet.id, disabled });
  return <ContextMenu>
    <ContextMenuTrigger asChild disabled={disabled}>
      <Button ref={setNodeRef} size="sm" variant={active ? "secondary" : "ghost"}
        style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : undefined }}
        {...attributes} {...listeners} aria-pressed={active} onClick={onSelect} onDoubleClick={onRename}
        onKeyDown={(event) => { if (event.key === "F2" && !disabled) { event.preventDefault(); onRename(); } }}>
        {sheet.name}{status && <span className="text-xs text-muted-foreground">({status})</span>}
      </Button>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem onSelect={onRename}>Rename sheet</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem disabled={!canMoveLeft} onSelect={() => onMove(-1)}>Move left</ContextMenuItem>
      <ContextMenuItem disabled={!canMoveRight} onSelect={() => onMove(1)}>Move right</ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive" disabled={!canDelete} onSelect={onDelete}>Delete sheet</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>;
}

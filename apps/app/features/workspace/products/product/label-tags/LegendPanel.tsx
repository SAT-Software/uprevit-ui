"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@uprevit/ui/components/ui/alert-dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@uprevit/ui/components/ui/collapsible";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { Switch } from "@uprevit/ui/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { cn } from "@uprevit/ui/lib/utils";
import { useMemo, useState } from "react";
import {
  PiCaretRightDuotone,
  PiPencilSimpleDuotone,
  PiPlusCircleDuotone,
  PiTrashDuotone,
} from "react-icons/pi";
import { LegendDialog } from "./LegendDialog";
import { LegendSwatch } from "./LegendSwatch";
import { LegendFormValues, LegendItem } from "./legendTypes";

type LegendPanelProps = {
  productId: string;
  labelTagId: string;
  legendItems?: LegendItem[];
  isEditable: boolean;
  overlayEnabled: boolean;
  onOverlayToggle: (value: boolean) => void;
};

export function LegendPanel({
  productId,
  labelTagId,
  legendItems = [],
  isEditable,
  overlayEnabled,
  onOverlayToggle,
}: LegendPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<LegendItem | null>(null);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutateAsync: updateLegend, isPending } = useUpdateProductTabData();

  const canEdit = isEditable && !isPending;

  const handlePersist = async (nextItems: LegendItem[]) => {
    try {
      await updateLegend({
        id: productId,
        tab: "label-tags",
        action: "update_label_tag_legend",
        data: {
          id: labelTagId,
          legend_items: nextItems,
        },
      });
      return true;
    } catch {
      return false;
    }
  };

  const handleAdd = async (values: LegendFormValues) => {
    const newItem: LegendItem = {
      id: crypto.randomUUID(),
      ...values,
    };
    return handlePersist([...legendItems, newItem]);
  };

  const handleEdit = async (values: LegendFormValues) => {
    if (!editingItem) return false;
    const nextItems = legendItems.map((item) =>
      item.id === editingItem.id ? { ...item, ...values } : item,
    );
    return handlePersist(nextItems);
  };

  const handleDelete = async (id: string) => {
    const nextItems = legendItems.filter((item) => item.id !== id);
    return handlePersist(nextItems);
  };

  const openAddDialog = () => {
    setDialogMode("add");
    setEditingItem(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: LegendItem) => {
    setDialogMode("edit");
    setEditingItem(item);
    setDialogOpen(true);
  };

  const currentDefaults = useMemo(() => {
    if (!editingItem) return null;
    const { id, ...rest } = editingItem;
    return rest;
  }, [editingItem]);

  const dialogKey = `${dialogMode}-${editingItem?.id ?? "new"}-${
    dialogOpen ? "open" : "closed"
  }`;

  return (
    <div
      className={cn(
        "w-full lg:shrink-0 transition-all",
        isCollapsed ? "lg:w-12" : "lg:w-[260px] xl:w-[280px]",
      )}
    >
      <LegendDialog
        key={dialogKey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        defaultValues={currentDefaults}
        onSave={dialogMode === "add" ? handleAdd : handleEdit}
        disabled={!canEdit}
      />

      <div className="rounded-xl border border-border bg-muted/20">
        <Collapsible
          open={!isCollapsed}
          onOpenChange={(open) => setIsCollapsed(!open)}
        >
          <div
            className={cn(
              "flex items-center border-b border-border px-3 py-2",
              isCollapsed ? "justify-center" : "justify-between",
            )}
          >
            <div className="flex items-center gap-2">
              {/* <PiListDuotone className="text-muted-foreground" /> */}
              {!isCollapsed && (
                <span className="text-sm font-semibold">Legend</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={overlayEnabled}
                      onCheckedChange={onOverlayToggle}
                    />
                    <span className="text-[11px] text-muted-foreground">
                      Overlay
                    </span>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="icon-sm"
                        className="p-1 h-6 w-6"
                        onClick={openAddDialog}
                        disabled={!canEdit}
                      >
                        <PiPlusCircleDuotone />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add legend item</TooltipContent>
                  </Tooltip>
                </div>
              )}

              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="p-1 h-6 w-6"
                >
                  <PiCaretRightDuotone
                    className={cn(
                      "transition-transform",
                      !isCollapsed && "rotate-90",
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent>
            <div className="p-3">
              {legendItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-background/60 p-2 text-center">
                  <p className="text-xs font-medium text-foreground">
                    No legend items yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add shapes and notes to explain annotations.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {legendItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-2 rounded-lg border border-transparent px-2 py-2 w-full hover:border-border hover:bg-muted/40"
                    >
                          <LegendSwatch item={item} size={20} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">
                              {item.text}
                            </p>
                            <p className="truncate text-[10px] text-muted-foreground capitalize">
                              {item.shape}
                            </p>
                          </div>
                          {isEditable && (
                            <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => openEditDialog(item)}
                                disabled={!canEdit}
                              >
                                <PiPencilSimpleDuotone />
                              </Button>

                              <AlertDialog
                                open={deleteDialogId === item.id}
                                onOpenChange={(open) => {
                                  if (isDeleting) return;
                                  setDeleteDialogId(open ? item.id : null);
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    disabled={!canEdit}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <PiTrashDuotone />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-sm">
                                  <AlertDialogHeader className="contents space-y-0 text-left">
                                    <AlertDialogTitle className="border-b px-4 py-4 text-sm bg-destructive/10">
                                      <span className="text-destructive font-semibold">
                                        Delete legend item
                                      </span>
                                    </AlertDialogTitle>
                                  </AlertDialogHeader>
                                  <div className="p-4">
                                    <AlertDialogDescription className="text-sm text-muted-foreground">
                                      You are about to permanently delete
                                      <span className="font-semibold text-foreground">
                                        {" "}
                                        &quot;{item.text}&quot;{" "}
                                      </span>
                                      from this legend. This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </div>
                                  <AlertDialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
                                    <AlertDialogCancel asChild>
                                      <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        disabled={isDeleting}
                                      >
                                        Cancel
                                      </Button>
                                    </AlertDialogCancel>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      disabled={isDeleting}
                                      aria-busy={isDeleting}
                                      onClick={async () => {
                                        setIsDeleting(true);
                                        const success = await handleDelete(
                                          item.id,
                                        );
                                        if (success) {
                                          setDeleteDialogId(null);
                                        }
                                        setIsDeleting(false);
                                      }}
                                    >
                                      {isDeleting ? (
                                        <Spinner />
                                      ) : (
                                        <PiTrashDuotone />
                                      )}
                                      {isDeleting
                                        ? "Deleting..."
                                        : "Delete Legend"}
                                    </Button>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}

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
import { Label } from "@uprevit/ui/components/ui/label";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { Switch } from "@uprevit/ui/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import {
  Add01Icon,
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
  Layers01Icon,
  PropertyEditIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { ScrollArea } from "@uprevit/ui/components/ui/scroll-area";
import { useMemo, useState } from "react";
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
    const { id: _id, ...rest } = editingItem;
    return rest;
  }, [editingItem]);

  const dialogKey = `${dialogMode}-${editingItem?.id ?? "new"}-${
    dialogOpen ? "open" : "closed"
  }`;

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/10">
      <LegendDialog
        key={dialogKey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        defaultValues={currentDefaults}
        onSave={dialogMode === "add" ? handleAdd : handleEdit}
        disabled={!canEdit}
      />

      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
        <div className="flex items-center gap-2">
          <Icon
            icon={Layers01Icon}
            size={14}
            strokeWidth={2}
            className="text-muted-foreground"
          />
          <span className="text-sm font-medium">Legend</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Switch
              id={`legend-overlay-${labelTagId}`}
              checked={overlayEnabled}
              onCheckedChange={onOverlayToggle}
              className="scale-90"
            />
            <Label
              htmlFor={`legend-overlay-${labelTagId}`}
              className="text-[11px] font-normal text-muted-foreground"
            >
              Overlay
            </Label>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon-2xs"
                onClick={openAddDialog}
                disabled={!canEdit}
                aria-label="Add legend item"
              >
                <Icon icon={Add01Icon} size={14} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add legend item</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="size-full" scrollFade={10}>
          <div className="p-2">
          {legendItems.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background/60 px-4 py-8 text-center">
              <Icon
                icon={Layers01Icon}
                size={24}
                strokeWidth={1.5}
                className="text-muted-foreground/40"
              />
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">
                  No legend items yet
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Add shapes and notes to explain annotations.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {legendItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-2.5 rounded-lg border border-border/60 bg-background px-2.5 py-2 transition-colors hover:border-border hover:bg-muted/30"
                >
                  <LegendSwatch item={item} size={18} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">
                      {item.text}
                    </p>
                    <p className="truncate text-[10px] capitalize text-muted-foreground">
                      {item.shape}
                    </p>
                  </div>
                  {isEditable && (
                    <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEditDialog(item)}
                        disabled={!canEdit}
                        aria-label={`Edit ${item.text}`}
                      >
                        <Icon
                          icon={PropertyEditIcon}
                          size={14}
                          strokeWidth={2}
                        />
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
                            size="icon-xs"
                            disabled={!canEdit}
                            className="text-destructive hover:text-destructive"
                            aria-label={`Delete ${item.text}`}
                          >
                            <Icon
                              icon={Delete02Icon}
                              size={14}
                              strokeWidth={2}
                            />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-sm">
                          <AlertDialogHeader className="contents space-y-0 text-left">
                            <AlertDialogTitle className="flex w-full items-center justify-between border-b bg-destructive/10 px-4 py-4 text-sm">
                              <div className="flex items-center gap-2 text-destructive">
                                <Icon
                                  icon={Alert01Icon}
                                  size={16}
                                  strokeWidth={2}
                                />
                                <span className="font-semibold">
                                  Delete legend item
                                </span>
                              </div>
                              <button
                                type="button"
                                className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                                onClick={() => setDeleteDialogId(null)}
                              >
                                <Icon
                                  icon={Cancel01Icon}
                                  size={18}
                                  strokeWidth={2}
                                />
                              </button>
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <div className="p-4">
                            <AlertDialogDescription className="text-sm text-muted-foreground">
                              You are about to permanently delete
                              <span className="font-semibold text-foreground">
                                {" "}
                                &quot;{item.text}&quot;{" "}
                              </span>
                              from this legend. This action cannot be undone.
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
                                <Icon icon={Cancel01Icon} />
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
                                const success = await handleDelete(item.id);
                                if (success) {
                                  setDeleteDialogId(null);
                                }
                                setIsDeleting(false);
                              }}
                            >
                              {isDeleting ? (
                                <Spinner />
                              ) : (
                                <Icon icon={Delete02Icon} />
                              )}
                              {isDeleting ? "Deleting..." : "Delete Legend"}
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
        </ScrollArea>
      </div>
    </div>
  );
}

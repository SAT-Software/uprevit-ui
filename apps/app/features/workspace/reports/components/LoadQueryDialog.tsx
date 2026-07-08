"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { SavedQuery } from "@/types/reports";
import {
  Calendar03Icon,
  Delete02Icon,
  FolderOpenIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";

interface LoadQueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queries: SavedQuery[];
  onLoad: (query: SavedQuery) => void;
  onDelete: (id: string) => void;
}

export function LoadQueryDialog({
  open,
  onOpenChange,
  queries,
  onLoad,
  onDelete,
}: LoadQueryDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-4 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon={FolderOpenIcon} size={18} strokeWidth={2} />
            Load Saved Query
          </DialogTitle>
          <DialogDescription>
            Select a previously saved query to load.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] space-y-2 overflow-y-auto">
          {queries.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-sm">No saved queries yet</p>
              <p className="mt-1 text-xs">
                Save a query to access it here later
              </p>
            </div>
          ) : (
            queries.map((query) => (
              <div
                key={query.id}
                className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{query.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon icon={Calendar03Icon} size={12} strokeWidth={2} />
                      {formatDate(query.createdAt)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {query.conditions.length} condition
                      {query.conditions.length !== 1 ? "s" : ""}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {query.conditionLogic}
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onLoad(query);
                      onOpenChange(false);
                    }}
                  >
                    Load
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(query.id)}
                    aria-label="Delete saved query"
                  >
                    <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SavedQuery } from "@/types/reports";
import {
  PiFolderOpenDuotone,
  PiTrashDuotone,
  PiCalendarDuotone,
} from "react-icons/pi";

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
      <DialogContent className="sm:max-w-[500px] p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiFolderOpenDuotone size={20} />
            Load Saved Query
          </DialogTitle>
          <DialogDescription>
            Select a previously saved query to load.
          </DialogDescription>
        </DialogHeader>

        <div className=" space-y-2 max-h-[400px] overflow-y-auto">
          {queries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No saved queries yet</p>
              <p className="text-xs mt-1">
                Save a query to access it here later
              </p>
            </div>
          ) : (
            queries.map((query) => (
              <div
                key={query.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{query.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <PiCalendarDuotone size={12} />
                      {formatDate(query.createdAt)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {query.conditions.length} condition
                      {query.conditions.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {query.conditionLogic}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
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
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(query.id)}
                  >
                    <PiTrashDuotone size={16} />
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

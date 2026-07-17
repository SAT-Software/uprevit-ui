"use client";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { SavedQuery } from "@/types/reports";
import {
  Calendar03Icon,
  Delete02Icon,
  HardDriveUploadIcon,
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

  const title = (
    <span className="flex items-center gap-2">
      Load Saved Query
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
        {queries.length}
      </span>
    </span>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title={title}
        description="Select a previously saved query to load."
        variant="inform"
        size="md"
        className="max-h-[85vh]"
      >
        {queries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
              <Icon icon={HardDriveUploadIcon} size={20} strokeWidth={2} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">
                No saved queries yet
              </p>
              <p className="text-xs text-muted-foreground">
                Save a query to access it here later
              </p>
            </div>
          </div>
        ) : (
          <div
            className={
              queries.length > 1 ? "divide-y divide-border" : undefined
            }
          >
            {queries.map((query) => (
              <div
                key={query.id}
                className="flex items-center justify-between gap-2 px-4 py-2 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{query.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon icon={Calendar03Icon} size={12} strokeWidth={2} />
                      {formatDate(query.createdAt)}
                    </span>
                    {/* <span className="text-xs text-muted-foreground">
                      {query.conditions.length} condition
                      {query.conditions.length !== 1 ? "s" : ""}
                    </span> */}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon-xs"
                        onClick={() => {
                          onLoad(query);
                          onOpenChange(false);
                        }}
                        aria-label={`Load ${query.name}`}
                      >
                        <Icon
                          icon={HardDriveUploadIcon}
                          size={14}
                          strokeWidth={2}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Load query</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon-xs"
                        onClick={() => onDelete(query.id)}
                        aria-label={`Delete ${query.name}`}
                      >
                        <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete query</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </AppDialogContent>
    </Dialog>
  );
}

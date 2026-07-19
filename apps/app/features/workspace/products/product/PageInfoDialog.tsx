"use client";

import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Button } from "@uprevit/ui/components/ui/button";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Cancel01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";

interface PageInfoDialogProps {
  title: string;
  content: React.ReactNode;
  buttonClassName?: string;
}

export function PageInfoDialog({
  title,
  content,
  buttonClassName = "",
}: PageInfoDialogProps) {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`size-5 rounded-full hover:bg-muted ${buttonClassName}`}
            >
              <Icon
                icon={InformationCircleIcon}
                size={16}
                strokeWidth={2}
                className="text-muted-foreground"
              />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>More information</TooltipContent>
      </Tooltip>
      <AppDialogContent
        title={title}
        description={typeof content === "string" ? content : title}
        variant="inform"
        size="sm"
        secondaryAction={{
          label: "Close",
          icon: Cancel01Icon,
        }}
      >
        <div className="p-4 text-sm text-muted-foreground">{content}</div>
      </AppDialogContent>
    </Dialog>
  );
}

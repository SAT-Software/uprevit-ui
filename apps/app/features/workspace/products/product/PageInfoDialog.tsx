"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { PiInfoDuotone, PiXCircleDuotone } from "react-icons/pi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Button } from "@uprevit/ui/components/ui/button";

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
              <PiInfoDuotone className="size-4 text-muted-foreground" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>More information</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogPrimitive.Close className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <PiXCircleDuotone className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="hidden" />
        <div className="text-sm text-muted-foreground">{content}</div>
      </DialogContent>
    </Dialog>
  );
}

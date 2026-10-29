"use client";

import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import { cn } from "@uprevit/ui/lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

function ContextMenuContent({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return <ContextMenuPrimitive.Portal><ContextMenuPrimitive.Content className={cn("z-[60] min-w-40 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-xl", className)} {...props} /></ContextMenuPrimitive.Portal>;
}

function ContextMenuItem({ className, variant = "default", ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Item> & { variant?: "default" | "destructive" }) {
  return <ContextMenuPrimitive.Item className={cn("relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", variant === "destructive" && "text-destructive focus:bg-destructive/10 focus:text-destructive", className)} {...props} />;
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return <ContextMenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator };

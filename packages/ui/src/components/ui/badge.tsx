import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@uprevit/ui/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-1.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] [&>svg]:shrink-0 leading-normal",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        white:
          "border shadow-md text-sm px-2 py-0.5 bg-white text-foreground [a&]:hover:bg-white/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground/60 [a&]:hover:bg-secondary/90",
        large:
          "flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        green:
          "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 border-green-400 dark:border-green-600",
        blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 border-blue-400 dark:border-blue-600",
        red: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 border-red-400 dark:border-red-600",
        yellow:
          "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-200 border-yellow-400 dark:border-yellow-600",
        gray: "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-200 border-gray-400 dark:border-gray-600",
        orange:
          "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-200 border-orange-400 dark:border-orange-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

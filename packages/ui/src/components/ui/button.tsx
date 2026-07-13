import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@uprevit/ui/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 [&_svg]:text-primary-foreground/60 dark:[&_svg]:text-foreground/60 hover:[&_svg]:text-primary-foreground dark:hover:[&_svg]:text-foreground",
        destructive:
          "bg-destructive/5 text-destructive dark:text-foreground border border-destructive/80 hover:bg-destructive/10 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 [&_svg]:text-destructive/60 dark:[&_svg]:text-foreground/60 hover:[&_svg]:text-destructive dark:hover:[&_svg]:text-foreground",
        outline:
          "border bg-background hover:bg-accent/60 hover:text-accent-foreground dark:bg-background dark:border-input dark:hover:bg-accent/60 [&_svg]:text-muted-foreground/60 hover:[&_svg]:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 [&_svg]:text-muted-foreground/60 hover:[&_svg]:text-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-muted/60 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-7 rounded-md gap-1.5 px-2 has-[>svg]:px-2",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9",
        standard: "h-4 p-1",
        "icon-sm": "size-8",
        "icon-xs": "size-7",
        "icon-2xs": "size-5 rounded-md p-0",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { IconSvgElement } from "@hugeicons/react";
import { CancelSquareIcon } from "@hugeicons/core-free-icons";

import { cn } from "@uprevit/ui/lib/utils";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { FieldGroup } from "@uprevit/ui/components/ui/field";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

const appDialogVariants = cva("", {
  variants: {
    variant: {
      form: "",
      "confirm-destructive": "",
      confirm: "",
      inform: "",
      custom: "",
    },
    size: {
      sm: "sm:max-w-md",
      md: "sm:max-w-lg",
      lg: "sm:max-w-xl",
      xl: "sm:max-w-[600px]",
    },
  },
  defaultVariants: {
    variant: "form",
    size: "lg",
  },
});

const confirmIconVariants = cva(
  "flex size-10 shrink-0 items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        "confirm-destructive":
          "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500",
        confirm:
          "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
        form: "bg-muted text-muted-foreground",
        inform: "bg-muted text-muted-foreground",
        custom: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "confirm-destructive",
    },
  },
);

export type AppDialogVariant = NonNullable<
  VariantProps<typeof appDialogVariants>["variant"]
>;

export type AppDialogSize = NonNullable<
  VariantProps<typeof appDialogVariants>["size"]
>;

export type AppDialogAction = {
  label: string;
  loadingLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconSvgElement;
  form?: string;
  type?: "button" | "submit";
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
};

export type AppDialogConfirmContent = {
  heading?: string;
  message: React.ReactNode;
  icon?: IconSvgElement;
};

type AppDialogContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof DialogContent>,
  "title"
> &
  VariantProps<typeof appDialogVariants> & {
    title: React.ReactNode;
    description?: string;
    subtitle?: string;
    confirmContent?: AppDialogConfirmContent;
    footer?: React.ReactNode;
    primaryAction?: AppDialogAction;
    secondaryAction?: AppDialogAction;
    wrapBodyInFieldGroup?: boolean;
    bodyClassName?: string;
    headerExtra?: React.ReactNode;
  };

function AppDialogContent({
  title,
  description,
  subtitle,
  confirmContent,
  footer,
  primaryAction,
  secondaryAction,
  wrapBodyInFieldGroup = false,
  bodyClassName,
  headerExtra,
  variant = "form",
  size = "lg",
  className,
  children,
  ...props
}: AppDialogContentProps) {
  const resolvedConfirmVariant =
    variant === "confirm-destructive" || variant === "confirm"
      ? variant
      : "confirm-destructive";

  const showDefaultFooter =
    footer !== undefined ||
    primaryAction !== undefined ||
    secondaryAction !== undefined;

  const bodyContent = (
    <>
      {confirmContent ? (
        <AppDialogConfirmBody
          variant={resolvedConfirmVariant}
          heading={confirmContent.heading}
          message={confirmContent.message}
          icon={confirmContent.icon}
        />
      ) : null}
      {children}
    </>
  );

  return (
    <DialogContent
      className={cn(
        "flex flex-col gap-0 overflow-y-visible p-0",
        appDialogVariants({ size }),
        className,
      )}
      {...props}
    >
      <DialogHeader className="contents space-y-0 text-left ">
        <DialogTitle className="flex h-10 w-full shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2 text-sm font-medium">
          <span className="min-w-0 truncate">{title}</span>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Close dialog"
              className="group"
            >
              <Icon
                icon={CancelSquareIcon}
                className="text-muted-foreground/60 group-hover:text-foreground"
              />
            </Button>
          </DialogClose>
        </DialogTitle>
        {subtitle ? (
          <div className="border-b border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
            {subtitle}
          </div>
        ) : null}
        {headerExtra}
      </DialogHeader>

      {description ? (
        <DialogDescription className="sr-only">{description}</DialogDescription>
      ) : null}

      {wrapBodyInFieldGroup ? (
        <FieldGroup className={cn("overflow-y-auto p-4", bodyClassName)}>
          {bodyContent}
        </FieldGroup>
      ) : bodyContent ? (
        <div className={cn("overflow-y-auto", bodyClassName)}>
          {bodyContent}
        </div>
      ) : null}

      {showDefaultFooter ? (
        <DialogFooter className="flex h-10 shrink-0 flex-row items-center justify-end border-t border-border bg-muted/60 px-2">
          {footer ?? (
            <AppDialogFooterActions
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
            />
          )}
        </DialogFooter>
      ) : null}
    </DialogContent>
  );
}

function AppDialogConfirmBody({
  heading = "Are you sure?",
  message,
  icon,
  variant = "confirm-destructive",
}: AppDialogConfirmContent & {
  variant?: "confirm-destructive" | "confirm";
}) {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start gap-3">
        {icon ? (
          <div className={confirmIconVariants({ variant })} aria-hidden="true">
            <Icon icon={icon} size={20} strokeWidth={2} />
          </div>
        ) : null}
        <div className="space-y-1">
          <h4 className="text-sm font-medium">{heading}</h4>
          <div className="text-sm text-muted-foreground">{message}</div>
        </div>
      </div>
    </div>
  );
}

function AppDialogFooterActions({
  primaryAction,
  secondaryAction,
}: {
  primaryAction?: AppDialogAction;
  secondaryAction?: AppDialogAction;
}) {
  return (
    <>
      {secondaryAction ? (
        <DialogClose asChild>
          <Button
            type={secondaryAction.type ?? "button"}
            variant={secondaryAction.variant ?? "secondary"}
            size="sm"
            disabled={secondaryAction.disabled || secondaryAction.loading}
            onClick={secondaryAction.onClick}
            className={secondaryAction.className}
          >
            {secondaryAction.icon ? (
              <Icon icon={secondaryAction.icon} size={16} strokeWidth={2} />
            ) : null}
            {secondaryAction.loading && secondaryAction.loadingLabel
              ? secondaryAction.loadingLabel
              : secondaryAction.label}
          </Button>
        </DialogClose>
      ) : null}
      {primaryAction ? (
        <Button
          type={primaryAction.type ?? "button"}
          variant={primaryAction.variant ?? "default"}
          size="sm"
          form={primaryAction.form}
          disabled={primaryAction.disabled || primaryAction.loading}
          onClick={primaryAction.onClick}
          className={primaryAction.className}
          aria-busy={primaryAction.loading}
        >
          {primaryAction.loading ? (
            <Spinner />
          ) : primaryAction.icon ? (
            <Icon icon={primaryAction.icon} size={16} strokeWidth={2} />
          ) : null}
          {primaryAction.loading && primaryAction.loadingLabel
            ? primaryAction.loadingLabel
            : primaryAction.label}
        </Button>
      ) : null}
    </>
  );
}

export {
  AppDialogContent,
  AppDialogConfirmBody,
  AppDialogFooterActions,
  appDialogVariants,
};

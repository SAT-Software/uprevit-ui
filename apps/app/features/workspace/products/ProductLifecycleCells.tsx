"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@uprevit/ui/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@uprevit/ui/components/ui/hover-card";
import { Separator } from "@uprevit/ui/components/ui/separator";
import { Icon, type IconProps } from "@uprevit/ui/components/common/Icon";
import {
  CheckmarkBadge01Icon,
  WorkflowIcon,
} from "@hugeicons/core-free-icons";
import { ProductStatusBadge } from "@/components/common/ProductStatusBadge";
import type {
  ProductActiveWorkflow,
  ProductReleasedVersion,
  ProductStatus,
} from "@/types/product";
import { PRODUCT_STATUS_LABELS } from "@/utils/product/product-lifecycle";

const LINK_CLASS_NAME =
  "rounded-sm text-xs font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function LifecycleHoverCard({
  trigger,
  label,
  title,
  description,
  row,
}: {
  trigger: ReactNode;
  label: string;
  title: string;
  description: string;
  row?: { label: string; value: string; href: string };
}) {
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            aria-label={label}
            className="flex cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {trigger}
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-72 gap-0 p-0" align="start">
          <div className="px-4 py-2">
            <p className="text-base font-medium text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {row ? (
            <>
              <Separator />
              <div className="flex items-center justify-between gap-4 px-4 py-2">
                <p className="text-xs text-muted-foreground">{row.label}</p>
                <Link href={row.href} className={LINK_CLASS_NAME}>
                  {row.value}
                </Link>
              </div>
            </>
          ) : null}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

/** Small marker shown beside a badge when its hover card links somewhere. */
function LinkedMarker({ icon }: { icon: IconProps["icon"] }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-muted-foreground">
      <Icon icon={icon} size={12} strokeWidth={2} />
    </span>
  );
}

export function ProductStatusCell({
  status,
  activeWorkflow,
}: {
  status?: ProductStatus;
  activeWorkflow?: ProductActiveWorkflow | null;
}) {
  if (!status) return null;
  const statusLabel = PRODUCT_STATUS_LABELS[status];

  return (
    <LifecycleHoverCard
      trigger={
        <span className="flex items-center gap-1">
          <ProductStatusBadge status={status} className="shrink-0" />
          {activeWorkflow ? <LinkedMarker icon={WorkflowIcon} /> : null}
        </span>
      }
      label={
        activeWorkflow
          ? `${statusLabel}, in workflow ${activeWorkflow.numberLabel}`
          : `${statusLabel}, not in a workflow`
      }
      title={statusLabel}
      description={
        activeWorkflow
          ? "This product is part of an active approval workflow."
          : "This product is not part of an active approval workflow."
      }
      row={
        activeWorkflow
          ? {
              label: "Workflow",
              value: activeWorkflow.numberLabel,
              href: `/workflows/${activeWorkflow.id}`,
            }
          : undefined
      }
    />
  );
}

export function ProductVersionCell({
  productId,
  version,
  releasedVersion,
}: {
  productId: string;
  version: number;
  releasedVersion?: ProductReleasedVersion | null;
}) {
  const isReleased = releasedVersion?.id === productId;
  const otherReleased =
    releasedVersion && !isReleased ? releasedVersion : null;

  return (
    <LifecycleHoverCard
      trigger={
        <span className="flex items-center gap-1">
          <Badge variant="secondary" className="shrink-0 font-mono text-xs">
            v{version}
          </Badge>
          {otherReleased ? <LinkedMarker icon={CheckmarkBadge01Icon} /> : null}
        </span>
      }
      label={
        otherReleased
          ? `Version ${version}, v${otherReleased.version} is released`
          : `Version ${version}`
      }
      title={`Version ${version}`}
      description={
        isReleased
          ? "This is the released version of this product."
          : otherReleased
            ? "A different version of this product is currently released."
            : "No version of this product has been released yet."
      }
      row={
        otherReleased
          ? {
              label: "Released version",
              value: `v${otherReleased.version}`,
              href: `/products/${otherReleased.id}/product-information`,
            }
          : undefined
      }
    />
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Activity03Icon,
  Add01Icon,
  Archive01Icon,
  ArchiveIcon,
  ArrowUpRight01Icon,
  BandageIcon,
  Blockchain03Icon,
  BookOpen02Icon,
  Bookmark01Icon,
  Cardiogram02Icon,
  Chart02Icon,
  Copy01Icon,
  DropletIcon,
  HeadphonesIcon,
  Home04Icon,
  KanbanIcon,
  NewOfficeIcon,
  Notification02Icon,
  Search01Icon,
  SearchSquareIcon,
  SidebarLeftIcon,
  TradeUpIcon,
  UnfoldMoreIcon,
  Upload04Icon,
  WorkflowIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { BrandMark } from "@/components/BrandLogo";
import { TileRow } from "@/components/TileGrid";
import { BrandBlindsBackdrop } from "./BrandBlindsBackdrop";
import { StatusBadge } from "./StatusBadge";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

type PersonCode = "SP" | "ML" | "RK" | "DK";

const PEOPLE: Record<PersonCode, { name: string; src: string }> = {
  SP: { name: "Sara P.", src: "/images/avatars/sara.webp" },
  ML: { name: "Marta L.", src: "/images/avatars/marta.webp" },
  RK: { name: "Ravi K.", src: "/images/avatars/ravi.webp" },
  DK: { name: "Daniel K.", src: "/images/avatars/daniel.webp" },
};

function AvatarDot({
  code,
  size = 18,
  className,
}: {
  code: PersonCode;
  size?: number;
  className?: string;
}) {
  const person = PEOPLE[code];
  return (
    <Image
      src={person.src}
      alt={person.name}
      width={size}
      height={size}
      unoptimized
      style={{ width: size, height: size }}
      className={cn(
        "inline-block shrink-0 rounded-full border border-foreground/10 object-cover object-top dark:border-white/15",
        className,
      )}
    />
  );
}

interface WorkspaceSpec {
  orgName: string;
  badgeType: "brand" | "northwind";
  avatarCode: PersonCode;
  greeting: string;
  subline: string;
  productsCount: string;
  workflowsCount: string;
  kpis: {
    label: string;
    value: string;
    delta: string;
    icon: IconSvgElement;
    tone: "success" | "warning";
  }[];
  projectsCount: string;
  projects: {
    name: string;
    meta: string;
    icon: IconSvgElement;
    members: readonly [PersonCode, PersonCode];
    extra: string;
  }[];
}

const ACME_WORKSPACE: WorkspaceSpec = {
  orgName: "Acme Medical",
  badgeType: "brand",
  avatarCode: "SP",
  greeting: "Good morning, Sara",
  subline: "3 products are waiting for your review and 1 release is due this week.",
  productsCount: "412",
  workflowsCount: "3",
  kpis: [
    { label: "Departments", value: "8", delta: "+2 this month", icon: NewOfficeIcon, tone: "success" },
    { label: "Projects", value: "34", delta: "+5 this month", icon: KanbanIcon, tone: "success" },
    { label: "Products", value: "412", delta: "+38 this month", icon: Blockchain03Icon, tone: "success" },
    { label: "In review", value: "7", delta: "3 need you", icon: SearchSquareIcon, tone: "warning" },
  ],
  projectsCount: "34",
  projects: [
    {
      name: "IV Sets · EU MDR 2027",
      meta: "Infusion Therapy · 24 products",
      icon: DropletIcon,
      members: ["SP", "RK"],
      extra: "+4",
    },
    {
      name: "Vital Signs Monitor Gen 3",
      meta: "Patient Monitoring · 18 products",
      icon: Cardiogram02Icon,
      members: ["DK", "ML"],
      extra: "+2",
    },
    {
      name: "Foam Dressings 2026",
      meta: "Wound Care · 12 products",
      icon: BandageIcon,
      members: ["RK", "ML"],
      extra: "+1",
    },
  ],
};

const NORTHWIND_WORKSPACE: WorkspaceSpec = {
  orgName: "Northwind Health",
  badgeType: "northwind",
  avatarCode: "ML",
  greeting: "Good afternoon, Marta",
  subline: "2 approvals are waiting for you and 4 labels were released this week.",
  productsCount: "268",
  workflowsCount: "2",
  kpis: [
    { label: "Departments", value: "5", delta: "+1 this month", icon: NewOfficeIcon, tone: "success" },
    { label: "Projects", value: "21", delta: "+3 this month", icon: KanbanIcon, tone: "success" },
    { label: "Products", value: "268", delta: "+19 this month", icon: Blockchain03Icon, tone: "success" },
    { label: "In review", value: "4", delta: "2 need you", icon: SearchSquareIcon, tone: "warning" },
  ],
  projectsCount: "21",
  projects: [
    {
      name: "Catheters · FDA 510(k)",
      meta: "Vascular Access · 31 products",
      icon: DropletIcon,
      members: ["ML", "RK"],
      extra: "+4",
    },
    {
      name: "Glucose Meter G2",
      meta: "Diabetes Care · 9 products",
      icon: Cardiogram02Icon,
      members: ["DK", "SP"],
      extra: "+2",
    },
    {
      name: "Surgical Gloves 2027",
      meta: "Infection Control · 15 products",
      icon: BandageIcon,
      members: ["RK", "ML"],
      extra: "+1",
    },
  ],
};

function WorkspacePreviewCard({
  spec,
  className,
}: {
  spec: WorkspaceSpec;
  className?: string;
}) {
  const sidebarGroups: {
    title: string;
    items: {
      label: string;
      icon: IconSvgElement;
      active?: boolean;
      badge?: string;
      badgePrimary?: boolean;
    }[];
  }[] = [
    {
      title: "Workspace",
      items: [
        { label: "Dashboard", icon: Home04Icon, active: true },
        { label: "Departments", icon: NewOfficeIcon },
        { label: "Projects", icon: KanbanIcon },
        { label: "Products", icon: Blockchain03Icon, badge: spec.productsCount },
        { label: "Workflows", icon: WorkflowIcon, badge: spec.workflowsCount, badgePrimary: true },
      ],
    },
    {
      title: "Library",
      items: [
        { label: "Source files", icon: Copy01Icon },
        { label: "Bookmarks", icon: Bookmark01Icon },
        { label: "Archive", icon: ArchiveIcon },
      ],
    },
    {
      title: "Insights",
      items: [
        { label: "Reports", icon: Archive01Icon },
        { label: "Analytics", icon: Chart02Icon },
      ],
    },
    {
      title: "Help",
      items: [
        { label: "Documentation", icon: BookOpen02Icon },
        { label: "Contact support", icon: HeadphonesIcon },
        { label: "System status", icon: Activity03Icon },
      ],
    },
  ];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none overflow-hidden rounded-[12px] bg-background text-foreground",
        className,
      )}
    >
      <div className="flex h-full w-full">
        <div className="flex w-[184px] shrink-0 flex-col gap-0.5 border-r border-border bg-muted p-2 dark:border-edge-1 dark:bg-surface-1">
          <div className="flex h-9 shrink-0 items-center gap-2 rounded-lg px-1.5">
            {spec.badgeType === "brand" ? (
              <span
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border pt-px"
                style={{
                  backgroundImage: "var(--logo-tile-bg-light)",
                  borderColor: "#000000",
                  boxShadow: "var(--logo-tile-shadow-light)",
                }}
              >
                <BrandMark width={13.5} height={11.4} />
              </span>
            ) : (
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-[#1D58D8] font-sans text-[12px] font-bold leading-none text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                N
              </span>
            )}
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-ui text-[11px] font-semibold leading-3.5 text-foreground">
                {spec.orgName}
              </span>
              <span className="truncate font-ui text-[9.5px] leading-3 text-icon">
                Uprevit workspace
              </span>
            </div>
            <Icon icon={UnfoldMoreIcon} size={12} strokeWidth={2} className="shrink-0 text-icon" />
          </div>

          <div className="mt-0.5 flex h-[27px] shrink-0 items-center gap-1.5 rounded-md border border-foreground/[0.09] bg-card pl-2 pr-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-edge-2 dark:bg-surface-3">
            <Icon icon={Search01Icon} size={12} strokeWidth={1.8} className="shrink-0 text-icon" />
            <span className="flex-1 font-ui text-[11px] leading-4 text-placeholder">Search</span>
            <span className="inline-flex h-4 items-center justify-center rounded-[3px] border border-border bg-subtle px-1 font-ui text-[9px] font-medium text-icon dark:border-edge-2 dark:bg-surface-4">
              ⌘K
            </span>
          </div>

          {sidebarGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-px pt-1.5">
              <div className="flex h-5 items-center pl-2 font-ui text-[9.5px] font-medium leading-3 text-placeholder">
                {group.title}
              </div>
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex h-[24px] items-center gap-1.5 rounded-md px-2 font-ui text-[11px] leading-4",
                    item.active
                      ? "bg-surface-selected font-medium text-foreground"
                      : "text-foreground/80",
                  )}
                >
                  <Icon
                    icon={item.icon}
                    size={12.5}
                    strokeWidth={1.9}
                    className={cn(
                      "shrink-0",
                      item.active ? "text-foreground" : "text-muted-foreground",
                    )}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "inline-flex h-[15px] min-w-[15px] items-center justify-center rounded-full px-1 font-ui text-[9.5px] leading-3 tabular-nums",
                        item.badgePrimary
                          ? "bg-primary font-semibold text-primary-foreground"
                          : "border border-stroke-primary bg-muted font-medium text-muted-foreground dark:border-edge-2 dark:bg-surface-3",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col bg-background dark:bg-surface-0">
          <div className="flex h-8 shrink-0 items-center justify-between border-b border-separator px-3.5">
            <div className="flex items-center gap-2">
              <Icon icon={SidebarLeftIcon} size={13} strokeWidth={1.9} className="text-muted-foreground" />
              <span className="h-3 w-px bg-border" />
              <span className="font-ui text-[11px] leading-4 text-fg-secondary">Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative inline-flex size-6 items-center justify-center rounded-md text-fg-secondary">
                <Icon icon={Notification02Icon} size={13} strokeWidth={1.9} />
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-primary" />
              </span>
              <AvatarDot code={spec.avatarCode} size={20} />
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-2.5 pt-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="font-sans text-[17px] font-medium leading-[21px] tracking-[-0.025em] text-foreground">
                {spec.greeting}
              </div>
              <div className="truncate font-ui text-[11px] leading-4 text-muted-foreground">
                {spec.subline}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="inline-flex h-[26px] items-center gap-1 rounded-md border border-border bg-card px-2.5 font-ui text-[11px] font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-edge-2 dark:bg-surface-2">
                <Icon icon={Upload04Icon} size={11.5} strokeWidth={1.9} className="text-fg-secondary" />
                Import
              </span>
              <span className="inline-flex h-[26px] items-center gap-1 rounded-md border border-primary-700 bg-primary px-2.5 font-ui text-[11px] font-medium text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
                <Icon icon={Add01Icon} size={11.5} strokeWidth={2.2} />
                New product
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 px-4 pb-3">
            <div className="grid grid-cols-4 divide-x divide-separator rounded-lg bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.04)] dark:bg-surface-1 dark:shadow-[0_0_0_1px_var(--edge-1)]">
              {spec.kpis.map((kpi) => (
                <div key={kpi.label} className="flex flex-col gap-1.5 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Icon icon={kpi.icon} size={12} strokeWidth={1.9} className="text-muted-foreground" />
                    <span className="font-ui text-[10.5px] leading-3.5 text-muted-foreground">
                      {kpi.label}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="font-sans text-[20px] font-medium leading-6 tracking-[-0.02em] text-foreground tabular-nums">
                      {kpi.value}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 font-ui text-[10px] font-medium leading-3.5",
                        kpi.tone === "success" ? "text-success-strong" : "text-warning-strong",
                      )}
                    >
                      {kpi.tone === "success" && (
                        <Icon icon={TradeUpIcon} size={11} strokeWidth={2.2} />
                      )}
                      <span>{kpi.delta}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col overflow-hidden rounded-lg bg-card shadow-[0_0_0_1px_var(--stroke-primary)] dark:bg-surface-1 dark:shadow-[0_0_0_1px_var(--edge-1)]">
                <div className="flex h-8 items-center justify-between border-b border-separator px-3">
                  <span className="font-ui text-[11.5px] font-medium leading-4 text-foreground">
                    Created vs released
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center gap-1 font-ui text-[10px] text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-stage-submitted" />
                      Created
                    </span>
                    <span className="inline-flex items-center gap-1 font-ui text-[10px] text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-stage-released" />
                      Released
                    </span>
                  </div>
                </div>

                <div className="relative h-[118px] px-3 pb-2 pt-2">
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="h-[88px] w-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id={`cta-c-${spec.badgeType}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--stage-submitted)" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="var(--stage-submitted)" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id={`cta-r-${spec.badgeType}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--stage-released)" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="var(--stage-released)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 62 C14 62 18 46 30 46 C42 46 46 54 58 54 C70 54 72 28 84 28 C92 28 96 14 100 14 L100 98 L0 98 Z"
                      fill={`url(#cta-c-${spec.badgeType})`}
                    />
                    <path
                      d="M0 84 C14 84 18 74 30 74 C42 74 46 66 58 66 C70 66 72 70 84 56 C92 48 96 46 100 46 L100 98 L0 98 Z"
                      fill={`url(#cta-r-${spec.badgeType})`}
                    />
                    <path
                      d="M0 62 C14 62 18 46 30 46 C42 46 46 54 58 54 C70 54 72 28 84 28 C92 28 96 14 100 14"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                      stroke="var(--stage-submitted)"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M0 84 C14 84 18 74 30 74 C42 74 46 66 58 66 C70 66 72 70 84 56 C92 48 96 46 100 46"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                      stroke="var(--stage-released)"
                      strokeWidth="1.6"
                    />
                  </svg>

                  <div className="absolute right-6 top-3 flex min-w-[92px] flex-col gap-0.5 rounded-md bg-invert px-2 py-1 text-invert-foreground shadow-[0_6px_14px_-4px_rgba(0,0,0,0.3)] dark:border dark:border-edge-3 dark:bg-surface-3 dark:text-foreground">
                    <span className="font-ui text-[9.5px] font-medium leading-3">Nov 2026</span>
                    <span className="flex items-center gap-1 font-ui text-[9px] leading-3">
                      <span className="size-1.5 rounded-[2px] bg-[#60A5FA]" />
                      <span className="opacity-70">Created</span>
                      <span className="ml-auto font-medium tabular-nums">38</span>
                    </span>
                    <span className="flex items-center gap-1 font-ui text-[9px] leading-3">
                      <span className="size-1.5 rounded-[2px] bg-[#4ADE80]" />
                      <span className="opacity-70">Released</span>
                      <span className="ml-auto font-medium tabular-nums">21</span>
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between font-ui text-[9px] text-foreground/45">
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span className="font-medium text-foreground">Nov</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col overflow-hidden rounded-lg bg-card shadow-[0_0_0_1px_var(--stroke-primary)] dark:bg-surface-1 dark:shadow-[0_0_0_1px_var(--edge-1)]">
                <div className="flex h-8 items-center justify-between border-b border-separator px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-ui text-[11.5px] font-medium leading-4 text-foreground">
                      Projects
                    </span>
                    <span className="inline-flex h-4 items-center rounded-full border border-stroke-primary bg-muted px-1.5 font-ui text-[9.5px] font-medium text-muted-foreground tabular-nums dark:border-edge-2 dark:bg-surface-3">
                      {spec.projectsCount}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-0.5 font-ui text-[10px] text-muted-foreground">
                    View all
                    <Icon icon={ArrowUpRight01Icon} size={10} strokeWidth={2} className="text-icon" />
                  </span>
                </div>

                <div className="divide-y divide-separator">
                  {spec.projects.map((proj) => (
                    <div key={proj.name} className="flex h-[39px] items-center gap-2 px-3">
                      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-stroke-primary bg-muted text-fg-secondary dark:border-edge-2 dark:bg-surface-3">
                        <Icon icon={proj.icon} size={12.5} strokeWidth={1.9} />
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-ui text-[11px] font-medium leading-3.5 text-foreground">
                          {proj.name}
                        </span>
                        <span className="truncate font-ui text-[9.5px] leading-3 text-icon">
                          {proj.meta}
                        </span>
                      </div>
                      <div className="relative flex h-4 w-[48px] shrink-0 items-center">
                        <AvatarDot
                          code={proj.members[0]}
                          size={17}
                          className="absolute left-0 top-0 ring-1 ring-card dark:ring-surface-1"
                        />
                        <AvatarDot
                          code={proj.members[1]}
                          size={17}
                          className="absolute left-3 top-0 ring-1 ring-card dark:ring-surface-1"
                        />
                        <span className="absolute left-6 top-0 inline-flex h-[17px] items-center rounded-full bg-muted px-1 font-ui text-[9px] font-medium text-muted-foreground ring-1 ring-card dark:bg-surface-3 dark:ring-surface-1">
                          {proj.extra}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col overflow-hidden rounded-lg bg-card shadow-[0_0_0_1px_var(--stroke-primary)] dark:bg-surface-1 dark:shadow-[0_0_0_1px_var(--edge-1)]">
              <div className="flex h-8 items-center justify-between px-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-ui text-[11.5px] font-medium leading-4 text-foreground">
                    Recent products
                  </span>
                  <span className="inline-flex h-4 items-center rounded-full border border-stroke-primary bg-muted px-1.5 font-ui text-[9.5px] font-medium text-muted-foreground tabular-nums dark:border-edge-2 dark:bg-surface-3">
                    {spec.productsCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-5 items-center gap-0.5 rounded-sm border border-stroke-primary bg-muted p-0.5 font-ui text-[9.5px] dark:border-edge-2 dark:bg-surface-2">
                    <span className="rounded-[3px] bg-card px-1.5 py-px font-medium text-foreground shadow-2xs dark:bg-surface-3">
                      All
                    </span>
                    <span className="px-1.5 text-muted-foreground">Mine</span>
                    <span className="px-1.5 text-muted-foreground">In review</span>
                  </div>
                  <span className="inline-flex items-center gap-0.5 font-ui text-[10px] text-muted-foreground">
                    View all
                    <Icon icon={ArrowUpRight01Icon} size={10} strokeWidth={2} className="text-icon" />
                  </span>
                </div>
              </div>
              <div className="flex h-6 items-center border-y border-separator bg-muted/50 px-3 font-ui text-[9.5px] font-medium text-muted-foreground dark:bg-surface-2/50">
                <span className="w-[210px]">Product</span>
                <span className="w-[130px]">Project</span>
                <span className="w-[96px]">Owner</span>
                <span className="w-[90px]">Status</span>
                <span className="w-[56px]">Version</span>
                <span className="flex-1">Progress</span>
              </div>
              <div className="flex h-9 items-center px-3 font-ui text-[10.5px]">
                <div className="flex w-[210px] flex-col">
                  <span className="font-medium text-foreground">IV Extension Set, 150 cm</span>
                  <span className="font-mono text-[9px] text-placeholder">PX-2042</span>
                </div>
                <span className="w-[130px] text-muted-foreground">IV Sets · EU MDR</span>
                <span className="flex w-[96px] items-center gap-1.5 text-muted-foreground">
                  <AvatarDot code="SP" size={16} />
                  Sara P.
                </span>
                <span className="w-[90px]">
                  <StatusBadge tone="review" className="px-1.5 py-0.5 text-[9.5px] leading-3">
                    In review
                  </StatusBadge>
                </span>
                <span className="w-[56px]">
                  <span className="rounded-sm border border-stroke-primary bg-muted px-1.5 py-0.5 font-mono text-[9.5px] text-fg-secondary dark:border-edge-2 dark:bg-surface-3">
                    v4
                  </span>
                </span>
                <span className="flex flex-1 items-center gap-2">
                  <span className="h-1 w-10 overflow-hidden rounded-full bg-warning/25">
                    <span className="block h-full w-[72%] rounded-full bg-warning" />
                  </span>
                  <span className="font-mono text-[9.5px] text-muted-foreground">72%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CTASection() {
  return (
    <MotionConfig reducedMotion="user">
      <TileRow
        as="section"
        aria-labelledby="cta-heading"
        className="min-h-[380px] lg:h-[440px]"
        centerClassName="relative overflow-hidden bg-[#0E0E0E] shadow-[0_1px_0_#0E0E0E]"
      >
        <BrandBlindsBackdrop anchorX={0.72} anchorY={0.35} />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[772px] top-[76px] hidden h-[478px] w-[976px] [mask-image:linear-gradient(rgb(0,0,0)_30%,transparent_75%)] md:block"
        >
          <WorkspacePreviewCard
            spec={NORTHWIND_WORKSPACE}
            className="absolute left-2 top-2 h-[462px] w-[960px] shadow-[0_0_0_1px_rgba(0,0,0,0.18),0_0_0_6px_rgba(255,255,255,0.22),0_0_0_7px_rgba(255,255,255,0.45)]"
          />
        </div>

        <WorkspacePreviewCard
          spec={ACME_WORKSPACE}
          className="absolute left-[460px] top-[188px] hidden h-[462px] w-[960px] shadow-[0_0_0_1px_rgba(0,0,0,0.18),0_0_0_6px_rgba(255,255,255,0.22),0_0_0_7px_rgba(255,255,255,0.45),0_-24px_48px_-12px_rgba(0,0,0,0.5)] md:block lg:left-[620px] lg:top-[148px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,9,0.3)_0%,rgba(9,9,9,0.5)_45%,rgba(9,9,9,0.85)_80%,#090909_100%)]"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="relative z-10 flex h-full max-w-[640px] flex-col justify-center gap-7 px-6 py-12 sm:px-10 lg:py-0 lg:pl-[72px] lg:pr-0"
        >
          <h2
            id="cta-heading"
            className="font-sans text-[32px] font-medium leading-[1.15] tracking-[-0.035em] text-white sm:text-[36px] lg:text-[40px] lg:leading-[46px]"
          >
            Release your next label
            <br />
            <span className="text-white/65">with full traceability.</span>
          </h2>

          <p className="max-w-[460px] font-ui text-[15px] leading-6 text-white/80 sm:text-[16px]">
            See your product data, reviews and redlines in one place, in a demo
            built around your own products.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/contact"
              data-attr="cta-book-demo"
              className="inline-flex h-10 items-center justify-center rounded-sm border border-primary-700 bg-primary px-4 font-ui text-[14px] font-medium leading-[18px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-[#8A33FF] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(127,34,254,0.6)] focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.97] active:bg-primary-700 dark:hover:bg-primary-hover"
            >
              Book a demo
            </Link>

            <Link
              href="/contact"
              data-attr="cta-contact-us"
              className="inline-flex h-10 items-center justify-center rounded-sm border border-[#17171714] bg-white px-4 font-ui text-[14px] font-medium leading-[18px] text-[#171717] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-[#F5F5F5] focus-visible:ring-2 focus-visible:ring-white/40 active:scale-[0.97]"
            >
              Contact us
            </Link>
          </div>
        </motion.div>
      </TileRow>
    </MotionConfig>
  );
}

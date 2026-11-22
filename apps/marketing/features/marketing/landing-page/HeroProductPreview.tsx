"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
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
  BubbleChatIcon,
  Cardiogram02Icon,
  Chart02Icon,
  CheckmarkCircle02Icon,
  Columns3CogIcon,
  Copy01Icon,
  DropletIcon,
  File02Icon,
  FileAddIcon,
  GitBranchIcon,
  HeadphonesIcon,
  Home04Icon,
  KanbanIcon,
  NewOfficeIcon,
  Notification02Icon,
  RepeatIcon,
  Search01Icon,
  SearchSquareIcon,
  SentIcon,
  SidebarLeftIcon,
  Tick02Icon,
  TradeUpIcon,
  UnfoldMoreIcon,
  Upload04Icon,
  UserCheck01Icon,
  UserIcon,
  WorkflowIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { BrandMark } from "@/components/BrandLogo";
import { FlutedGlassBackdrop } from "./FlutedGlassBackdrop";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export type HeroSpotlight = "spec-change" | "review" | "release" | null;

type ProductFilter = "All" | "Mine" | "In review";
type RedlineFilter = "All" | "Updated" | "Added";
type PersonCode = "SP" | "ML" | "RK" | "DK" | "AM";

interface SidebarItem {
  label: string;
  icon: IconSvgElement;
  active?: boolean;
  badge?: string;
  badgePrimary?: boolean;
  statusDot?: boolean;
}

const SIDEBAR_GROUPS: { title: string; items: SidebarItem[] }[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", icon: Home04Icon, active: true },
      { label: "Departments", icon: NewOfficeIcon },
      { label: "Projects", icon: KanbanIcon },
      { label: "Products", icon: Blockchain03Icon, badge: "412" },
      { label: "Workflows", icon: WorkflowIcon, badge: "3", badgePrimary: true },
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
      { label: "System status", icon: Activity03Icon, statusDot: true },
    ],
  },
];

const GREETING_CHIPS: {
  label: string;
  dotClassName: string;
  spotlightMatch: Exclude<HeroSpotlight, null>;
}[] = [
  {
    label: "3 waiting for your review",
    dotClassName: "bg-stage-review",
    spotlightMatch: "review",
  },
  {
    label: "1 release due Friday",
    dotClassName: "bg-stage-released",
    spotlightMatch: "release",
  },
  {
    label: "2 comments to answer",
    dotClassName: "bg-stage-submitted",
    spotlightMatch: "spec-change",
  },
];

type KpiHoverRow = { label: string; value: string; tone?: "muted" | "warning" };

const activityRows = (created: number, updated: number, both: number): KpiHoverRow[] => [
  { label: "Created", value: String(created), tone: created ? undefined : "muted" },
  { label: "Updated", value: String(updated), tone: updated ? undefined : "muted" },
  { label: "Created and updated", value: String(both), tone: both ? undefined : "muted" },
];

const KPI_ITEMS: {
  label: string;
  value: string;
  delta: string;
  icon: IconSvgElement;
  tone: "success" | "warning";
  hoverTitle: string;
  hoverMeta: string;
  hoverRows: KpiHoverRow[];
  hoverTotal: string;
  hoverFooter?: string;
}[] = [
  {
    label: "Departments",
    value: "8",
    delta: "+2 this month",
    icon: NewOfficeIcon,
    tone: "success",
    hoverTitle: "Active departments",
    hoverMeta: "Last 30 days",
    hoverRows: activityRows(1, 1, 0),
    hoverTotal: "+2",
  },
  {
    label: "Projects",
    value: "34",
    delta: "+5 this month",
    icon: KanbanIcon,
    tone: "success",
    hoverTitle: "Active projects",
    hoverMeta: "Last 30 days",
    hoverRows: activityRows(2, 2, 1),
    hoverTotal: "+5",
  },
  {
    label: "Products",
    value: "412",
    delta: "+38 this month",
    icon: Blockchain03Icon,
    tone: "success",
    hoverTitle: "Active products",
    hoverMeta: "Last 30 days",
    hoverRows: activityRows(21, 12, 5),
    hoverTotal: "+38",
  },
  {
    label: "In review",
    value: "7",
    delta: "3 need you",
    icon: SearchSquareIcon,
    tone: "warning",
    hoverTitle: "Open reviews",
    hoverMeta: "Right now",
    hoverRows: [
      { label: "Waiting for you", value: "3", tone: "warning" },
      { label: "Waiting for others", value: "4" },
      { label: "Overdue", value: "0", tone: "muted" },
    ],
    hoverTotal: "7",
    hoverFooter: "Open my reviews",
  },
];

const KPI_HOVER_WIDTH = 228;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface KpiHoverState {
  index: number;
  alignRight: boolean;
  x: number;
  y: number;
}

function KpiHoverCard({
  hover,
  reduceMotion,
}: {
  hover: KpiHoverState;
  reduceMotion: boolean;
}) {
  const kpi = KPI_ITEMS[hover.index];
  const move = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, duration: 0.32, bounce: 0 };
  const fade = reduceMotion ? { duration: 0.01 } : { duration: 0.15, ease: EASE_OUT };

  return (
    <motion.div
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97, x: hover.x, y: hover.y }}
      animate={{ opacity: 1, scale: 1, x: hover.x, y: hover.y }}
      exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98, transition: { duration: 0.12, ease: EASE_OUT } }}
      transition={{ default: fade, x: move, y: move }}
      style={{
        width: KPI_HOVER_WIDTH,
        transformOrigin: hover.alignRight ? "top right" : "top left",
      }}
      className="pointer-events-none absolute left-0 top-0 z-40 flex flex-col overflow-hidden rounded-xl bg-card font-ui shadow-[0_0_0_1px_rgba(23,23,23,0.08),0_12px_32px_-8px_rgba(23,23,23,0.12),0_2px_6px_rgba(0,0,0,0.04)] dark:bg-surface-2 dark:shadow-[0_0_0_1px_var(--edge-2),0_12px_32px_-8px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.3)]"
    >
      <motion.div
        key={kpi.label}
        initial={reduceMotion ? false : { opacity: 0, filter: "blur(2px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={fade}
      >
        <div className="flex h-[34px] items-center gap-2 border-b border-separator px-3">
          <span className="flex-1 text-[12px] font-medium leading-4 text-foreground">
            {kpi.hoverTitle}
          </span>
          <span className="text-[11px] leading-4 text-foreground/45">
            {kpi.hoverMeta}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 px-3 py-2.5 text-[11px] leading-4">
          {kpi.hoverRows.map((row) => (
            <div key={row.label} className="flex justify-between">
              <span className="text-muted-foreground">{row.label}</span>
              <span
                className={cn(
                  "font-semibold tabular-nums text-foreground",
                  row.tone === "muted" && "text-foreground/40",
                  row.tone === "warning" && "text-warning-strong",
                )}
              >
                {row.value}
              </span>
            </div>
          ))}
          <div className="h-px bg-separator" />
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Total</span>
            <span
              className={cn(
                "text-[12px] font-semibold tabular-nums",
                kpi.tone === "success" ? "text-success-strong" : "text-foreground",
              )}
            >
              {kpi.hoverTotal}
            </span>
          </div>
        </div>
      </motion.div>
      <AnimatePresence initial={false}>
        {kpi.hoverFooter && (
          <motion.div
            key="footer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 34, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="flex h-[34px] items-center border-t border-separator px-3 text-[11px] font-medium leading-4 text-foreground">
              {kpi.hoverFooter} →
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const CHART_POINTS = [
  { month: "Jun", full: "Jun 2026", xPct: 1.5, createdY: 64, releasedY: 94, created: 18, released: 9 },
  { month: "Jul", full: "Jul 2026", xPct: 20.9, createdY: 46, releasedY: 82, created: 24, released: 13 },
  { month: "Aug", full: "Aug 2026", xPct: 40.3, createdY: 55, releasedY: 73, created: 21, released: 16 },
  { month: "Sep", full: "Sep 2026", xPct: 59.7, createdY: 28, releasedY: 76, created: 30, released: 15 },
  { month: "Oct", full: "Oct 2026", xPct: 79.1, createdY: 37, releasedY: 60, created: 27, released: 19 },
  { month: "Nov", full: "Nov 2026", xPct: 98.5, createdY: 10, releasedY: 54, created: 38, released: 21 },
];

const PROJECTS = [
  {
    name: "IV Sets · EU MDR 2027",
    meta: "Infusion Therapy · 24 products",
    icon: DropletIcon,
    members: ["SP", "RK"] as readonly [PersonCode, PersonCode],
    extra: "+4",
  },
  {
    name: "Vital Signs Monitor Gen 3",
    meta: "Patient Monitoring · 18 products",
    icon: Cardiogram02Icon,
    members: ["DK", "ML"] as readonly [PersonCode, PersonCode],
    extra: "+2",
  },
  {
    name: "Foam Dressings 2026",
    meta: "Wound Care · 12 products",
    icon: BandageIcon,
    members: ["RK", "ML"] as readonly [PersonCode, PersonCode],
    extra: "+1",
  },
];

const PRODUCT_FILTER_OPTIONS: {
  id: ProductFilter;
  label: string;
  icon: IconSvgElement;
}[] = [
  { id: "All", label: "All products", icon: Blockchain03Icon },
  { id: "Mine", label: "Assigned to me", icon: UserIcon },
  { id: "In review", label: "In review", icon: SearchSquareIcon },
];

interface ProductRow {
  ppn: string;
  name: string;
  project: string;
  department: string;
  owner: string;
  ownerCode: PersonCode;
  status: "In review" | "Released" | "Submitted";
  hasBranch?: boolean;
  version: string;
  hasApprovedBadge?: boolean;
  progress: number;
  mine?: boolean;
}

const PRODUCT_ROWS: ProductRow[] = [
  {
    ppn: "PX-2042",
    name: "IV Extension Set, 150 cm",
    project: "IV Sets · EU MDR",
    department: "Infusion Therapy",
    owner: "Sara P.",
    ownerCode: "SP",
    status: "In review",
    hasBranch: true,
    version: "v4",
    progress: 72,
    mine: true,
  },
  {
    ppn: "PM-3110",
    name: "Vital Signs Monitor V3",
    project: "Vital Signs Gen 3",
    department: "Patient Monitoring",
    owner: "Daniel K.",
    ownerCode: "DK",
    status: "Released",
    version: "v7",
    progress: 100,
  },
  {
    ppn: "PX-2051",
    name: "Needle-free Y-Site Connector",
    project: "IV Sets · EU MDR",
    department: "Infusion Therapy",
    owner: "Ravi K.",
    ownerCode: "RK",
    status: "Submitted",
    version: "v2",
    progress: 45,
  },
  {
    ppn: "PM-3122",
    name: "Blood Pressure Cuff, Adult",
    project: "Vital Signs Gen 3",
    department: "Patient Monitoring",
    owner: "Marta L.",
    ownerCode: "ML",
    status: "In review",
    hasBranch: true,
    version: "v3",
    hasApprovedBadge: true,
    progress: 64,
    mine: true,
  },
  {
    ppn: "WC-4410",
    name: "Foam Dressing, 10 × 10 cm",
    project: "Foam Dressings 2026",
    department: "Wound Care",
    owner: "Sara P.",
    ownerCode: "SP",
    status: "Released",
    version: "v2",
    progress: 100,
    mine: true,
  },
];

interface RedlineItem {
  id: string;
  field: string;
  type: "Updated" | "Added";
  before?: string;
  prefix?: string;
  after: string;
}

const REDLINE_ITEMS: RedlineItem[] = [
  {
    id: "sterilization",
    field: "Sterilization",
    type: "Updated",
    prefix: "Sterilized using ",
    before: "ethylene oxide",
    after: " irradiation",
  },
  {
    id: "shelf-life",
    field: "Shelf life",
    type: "Updated",
    prefix: "Use within ",
    before: "3",
    after: " 5 years of manufacture",
  },
  {
    id: "warnings",
    field: "Warnings",
    type: "Added",
    after: "Not made with natural rubber latex",
  },
  {
    id: "storage",
    field: "Storage",
    type: "Updated",
    prefix: "Store below ",
    before: "30°C",
    after: " 25°C, keep dry",
  },
  {
    id: "eu-rep",
    field: "EU REP",
    type: "Added",
    after: "Medrep GmbH, Berlin, DE",
  },
  {
    id: "udi-di",
    field: "UDI-DI",
    type: "Added",
    after: "(01) 04056869215437",
  },
];

const PEOPLE: Record<
  PersonCode,
  { name: string; src: string; role: string }
> = {
  SP: {
    name: "Sara P.",
    src: "/images/avatars/sara.webp",
    role: "Regulatory Lead",
  },
  ML: {
    name: "Marta L.",
    src: "/images/avatars/marta.webp",
    role: "Quality Assurance",
  },
  RK: {
    name: "Ravi K.",
    src: "/images/avatars/ravi.webp",
    role: "Labeling Engineer",
  },
  DK: {
    name: "Daniel K.",
    src: "/images/avatars/daniel.webp",
    role: "QA Reviewer",
  },
  AM: {
    name: "Arjun M.",
    src: "/images/avatars/ravi.webp",
    role: "QA Lead",
  },
};

function ProfileAvatar({
  code,
  size = 20,
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

function ProgressRing({ value }: { value: number }) {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const filled = (value / 100) * circumference;

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle
        cx="9"
        cy="9"
        r={radius}
        fill="none"
        className="stroke-foreground/12 dark:stroke-white/15"
        strokeWidth="2"
      />
      <circle
        cx="9"
        cy="9"
        r={radius}
        transform="rotate(-90 9 9)"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${filled.toFixed(1)} ${circumference.toFixed(1)}`}
      />
    </svg>
  );
}

const SARA_DRAFTS: Record<number, string> = {
  3: "The new one, signed in March. Agreement attached.",
  8: "Published v7 with the IFU redlines.",
};
const DISCUSSION_STEP_DELAYS = [
  700, 1300, 1500, 2200, 1500, 1500, 1300, 1700, 1800, 1600, 1300, 1400, 3600,
];
const LAST_DISCUSSION_STEP = DISCUSSION_STEP_DELAYS.length - 1;

type DiscussionTone = "idle" | "info" | "warning" | "destructive" | "success";

const DISCUSSION_DOT: Record<DiscussionTone, string> = {
  idle: "bg-foreground/25",
  info: "bg-info",
  warning: "bg-warning",
  destructive: "bg-destructive",
  success: "bg-success",
};

const DISCUSSION_STATUS_TEXT: Record<DiscussionTone, string> = {
  idle: "text-muted-foreground",
  info: "text-info-strong",
  warning: "text-warning-strong",
  destructive: "text-destructive-strong",
  success: "text-success-strong",
};

function TypingBubble({ code }: { code: PersonCode }) {
  return (
    <div className="flex items-end gap-2">
      <ProfileAvatar code={code} size={22} />
      <div className="flex h-[26px] items-center gap-[3px] rounded-t-2xl rounded-bl-[4px] rounded-br-2xl border border-border bg-file-frame px-2.5 dark:border-edge-2 dark:bg-surface-3">
        {[0, 160, 320].map((delay) => (
          <span
            key={delay}
            className="typing-dot size-[4.5px] rounded-full bg-foreground/40"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function DiscussionEventRow({ name, text }: { name: string; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-foreground/12" />
      <span className="flex items-center gap-1 whitespace-nowrap font-ui text-[10px] leading-3.5 text-foreground/40">
        {text.includes("approved") && (
          <Icon
            icon={Tick02Icon}
            size={11}
            strokeWidth={2.4}
            className="text-success"
          />
        )}
        <span className="font-medium text-muted-foreground">{name}</span>
        {text}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-foreground/12" />
    </div>
  );
}

function OwnMessage({
  text,
  file,
  time,
}: {
  text: string;
  file: string;
  time: string;
}) {
  return (
    <div className="flex flex-col items-end gap-[3px]">
      <div className="max-w-[200px] rounded-t-2xl rounded-bl-2xl rounded-br-[4px] bg-invert px-[11px] py-[7px] font-ui text-[11.5px] leading-4 text-invert-foreground">
        {text}
      </div>
      <div className="flex items-center gap-[5px] pr-1 font-ui text-[10.5px] leading-3.5 text-muted-foreground">
        <Icon icon={File02Icon} size={11} strokeWidth={1.6} className="text-icon" />
        {file}
      </div>
      <span className="pr-1 font-ui text-[9.5px] leading-3 text-placeholder">
        {time}
      </span>
    </div>
  );
}

function LiveDiscussionCard({
  highlighted,
  reduceMotion,
}: {
  highlighted: boolean;
  reduceMotion: boolean;
}) {
  const [step, setStep] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [typedCount, setTypedCount] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion || paused) return;

    const timer = setTimeout(() => {
      setStep((prev) => (prev >= LAST_DISCUSSION_STEP ? 0 : prev + 1));
    }, DISCUSSION_STEP_DELAYS[step]);

    return () => clearTimeout(timer);
  }, [step, paused, reduceMotion]);

  const draft = SARA_DRAFTS[step];

  React.useEffect(() => {
    if (reduceMotion || paused || !draft) return;

    const interval = setInterval(() => {
      setTypedCount((prev) => Math.min(prev + 1, draft.length));
    }, 32);

    return () => clearInterval(interval);
  }, [draft, paused, reduceMotion]);

  const [prevStep, setPrevStep] = React.useState(step);
  if (prevStep !== step) {
    setPrevStep(step);
    setTypedCount(0);
  }

  const s = reduceMotion ? LAST_DISCUSSION_STEP : step;
  const arjunResolved = s >= 11;

  const status: { tone: DiscussionTone; label: string } =
    s >= 12
      ? { tone: "success", label: "Ready to complete" }
      : s >= 7 && s < 9
        ? { tone: "destructive", label: "Changes requested" }
        : { tone: "info", label: "In review" };

  const approvers: { code: PersonCode; tone: DiscussionTone }[] = [
    { code: "DK", tone: s >= 5 ? "success" : "idle" },
    {
      code: "AM",
      tone:
        s >= 12
          ? "success"
          : s >= 9
            ? "warning"
            : s >= 7
              ? "destructive"
              : "idle",
    },
  ];

  const msgTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, duration: 0.42, bounce: 0.08 };

  const enter = {
    layout: "position" as const,
    initial: { opacity: 0, y: 10, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.94, transition: { duration: 0.14 } },
    transition: msgTransition,
  };

  const items: { key: string; show: boolean; node: React.ReactNode }[] = [
    {
      key: "started",
      show: true,
      node: <DiscussionEventRow name="Sara" text=" started the workflow · 09:02" />,
    },
    { key: "daniel-typing", show: s === 1, node: <TypingBubble code="DK" /> },
    {
      key: "daniel-question",
      show: s >= 2,
      node: (
        <div className="flex items-start gap-2">
          <ProfileAvatar code="DK" size={22} />
          <div className="flex max-w-[200px] flex-col items-start gap-[3px]">
            <span className="pl-1 font-ui text-[10.5px] font-medium leading-3.5 text-foreground">
              Daniel K.
            </span>
            <div className="rounded-t-2xl rounded-bl-[4px] rounded-br-2xl border border-border bg-file-frame px-[11px] py-[7px] font-ui text-[11.5px] leading-4 text-foreground dark:border-edge-2 dark:bg-surface-3">
              Does EU REP point to the new Medrep GmbH agreement, or the old rep?
            </div>
            <span className="pl-1 font-ui text-[9.5px] leading-3 text-placeholder">
              09:40
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "sara-agreement",
      show: s >= 4,
      node: (
        <OwnMessage
          text="The new one, signed in March. Agreement attached."
          file="Medrep-agreement.pdf"
          time="10:05"
        />
      ),
    },
    {
      key: "daniel-approved",
      show: s >= 5,
      node: <DiscussionEventRow name="Daniel" text=" approved · 10:12" />,
    },
    {
      key: "arjun-typing-1",
      show: s === 6,
      node: <TypingBubble code="AM" />,
    },
    {
      key: "arjun-request",
      show: s >= 7,
      node: (
        <div className="flex items-start gap-2">
          <ProfileAvatar code="AM" size={22} />
          <div className="flex max-w-[200px] flex-col items-start gap-[3px]">
            <span className="pl-1 font-ui text-[10.5px] font-medium leading-3.5 text-foreground">
              Arjun M.
            </span>
            <div className="rounded-t-2xl rounded-bl-[4px] rounded-br-2xl border border-border bg-file-frame px-[11px] py-[7px] font-ui text-[11.5px] leading-4 text-foreground dark:border-edge-2 dark:bg-surface-3">
              IFU redlines aren&apos;t attached. Add them and I&apos;ll approve.
            </div>
            <AnimatePresence mode="popLayout" initial={false}>
              {s >= 9 && !arjunResolved && (
                <motion.span
                  key="mark"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.12 } }}
                  transition={msgTransition}
                  className="mt-0.5 inline-flex items-center gap-1 rounded-[6px] bg-card px-[9px] py-[3px] font-ui text-[10.5px] font-medium leading-3.5 text-foreground shadow-[0_0_0_1px_rgba(23,23,23,0.08),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-3 dark:shadow-[0_0_0_1px_var(--edge-2)]"
                >
                  <Icon icon={Tick02Icon} size={11} strokeWidth={2.4} className="text-success" />
                  Mark addressed
                </motion.span>
              )}
              {arjunResolved && (
                <motion.span
                  key="addressed"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={msgTransition}
                  className="inline-flex items-center gap-1 pl-1 font-ui text-[10.5px] font-medium leading-3.5 text-success-strong"
                >
                  <Icon icon={Tick02Icon} size={11} strokeWidth={2.4} className="text-success" />
                  Addressed
                </motion.span>
              )}
            </AnimatePresence>
            <span className="pl-1 font-ui text-[9.5px] leading-3 text-placeholder">
              11:20
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "sara-v7",
      show: s >= 9,
      node: (
        <OwnMessage
          text="Published v7 with the IFU redlines."
          file="IFU-redlines-v7.pdf"
          time="12:48"
        />
      ),
    },
    {
      key: "arjun-typing-2",
      show: s === 10,
      node: <TypingBubble code="AM" />,
    },
    {
      key: "arjun-approved",
      show: s >= 12,
      node: <DiscussionEventRow name="Arjun" text=" approved · 13:11" />,
    },
  ];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn(
        "hero-enter-float pointer-events-auto absolute left-8 top-[236px] z-30 hidden h-[460px] w-[262px] flex-col overflow-hidden rounded-[14px] bg-card shadow-[0_0_0_1px_rgba(23,23,23,0.1),0_0_0_6px_rgba(255,255,255,0.4),0_0_0_7px_rgba(255,255,255,0.6),0_0_28px_10px_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.05),0_12px_24px_-8px_rgba(27,16,58,0.18),0_40px_80px_-24px_rgba(27,16,58,0.35)] transition-shadow duration-200 lg:left-[44px] lg:flex xl:left-[76px] xl:w-[276px] dark:bg-surface-2 dark:shadow-[0_0_0_1px_rgba(237,237,237,0.1),0_0_0_6px_rgba(20,20,20,0.4),0_0_0_7px_rgba(20,20,20,0.6),0_0_28px_10px_rgba(20,20,20,0.35),0_1px_2px_rgba(0,0,0,0.2),0_12px_24px_-8px_rgba(0,0,0,0.45),0_40px_80px_-24px_rgba(0,0,0,0.65)]",
        highlighted &&
          "ring-2 ring-primary/50 ring-offset-2 ring-offset-transparent",
      )}
      style={
        {
          "--hero-delay": "310ms",
          "--hero-duration": "480ms",
        } as React.CSSProperties
      }
    >
      <div className="flex shrink-0 flex-col gap-2 border-b border-separator px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Icon
              icon={BubbleChatIcon}
              size={14}
              strokeWidth={1.7}
              className="text-muted-foreground"
            />
            <span className="font-ui text-[12.5px] font-medium leading-4 text-foreground">
              Discussion
            </span>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 font-ui text-[10.5px] font-medium leading-3.5 transition-colors duration-300",
              DISCUSSION_STATUS_TEXT[status.tone],
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full transition-colors duration-300",
                DISCUSSION_DOT[status.tone],
              )}
            />
            {status.label}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-ui text-[11px] leading-4 text-icon">
            PTA Balloon Catheter 5×40 · {s >= 9 ? "v7" : "v6"}
          </span>
          <div className="flex shrink-0 items-center gap-[3px]">
            {approvers.map((approver) => (
              <span key={approver.code} className="relative inline-flex size-5">
                <ProfileAvatar
                  code={approver.code}
                  size={20}
                  className="ring-2 ring-card dark:ring-surface-2"
                />
                <span
                  className={cn(
                    "absolute -bottom-px -right-px size-2 rounded-full border-2 border-card transition-colors duration-300 dark:border-surface-2",
                    DISCUSSION_DOT[approver.tone],
                  )}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end gap-3.5 overflow-hidden px-3 pb-3 pt-4 [mask-image:linear-gradient(to_bottom,transparent_0,black_56px)]">
        <AnimatePresence mode="popLayout" initial={false}>
          {items
            .filter((item) => item.show)
            .map((item) => (
              <motion.div key={item.key} {...enter} className="shrink-0">
                {item.node}
              </motion.div>
            ))}
        </AnimatePresence>

      </div>

      <div className="shrink-0 border-t border-separator px-3 py-2.5">
        <div className="flex h-8 items-center gap-2 rounded-md bg-file-frame pl-3 pr-1 dark:bg-surface-3">
          <span
            className={cn(
              "flex flex-1 items-center overflow-hidden whitespace-nowrap font-ui text-[11.5px] leading-4",
              draft ? "text-foreground" : "text-foreground/40",
            )}
          >
            {draft ? (
              <span className="inline-flex min-w-0 items-center overflow-hidden">
                <span className="truncate">{draft.slice(0, typedCount)}</span>
                <span
                  aria-hidden="true"
                  className="ml-px inline-block h-3.5 w-[1.5px] shrink-0 animate-pulse bg-foreground/70"
                />
              </span>
            ) : (
              "Reply to the team"
            )}
          </span>
          <span
            className={cn(
              "inline-flex size-6 shrink-0 items-center justify-center rounded-[5px] bg-invert text-invert-foreground transition-transform duration-150",
              draft && typedCount >= draft.length - 2 && "scale-[0.94]",
            )}
          >
            <Icon icon={SentIcon} size={12.5} strokeWidth={1.9} />
          </span>
        </div>
      </div>
    </div>
  );
}

export interface HeroProductPreviewProps {
  spotlight?: HeroSpotlight;
}

export function HeroProductPreview({ spotlight = null }: HeroProductPreviewProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [productFilter, setProductFilter] = React.useState<ProductFilter>("All");
  const [redlineFilter, setRedlineFilter] = React.useState<RedlineFilter>("All");
  const [activeMonthIndex, setActiveMonthIndex] = React.useState<number>(5);
  const [kpiHover, setKpiHover] = React.useState<KpiHoverState | null>(null);

  const visibleProducts = React.useMemo(() => {
    if (productFilter === "Mine") return PRODUCT_ROWS.filter((r) => r.mine);
    if (productFilter === "In review") {
      return PRODUCT_ROWS.filter((r) => r.status === "In review");
    }
    return PRODUCT_ROWS;
  }, [productFilter]);

  const visibleRedlines = React.useMemo(() => {
    if (redlineFilter === "All") return REDLINE_ITEMS.slice(0, 3);
    return REDLINE_ITEMS.filter((item) => item.type === redlineFilter).slice(
      0,
      3,
    );
  }, [redlineFilter]);

  const redlineCountLabel =
    redlineFilter === "All"
      ? `${REDLINE_ITEMS.length} changes`
      : redlineFilter === "Updated"
        ? "3 updated"
        : "3 added";

  const activePoint = CHART_POINTS[activeMonthIndex] ?? CHART_POINTS[5];
  const tooltipLeftPct = Math.min(Math.max(activePoint.xPct - 18, 2), 68);
  const chartPlotRef = React.useRef<HTMLDivElement>(null);

  const handleChartPointerMove = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = chartPlotRef.current?.getBoundingClientRect();
      if (!rect || rect.width <= 0) return;
      const ratio = Math.min(
        Math.max((event.clientX - rect.left) / rect.width, 0),
        1,
      );
      const nextIndex = Math.round(ratio * (CHART_POINTS.length - 1));
      setActiveMonthIndex(nextIndex);
    },
    [],
  );

  const chartSpring = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness: 280, damping: 28, mass: 0.55 };

  const pillSpring = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, duration: 0.28, bounce: 0 };

  return (
    <div className="relative w-full">
      <div className="relative h-[540px] w-full overflow-hidden rounded-tile sm:h-[620px] lg:h-[680px]">
        <FlutedGlassBackdrop />

        <div
          className="hero-enter relative mx-auto h-full max-w-[1310px]"
          style={
            {
              "--hero-delay": "180ms",
              "--hero-duration": "520ms",
              "--hero-y": "14px",
            } as React.CSSProperties
          }
        >
          <div className="absolute inset-x-3 top-6 h-[680px] overflow-hidden rounded-2xl bg-background shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_0_0_6px_rgba(255,255,255,0.16),0_30px_80px_-20px_rgba(11,9,41,0.42),0_12px_24px_-12px_rgba(11,9,41,0.26)] sm:inset-x-6 sm:top-10 lg:left-[56px] lg:right-[56px] lg:top-[56px] lg:h-[780px] dark:bg-surface-0 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_0_6px_rgba(20,20,20,0.28),0_30px_80px_-20px_rgba(0,0,0,0.68),0_12px_24px_-12px_rgba(0,0,0,0.48)]">
            <div className="flex h-full w-full">
              <aside className="hidden w-[204px] shrink-0 flex-col gap-1 border-r border-border bg-muted p-2.5 lg:flex xl:w-[216px] dark:border-edge-1 dark:bg-surface-1">
                <div className="flex h-10 shrink-0 items-center gap-2 rounded-lg px-1.5 transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[0.04]">
                  <span
                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border pt-px"
                    style={{
                      backgroundImage: "var(--logo-tile-bg-light)",
                      borderColor: "#000000",
                      boxShadow: "var(--logo-tile-shadow-light)",
                    }}
                  >
                    <BrandMark width={14.5} height={12.2} />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="truncate font-ui text-[12px] font-semibold leading-3.5 text-foreground">
                      Acme Medical
                    </span>
                    <span className="truncate font-ui text-[10px] leading-3 text-icon">
                      Uprevit workspace
                    </span>
                  </div>
                  <Icon
                    icon={UnfoldMoreIcon}
                    size={13}
                    strokeWidth={2}
                    className="shrink-0 text-icon"
                  />
                </div>

                <div className="mt-0.5 flex h-[30px] shrink-0 items-center gap-2 rounded-md border border-foreground/[0.09] bg-card pl-2.5 pr-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:border-stroke-strong dark:border-edge-2 dark:bg-surface-3">
                  <Icon
                    icon={Search01Icon}
                    size={13}
                    strokeWidth={1.8}
                    className="shrink-0 text-icon"
                  />
                  <span className="flex-1 font-ui text-[12px] leading-4 text-placeholder">
                    Search
                  </span>
                  <span className="inline-flex h-[18px] items-center justify-center rounded-[4px] border border-border bg-subtle px-1 font-ui text-[10px] font-medium tracking-[0.02em] text-icon dark:border-edge-2 dark:bg-surface-4">
                    ⌘K
                  </span>
                </div>

                {SIDEBAR_GROUPS.map((group) => (
                  <div key={group.title} className="flex flex-col gap-px pt-2">
                    <div className="flex h-6 items-center pl-2 font-ui text-[10px] font-medium leading-3 text-placeholder">
                      {group.title}
                    </div>
                    {group.items.map((item) => (
                      <div
                        key={item.label}
                        className={cn(
                          "flex h-[27px] items-center gap-2 rounded-md px-2 font-ui text-[12px] leading-4 transition-colors duration-150",
                          item.active
                            ? "bg-surface-selected font-medium text-foreground"
                            : "text-foreground/80 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[0.04] [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground",
                        )}
                      >
                        <Icon
                          icon={item.icon}
                          size={14}
                          strokeWidth={1.9}
                          className={cn(
                            "shrink-0",
                            item.active
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-tile px-1 font-ui text-[10px] leading-3 tabular-nums",
                              item.badgePrimary
                                ? "bg-primary font-semibold text-primary-foreground"
                                : "border border-stroke-primary bg-muted font-medium text-muted-foreground dark:border-edge-2 dark:bg-surface-3",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.statusDot && (
                          <span className="size-1.5 shrink-0 rounded-full bg-stage-released shadow-[0_0_0_3px_rgba(34,197,94,0.15)]" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </aside>

              <div className="flex min-w-0 flex-1 flex-col bg-background dark:bg-surface-0">
                <div className="flex h-10 shrink-0 items-center justify-between border-b border-separator px-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-hover [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground">
                      <Icon icon={SidebarLeftIcon} size={14} strokeWidth={1.9} />
                    </span>
                    <span className="h-3.5 w-px bg-border" />
                    <span className="font-ui text-[12px] leading-4 text-fg-secondary">
                      Dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Notifications"
                      className="relative inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-fg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[background-color,border-color,color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96] [@media(hover:hover)_and_(pointer:fine)]:hover:border-stroke-strong [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-hover [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground dark:border-edge-2 dark:bg-surface-2 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-3"
                    >
                      <Icon icon={Notification02Icon} size={14} strokeWidth={1.9} />
                      <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary ring-[1.5px] ring-card dark:ring-surface-2" />
                    </button>
                    <ProfileAvatar code="SP" size={26} />
                  </div>
                </div>

                <div className="relative flex shrink-0 items-end justify-between gap-4 overflow-hidden border-b border-separator px-4 pb-3 pt-3.5">
                  <div
                    aria-hidden="true"
                    className="tile-dots pointer-events-none absolute inset-0"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, color-mix(in srgb, var(--background) 32%, transparent) 0%, color-mix(in srgb, var(--background) 85%, transparent) 38%, var(--background) 62%, var(--background) 100%)",
                      }}
                    />
                  </div>

                  <div className="relative flex min-w-0 flex-col gap-1">
                    <div className="font-sans text-[22px] font-medium leading-[26px] tracking-[-0.03em] text-foreground">
                      Good morning, Sara
                    </div>
                    <div className="font-ui text-[12px] leading-4 text-muted-foreground">
                      Here is what needs you this week.
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {GREETING_CHIPS.map((chip) => {
                        const active = spotlight === chip.spotlightMatch;
                        return (
                          <span
                            key={chip.label}
                            className={cn(
                              "inline-flex h-6 cursor-default items-center gap-1.5 rounded-sm border border-border bg-card px-2 font-ui text-[11px] leading-3.5 text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors duration-150 dark:border-white/12 dark:bg-surface-3 dark:shadow-[0_1px_2px_rgba(0,0,0,0.24)]",
                              active && "border-primary/40 bg-primary-soft/60",
                            )}
                          >
                            <span
                              className={cn(
                                "size-1.5 shrink-0 rounded-full",
                                chip.dotClassName,
                              )}
                            />
                            <span>{chip.label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative hidden shrink-0 items-center gap-1.5 sm:flex">
                    <button
                      type="button"
                      className="inline-flex h-[30px] cursor-pointer items-center gap-1.5 rounded-md border border-border bg-card pl-2.5 pr-3 font-ui text-[12px] font-medium text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none transition-[background-color,border-color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:border-stroke-strong [@media(hover:hover)_and_(pointer:fine)]:hover:bg-subtle dark:border-white/12 dark:bg-surface-3 dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-4"
                    >
                      <Icon
                        icon={Upload04Icon}
                        size={13}
                        strokeWidth={1.9}
                        className="text-fg-secondary"
                      />
                      Import
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-[30px] cursor-pointer items-center gap-1.5 rounded-md border border-primary-700 bg-primary pl-2.5 pr-3 font-ui text-[12px] font-medium text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(106,18,220,0.25)] outline-none transition-[background-color,box-shadow,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#8A33FF] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_6px_16px_-6px_rgba(127,34,254,0.55)] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary-hover"
                    >
                      <Icon icon={Add01Icon} size={13} strokeWidth={2.2} />
                      New product
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 px-4 pb-4 pt-3">
                  <div
                    className="relative"
                    onMouseLeave={() => setKpiHover(null)}
                  >
                    <div className="grid grid-cols-2 divide-x divide-y divide-separator rounded-xl bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] sm:grid-cols-4 sm:divide-y-0 dark:bg-surface-1 dark:shadow-[0_0_0_1px_var(--edge-1),0_1px_2px_rgba(0,0,0,0.24)]">
                    {KPI_ITEMS.map((kpi, index) => {
                      const highlighted =
                        (spotlight === "review" && kpi.label === "In review") ||
                        (spotlight === "release" && kpi.label === "Products");

                      return (
                        <div
                          key={kpi.label}
                          onMouseEnter={(event) => {
                            const cell = event.currentTarget;
                            const alignRight = index >= 2;
                            setKpiHover({
                              index,
                              alignRight,
                              x: alignRight
                                ? cell.offsetLeft + cell.offsetWidth - 8 - KPI_HOVER_WIDTH
                                : cell.offsetLeft + 8,
                              y: cell.offsetTop + cell.offsetHeight + 6,
                            });
                          }}
                          className={cn(
                            "flex cursor-default flex-col gap-2 px-3.5 py-2.5 transition-colors duration-150 first:rounded-l-xl last:rounded-r-xl [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-hover",
                            highlighted && "bg-primary-soft/60",
                          )}
                        >
                          <div className="flex h-4 items-center gap-1.5">
                            <Icon
                              icon={kpi.icon}
                              size={13}
                              strokeWidth={1.9}
                              className="shrink-0 text-muted-foreground"
                            />
                            <span className="font-ui text-[11.5px] leading-4 text-muted-foreground">
                              {kpi.label}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between gap-1.5">
                            <span className="font-sans text-[22px] font-medium leading-[26px] tracking-[-0.02em] text-foreground tabular-nums">
                              {kpi.value}
                            </span>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-sm px-1 py-0.5 font-ui text-[10.5px] font-medium leading-3.5 transition-colors duration-150",
                                kpi.tone === "success"
                                  ? "text-success-strong"
                                  : "text-warning-strong",
                              )}
                            >
                              <Icon
                                icon={
                                  kpi.tone === "success"
                                    ? TradeUpIcon
                                    : UserCheck01Icon
                                }
                                size={12}
                                strokeWidth={2.2}
                                className="shrink-0"
                              />
                              <span className="truncate">{kpi.delta}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    </div>

                    <AnimatePresence>
                      {kpiHover && (
                        <KpiHoverCard
                          hover={kpiHover}
                          reduceMotion={reduceMotion}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-1 dark:shadow-[0_0_0_1px_var(--edge-1),0_1px_2px_rgba(0,0,0,0.24)]">
                      <div className="flex h-9 shrink-0 items-center justify-between border-b border-separator px-3.5">
                        <span className="font-ui text-[12.5px] font-medium leading-4 text-foreground">
                          Created vs released
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 font-ui text-[11px] text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-stage-submitted" />
                            Created
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-ui text-[11px] text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-stage-released" />
                            Released
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-end pb-2 pt-2.5">
                        <div
                          ref={chartPlotRef}
                          onMouseMove={handleChartPointerMove}
                          className="relative h-[112px] w-full cursor-crosshair select-none"
                        >
                          <svg
                            viewBox="0 0 100 112"
                            preserveAspectRatio="none"
                            className="h-full w-full overflow-visible"
                            role="img"
                            aria-label="Created vs released monthly trend from Jun to Nov 2026"
                          >
                            <defs>
                              <linearGradient
                                id="hero-created-grad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="var(--stage-submitted)"
                                  stopOpacity="0.2"
                                />
                                <stop
                                  offset="100%"
                                  stopColor="var(--stage-submitted)"
                                  stopOpacity="0"
                                />
                              </linearGradient>
                              <linearGradient
                                id="hero-released-grad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="var(--stage-released)"
                                  stopOpacity="0.2"
                                />
                                <stop
                                  offset="100%"
                                  stopColor="var(--stage-released)"
                                  stopOpacity="0"
                                />
                              </linearGradient>
                            </defs>
                            <line
                              x1="0"
                              y1="10"
                              x2="100"
                              y2="10"
                              vectorEffect="non-scaling-stroke"
                              stroke="currentColor"
                              className="text-separator"
                              strokeDasharray="3 3"
                            />
                            <line
                              x1="0"
                              y1="61"
                              x2="100"
                              y2="61"
                              vectorEffect="non-scaling-stroke"
                              stroke="currentColor"
                              className="text-separator"
                              strokeDasharray="3 3"
                            />
                            <line
                              x1="0"
                              y1="111"
                              x2="100"
                              y2="111"
                              vectorEffect="non-scaling-stroke"
                              stroke="currentColor"
                              className="text-border"
                            />
                            <path
                              d="M0 64 L1.5 64 C9.5 64 12.9 46 20.9 46 C28.9 46 32.3 55 40.3 55 C48.3 55 51.7 28 59.7 28 C67.7 28 71.1 37 79.1 37 C87.1 37 90.5 10 98.5 10 L100 10 L100 111 L0 111 Z"
                              fill="url(#hero-created-grad)"
                            />
                            <path
                              d="M0 94 L1.5 94 C9.5 94 12.9 82 20.9 82 C28.9 82 32.3 73 40.3 73 C48.3 73 51.7 76 59.7 76 C67.7 76 71.1 60 79.1 60 C87.1 60 90.5 54 98.5 54 L100 54 L100 111 L0 111 Z"
                              fill="url(#hero-released-grad)"
                            />
                            <path
                              d="M0 64 L1.5 64 C9.5 64 12.9 46 20.9 46 C28.9 46 32.3 55 40.3 55 C48.3 55 51.7 28 59.7 28 C67.7 28 71.1 37 79.1 37 C87.1 37 90.5 10 98.5 10 L100 10"
                              fill="none"
                              vectorEffect="non-scaling-stroke"
                              stroke="var(--stage-submitted)"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                            />
                            <path
                              d="M0 94 L1.5 94 C9.5 94 12.9 82 20.9 82 C28.9 82 32.3 73 40.3 73 C48.3 73 51.7 76 59.7 76 C67.7 76 71.1 60 79.1 60 C87.1 60 90.5 54 98.5 54 L100 54"
                              fill="none"
                              vectorEffect="non-scaling-stroke"
                              stroke="var(--stage-released)"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                            />
                          </svg>

                          <motion.div
                            aria-hidden="true"
                            animate={{
                              left: `${activePoint.xPct}%`,
                              top: `${(activePoint.createdY / 112) * 100}%`,
                            }}
                            transition={chartSpring}
                            className="pointer-events-none absolute bottom-0 w-px -translate-x-1/2 border-l border-dashed border-foreground/25"
                          />

                          <motion.div
                            aria-hidden="true"
                            animate={{
                              left: `${activePoint.xPct}%`,
                              top: `${(activePoint.createdY / 112) * 100}%`,
                            }}
                            transition={chartSpring}
                            className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-stage-submitted bg-card shadow-[0_0_0_2px_rgba(59,130,246,0.18)] dark:bg-surface-1"
                          />

                          <motion.div
                            aria-hidden="true"
                            animate={{
                              left: `${activePoint.xPct}%`,
                              top: `${(activePoint.releasedY / 112) * 100}%`,
                            }}
                            transition={chartSpring}
                            className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-stage-released bg-card shadow-[0_0_0_2px_rgba(34,197,94,0.18)] dark:bg-surface-1"
                          />

                          <motion.div
                            animate={{ left: `${tooltipLeftPct}%` }}
                            transition={chartSpring}
                            className="pointer-events-none absolute top-1 flex min-w-[104px] flex-col gap-1 rounded-md bg-invert px-2.5 py-1.5 text-invert-foreground shadow-[0_6px_16px_-4px_rgba(23,23,23,0.32)] dark:border dark:border-edge-3 dark:bg-surface-3 dark:text-foreground"
                          >
                            <span className="font-ui text-[10.5px] font-medium leading-3.5">
                              {activePoint.full}
                            </span>
                            <span className="flex items-center gap-1.5 font-ui text-[10px] leading-3.5">
                              <span className="size-1.5 rounded-[2px] bg-[#60A5FA]" />
                              <span className="opacity-70">Created</span>
                              <span className="ml-auto font-medium tabular-nums">
                                {activePoint.created}
                              </span>
                            </span>
                            <span className="flex items-center gap-1.5 font-ui text-[10px] leading-3.5">
                              <span className="size-1.5 rounded-[2px] bg-[#4ADE80]" />
                              <span className="opacity-70">Released</span>
                              <span className="ml-auto font-medium tabular-nums">
                                {activePoint.released}
                              </span>
                            </span>
                          </motion.div>
                        </div>

                        <div className="mt-1.5 flex items-center justify-between px-0.5">
                          {CHART_POINTS.map((point, index) => (
                            <button
                              key={point.month}
                              type="button"
                              onMouseEnter={() => setActiveMonthIndex(index)}
                              onClick={() => setActiveMonthIndex(index)}
                              className={cn(
                                "cursor-pointer font-ui text-[10px] leading-3.5 transition-colors duration-150",
                                index === activeMonthIndex
                                  ? "font-medium text-foreground"
                                  : "text-foreground/40 hover:text-foreground/70",
                              )}
                            >
                              {point.month}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="hidden min-w-0 flex-col overflow-hidden rounded-xl bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] md:flex dark:bg-surface-1 dark:shadow-[0_0_0_1px_var(--edge-1),0_1px_2px_rgba(0,0,0,0.24)]">
                      <div className="flex h-9 shrink-0 items-center justify-between border-b border-separator pl-3.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-ui text-[12.5px] font-medium leading-4 text-foreground">
                            Projects
                          </span>
                          <span className="inline-flex h-[17px] min-w-[17px] items-center justify-center rounded-tile border border-stroke-primary bg-muted px-1.5 font-ui text-[10px] font-medium leading-3 text-muted-foreground tabular-nums dark:border-edge-2 dark:bg-surface-3">
                            34
                          </span>
                        </div>
                        <span className="inline-flex h-6 items-center gap-1 rounded-md px-1.5 font-ui text-[11px] font-medium text-muted-foreground transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-hover [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground">
                          View all
                          <Icon
                            icon={ArrowUpRight01Icon}
                            size={11}
                            strokeWidth={2}
                            className="text-icon"
                          />
                        </span>
                      </div>

                      <div className="divide-y divide-separator">
                        {PROJECTS.map((item) => (
                          <div
                            key={item.name}
                            className="flex h-[48px] items-center gap-2.5 px-3.5 transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-hover"
                          >
                            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-stroke-primary bg-muted text-fg-secondary dark:border-edge-2 dark:bg-surface-3">
                              <Icon icon={item.icon} size={14} strokeWidth={1.9} />
                            </span>
                            <div className="flex min-w-0 flex-1 flex-col gap-px">
                              <span className="truncate font-ui text-[12px] font-medium leading-4 text-foreground">
                                {item.name}
                              </span>
                              <span className="truncate font-ui text-[10.5px] leading-3.5 text-icon">
                                {item.meta}
                              </span>
                            </div>
                            <div className="relative flex h-5 w-[58px] shrink-0 items-center">
                              <ProfileAvatar
                                code={item.members[0]}
                                size={20}
                                className="absolute left-0 top-0 ring-2 ring-card dark:ring-surface-1"
                              />
                              <ProfileAvatar
                                code={item.members[1]}
                                size={20}
                                className="absolute left-3.5 top-0 ring-2 ring-card dark:ring-surface-1"
                              />
                              <span className="absolute left-7 top-0 inline-flex h-5 items-center rounded-full bg-muted px-1.5 font-ui text-[10px] font-medium leading-3 text-muted-foreground ring-2 ring-card dark:bg-surface-3 dark:ring-surface-1">
                                {item.extra}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col overflow-hidden rounded-xl bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-1 dark:shadow-[0_0_0_1px_var(--edge-1),0_1px_2px_rgba(0,0,0,0.24)]">
                    <div className="flex h-10 shrink-0 items-center justify-between gap-2 pl-3.5 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-ui text-[12.5px] font-medium leading-4 text-foreground">
                          Recent products
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div
                          role="tablist"
                          aria-label="Filter recent products"
                          className="flex h-6 items-center gap-0.5 rounded-sm border border-stroke-primary bg-muted p-0.5 dark:border-edge-2 dark:bg-surface-2"
                        >
                          {PRODUCT_FILTER_OPTIONS.map((tab) => {
                            const active = productFilter === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                aria-label={tab.label}
                                title={tab.label}
                                onClick={() => setProductFilter(tab.id)}
                                className={cn(
                                  "relative inline-flex h-5 w-[22px] cursor-pointer items-center justify-center rounded-[4px] transition-colors duration-150",
                                  active
                                    ? "text-foreground"
                                    : "text-icon hover:text-foreground",
                                )}
                              >
                                {active && (
                                  <motion.span
                                    layoutId="hero-recent-products-tab"
                                    transition={pillSpring}
                                    className="absolute inset-0 rounded-[4px] bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-3 dark:shadow-[0_0_0_1px_var(--edge-2)]"
                                  />
                                )}
                                <Icon
                                  icon={tab.icon}
                                  size={12}
                                  strokeWidth={1.9}
                                  className="relative z-10"
                                />
                              </button>
                            );
                          })}
                        </div>

                        <span
                          aria-hidden="true"
                          className="inline-flex size-6 items-center justify-center rounded-sm border border-border bg-card text-icon shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-edge-2 dark:bg-surface-2"
                        >
                          <Icon icon={Columns3CogIcon} size={12} strokeWidth={1.9} />
                        </span>

                        <span className="hidden h-6 items-center gap-1 rounded-md px-1.5 font-ui text-[11px] font-medium text-muted-foreground sm:inline-flex">
                          View all
                          <Icon
                            icon={ArrowUpRight01Icon}
                            size={11}
                            strokeWidth={2}
                            className="text-icon"
                          />
                        </span>
                      </div>
                    </div>

                    <div className="flex h-[30px] shrink-0 items-center border-y border-separator bg-muted/60 font-ui text-[10.5px] font-medium text-muted-foreground dark:bg-surface-2/60">
                      <div className="flex w-[76px] shrink-0 items-center gap-1 pl-3.5">
                        <span>PPN</span>
                        <Icon icon={UnfoldMoreIcon} size={9} strokeWidth={2.2} className="opacity-50" />
                      </div>
                      <div className="flex min-w-0 flex-1 items-center gap-1 pl-2">
                        <span>Product name</span>
                        <Icon icon={UnfoldMoreIcon} size={9} strokeWidth={2.2} className="opacity-50" />
                      </div>
                      <div className="hidden w-[116px] shrink-0 items-center gap-1 pl-2 sm:flex">
                        <span>Project</span>
                        <Icon icon={UnfoldMoreIcon} size={9} strokeWidth={2.2} className="opacity-50" />
                      </div>
                      <div className="hidden w-[118px] shrink-0 items-center gap-1 pl-2 xl:flex">
                        <span>Department</span>
                        <Icon icon={UnfoldMoreIcon} size={9} strokeWidth={2.2} className="opacity-50" />
                      </div>
                      <div className="hidden w-[96px] shrink-0 items-center gap-1 pl-2 md:flex">
                        <span>Owner</span>
                        <Icon icon={UnfoldMoreIcon} size={9} strokeWidth={2.2} className="opacity-50" />
                      </div>
                      <div className="flex w-[112px] shrink-0 items-center gap-1 pl-2">
                        <span>Status</span>
                        <Icon icon={UnfoldMoreIcon} size={9} strokeWidth={2.2} className="opacity-50" />
                      </div>
                      <div className="hidden w-[66px] shrink-0 items-center gap-1 pl-2 lg:flex">
                        <span>Version</span>
                      </div>
                      <div className="hidden w-[82px] shrink-0 items-center gap-1 pl-2 pr-3 sm:flex">
                        <span>Progress</span>
                      </div>
                    </div>

                    <div className="divide-y divide-separator">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {visibleProducts.map((row) => (
                          <motion.div
                            key={row.ppn}
                            layout="position"
                            initial={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: 4 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            exit={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: -4 }
                            }
                            transition={{
                              duration: 0.18,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            className={cn(
                              "flex h-[41px] items-center transition-colors duration-150 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-hover",
                              spotlight === "release" &&
                                row.status === "Released" &&
                                "bg-success-soft/60",
                              spotlight === "review" &&
                                row.status === "In review" &&
                                "bg-warning-soft/50",
                            )}
                          >
                            <div className="w-[76px] shrink-0 pl-3.5 font-mono text-[10.5px] leading-4 text-muted-foreground">
                              {row.ppn}
                            </div>
                            <div className="min-w-0 flex-1 truncate pl-2 font-ui text-[11.5px] font-medium leading-4 text-foreground">
                              {row.name}
                            </div>
                            <div className="hidden w-[116px] shrink-0 truncate pl-2 font-ui text-[11.5px] leading-4 text-fg-secondary sm:block">
                              {row.project}
                            </div>
                            <div className="hidden w-[118px] shrink-0 truncate pl-2 font-ui text-[11.5px] leading-4 text-fg-secondary xl:block">
                              {row.department}
                            </div>
                            <div className="hidden w-[96px] shrink-0 items-center gap-1.5 pl-2 md:flex">
                              <ProfileAvatar code={row.ownerCode} size={18} />
                              <span className="truncate font-ui text-[11.5px] leading-4 text-fg-secondary">
                                {row.owner}
                              </span>
                            </div>
                            <div className="flex w-[112px] shrink-0 items-center gap-1 pl-2">
                              <StatusPill status={row.status} />
                              {row.hasBranch && (
                                <span
                                  aria-hidden="true"
                                  className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground dark:bg-surface-3"
                                >
                                  <Icon icon={GitBranchIcon} size={10} strokeWidth={2} />
                                </span>
                              )}
                            </div>
                            <div className="hidden w-[66px] shrink-0 items-center gap-1 pl-2 lg:flex">
                              <span className="inline-flex h-[18px] items-center rounded-sm border border-stroke-primary bg-muted px-1.5 font-mono text-[10px] leading-3.5 text-fg-secondary dark:border-edge-2 dark:bg-surface-3">
                                {row.version}
                              </span>
                              {row.hasApprovedBadge && (
                                <span
                                  aria-hidden="true"
                                  className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground dark:bg-surface-3"
                                >
                                  <Icon
                                    icon={CheckmarkCircle02Icon}
                                    size={10}
                                    strokeWidth={2}
                                  />
                                </span>
                              )}
                            </div>
                            <div className="hidden w-[82px] shrink-0 items-center gap-1.5 pl-2 pr-3 sm:flex">
                              <ProgressRing value={row.progress} />
                              <span className="font-ui text-[11.5px] font-medium leading-4 text-foreground tabular-nums">
                                {row.progress}%
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            layout
            transition={pillSpring}
            className={cn(
              "hero-enter-float absolute bottom-4 right-4 z-20 hidden w-[340px] rounded-2xl border border-white/60 bg-white/40 p-[5px] backdrop-blur-md shadow-[0_0_28px_10px_rgba(255,255,255,0.35),0_12px_24px_-8px_rgba(27,16,58,0.18),0_40px_80px_-24px_rgba(27,16,58,0.35)] md:block lg:bottom-auto lg:right-[18px] lg:top-[386px] lg:w-[376px] xl:right-[21px] xl:w-[396px] dark:border-edge-3 dark:bg-[#141414]/45 dark:shadow-[0_0_28px_10px_rgba(20,20,20,0.35),0_12px_24px_-8px_rgba(0,0,0,0.45),0_40px_80px_-24px_rgba(0,0,0,0.65)]",
              spotlight === "spec-change" &&
                "ring-2 ring-primary/50 ring-offset-2 ring-offset-transparent",
            )}
            style={
              {
                "--hero-delay": "260ms",
                "--hero-duration": "480ms",
              } as React.CSSProperties
            }
          >
            <div className="flex flex-col overflow-hidden rounded-xl bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-2 dark:shadow-[0_0_0_1px_var(--edge-2),0_1px_2px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-2.5 border-b border-separator px-3.5 py-2.5">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-stroke-primary bg-card text-fg-secondary shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-2">
                  <Icon icon={FileAddIcon} size={15} strokeWidth={1.6} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-px">
                  <span className="truncate font-ui text-[12.5px] font-medium leading-4 text-foreground">
                    IV Extension Set
                  </span>
                  <span className="truncate font-ui text-[10.5px] leading-3.5 text-icon">
                    Pouch label · English
                  </span>
                </div>
                <div className="flex h-[26px] shrink-0 items-center gap-1 rounded-[8px] border border-stroke-primary bg-muted p-[2px] dark:border-edge-2 dark:bg-surface-3">
                  <span className="inline-flex h-[20px] items-center rounded-[5px] bg-card px-2 font-ui text-[11px] font-medium leading-3.5 text-muted-foreground dark:bg-surface-2">
                    v3
                  </span>
                  <span className="inline-flex h-[20px] w-3.5 items-center justify-center text-icon">
                    <Icon icon={RepeatIcon} size={11} strokeWidth={2} />
                  </span>
                  <span className="inline-flex h-[20px] items-center rounded-[5px] bg-invert px-2 font-ui text-[11px] font-medium leading-3.5 text-invert-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(23,23,23,0.2)]">
                    v4
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-separator px-3.5 py-2">
                <div
                  role="tablist"
                  aria-label="Filter redline changes"
                  className="flex items-center gap-1"
                >
                  {(["All", "Updated", "Added"] as const).map((tab) => {
                    const active = redlineFilter === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setRedlineFilter(tab)}
                        className={cn(
                          "relative cursor-pointer rounded-sm px-2 py-[3px] font-ui text-[11px] leading-3.5 transition-colors duration-150 active:scale-[0.97]",
                          active
                            ? "font-medium text-invert-foreground"
                            : "text-fg-secondary shadow-[inset_0_0_0_1px_var(--stroke-primary)] hover:text-foreground dark:shadow-[inset_0_0_0_1px_var(--edge-2)]",
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="hero-redline-filter-tab"
                            transition={pillSpring}
                            className="absolute inset-0 rounded-sm bg-invert"
                          />
                        )}
                        <span className="relative z-10">{tab}</span>
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={redlineCountLabel}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 3 }}
                    transition={{ duration: 0.14 }}
                    className="font-ui text-[10.5px] leading-3.5 text-placeholder tabular-nums"
                  >
                    {redlineCountLabel}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={redlineFilter}
                    initial={
                      reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                    transition={{
                      duration: 0.18,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    className="divide-y divide-separator"
                  >
                    {visibleRedlines.map((item, idx) => {
                      const dimmed = redlineFilter === "All" && idx === 2;
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "flex min-h-[58px] items-center gap-2.5 px-3.5 py-2.5",
                            dimmed && "opacity-55",
                          )}
                        >
                          <span
                            className={cn(
                              "w-[3px] shrink-0 self-stretch rounded-[2px]",
                              item.type === "Updated"
                                ? "bg-stage-released"
                                : "bg-stage-submitted",
                            )}
                          />
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-ui text-[10.5px] leading-3.5 text-placeholder">
                                {item.field}
                              </span>
                              <span
                                className={cn(
                                  "font-ui text-[10.5px] font-medium leading-3.5",
                                  item.type === "Updated"
                                    ? "text-diff-updated"
                                    : "text-diff-added",
                                )}
                              >
                                {item.type}
                              </span>
                            </div>
                            {item.type === "Added" ? (
                              <div className="truncate">
                                <span className="inline-block max-w-full truncate rounded-[3px] bg-diff-added-soft px-1 font-ui text-[11.5px] leading-[17px] text-diff-added">
                                  {item.after}
                                </span>
                              </div>
                            ) : (
                              <p className="truncate font-ui text-[11.5px] leading-[17px] text-foreground">
                                {item.prefix}
                                {item.before && (
                                  <span className="line-through decoration-1">
                                    {item.before}
                                  </span>
                                )}
                                {item.after}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <LiveDiscussionCard
        highlighted={spotlight === "review"}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}

function StatusPill({ status }: { status: ProductRow["status"] }) {
  if (status === "In review") {
    return (
      <span className="inline-flex h-[18px] items-center gap-1 rounded-tile border border-[#F59E0B]/20 bg-warning-soft pl-1.5 pr-1.5 font-ui text-[10.5px] font-medium leading-3 text-warning-strong">
        <span className="size-1.5 rounded-full bg-stage-review" />
        In review
      </span>
    );
  }
  if (status === "Released") {
    return (
      <span className="inline-flex h-[18px] items-center gap-1 rounded-tile border border-[#22C55E]/20 bg-success-soft pl-1.5 pr-1.5 font-ui text-[10.5px] font-medium leading-3 text-success-strong">
        <span className="size-1.5 rounded-full bg-stage-released" />
        Released
      </span>
    );
  }
  return (
    <span className="inline-flex h-[18px] items-center gap-1 rounded-tile border border-[#3B82F6]/20 bg-info-soft pl-1.5 pr-1.5 font-ui text-[10.5px] font-medium leading-3 text-info-strong">
      <span className="size-1.5 rounded-full bg-stage-submitted" />
      Submitted
    </span>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Archive01Icon,
  Blockchain03Icon,
  FileSyncIcon,
  Layers01Icon,
  Menu01Icon,
  TextStrikethroughIcon,
  UserCheck01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@uprevit/ui/components/ui/sheet";
import { cn } from "@uprevit/ui/lib/utils";
import { BrandLogo } from "@/components/BrandLogo";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

interface PlatformMenuItem {
  title: string;
  description: string;
  href: string;
  icon: IconSvgElement;
  badge?: string;
}

const PLATFORM_MENU_COLUMNS: [PlatformMenuItem[], PlatformMenuItem[]] = [
  [
    {
      title: "Platform overview",
      description: "Departments, projects, roles and governance in one workspace",
      href: "/platform/overview",
      icon: UserMultipleIcon,
    },
    {
      title: "Products & bulk import",
      description: "Seven structured tabs per product plus validated Excel import",
      href: "/platform/products",
      icon: Blockchain03Icon,
    },
    {
      title: "Version control",
      description: "Draft to released timelines with immutable master records",
      href: "/platform/version-control",
      icon: FileSyncIcon,
    },
  ],
  [
    {
      title: "Redlining",
      description: "Automated field-by-field diffs against your master version",
      href: "/platform/redlining",
      icon: TextStrikethroughIcon,
    },
    {
      title: "Approval workflows",
      description: "Cross-functional sign-off across RA, QA and Packaging",
      href: "/platform/approval-workflows",
      icon: UserCheck01Icon,
      badge: "New",
    },
    {
      title: "Reports & exports",
      description: "Portfolio query reports plus full PDF & Excel product exports",
      href: "/platform/reports-exports",
      icon: Archive01Icon,
    },
  ],
];

const NEW_BADGE_CLASS =
  "inline-flex items-center rounded-[5px] bg-primary-soft px-1.5 font-ui text-[10px] font-medium leading-4 text-primary-700 ring-1 ring-inset ring-primary/25 dark:text-primary-text";

const ALL_PLATFORM_ITEMS = [
  ...PLATFORM_MENU_COLUMNS[0],
  ...PLATFORM_MENU_COLUMNS[1],
];

const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/resources/blogs" },
];

export interface MarketingHeaderProps {
  inTileGrid?: boolean;
}

export default function MarketingHeader({
  inTileGrid = false,
}: MarketingHeaderProps) {
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const [isPlatformOpen, setIsPlatformOpen] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsPlatformOpen(false);
    setIsMobileNavOpen(false);
  }

  React.useEffect(() => {
    if (!isPlatformOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPlatformOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsPlatformOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isPlatformOpen]);

  const cancelCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = React.useCallback(() => {
    cancelCloseTimer();
    setIsPlatformOpen(true);
  }, [cancelCloseTimer]);

  const scheduleCloseMenu = React.useCallback(() => {
    cancelCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsPlatformOpen(false);
    }, 120);
  }, [cancelCloseTimer]);

  React.useEffect(() => {
    return () => cancelCloseTimer();
  }, [cancelCloseTimer]);

  const row = (
    <TileRow
      as="header"
      className={cn(
        "sticky top-0 z-50 h-14 transition-[box-shadow] duration-200",
        isScrolled && "shadow-[0_1px_0_var(--grid)]",
      )}
      railClassName={cn(
        "transition-colors duration-200",
        isScrolled && "bg-tile/90 backdrop-blur-md",
      )}
      centerClassName={cn(
        "flex items-center px-5 sm:px-8 lg:px-10 transition-colors duration-200",
        isScrolled && "bg-tile/90 backdrop-blur-md",
      )}
    >
      <div className="flex h-14 w-full items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center rounded-md outline-none transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
          aria-label="Uprevit home"
        >
          <BrandLogo size="xs" />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-0.5 md:flex"
        >
          <div
            ref={menuRef}
            className="relative"
            onMouseEnter={openMenu}
            onMouseLeave={scheduleCloseMenu}
          >
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={isPlatformOpen}
              aria-controls="platform-nav-panel"
              onClick={() => setIsPlatformOpen((prev) => !prev)}
              className={cn(
                "inline-flex h-[30px] cursor-pointer items-center gap-1 rounded-sm px-2.5 font-ui text-[13px] font-medium leading-4 outline-none transition-[color,background-color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]",
                isPlatformOpen || pathname.startsWith("/platform")
                  ? "bg-separator text-foreground dark:bg-surface-hover"
                  : "text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-separator [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-hover",
              )}
            >
              Platform
            </button>

            <AnimatePresence>
              {isPlatformOpen && (
                <motion.div
                  id="platform-nav-panel"
                  aria-label="Platform pages"
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.96, y: -4 }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.97, y: -3 }
                  }
                  transition={{
                    duration: reduceMotion ? 0.12 : 0.18,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  style={{ transformOrigin: "top center" }}
                  className="absolute left-1/2 top-full z-50 mt-2.5 w-[632px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl bg-card p-1 shadow-[0_0_0_1px_rgba(23,23,23,0.08),0_24px_48px_-12px_rgba(23,23,23,0.16),0_8px_16px_-8px_rgba(23,23,23,0.08)] dark:bg-surface-3 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(255,255,255,0.12),0_2px_6px_rgba(0,0,0,0.4),0_16px_40px_rgba(0,0,0,0.6)]"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {PLATFORM_MENU_COLUMNS.map((column, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-1">
                        {column.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setIsPlatformOpen(false)}
                            className="group/item flex items-start gap-2.5 rounded-lg p-2 outline-none transition-colors duration-150 focus-visible:bg-foreground/[0.035] focus-visible:ring-2 focus-visible:ring-ring [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground/[0.035] dark:focus-visible:bg-white/[0.05] dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.05]"
                          >
                            <span className="relative flex size-[52px] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-card shadow-[inset_0_0_0_1px_rgba(23,23,23,0.08)] transition-[background-color,box-shadow] duration-150 group-hover/item:shadow-[inset_0_0_0_1px_rgba(23,23,23,0.14)] dark:bg-surface-2 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] dark:group-hover/item:bg-surface-4 dark:group-hover/item:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16),inset_0_1px_0_rgba(255,255,255,0.08)]">
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-0 left-2 w-0 border-l border-dashed border-separator transition-colors duration-150 group-hover/item:border-stroke-primary dark:border-white/[0.07] dark:group-hover/item:border-white/[0.12]"
                              />
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-0 right-2 w-0 border-l border-dashed border-separator transition-colors duration-150 group-hover/item:border-stroke-primary dark:border-white/[0.07] dark:group-hover/item:border-white/[0.12]"
                              />
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-2 h-0 border-t border-dashed border-separator transition-colors duration-150 group-hover/item:border-stroke-primary dark:border-white/[0.07] dark:group-hover/item:border-white/[0.12]"
                              />
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 bottom-2 h-0 border-t border-dashed border-separator transition-colors duration-150 group-hover/item:border-stroke-primary dark:border-white/[0.07] dark:group-hover/item:border-white/[0.12]"
                              />
                              <Icon
                                icon={item.icon}
                                size={20}
                                strokeWidth={1.8}
                                className="relative text-icon transition-colors duration-150 group-hover/item:text-foreground dark:text-muted-foreground dark:group-hover/item:text-foreground"
                              />
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
                              <span className="flex items-center gap-1.5">
                                <span className="font-ui text-[13px] font-medium leading-[18px] text-foreground/85 transition-colors duration-150 group-hover/item:text-foreground dark:text-foreground/90 dark:group-hover/item:text-foreground">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className={NEW_BADGE_CLASS}>
                                    {item.badge}
                                  </span>
                                )}
                              </span>
                              <span className="font-ui text-[12px] leading-[16.5px] text-muted-foreground">
                                {item.description}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/resources/blogs"
                ? pathname.startsWith("/resources")
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex h-[30px] items-center rounded-sm px-2.5 font-ui text-[13px] font-medium leading-4 outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-separator text-foreground dark:bg-surface-hover"
                    : "text-muted-foreground hover:bg-separator hover:text-foreground dark:hover:bg-surface-hover",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            data-attr="header-book-demo"
            className="hidden h-[30px] items-center gap-1.5 rounded-sm border border-primary-700 bg-primary px-3 font-ui text-[12.5px] font-medium leading-4 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] active:bg-primary-700 sm:inline-flex [@media(hover:hover)_and_(pointer:fine)]:hover:bg-primary-hover [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_6px_16px_-6px_rgba(127,34,254,0.55)]"
          >
            Book a demo
          </Link>

          <div className="md:hidden">
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 rounded-md border border-border bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-[0.96] dark:border-edge-2 dark:bg-surface-2"
                  aria-label="Open navigation menu"
                >
                  <Icon icon={Menu01Icon} size={16} strokeWidth={1.8} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="z-95 w-full max-w-none overflow-y-auto border-l border-border bg-background px-0 sm:max-w-sm"
              >
                <SheetHeader className="border-b border-separator px-5 py-4 text-left">
                  <SheetTitle className="flex items-center">
                    <BrandLogo size="sm" />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-5 px-5 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="mb-1.5 px-2 font-mono text-caption uppercase tracking-label text-muted-foreground">
                      Platform
                    </div>
                    {ALL_PLATFORM_ITEMS.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setIsMobileNavOpen(false)}
                        className="flex items-start gap-3 rounded-md px-2 py-2.5 outline-none transition-colors duration-150 hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-sm border border-stroke-primary bg-card text-icon dark:bg-surface-2">
                          <Icon icon={item.icon} size={16} strokeWidth={1.8} />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 font-ui text-body-m font-medium text-foreground">
                            {item.title}
                            {item.badge && (
                              <span className={NEW_BADGE_CLASS}>
                                {item.badge}
                              </span>
                            )}
                          </span>
                          <span className="font-ui text-label leading-snug text-muted-foreground">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1 border-t border-separator pt-4">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileNavOpen(false)}
                        className="flex h-10 items-center rounded-md px-3 font-ui text-body-m font-medium text-foreground outline-none transition-colors duration-150 hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="/resources"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="flex h-10 items-center gap-2 rounded-md px-3 font-ui text-body-m font-medium text-muted-foreground outline-none transition-colors duration-150 hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon icon={Layers01Icon} size={16} strokeWidth={1.8} />
                      Resources hub
                    </Link>
                  </div>

                  <div className="border-t border-separator pt-4">
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-primary-700 bg-primary px-4 font-ui text-body-m font-medium text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] outline-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
                    >
                      Book a demo
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </TileRow>
  );

  if (inTileGrid) {
    return row;
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-card dark:bg-background">
      <div className="w-full bg-grid p-px">{row}</div>
    </div>
  );
}

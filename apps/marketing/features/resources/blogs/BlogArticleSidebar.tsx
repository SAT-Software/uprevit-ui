"use client";

import * as React from "react";
import {
  ArrowDown01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import type { BlogTocItem } from "@/lib/blog";

export function CopyArticleLinkButton({ className }: { className?: string }) {
  const [copied, setCopied] = React.useState(false);
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-card px-2.5 font-ui text-[12px] font-medium leading-4 text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-colors duration-150 hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring dark:border-edge-2 dark:bg-surface-2 dark:hover:bg-surface-3",
        className,
      )}
    >
      <Icon
        icon={copied ? Tick02Icon : Copy01Icon}
        size={12}
        strokeWidth={2}
        className={copied ? "text-success" : "text-icon"}
      />
      <span>{copied ? "Copied link" : "Copy link"}</span>
    </button>
  );
}

export function BlogArticleSidebar({ items }: { items: BlogTocItem[] }) {
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id ?? "");

  React.useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const updateActive = () => {
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= 120) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    updateActive();

    const observer = new IntersectionObserver(updateActive, {
      rootMargin: "-88px 0px -65% 0px",
      threshold: 0,
    });

    elements.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActive);
    };
  }, [items]);

  return (
    <aside
      aria-label="Article table of contents"
      className="sticky top-20 flex flex-col gap-7"
    >
      {items.length > 0 && (
        <div className="flex flex-col gap-3.5">
          <div className="font-mono text-caption uppercase tracking-label text-faint-foreground">
            On this page
          </div>
          <nav aria-label="On this page" className="border-l border-separator">
            <ul className="flex flex-col gap-1">
              {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setActiveId(item.id)}
                      className={cn(
                        "-ml-px block border-l-2 py-1 pl-3.5 font-ui text-[13px] leading-[18px] transition-colors duration-150",
                        isActive
                          ? "border-primary font-medium text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                      )}
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}

      <div className="h-px bg-separator" />

      <div className="flex flex-col items-start gap-3">
        <div className="font-mono text-caption uppercase tracking-label text-faint-foreground">
          Share
        </div>
        <CopyArticleLinkButton />
      </div>
    </aside>
  );
}

export function BlogArticleMobileToc({ items }: { items: BlogTocItem[] }) {
  const [open, setOpen] = React.useState(false);

  if (items.length === 0) return null;

  return (
    <TileRow as="div" className="lg:hidden" centerClassName="px-5 py-3.5 sm:px-10">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="font-ui text-body-s font-medium text-foreground">
            On this page
          </span>
          <span className="font-ui text-body-s text-faint-foreground">
            {items.length} sections
          </span>
        </span>
        <Icon
          icon={ArrowDown01Icon}
          size={15}
          strokeWidth={1.8}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <nav aria-label="On this page" className="mt-3 border-t border-separator pt-3">
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block font-ui text-body-m leading-5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </TileRow>
  );
}

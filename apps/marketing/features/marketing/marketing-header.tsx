"use client";

import * as React from "react";
import Link from "next/link";
import type { IconSvgElement } from "@hugeicons/react";
import {
  AtSignIcon,
  File02Icon,
  GridViewIcon,
  Layers01Icon,
  Menu01Icon,
  Money01Icon,
  News01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import { Button } from "@uprevit/ui/components/ui/button";

import { useIsMobile } from "@uprevit/ui/hooks/general/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@uprevit/ui/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@uprevit/ui/components/ui/sheet";
import { usePathname } from "next/navigation";
import Image from "next/image";

const resourceLinks = [
  {
    title: "Templates",
    href: "/resources/templates",
    description: "Compliance checklists and templates.",
    icon: File02Icon,
  },
  {
    title: "Standards & Symbols",
    href: "/resources/standards-symbols",
    description: "ISO documents and symbol library.",
    icon: GridViewIcon,
  },
  {
    title: "Blogs & News",
    href: "/resources/blogs",
    description: "Regulatory updates and insights.",
    icon: News01Icon,
  },
  {
    title: "Free Tools",
    href: "/resources/toolkits",
    description: "Coming soon.",
    icon: Wrench01Icon,
  },
];

export default function MarketingHeader() {
  const isMobile = useIsMobile();
  const [isAtTop, setIsAtTop] = React.useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const pathname = usePathname();

  const isResourcesAndChildPaths = pathname.startsWith("/resources");
  const isDecoratedMarketingPage =
    isResourcesAndChildPaths ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/contact");

  React.useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!isMobile) {
      setIsMobileNavOpen(false);
    }
  }, [isMobile]);

  return (
    <>
      <div className="fixed top-0 left-0 z-60 w-full">
        <div
          className={cn(
            "mx-auto flex h-14 md:h-16 w-full items-center justify-between transition-all delay-150 ease-in-out duration-300",
            !isAtTop ? "bg-accent/80 border-b" : "bg-transparent",
            isDecoratedMarketingPage &&
              "border-b border-dashed border-border/80",
          )}
          style={{
            backdropFilter: !isAtTop ? "blur(8px)" : "none",
            WebkitBackdropFilter: !isAtTop ? "blur(8px)" : "none",
          }}
        >
          <div
            className={
              "flex items-center justify-between max-w-6xl w-full mx-auto px-2 sm:px-0"
            }
          >
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 p-1 rounded  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="relative dark:hidden flex aspect-square mb-1 size-5 md:size-7 items-center justify-center">
                  <Image
                    src="/uprevit-logo-black.svg"
                    alt="Uprevit logo"
                    fill
                    className=""
                  />
                </div>
                <div className="relative hidden dark:flex aspect-square mb-1 size-5 md:size-7 items-center justify-center">
                  <Image
                    src="/uprevit-logo-white.svg"
                    alt="Uprevit logo"
                    fill
                    className=""
                  />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-base md:text-lg text-foreground font-bold ">
                      UPREVIT
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="text-xs">
                          α
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        Early preview. Active updates are in progress.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <NavigationMenu viewport={false}>
                  <NavigationMenuList className="flex-wrap">
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                      <NavigationMenuContent className="md:left-auto md:right-0 border-0 bg-transparent p-0 shadow-none">
                        <div className="rounded-2xl bg-border/20 p-1">
                          <div className="overflow-hidden rounded-xl border border-border bg-popover">
                            <div className="grid w-[min(92vw,36.5rem)] grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                              <div className="border-r border-dashed border-border p-1">
                                <NavigationMenuLink asChild>
                                  <Link
                                    href="/resources"
                                    className="flex h-full w-full flex-col justify-end gap-3 rounded-lg border border-border/60 bg-linear-to-b from-background/40 to-muted/70 p-4 no-underline outline-hidden transition-colors hover:from-background/20 hover:to-muted focus-visible:from-background/20 focus-visible:to-muted"
                                  >
                                    <div className="">
                                      <Icon
                                        icon={Layers01Icon}
                                        size={22}
                                        strokeWidth={2}
                                        className="text-foreground"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <div className="text-base font-medium text-foreground">
                                        Resources Hub
                                      </div>
                                      <p className="text-sm leading-snug text-muted-foreground">
                                        Compliance resources, templates, and
                                        tools.
                                      </p>
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </div>

                              <div className="flex h-full flex-col my-1 border-y border-dashed border-border">
                                {resourceLinks.map((link) => (
                                  <ResourceMenuItem
                                    key={link.title}
                                    href={link.href}
                                    title={link.title}
                                    description={link.description}
                                    icon={link.icon}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href="/pricing">Pricing</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                      >
                        <Link href="/contact">Contact</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <div className="md:hidden">
                <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 text-foreground"
                      aria-label="Open navigation menu"
                    >
                      <Icon icon={Menu01Icon} size={20} strokeWidth={2} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="z-95 w-full max-w-none overflow-y-auto border-l border-border bg-background px-0 sm:max-w-sm"
                  >
                    <SheetHeader className="border-b border-border px-4 py-4 text-left">
                      <SheetTitle className="text-base font-semibold">
                        Navigation
                      </SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col px-4">
                      <div className="flex flex-col gap-2 border-b border-border pb-4">
                        <Link
                          href="/pricing"
                          className={cn(
                            "flex items-center justify-between rounded-xl border border-border bg-accent/40 px-4 py-3 transition-colors hover:bg-accent",
                            isResourcesAndChildPaths &&
                              "border-foreground/20 bg-accent",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-background">
                              <Icon
                                icon={Money01Icon}
                                size={20}
                                strokeWidth={2}
                                className="text-foreground"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                Pricing
                              </div>
                              <p className="text-muted-foreground text-xs leading-snug">
                                Uprevit pricing plans and details
                              </p>
                            </div>
                          </div>
                        </Link>
                        <Link
                          href="/contact"
                          className={cn(
                            "flex items-center justify-between rounded-xl border border-border bg-accent/40 px-4 py-3 transition-colors hover:bg-accent",
                            isResourcesAndChildPaths &&
                              "border-foreground/20 bg-accent",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-background">
                              <Icon
                                icon={AtSignIcon}
                                size={20}
                                strokeWidth={2}
                                className="text-foreground"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                Contact
                              </div>
                              <p className="text-muted-foreground text-xs leading-snug">
                                Get in touch with us for demo or support
                              </p>
                            </div>
                          </div>
                        </Link>
                        <Link
                          href="/resources"
                          className={cn(
                            "flex items-center justify-between rounded-xl border border-border bg-accent/40 px-4 py-3 transition-colors hover:bg-accent",
                            isResourcesAndChildPaths &&
                              "border-foreground/20 bg-accent",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-background">
                              <Icon
                                icon={Layers01Icon}
                                size={20}
                                strokeWidth={2}
                                className="text-foreground"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                Resources Hub
                              </div>
                              <p className="text-muted-foreground text-xs leading-snug">
                                Compliance resources, templates, and tools
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>

                      <div className="border-b border-border py-5">
                        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          Resources
                        </div>
                        <div className="flex flex-col gap-2">
                          {resourceLinks.map((link) => (
                            <Link
                              key={link.title}
                              href={link.href}
                              className={cn(
                                "flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent",
                                pathname === link.href && "bg-accent",
                              )}
                            >
                              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                                <Icon
                                  icon={link.icon}
                                  size={16}
                                  strokeWidth={2}
                                  className="text-foreground"
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {link.title}
                                </div>
                                <p className="text-muted-foreground text-xs leading-snug">
                                  {link.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        <div className=" bg-amber-50/95 px-2 py-2 border-b border-border/70 text-center text-[11px] font-medium text-amber-900 backdrop-blur sm:px-6 lg:hidden dark:bg-amber-500/12 dark:text-amber-100">
          <div className="mx-auto max-w-6xl">
            For the best experience, please use Uprevit on desktop or laptop
          </div>
        </div>
      </div>

      {/* <div className="h-[5.75rem] md:hidden" aria-hidden="true" /> */}
    </>
  );
}

function ResourceMenuItem({
  title,
  description,
  href,
  icon: svgIcon,
}: {
  title: string;
  description: string;
  href: string;
  icon: IconSvgElement;
}) {
  return (
    <NavigationMenuLink
      asChild
      className="gap-0 rounded-none p-0 hover:bg-transparent focus:bg-transparent data-[active=true]:bg-transparent data-[active=true]:hover:bg-transparent"
    >
      <Link
        href={href}
        className="group/resource flex flex-row items-stretch border-b border-dashed border-border"
      >
        <span className="flex shrink-0 items-stretch justify-center border-r border-dashed border-border p-1">
          <span className="flex aspect-square h-full items-center justify-center rounded-lg transition-colors group-hover/resource:bg-accent group-focus-visible/resource:bg-accent">
            <Icon
              icon={svgIcon}
              size={28}
              strokeWidth={2}
              className="size-6 text-muted-foreground transition-colors group-hover/resource:text-foreground group-focus-visible/resource:text-foreground"
            />
          </span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 rounded-lg p-2 m-1 transition-colors group-hover/resource:bg-accent group-focus-visible/resource:bg-accent">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="line-clamp-1 text-sm leading-snug text-muted-foreground">
            {description}
          </span>
        </span>
      </Link>
    </NavigationMenuLink>
  );
}

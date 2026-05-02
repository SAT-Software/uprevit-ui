"use client";

import * as React from "react";
import Link from "next/link";
import {
  PiFileTextDuotone,
  PiListDuotone,
  PiSquaresFourDuotone,
  PiNewspaperDuotone,
  PiWrenchDuotone,
  PiStackDuotone,
  PiMoneyDuotone,
  PiAtDuotone,
} from "react-icons/pi";
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
    icon: PiFileTextDuotone,
  },
  {
    title: "Standards & Symbols",
    href: "/resources/standards-symbols",
    description: "ISO documents and symbol library.",
    icon: PiSquaresFourDuotone,
  },
  {
    title: "Blogs & News",
    href: "/resources/blogs",
    description: "Regulatory updates and insights.",
    icon: PiNewspaperDuotone,
  },
  {
    title: "Free Tools",
    href: "/resources/toolkits",
    description: "Coming soon.",
    icon: PiWrenchDuotone,
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
            "mx-auto flex h-14 md:h-18 w-full items-center justify-between transition-all delay-150 ease-in-out duration-300",
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
              "flex items-center justify-between max-w-6xl w-full mx-auto px-4 sm:px-6"
            }
          >
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 p-1 rounded  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="relative dark:hidden flex aspect-square mb-1 size-7 items-center justify-center">
                  <Image
                    src="/uprevit-logo-black"
                    alt="Uprevit logo"
                    fill
                    className=""
                  />
                </div>
                <div className="relative hidden dark:flex aspect-square mb-1 size-7 items-center justify-center">
                  <Image
                    src="/uprevit-logo-white.svg"
                    alt="Uprevit logo"
                    fill
                    className=""
                  />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-lg text-foreground font-extrabold mt-0.5">
                      UPREVIT
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          aria-label="Alpha release"
                          className="rounded-full border border-border bg-accent px-2 py-0.5 text-xs font-semibold text-muted-foreground"
                        >
                          α
                        </span>
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
                      <NavigationMenuContent className="md:left-auto md:right-0">
                        <ul className="grid gap-2 md:w-[400px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-4">
                            <NavigationMenuLink asChild>
                              <Link
                                className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                                href="/resources"
                              >
                                <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-border bg-background/80">
                                  <PiStackDuotone className="size-5 text-foreground" />
                                </div>
                                <div className="mb-2 text-lg font-medium">
                                  Resources Hub
                                </div>
                                <p className="text-muted-foreground text-sm leading-tight">
                                  Compliance resources, templates, and tools.
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          {resourceLinks.map((link) => (
                            <ListItem
                              key={link.title}
                              href={link.href}
                              title={link.title}
                              icon={link.icon}
                            >
                              {link.description}
                            </ListItem>
                          ))}
                        </ul>
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
                      <PiListDuotone className="size-5" />
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
                              <PiMoneyDuotone className="size-5 text-foreground" />
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
                              <PiAtDuotone className="size-5 text-foreground" />
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
                              <PiStackDuotone className="size-5 text-foreground" />
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
                                <link.icon className="size-4 text-foreground" />
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

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon?: React.ElementType;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="flex flex-row items-center gap-3">
          {Icon && (
            <div className="shrink-0 flex items-center justify-center size-10 rounded-lg bg-accent mt-0.5">
              <Icon className="size-5 text-foreground" />
            </div>
          )}
          <div className="flex flex-col">
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

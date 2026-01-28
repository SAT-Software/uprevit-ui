"use client";

import * as React from "react";
import Link from "next/link";
import {
  PiFileTextDuotone,
  PiSquaresFourDuotone,
  PiNewspaperDuotone,
  PiWrenchDuotone,
  PiStackDuotone,
} from "react-icons/pi";
import { cn } from "@/lib/utils";

import { useIsMobile } from "@/hooks/general/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
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
  const auth = useAuth();
  const router = useRouter();
  const [isAtTop, setIsAtTop] = React.useState(true);
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

  const handleGetStarted = () => {
    if (!auth.isLoading && auth.isAuthenticated) {
      router.push("/dashboard");
    } else {
      auth.signinRedirect();
    }
  };

  return (
    <div
      className={cn(
        "fixed top-0 w-full h-18 mx-auto flex items-center justify-between z-60 transition-all delay-150 ease-in-out duration-300",
        !isAtTop ? "bg-accent/80 border-b" : "bg-transparent",
        isDecoratedMarketingPage && "border-b border-dashed border-border/80"
      )}
      style={{
        backdropFilter: !isAtTop ? "blur(8px)" : "none",
        WebkitBackdropFilter: !isAtTop ? "blur(8px)" : "none",
      }}
    >
      <div
        className={"flex items-center justify-between max-w-6xl w-full mx-auto"}
      >
        <div>
          <Link
            href="/"
            className="flex items-center gap-4 p-1 rounded  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="relative flex aspect-square mb-1 size-8 items-center justify-center">
              <Image
                src="/log-no-bg-black.svg"
                alt="Uprevit logo"
                fill
                className=""
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-lg text-foreground font-black ">
                UPREVIT
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <NavigationMenu viewport={isMobile}>
            <NavigationMenuList className="flex-wrap">
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent className="">
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
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="default"
              className="w-fit"
              onClick={handleGetStarted}
            >
              {auth.isAuthenticated ? "Learn More" : "Log in"}
            </Button>
            <Button
              variant="default"
              size="default"
              className="w-fit"
              onClick={handleGetStarted}
            >
              {auth.isAuthenticated ? "Dashboard" : "Sign Up"}
            </Button>
          </div>
        </div>
      </div>
    </div>
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

"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { FloatingPaths } from "@/components/floating-paths";
import { Button } from "@uprevit/ui/components/ui/button";
import { useSignOut } from "@/hooks/auth/useSignOut";
import { useAuth } from "react-oidc-context";
import { PiSignOutDuotone } from "react-icons/pi";

type OnboardingShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  leftQuote?: string;
  leftAttribution?: string;
  leftCode?: string;
};

export function OnboardingShell({
  title,
  description,
  children,
  leftQuote = "Uprevit gives regulated teams one connected workspace to prepare, review, and ship compliant labeling faster.",
  leftAttribution = "Medical labeling teams",
  leftCode = "uprevit://workspace-ready | fda-udi | eu-mdr | iso-15223",
}: OnboardingShellProps) {
  const auth = useAuth();
  const signOut = useSignOut();

  return (
    <main className="relative lg:grid lg:h-screen lg:grid-cols-2 lg:overflow-hidden">
      <div className="relative hidden h-full flex-col overflow-hidden border-r border-dashed border-border/70 bg-accent/35 p-10 lg:flex dark:bg-accent/20">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/90" />

        <BrandMark className="z-10" />

        <div className="z-10 mt-auto space-y-4">
          <blockquote className="space-y-2">
            <p className="max-w-md text-xl leading-snug">
              &ldquo;{leftQuote}&rdquo;
            </p>
            <footer className="font-mono text-sm text-muted-foreground">
              {leftAttribution}
            </footer>
          </blockquote>

          <div className="inline-flex rounded-lg border border-border/60 bg-background/80 px-3 py-2 font-mono text-xs text-muted-foreground backdrop-blur-sm">
            {leftCode}
          </div>
        </div>

        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col justify-start px-6 py-8 sm:px-8 lg:max-h-screen lg:justify-center lg:overflow-y-auto lg:px-10 lg:py-10 bg-muted/80">
        {auth.isAuthenticated && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="absolute top-4 right-4 z-10 sm:top-6 sm:right-6 lg:top-8 lg:right-8"
          >
            <PiSignOutDuotone className="h-4 w-4" />
            Sign out
          </Button>
        )}

        <div
          aria-hidden
          className="absolute inset-0 isolate -z-10 opacity-60 contain-strict"
        >
          <div className="absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>

        <div className="mx-auto w-full max-w-3xl space-y-3">
          <BrandMark className="lg:hidden" />

          <div className="space-y-0 max-w-3xl">
            <h1 className="text-base font-semibold tracking-tight sm:text-lg">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {description}
            </p>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}

function BrandMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={[
        "flex w-fit items-center gap-3 rounded p-1 transition-colors",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative size-8">
        <Image
          src="/uprevit-logo-black.svg"
          alt="Uprevit logo"
          fill
          className="object-contain dark:hidden"
        />
        <Image
          src="/uprevit-logo-white.svg"
          alt="Uprevit logo"
          fill
          className="hidden object-contain dark:block"
        />
      </div>
    </Link>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircleIcon,
  ArrowRight02Icon,
  Mail01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { TileRow } from "@/components/TileGrid";

type ActionState = "ready" | "submitting" | "done" | "error";

function NewsletterActionInner({ mode }: { mode: "confirm" | "unsubscribe" }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [state, setState] = React.useState<ActionState>("ready");
  const [message, setMessage] = React.useState<string>("");

  const isConfirm = mode === "confirm";

  const handleAction = async () => {
    if (!token || state === "submitting") return;
    setState("submitting");
    setMessage("");

    try {
      const response = await fetch(`/api/newsletter/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        status?: string;
        message?: string;
      };

      if (!response.ok) {
        setState("error");
        setMessage(
          data.message ||
            (isConfirm
              ? "This confirmation link is invalid or has expired. Please subscribe again."
              : "This unsubscribe link is invalid. Please contact contact@uprevit.com."),
        );
        return;
      }

      setState("done");
      setMessage(
        data.message ||
          (isConfirm
            ? "You are subscribed to the Uprevit blog."
            : "You have been unsubscribed from the Uprevit blog."),
      );
    } catch {
      setState("error");
      setMessage(
        "Unable to reach our server right now. Please try again in a moment.",
      );
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col gap-5">
        <span className="inline-flex size-10 items-center justify-center rounded-full border border-destructive/25 bg-destructive-soft text-destructive">
          <Icon icon={AlertCircleIcon} size={18} strokeWidth={2} />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-sans text-[24px] font-medium leading-8 tracking-[-0.025em] text-foreground">
            {isConfirm ? "Invalid confirmation link" : "Invalid unsubscribe link"}
          </h1>
          <p className="font-ui text-body-m leading-[22px] text-muted-foreground">
            {isConfirm
              ? "This confirmation link is missing its token. Subscribe again from the blog page to receive a fresh link."
              : "This unsubscribe link is missing its token. Use the link from a blog email or write to contact@uprevit.com."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/resources/blogs#blog-newsletter"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary-700 bg-primary px-4 font-ui text-body-m font-medium text-primary-foreground transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.97]"
          >
            Go to blog
            <Icon icon={ArrowRight02Icon} size={14} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div role="status" aria-live="polite" className="flex flex-col gap-5">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-success-soft text-success-strong dark:text-success">
          <Icon icon={Tick02Icon} size={18} strokeWidth={2.3} />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-sans text-[24px] font-medium leading-8 tracking-[-0.025em] text-foreground">
            {isConfirm ? "Subscription confirmed" : "You’ve been unsubscribed"}
          </h1>
          <p className="font-ui text-body-m leading-[22px] text-muted-foreground">
            {message}{" "}
            {isConfirm
              ? "We’ll send you one short email whenever a new post goes live."
              : "You won’t receive any more blog emails. You can always subscribe again later."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/resources/blogs"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary-700 bg-primary px-4 font-ui text-body-m font-medium text-primary-foreground transition-[background-color,transform] duration-150 hover:bg-primary-hover active:scale-[0.97]"
          >
            Read the blog
            <Icon icon={ArrowRight02Icon} size={14} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <span className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-subtle text-foreground dark:border-edge-3 dark:bg-surface-3">
        <Icon icon={Mail01Icon} size={18} strokeWidth={1.9} />
      </span>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-sans text-[24px] font-medium leading-8 tracking-[-0.025em] text-foreground">
          {isConfirm
            ? "Confirm your blog subscription"
            : "Unsubscribe from Uprevit Blog"}
        </h1>
        <p className="font-ui text-body-m leading-[22px] text-muted-foreground">
          {isConfirm
            ? "Click the button below to confirm your email and receive one short note whenever a new post goes live."
            : "Click below to stop receiving Uprevit blog update emails. This takes effect immediately."}
        </p>
      </div>

      {state === "error" && message && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 font-ui text-body-s leading-5 text-destructive"
        >
          {message}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={handleAction}
          disabled={state === "submitting"}
          aria-busy={state === "submitting"}
          data-attr={
            isConfirm
              ? "newsletter-confirm-submit"
              : "newsletter-unsubscribe-submit"
          }
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary-700 bg-primary px-4 font-ui text-body-m font-medium text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] outline-none transition-[background-color,transform,opacity] duration-150 hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] disabled:pointer-events-none disabled:opacity-65"
        >
          {state === "submitting" && (
            <span
              aria-hidden="true"
              className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground/35 border-t-primary-foreground"
            />
          )}
          <span>
            {state === "submitting"
              ? isConfirm
                ? "Confirming…"
                : "Unsubscribing…"
              : isConfirm
                ? "Confirm subscription"
                : "Confirm unsubscribe"}
          </span>
        </button>

        <Link
          href="/resources/blogs"
          className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-4 font-ui text-body-m font-medium text-muted-foreground transition-colors hover:text-foreground dark:border-edge-3 dark:bg-surface-3"
        >
          Back to blog
        </Link>
      </div>
    </div>
  );
}

export function NewsletterActionPageContent({
  mode,
}: {
  mode: "confirm" | "unsubscribe";
}) {
  return (
    <TileRow
      as="section"
      centerClassName="flex items-center justify-center px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
    >
      <div className="w-full max-w-[520px] rounded-2xl bg-card p-6 shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.04)] sm:p-8 dark:bg-surface-2 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.24)]">
        <React.Suspense
          fallback={
            <div className="h-44 animate-pulse rounded-xl bg-muted/60" />
          }
        >
          <NewsletterActionInner mode={mode} />
        </React.Suspense>
      </div>
    </TileRow>
  );
}

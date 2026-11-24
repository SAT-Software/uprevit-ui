"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import {
  ArrowUpRight01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { BrandMark } from "@/components/BrandLogo";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import type { BlogPostSummary } from "./BlogPostCard";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface InboxMailRow {
  id: string;
  sender: string;
  time: string;
  subject: string;
  preview: string;
  unread?: boolean;
}

const ARCHIVE_MAILS: InboxMailRow[] = [
  {
    id: "review-pass",
    sender: "Uprevit Blog",
    time: "Nov 5",
    subject: "How to run a label review in one pass",
    preview: "Set reviewers, collect comments and sign off in one place...",
  },
  {
    id: "redlines",
    sender: "Uprevit Blog",
    time: "Oct 29",
    subject: "Side-by-side redlines for medical device labels",
    preview: "Compare two versions field by field without spotting by eye...",
  },
  {
    id: "iso-symbols",
    sender: "Uprevit Blog",
    time: "Oct 21",
    subject: "ISO 15223-1 symbol guidance for device packs",
    preview: "Practical checklist for global labeling teams across markets...",
  },
];

const INCOMING_MAIL: InboxMailRow = {
  id: "eu-mdr-incoming",
  sender: "Uprevit Blog",
  time: "Just now",
  subject: "EU MDR label changes: what to check before release",
  preview: "A plain walk-through of Annex I §23 updates for your next pack...",
  unread: true,
};

function buildSubscribeMailto(email: string) {
  const params = new URLSearchParams({
    subject: "Subscribe to Uprevit blog updates",
    body: `Please add ${email} to the Uprevit blog newsletter.`,
  });
  return `mailto:contact@uprevit.com?${params.toString().replace(/\+/g, "%20")}`;
}

function NewsletterInboxVisual({
  latestPost,
  recipientEmail,
}: {
  latestPost?: BlogPostSummary;
  recipientEmail: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-80px" });
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion || !inView) return;
    const id = setInterval(() => setTick((v) => v + 1), 4200);
    return () => clearInterval(id);
  }, [reduceMotion, inView]);

  const latestRow: InboxMailRow = {
    id: "latest-post",
    sender: "Uprevit Blog",
    time: "Now",
    subject:
      latestPost?.title ??
      "What is Uprevit? One place to manage medical device labeling",
    preview:
      latestPost?.description ??
      "Labeling data usually lives in spreadsheets and email threads...",
    unread: true,
  };

  const showIncoming = !reduceMotion && tick % 2 === 1;
  const rows = showIncoming
    ? [INCOMING_MAIL, latestRow, ...ARCHIVE_MAILS]
    : [latestRow, ...ARCHIVE_MAILS];
  const unreadCount = rows.filter((row) => row.unread).length;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={containerRef}
        aria-hidden="true"
        className="relative hidden h-[380px] w-[560px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_20%,#FFFFFF_0%,#FCFCFC_55%,#F7F7F7_100%)] shadow-[0_0_0_1px_rgba(23,23,23,0.05)] lg:flex dark:bg-[radial-gradient(circle_at_50%_20%,#1C1C1C_0%,#151515_55%,#111111_100%)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_0_1px_rgba(255,255,255,0.06)]"
      >
        <div className="absolute left-[30px] top-6 flex w-[500px] rounded-[22px] border border-[#1717170D] bg-[#F5F5F5BF] p-1.5 dark:border-separator dark:bg-white/[0.02]">
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-2 dark:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between gap-3 border-b border-separator px-[18px] py-3.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="font-ui text-[14px] font-semibold leading-[18px] text-foreground">
                  Inbox
                </span>
                <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-primary-50 px-[7px] font-ui text-[11px] font-medium leading-[14px] text-primary-700 dark:bg-primary-soft dark:text-primary-text">
                  {unreadCount} new
                </span>
                {recipientEmail !== "you@company.com" && (
                  <span className="truncate font-ui text-[11px] text-muted-foreground">
                    · {recipientEmail}
                  </span>
                )}
              </div>

              <div className="flex h-7 w-[176px] shrink-0 items-center gap-2 rounded-md border border-border bg-card pl-2.5 pr-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-edge-2 dark:bg-surface-3">
                <Icon
                  icon={Search01Icon}
                  size={12}
                  strokeWidth={2}
                  className="shrink-0 text-icon"
                />
                <span className="flex-1 font-ui text-[11px] leading-[14px] text-faint-foreground">
                  Search mail
                </span>
                <span className="flex h-[18px] items-center rounded border border-border bg-muted px-[5px] font-ui text-[10px] font-medium leading-3 text-muted-foreground dark:border-edge-2 dark:bg-surface-4">
                  ⌘K
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <AnimatePresence initial={false} mode="popLayout">
                {rows.map((row) => (
                  <motion.div
                    key={row.id}
                    layout="position"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.2, ease: EASE_OUT },
                    }}
                    transition={{
                      duration: 0.35,
                      ease: EASE_OUT,
                      layout: { type: "spring", duration: 0.45, bounce: 0 },
                    }}
                    className={cn(
                      "flex items-start gap-3 border-b border-separator px-[18px] py-[13px] last:border-b-0",
                      row.unread && "bg-[#F7F7F780] dark:bg-white/[0.03]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-[30px] shrink-0 items-center justify-center rounded-full",
                        row.unread
                          ? "border border-black/80 bg-[linear-gradient(180deg,#2A2A2A_0%,#1A1A1A_55%,#111111_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_2px_4px_rgba(0,0,0,0.14)] dark:border-edge-2"
                          : "border border-separator bg-muted dark:border-edge-2 dark:bg-surface-3",
                      )}
                    >
                      <BrandMark
                        className="h-[12.5px] w-[15px]"
                        markColor={
                          row.unread ? "#FFFFFF" : "var(--muted-foreground)"
                        }
                        arrowColor={
                          row.unread ? "#A56BFF" : "var(--faint-foreground)"
                        }
                      />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "font-ui text-[13px] leading-[17px] text-foreground",
                            row.unread ? "font-semibold" : "font-medium",
                          )}
                        >
                          {row.sender}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5">
                          <span
                            className={cn(
                              "font-ui text-[11px] leading-[14px]",
                              row.unread
                                ? "font-semibold text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {row.time}
                          </span>
                          {row.unread && (
                            <span className="size-[7px] rounded-full bg-primary" />
                          )}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "truncate font-ui text-[12px] leading-[17px]",
                          row.unread
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {row.subject}
                      </span>
                      <span className="truncate font-ui text-[11px] leading-4 text-faint-foreground">
                        {row.preview}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(180deg,rgba(247,247,247,0)_0%,#F7F7F7_100%)] dark:bg-[linear-gradient(180deg,rgba(17,17,17,0)_0%,#111111_100%)]" />
      </div>
    </MotionConfig>
  );
}

export function BlogNewsletterSection({
  latestPost,
}: {
  latestPost?: BlogPostSummary;
}) {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(
    null,
  );

  const displayEmail = (submittedEmail || email).trim() || "you@company.com";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your work email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setSubmittedEmail(trimmed);
  };

  return (
    <TileRow
      as="section"
      aria-labelledby="blog-newsletter-heading"
      centerClassName="flex flex-col items-stretch justify-between gap-8 px-5 pt-10 pb-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:gap-12 lg:p-12"
    >
      <div className="flex flex-1 flex-col gap-4 lg:gap-7 lg:pl-2">
        <div className="flex max-w-[520px] flex-col gap-2">
          <h2
            id="blog-newsletter-heading"
            className="font-sans text-[22px] font-medium leading-[27px] tracking-[-0.03em] text-foreground sm:text-[28px] sm:leading-[34px] lg:text-[32px] lg:leading-[38px] lg:tracking-heading"
          >
            Get new posts by email
          </h2>
          <p className="font-ui text-body-m leading-[21px] text-muted-foreground lg:text-body-l lg:leading-[26px]">
            One short email when a new post goes live. No sales emails, and you
            can leave any time.
          </p>
        </div>

        {submittedEmail ? (
          <div
            role="status"
            aria-live="polite"
            className="flex max-w-[460px] flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-edge-2 dark:bg-surface-2"
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success-strong dark:text-success">
                <Icon icon={Tick02Icon} size={12} strokeWidth={2.4} />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="font-ui text-body-m font-medium leading-5 text-foreground">
                  Confirm subscription for {submittedEmail}
                </p>
                <p className="font-ui text-body-s leading-[18px] text-muted-foreground">
                  Send a one-line email to join our mailing list.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={buildSubscribeMailto(submittedEmail)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-primary-700 bg-primary px-3.5 font-ui text-body-s font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-colors hover:bg-[#8A33FF] dark:hover:bg-primary-hover"
              >
                Open email to subscribe
                <Icon icon={ArrowUpRight01Icon} size={14} strokeWidth={1.8} />
              </a>
              <button
                type="button"
                onClick={() => {
                  setSubmittedEmail(null);
                  setEmail("");
                }}
                className="inline-flex h-9 cursor-pointer items-center rounded-md border border-border bg-card px-3 font-ui text-body-s font-medium text-muted-foreground transition-colors hover:text-foreground dark:border-edge-2 dark:bg-surface-3"
              >
                Use another email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center sm:gap-2 sm:pt-0">
              <label htmlFor="blog-newsletter-email" className="sr-only">
                Work email
              </label>
              <input
                id="blog-newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="you@company.com"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "blog-newsletter-error" : undefined}
                className="h-11 w-full rounded-lg border border-stroke-strong bg-card px-3.5 font-ui text-[15px] leading-5 text-foreground placeholder:text-placeholder shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 sm:w-[300px] dark:border-edge-3 dark:bg-surface-3 dark:text-foreground dark:placeholder:text-faint-foreground dark:shadow-[0_1px_2px_rgba(0,0,0,0.24)]"
              />
              <button
                type="submit"
                className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-primary-700 bg-primary px-5 font-ui text-[15px] font-medium leading-[18px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-[#8A33FF] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_8px_20px_-6px_rgba(127,34,254,0.55)] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] sm:w-auto dark:hover:bg-primary-hover"
              >
                Subscribe
              </button>
            </div>
            {error && (
              <p
                id="blog-newsletter-error"
                role="alert"
                className="font-ui text-body-s text-destructive"
              >
                {error}
              </p>
            )}
          </form>
        )}
      </div>

      <NewsletterInboxVisual
        latestPost={latestPost}
        recipientEmail={displayEmail}
      />
    </TileRow>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  ArrowRight02Icon,
  ArrowUpRight01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Textarea } from "@uprevit/ui/components/ui/textarea";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  ContactNoteRouting,
  type ContactTopicId,
} from "./ContactNoteRouting";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const TOPICS: { id: ContactTopicId; label: string }[] = [
  { id: "demo", label: "Book a demo" },
  { id: "pricing", label: "Pricing" },
  { id: "support", label: "Support" },
];

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  message: "",
};

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.firstName.trim()) {
    errors.firstName = "Enter your first name.";
  }
  if (!values.lastName.trim()) {
    errors.lastName = "Enter your last name.";
  }
  const email = values.email.trim();
  if (!email) {
    errors.email = "Enter your work email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.company.trim()) {
    errors.company = "Enter your company name.";
  }
  return errors;
}

function buildMailtoHref(topicLabel: string, values: FormValues) {
  const subject = `[${topicLabel}] ${values.company.trim()} — ${values.firstName.trim()} ${values.lastName.trim()}`;
  const lines = [
    `Name: ${values.firstName.trim()} ${values.lastName.trim()}`,
    `Work email: ${values.email.trim()}`,
    `Company: ${values.company.trim()}`,
    `Topic: ${topicLabel}`,
  ];
  if (values.message.trim()) {
    lines.push("", "Message:", values.message.trim());
  }
  const params = new URLSearchParams({
    subject,
    body: lines.join("\n"),
  });
  return `mailto:contact@uprevit.com?${params.toString().replace(/\+/g, "%20")}`;
}

export default function ContactHeroSection({
  selectedTopic,
  onSelectTopic,
}: {
  selectedTopic: ContactTopicId;
  onSelectTopic: (topic: ContactTopicId) => void;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [values, setValues] = React.useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const hasToggledStepRef = React.useRef(false);
  const copyTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const focusHeadingOnTransition = React.useCallback(
    (node: HTMLHeadingElement | null) => {
      if (node && hasToggledStepRef.current) {
        node.focus();
      }
    },
    [],
  );

  const selectedTopicLabel =
    TOPICS.find((item) => item.id === selectedTopic)?.label ?? "Book a demo";

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstKey = Object.keys(nextErrors)[0];
      const fieldEl = document.getElementById(`contact-${firstKey}`);
      fieldEl?.focus();
      return;
    }
    setErrors({});
    hasToggledStepRef.current = true;
    setSubmitted(true);
  };

  const handleCopySummary = async () => {
    const summary = [
      `To: contact@uprevit.com`,
      `Topic: ${selectedTopicLabel}`,
      `Name: ${values.firstName.trim()} ${values.lastName.trim()}`,
      `Work email: ${values.email.trim()}`,
      `Company: ${values.company.trim()}`,
      ...(values.message.trim() ? [`Message: ${values.message.trim()}`] : []),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const inputClassName =
    "h-10 rounded-md border border-foreground/[0.12] bg-card px-3 font-ui text-base leading-5 text-foreground placeholder:text-faint-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 sm:text-[14px] dark:border-edge-3 dark:bg-surface-3 dark:shadow-[0_1px_2px_rgba(0,0,0,0.24)]";

  return (
    <MotionConfig reducedMotion="user">
      <TileRow
        as="section"
        id="contact-form"
        aria-labelledby="contact-hero-heading"
        className="scroll-mt-14"
        splitCenter
        centerClassName="grid grid-cols-1 gap-px lg:grid-cols-2"
      >
        <div className="relative flex min-w-0 flex-col justify-between gap-10 overflow-hidden rounded-tile bg-tile px-5 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-16 lg:gap-14 lg:px-10 lg:pb-12 lg:pt-[88px]">
          <div
            aria-hidden="true"
            className="tile-dots pointer-events-none absolute left-0 top-0 h-[360px] w-full overflow-hidden lg:h-[560px]"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 90% 85% at 0% 0%, transparent 0%, color-mix(in srgb, var(--tile-surface-solid) 70%, transparent) 55%, var(--tile-surface-solid) 100%)",
              }}
            />
          </div>

          <div className="relative flex flex-col gap-4 sm:gap-5">
            <h1
              id="contact-hero-heading"
              className="hero-enter text-balance font-sans text-[34px] font-medium leading-[1.1] tracking-[-0.04em] text-foreground sm:text-[48px] xl:text-[60px] xl:leading-[1.07]"
              style={
                {
                  "--hero-delay": "0ms",
                  "--hero-duration": "500ms",
                  "--hero-y": "12px",
                } as React.CSSProperties
              }
            >
              Talk to the team
              <br />
              <span className="text-foreground/55">behind Uprevit</span>
            </h1>

            <p
              className="hero-enter max-w-[460px] text-pretty font-ui text-[15px] leading-[23px] text-muted-foreground sm:text-[17px] sm:leading-[27px] lg:text-lead lg:leading-[30px]"
              style={
                {
                  "--hero-delay": "70ms",
                  "--hero-duration": "450ms",
                  "--hero-y": "8px",
                } as React.CSSProperties
              }
            >
              Demos, pricing, rollout or a question about your labels. Send a
              note and the right person replies within two to three business
              days.
            </p>
          </div>

          <ContactNoteRouting
            selectedTopic={selectedTopic}
            onSelectTopic={(topic) => {
              onSelectTopic(topic);
              if (submitted) {
                hasToggledStepRef.current = true;
                setSubmitted(false);
              }
            }}
            reduceMotion={reduceMotion}
          />
        </div>

        <div className="flex min-w-0 flex-col rounded-tile bg-tile p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col rounded-2xl bg-card p-6 shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.04)] sm:p-8 lg:p-6 xl:p-8 dark:bg-surface-2 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.24),0_8px_24px_-8px_rgba(0,0,0,0.32)]">
            <AnimatePresence mode="wait" initial={false}>
              {submitted ? (
                <motion.div
                  key="submitted"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="flex flex-col gap-6 py-2"
                >
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex flex-col gap-3"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-full border border-success/25 bg-success-soft text-success-strong dark:border-success/30 dark:text-success">
                      <Icon icon={Tick02Icon} size={18} strokeWidth={2.2} />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2
                        ref={focusHeadingOnTransition}
                        tabIndex={-1}
                        className="font-sans text-[22px] font-medium leading-7 tracking-[-0.02em] text-foreground outline-none"
                      >
                        Your note is ready to send
                      </h2>
                      <p className="font-ui text-body-m leading-[22px] text-muted-foreground">
                        Open your email client below to send directly to{" "}
                        <span className="font-medium text-foreground">
                          contact@uprevit.com
                        </span>
                        . The right person on our team replies within 2–3
                        business days.
                      </p>
                    </div>
                  </div>

                  <dl className="flex flex-col gap-2.5 rounded-xl border border-separator bg-subtle p-4 font-ui text-body-s dark:border-edge-1 dark:bg-surface-3/60">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Topic</dt>
                      <dd className="font-medium text-foreground">
                        {selectedTopicLabel}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">From</dt>
                      <dd className="text-right font-medium text-foreground">
                        {values.firstName} {values.lastName} · {values.company}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="shrink-0 text-muted-foreground">Email</dt>
                      <dd className="break-all text-right font-medium text-foreground">
                        {values.email}
                      </dd>
                    </div>
                    {values.message.trim() && (
                      <div className="border-t border-separator pt-2.5 dark:border-edge-1">
                        <dt className="mb-1 text-muted-foreground">Message</dt>
                        <dd className="whitespace-pre-wrap text-foreground">
                          {values.message.trim()}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                    <a
                      href={buildMailtoHref(selectedTopicLabel, values)}
                      data-attr="contact-form-open-email"
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-sm border border-primary-700 bg-primary px-4 font-ui text-body-m font-medium leading-[18px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
                    >
                      <span>Open in email client</span>
                      <Icon
                        icon={ArrowUpRight01Icon}
                        size={14}
                        strokeWidth={2}
                      />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-border bg-card px-3.5 font-ui text-body-m font-medium leading-[18px] text-foreground transition-[color,background-color,border-color,transform] duration-150 hover:border-stroke-strong hover:bg-subtle focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] dark:border-edge-3 dark:bg-surface-3 dark:hover:bg-surface-4"
                    >
                      <Icon
                        icon={copied ? Tick02Icon : Copy01Icon}
                        size={14}
                        strokeWidth={1.8}
                      />
                      <span>{copied ? "Copied" : "Copy note"}</span>
                    </button>
                  </div>
                  <span role="status" aria-live="polite" className="sr-only">
                    {copied ? "Note copied to clipboard." : ""}
                  </span>

                  <div className="border-t border-separator pt-4 dark:border-edge-1">
                    <button
                      type="button"
                      onClick={() => {
                        hasToggledStepRef.current = true;
                        setSubmitted(false);
                      }}
                      className="cursor-pointer font-ui text-body-s font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      ← Edit note
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-1 pb-1">
                    <h2
                      ref={focusHeadingOnTransition}
                      tabIndex={-1}
                      className="font-sans text-[22px] font-medium leading-7 tracking-[-0.02em] text-foreground outline-none"
                    >
                      Send us a note
                    </h2>
                    <p className="font-ui text-body-m leading-[22px] text-muted-foreground">
                      Fields marked optional can wait for the call.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="contact-firstName"
                        className="font-ui text-body-m font-medium leading-5 text-foreground"
                      >
                        First name
                      </Label>
                      <Input
                        id="contact-firstName"
                        name="firstName"
                        autoComplete="given-name"
                        placeholder="Alex"
                        value={values.firstName}
                        onChange={(e) =>
                          handleFieldChange("firstName", e.target.value)
                        }
                        aria-invalid={Boolean(errors.firstName)}
                        aria-describedby={
                          errors.firstName
                            ? "contact-firstName-error"
                            : undefined
                        }
                        className={inputClassName}
                      />
                      {errors.firstName && (
                        <p
                          id="contact-firstName-error"
                          className="font-ui text-label text-destructive"
                        >
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="contact-lastName"
                        className="font-ui text-body-m font-medium leading-5 text-foreground"
                      >
                        Last name
                      </Label>
                      <Input
                        id="contact-lastName"
                        name="lastName"
                        autoComplete="family-name"
                        placeholder="Rivera"
                        value={values.lastName}
                        onChange={(e) =>
                          handleFieldChange("lastName", e.target.value)
                        }
                        aria-invalid={Boolean(errors.lastName)}
                        aria-describedby={
                          errors.lastName ? "contact-lastName-error" : undefined
                        }
                        className={inputClassName}
                      />
                      {errors.lastName && (
                        <p
                          id="contact-lastName-error"
                          className="font-ui text-label text-destructive"
                        >
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="contact-email"
                        className="font-ui text-body-m font-medium leading-5 text-foreground"
                      >
                        Work email
                      </Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="alex@northwind.health"
                        value={values.email}
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "contact-email-error" : undefined
                        }
                        className={inputClassName}
                      />
                      {errors.email && (
                        <p
                          id="contact-email-error"
                          className="font-ui text-label text-destructive"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="contact-company"
                        className="font-ui text-body-m font-medium leading-5 text-foreground"
                      >
                        Company
                      </Label>
                      <Input
                        id="contact-company"
                        name="company"
                        autoComplete="organization"
                        placeholder="Northwind Health"
                        value={values.company}
                        onChange={(e) =>
                          handleFieldChange("company", e.target.value)
                        }
                        aria-invalid={Boolean(errors.company)}
                        aria-describedby={
                          errors.company ? "contact-company-error" : undefined
                        }
                        className={inputClassName}
                      />
                      {errors.company && (
                        <p
                          id="contact-company-error"
                          className="font-ui text-label text-destructive"
                        >
                          {errors.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <fieldset className="flex flex-col gap-2">
                    <legend className="font-ui text-body-m font-medium leading-5 text-foreground">
                      What can we help with?
                    </legend>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {TOPICS.map((topic) => {
                        const isSelected = selectedTopic === topic.id;
                        return (
                          <label
                            key={topic.id}
                            className="relative inline-flex cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="contact-topic"
                              value={topic.id}
                              checked={isSelected}
                              onChange={() => onSelectTopic(topic.id)}
                              className="peer sr-only"
                            />
                            <span
                              className={cn(
                                "inline-flex h-6 items-center rounded-md border px-2 font-ui text-xs leading-4 transition-[background-color,border-color,color,transform] duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-ring active:scale-[0.97]",
                                isSelected
                                  ? "border-foreground bg-foreground font-medium text-background"
                                  : "border-stroke-strong bg-card text-foreground hover:bg-subtle dark:border-edge-3 dark:bg-surface-3 dark:hover:bg-surface-4",
                              )}
                            >
                              {topic.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <Label
                        htmlFor="contact-message"
                        className="font-ui text-body-m font-medium leading-5 text-foreground"
                      >
                        Message
                      </Label>
                      <span className="font-ui text-body-m leading-5 text-faint-foreground">
                        optional
                      </span>
                    </div>
                    <Textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      placeholder="How many products and labels you manage, and what you use today…"
                      value={values.message}
                      onChange={(e) =>
                        handleFieldChange("message", e.target.value)
                      }
                      className="min-h-[112px] resize-none rounded-md border border-foreground/[0.12] bg-card px-3 py-2.5 font-ui text-base leading-[22px] text-foreground placeholder:text-faint-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 sm:text-[14px] dark:border-edge-3 dark:bg-surface-3 dark:shadow-[0_1px_2px_rgba(0,0,0,0.24)]"
                    />
                  </div>

                  <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-separator pt-5 sm:flex-row sm:items-center sm:gap-6 dark:border-edge-1">
                    <p className="max-w-[300px] font-ui text-body-s leading-5 text-muted-foreground">
                      Prepares a draft for your email app. By contacting us you
                      agree to our{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-foreground underline underline-offset-2 transition-opacity hover:opacity-80"
                      >
                        Privacy policy
                      </Link>
                      .
                    </p>

                    <button
                      type="submit"
                      data-attr="contact-form-submit"
                      className="group/cta inline-flex h-10 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary-700 bg-primary bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.04)_100%)] px-4 font-ui text-body-m font-medium leading-[18px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(106,18,220,0.25)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-primary-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(127,34,254,0.6)] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] active:bg-primary-700 sm:w-auto sm:rounded-sm"
                    >
                      <span>Prepare email</span>
                      <Icon
                        icon={ArrowRight02Icon}
                        size={14}
                        strokeWidth={1.8}
                        className="transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover/cta:translate-x-0.5"
                      />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </TileRow>
    </MotionConfig>
  );
}

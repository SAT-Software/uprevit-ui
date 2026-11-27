"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowRight02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
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
import { ContactTurnstileWidget } from "./ContactTurnstileWidget";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
const TURNSTILE_LOAD_ERROR_MESSAGE =
  "Verification failed to load. Please refresh the page or email contact@uprevit.com.";
const TURNSTILE_WAITING_MESSAGE =
  "Please wait a moment for the verification check to finish and try again.";

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

interface SubmittedSnapshot extends FormValues {
  topicLabel: string;
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
  const firstName = values.firstName.trim();
  if (!firstName) {
    errors.firstName = "Enter your first name.";
  } else if (firstName.length > 80) {
    errors.firstName = "First name must be 80 characters or fewer.";
  }

  const lastName = values.lastName.trim();
  if (!lastName) {
    errors.lastName = "Enter your last name.";
  } else if (lastName.length > 80) {
    errors.lastName = "Last name must be 80 characters or fewer.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Enter your work email.";
  } else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const company = values.company.trim();
  if (!company) {
    errors.company = "Enter your company name.";
  } else if (company.length > 120) {
    errors.company = "Company name must be 120 characters or fewer.";
  }

  if (values.message.trim().length > 2000) {
    errors.message = "Message must be 2,000 characters or fewer.";
  }

  return errors;
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
  const [website, setWebsite] = React.useState("");
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submittedSnapshot, setSubmittedSnapshot] =
    React.useState<SubmittedSnapshot | null>(null);
  const [turnstileToken, setTurnstileToken] = React.useState("");
  const [turnstileError, setTurnstileError] = React.useState(false);
  const [turnstileResetCount, setTurnstileResetCount] = React.useState(0);
  const hasToggledStepRef = React.useRef(false);

  const submitted = submittedSnapshot !== null;

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
    if (submitError) setSubmitError(null);
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleTurnstileToken = React.useCallback((token: string) => {
    setTurnstileToken(token);
    setTurnstileError(false);
    setSubmitError((prev) =>
      prev === TURNSTILE_WAITING_MESSAGE ||
      prev === TURNSTILE_LOAD_ERROR_MESSAGE
        ? null
        : prev,
    );
  }, []);

  const handleTurnstileExpire = React.useCallback(() => {
    setTurnstileToken("");
  }, []);

  const handleTurnstileError = React.useCallback(() => {
    setTurnstileToken("");
    setTurnstileError(true);
  }, []);

  const resetTurnstile = () => {
    if (!TURNSTILE_SITE_KEY) return;
    setTurnstileToken("");
    setTurnstileResetCount((count) => count + 1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validateForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitError(null);
      const firstKey = Object.keys(nextErrors)[0];
      const fieldEl = document.getElementById(`contact-${firstKey}`);
      fieldEl?.focus();
      return;
    }

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setSubmitError(
        turnstileError
          ? TURNSTILE_LOAD_ERROR_MESSAGE
          : TURNSTILE_WAITING_MESSAGE,
      );
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    const trimmedValues: FormValues = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      message: values.message.trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...trimmedValues,
          topic: selectedTopic,
          website,
          turnstileToken,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok) {
        if (data.errors) {
          const fieldErrors: FormErrors = {};
          for (const key of [
            "firstName",
            "lastName",
            "email",
            "company",
            "message",
          ] as const) {
            if (typeof data.errors[key] === "string") {
              fieldErrors[key] = data.errors[key];
            }
          }
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
          }
        }

        if (response.status === 429) {
          setSubmitError(
            data.message ||
              "Too many messages sent recently. Please try again in a few minutes.",
          );
        } else {
          setSubmitError(
            data.message ||
              "We couldn't send your message right now. Please try again or email contact@uprevit.com.",
          );
        }
        resetTurnstile();
        return;
      }

      hasToggledStepRef.current = true;
      setSubmittedSnapshot({
        ...trimmedValues,
        topicLabel: selectedTopicLabel,
      });
      setValues(INITIAL_VALUES);
      setWebsite("");
      resetTurnstile();
    } catch {
      setSubmitError(
        "Unable to reach our server right now. Please check your connection and try again, or email contact@uprevit.com.",
      );
      resetTurnstile();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendAnother = () => {
    hasToggledStepRef.current = true;
    setSubmittedSnapshot(null);
    setSubmitError(null);
    setErrors({});
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
                setSubmittedSnapshot(null);
              }
            }}
            reduceMotion={reduceMotion}
          />
        </div>

        <div className="flex min-w-0 flex-col rounded-tile bg-tile p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col rounded-2xl bg-card p-6 shadow-[0_0_0_1px_rgba(23,23,23,0.06),0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.04)] sm:p-8 lg:p-6 xl:p-8 dark:bg-surface-2 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.24),0_8px_24px_-8px_rgba(0,0,0,0.32)]">
            <AnimatePresence mode="wait" initial={false}>
              {submitted && submittedSnapshot ? (
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
                    <span className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-subtle text-foreground dark:border-edge-3 dark:bg-surface-3">
                      <Icon icon={Tick02Icon} size={18} strokeWidth={2.2} />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h2
                        ref={focusHeadingOnTransition}
                        tabIndex={-1}
                        className="font-sans text-[22px] font-medium leading-7 tracking-[-0.02em] text-foreground outline-none"
                      >
                        Message sent
                      </h2>
                      <p className="font-ui text-body-m leading-[22px] text-muted-foreground">
                        Thanks for reaching out. We received your note and the
                        right person on our team will reply to{" "}
                        <span className="font-medium text-foreground">
                          {submittedSnapshot.email}
                        </span>{" "}
                        within 2–3 business days.
                      </p>
                    </div>
                  </div>

                  <dl className="flex flex-col gap-2.5 rounded-xl border border-separator bg-subtle p-4 font-ui text-body-s dark:border-edge-1 dark:bg-surface-3/60">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Topic</dt>
                      <dd className="font-medium text-foreground">
                        {submittedSnapshot.topicLabel}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">From</dt>
                      <dd className="text-right font-medium text-foreground">
                        {submittedSnapshot.firstName}{" "}
                        {submittedSnapshot.lastName} ·{" "}
                        {submittedSnapshot.company}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="shrink-0 text-muted-foreground">Email</dt>
                      <dd className="break-all text-right font-medium text-foreground">
                        {submittedSnapshot.email}
                      </dd>
                    </div>
                    {submittedSnapshot.message && (
                      <div className="border-t border-separator pt-2.5 dark:border-edge-1">
                        <dt className="mb-1 text-muted-foreground">Message</dt>
                        <dd className="whitespace-pre-wrap text-foreground">
                          {submittedSnapshot.message}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="border-t border-separator pt-4 dark:border-edge-1">
                    <button
                      type="button"
                      onClick={handleSendAnother}
                      className="inline-flex h-10 cursor-pointer items-center justify-center rounded-sm border border-border bg-card px-4 font-ui text-body-m font-medium leading-[18px] text-foreground transition-[color,background-color,border-color,transform] duration-150 hover:border-stroke-strong hover:bg-subtle focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] dark:border-edge-3 dark:bg-surface-3 dark:hover:bg-surface-4"
                    >
                      Send another message
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

                  <div
                    aria-hidden="true"
                    className="pointer-events-none fixed -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0"
                  >
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
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
                        maxLength={80}
                        disabled={submitting}
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
                        maxLength={80}
                        disabled={submitting}
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
                        maxLength={254}
                        disabled={submitting}
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
                        maxLength={120}
                        disabled={submitting}
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

                  <fieldset className="flex flex-col gap-2" disabled={submitting}>
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
                      maxLength={2000}
                      disabled={submitting}
                      placeholder="How many products and labels you manage, and what you use today…"
                      value={values.message}
                      onChange={(e) =>
                        handleFieldChange("message", e.target.value)
                      }
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? "contact-message-error" : undefined
                      }
                      className="min-h-[112px] resize-none rounded-md border border-foreground/[0.12] bg-card px-3 py-2.5 font-ui text-base leading-[22px] text-foreground placeholder:text-faint-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 sm:text-[14px] dark:border-edge-3 dark:bg-surface-3 dark:shadow-[0_1px_2px_rgba(0,0,0,0.24)]"
                    />
                    {errors.message && (
                      <p
                        id="contact-message-error"
                        className="font-ui text-label text-destructive"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <ContactTurnstileWidget
                    siteKey={TURNSTILE_SITE_KEY}
                    resetCount={turnstileResetCount}
                    onToken={handleTurnstileToken}
                    onExpire={handleTurnstileExpire}
                    onError={handleTurnstileError}
                  />

                  {submitError && (
                    <div
                      role="alert"
                      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 font-ui text-body-s leading-5 text-destructive"
                    >
                      {submitError}
                    </div>
                  )}

                  <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-separator pt-5 sm:flex-row sm:items-center sm:gap-6 dark:border-edge-1">
                    <p className="max-w-[300px] font-ui text-body-s leading-5 text-muted-foreground">
                      By contacting us you agree to our{" "}
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
                      disabled={submitting}
                      aria-busy={submitting}
                      data-attr="contact-form-submit"
                      className="group/cta inline-flex h-10 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary-700 bg-primary bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.04)_100%)] px-4 font-ui text-body-m font-medium leading-[18px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(106,18,220,0.25)] outline-none transition-[background-color,box-shadow,transform,opacity] duration-150 ease-out hover:bg-primary-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(127,34,254,0.6)] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] active:bg-primary-700 disabled:pointer-events-none disabled:opacity-65 sm:w-auto sm:rounded-sm"
                    >
                      {submitting && (
                        <span
                          aria-hidden="true"
                          className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground/35 border-t-primary-foreground"
                        />
                      )}
                      <span>{submitting ? "Sending…" : "Send message"}</span>
                      {!submitting && (
                        <Icon
                          icon={ArrowRight02Icon}
                          size={14}
                          strokeWidth={1.8}
                          className="transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover/cta:translate-x-0.5"
                        />
                      )}
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

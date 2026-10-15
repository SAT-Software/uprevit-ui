"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import {
  AlertCircleIcon,
  Bug01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Idea01Icon,
  ImageAdd01Icon,
  MessageQuestionIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { Field, FieldError } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@uprevit/ui/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@uprevit/ui/components/ui/toggle-group";
import { TooltipProvider } from "@uprevit/ui/components/ui/tooltip";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { SupportConversationsPanel } from "@/components/common/SupportConversationsPanel";
import { useGetSupportConfig } from "@/hooks/support/useGetSupportConfig";
import { getSupportPrincipal, useSupportPrincipal } from "@/hooks/support/useSupportPrincipal";
import {
  SUPPORT_IMAGE_LIMIT,
  SUPPORT_IMAGE_MAX_BYTES,
  SUPPORT_IMAGE_TYPES,
  useSendSupportMessage,
} from "@/hooks/support/useSendSupportMessage";
import { useGetUser } from "@/hooks/user/useGetUser";
import { getErrorMessage } from "@/lib/api-error";
import { POSTHOG_TOKEN } from "@/lib/posthog/support";
import { getProfileValue } from "@/utils/authProfile";
import type { SupportCategory, SupportImageDraft } from "@/types/support";

const CATEGORIES: { value: SupportCategory; label: string; icon: typeof Bug01Icon }[] = [
  { value: "bug", label: "Bug", icon: Bug01Icon },
  { value: "feature", label: "Feature", icon: Idea01Icon },
  { value: "other", label: "Other", icon: MessageQuestionIcon },
];

const MESSAGE_MAX_LENGTH = 5000;
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type DialogTab = "new" | "conversations";

export function SendFeedbackDialog({ children }: { children: React.ReactNode }) {
  const principal = getSupportPrincipal(useAuth());
  return (
    <TooltipProvider>
      <SendFeedbackDialogContent key={principal}>{children}</SendFeedbackDialogContent>
    </TooltipProvider>
  );
}

function SendFeedbackDialogContent({ children }: { children: React.ReactNode }) {
  const id = useId();
  const formId = `send-feedback-form-${id}`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();
  const { isCurrent } = useSupportPrincipal();
  const { data: userData } = useGetUser();
  const { data: config, isError: isConfigError } = useGetSupportConfig();
  const sendMessage = useSendSupportMessage(config);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<DialogTab>("new");
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [category, setCategory] = useState<SupportCategory>("bug");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<SupportImageDraft[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const previewUrls = useRef(new Set<string>());
  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const revokePreview = (url: string) => {
    URL.revokeObjectURL(url);
    previewUrls.current.delete(url);
  };

  const profile = auth.user?.profile;
  const resolvedName = name ?? userData?.user?.name ?? getProfileValue(profile, "name") ?? "";
  const resolvedEmail = email ?? userData?.user?.email ?? getProfileValue(profile, "email") ?? "";
  const isSending = sendMessage.isPending;

  const unavailableReason = !POSTHOG_TOKEN
    ? "Support is not available in this environment."
    : isConfigError
      ? "We could not load support settings. Please try again in a moment."
      : config && !config.identityHash
        ? "Support is not set up for your account yet."
        : null;

  const fieldErrors: Partial<Record<"name" | "email" | "message", string>> = submitted
    ? {
        name: resolvedName.trim() ? undefined : "Name is required",
        email: EMAIL_PATTERN.test(resolvedEmail.trim()) ? undefined : "Enter a valid email address",
        message: message.trim() ? undefined : "Describe the issue or idea",
      }
    : {};

  const addImages = (files: File[]) => {
    const room = SUPPORT_IMAGE_LIMIT - images.length;
    if (files.length > room) {
      toast.error(`You can add up to ${SUPPORT_IMAGE_LIMIT} images`);
    }
    const accepted = files.slice(0, Math.max(room, 0)).filter((file) => {
      if (!SUPPORT_IMAGE_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a PNG, JPEG, GIF or WebP image`);
        return false;
      }
      if (file.size === 0 || file.size > SUPPORT_IMAGE_MAX_BYTES) {
        toast.error(`${file.name} must be 5 MB or smaller`);
        return false;
      }
      return true;
    });
    const added = accepted.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrls.current.add(previewUrl);
      return { localId: crypto.randomUUID(), file, previewUrl };
    });
    setImages((current) => [...current, ...added]);
  };

  const removeImage = (image: SupportImageDraft) => {
    revokePreview(image.previewUrl);
    setImages((current) => current.filter(({ localId }) => localId !== image.localId));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setError(null);
    if (!resolvedName.trim() || !EMAIL_PATTERN.test(resolvedEmail.trim()) || !message.trim()) {
      return;
    }

    sendMessage.mutate(
      {
        draft: { name: resolvedName, email: resolvedEmail, category, title, message, images },
        onImageUploaded: (localId, attachmentId) => {
          if (!isCurrent()) return;
          setImages((current) =>
            current.map((image) => (image.localId === localId ? { ...image, attachmentId } : image)),
          );
        },
      },
      {
        onSuccess: () => {
          if (!isCurrent()) return;
          images.forEach((image) => revokePreview(image.previewUrl));
          setImages([]);
          setTitle("");
          setMessage("");
          setCategory("bug");
          setSubmitted(false);
          setSent(true);
        },
        onError: (sendError) => {
          if (isCurrent()) setError(getErrorMessage(sendError, "Your message could not be sent. Please try again."));
        },
      },
    );
  };

  const tabs = (
    <div className="flex h-10 items-center border-b border-border px-2">
      <Tabs value={tab} onValueChange={(value) => setTab(value as DialogTab)}>
        <TabsList variant="line">
          <TabsTrigger value="new">New message</TabsTrigger>
          <TabsTrigger value="conversations">Your conversations</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );

  const showForm = tab === "new" && !sent;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <AppDialogContent
        title="Send feedback"
        description="Report a bug, request a feature, or ask the Uprevit team a question."
        size="xl"
        className="ph-no-capture"
        headerExtra={tabs}
        primaryAction={
          showForm
            ? {
                label: "Send message",
                loadingLabel: "Sending…",
                type: "submit",
                form: formId,
                loading: isSending,
                disabled: isSending || !config?.identityHash || Boolean(unavailableReason),
                icon: SentIcon,
              }
            : undefined
        }
        secondaryAction={
          showForm ? { label: "Close", disabled: isSending, icon: Cancel01Icon } : undefined
        }
      >
        {tab === "conversations" ? (
          <SupportConversationsPanel config={config} enabled={open && tab === "conversations"} />
        ) : sent ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Icon icon={CheckmarkCircle02Icon} size={24} strokeWidth={2} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Message sent</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Thanks for reaching out. Replies from the Uprevit team will appear under Your conversations.
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setSent(false)}>
                Send another
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setSent(false);
                  setTab("conversations");
                }}
              >
                View conversations
              </Button>
            </div>
          </div>
        ) : (
          <form id={formId} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-4">
            {unavailableReason || error ? (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm"
              >
                <Icon icon={AlertCircleIcon} size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-destructive" />
                <p>{unavailableReason ?? error}</p>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field data-invalid={Boolean(fieldErrors.name)}>
                <FormFieldLabel htmlFor={`${id}-name`} label="Name" />
                <InputGroup size="md" className="bg-background">
                  <InputGroupInput
                    id={`${id}-name`}
                    value={resolvedName}
                    onChange={(event) => setName(event.target.value)}
                    disabled={isSending}
                    aria-invalid={Boolean(fieldErrors.name)}
                    autoComplete="name"
                  />
                </InputGroup>
                <FieldError>{fieldErrors.name}</FieldError>
              </Field>
              <Field data-invalid={Boolean(fieldErrors.email)}>
                <FormFieldLabel
                  htmlFor={`${id}-email`}
                  label="Email"
                  tooltip="We reply to this address if you are not in the app."
                />
                <InputGroup size="md" className="bg-background">
                  <InputGroupInput
                    id={`${id}-email`}
                    type="email"
                    value={resolvedEmail}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={isSending}
                    aria-invalid={Boolean(fieldErrors.email)}
                    autoComplete="email"
                  />
                </InputGroup>
                <FieldError>{fieldErrors.email}</FieldError>
              </Field>
            </div>

            <Field>
              <FormFieldLabel label="Category" />
              <ToggleGroup
                type="single"
                variant="outline"
                value={category}
                onValueChange={(value) => value && setCategory(value as SupportCategory)}
                disabled={isSending}
                className="grid grid-cols-3 gap-2"
              >
                {CATEGORIES.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value} className="h-9">
                    <Icon icon={option.icon} size={16} strokeWidth={2} />
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>

            <Field>
              <FormFieldLabel htmlFor={`${id}-title`} label="Title" optional />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-title`}
                  value={title}
                  maxLength={150}
                  placeholder="A short summary"
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={isSending}
                />
              </InputGroup>
            </Field>

            <Field data-invalid={Boolean(fieldErrors.message)}>
              <FormFieldLabel htmlFor={`${id}-message`} label="Message" />
              <InputGroup className="bg-background">
                <InputGroupTextarea
                  id={`${id}-message`}
                  value={message}
                  maxLength={MESSAGE_MAX_LENGTH}
                  rows={6}
                  placeholder="What happened, what did you expect, and how can we reproduce it?"
                  onChange={(event) => setMessage(event.target.value)}
                  disabled={isSending}
                  aria-invalid={Boolean(fieldErrors.message)}
                />
              </InputGroup>
              <FieldError>{fieldErrors.message}</FieldError>
            </Field>

            <Field>
              <FormFieldLabel
                label="Screenshots"
                tooltip="Only the images you add here are sent. Nothing is captured automatically."
                optional
              />
              <div className="flex flex-wrap gap-2">
                {images.map((image) => (
                  <div
                    key={image.localId}
                    className="relative size-20 overflow-hidden rounded-lg border border-border bg-muted"
                  >
                    <Image src={image.previewUrl} alt={image.file.name} fill unoptimized className="object-cover" />
                    {image.attachmentId ? (
                      <span className="absolute bottom-1 left-1 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Icon icon={CheckmarkCircle02Icon} size={12} strokeWidth={2} />
                      </span>
                    ) : null}
                    <Button
                      type="button"
                      size="icon-2xs"
                      variant="secondary"
                      aria-label={`Remove ${image.file.name}`}
                      disabled={isSending}
                      className="absolute right-1 top-1 rounded-full"
                      onClick={() => removeImage(image)}
                    >
                      <Icon icon={Cancel01Icon} size={12} />
                    </Button>
                  </div>
                ))}
                {images.length < SUPPORT_IMAGE_LIMIT ? (
                  <button
                    type="button"
                    disabled={isSending}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex size-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-xs text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                  >
                    <Icon icon={ImageAdd01Icon} size={18} strokeWidth={2} />
                    Add image
                  </button>
                ) : null}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={SUPPORT_IMAGE_TYPES.join(",")}
                multiple
                hidden
                onChange={(event) => {
                  addImages(Array.from(event.target.files ?? []));
                  event.target.value = "";
                }}
              />
              <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                Up to {SUPPORT_IMAGE_LIMIT} PNG, JPEG, GIF or WebP images, 5 MB each.
              </p>
            </Field>
          </form>
        )}
      </AppDialogContent>
    </Dialog>
  );
}

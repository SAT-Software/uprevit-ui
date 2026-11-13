"use client";

import { useId } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldGroup, FieldError } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { useInviteWorkspaceMembers } from "@/hooks/workspace/useInviteWorkspaceMembers";
import {
  Cancel01Icon,
  Delete02Icon,
  MailSend01Icon,
  UserAdd01Icon,
  MailAccount01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  MEMBER_ACCESS_OPTIONS,
  getMemberAccessOption,
  type MemberAccessOptionValue,
} from "./memberAccessOptions";

const MAX_INVITES = 10;
const ROW_GRID =
  "grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_12.5rem_2.25rem] sm:items-start";

type InviteMembersFormValues = {
  users: { name: string; email: string; access: MemberAccessOptionValue }[];
};

const EMPTY_USER = { name: "", email: "", access: "user" } as const;

export function InviteMembersDialog() {
  const id = useId();
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  const { mutate: inviteMembersMutation, isPending } =
    useInviteWorkspaceMembers();

  const form = useForm<InviteMembersFormValues>({
    defaultValues: {
      users: [EMPTY_USER],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "users",
  });

  function onSubmit(data: InviteMembersFormValues) {
    const users = data.users.map((user) => ({
      name: user.name.trim(),
      email: user.email.trim(),
      ...getMemberAccessOption(user.access).access,
    }));

    inviteMembersMutation(users, {
      onSuccess: (data) => {
        const results = data?.data as Array<{ status?: string }> | undefined;
        if (!results?.some((result) => result.status === "Failed")) {
          form.reset();
        }
      },
    });
  }

  if (!isAdmin) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Icon icon={MailAccount01Icon} size={14} strokeWidth={2} />
          Invite Users
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Invite Users"
        description="Invite people to this workspace and choose each person's access."
        subtitle="Each person gets an email invitation with the access you pick for them."
        variant="form"
        size="xl"
        className="sm:max-w-3xl"
        primaryAction={{
          label: "Send Invitations",
          loadingLabel: "Sending…",
          form: `invite-users-form-${id}`,
          type: "submit",
          loading: isPending,
          disabled: isPending,
          icon: MailSend01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          icon: Cancel01Icon,
        }}
      >
        <form
          id={`invite-users-form-${id}`}
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-3 p-4">
            <div
              aria-hidden
              className={`${ROW_GRID} hidden px-0.5 text-xs font-medium text-muted-foreground sm:grid`}
            >
              <span>Name</span>
              <span>Email</span>
              <span>Access</span>
            </div>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={`${ROW_GRID} rounded-md border p-3 sm:border-0 sm:p-0`}
              >
                <Controller
                  name={`users.${index}.name`}
                  control={form.control}
                  rules={{
                    validate: (value) =>
                      value.trim().length > 0 || "Name is required.",
                  }}
                  render={({ field: controllerField, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <InputGroup size="md" className="bg-background">
                        <InputGroupInput
                          {...controllerField}
                          placeholder="Full name"
                          autoComplete="off"
                          aria-label={`Name for invitee ${index + 1}`}
                          aria-invalid={fieldState.invalid}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={`users.${index}.email`}
                  control={form.control}
                  rules={{
                    required: "Email is required.",
                    pattern: {
                      value: /^\s*\S+@\S+\s*$/i,
                      message: "Enter a valid email address.",
                    },
                  }}
                  render={({ field: controllerField, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <InputGroup size="md" className="bg-background">
                        <InputGroupInput
                          {...controllerField}
                          placeholder="name@example.com"
                          type="email"
                          autoComplete="off"
                          aria-label={`Email for invitee ${index + 1}`}
                          aria-invalid={fieldState.invalid}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={`users.${index}.access`}
                  control={form.control}
                  render={({ field: controllerField }) => (
                    <Select
                      value={controllerField.value}
                      onValueChange={controllerField.onChange}
                    >
                      <SelectTrigger
                        size="md"
                        className="w-full whitespace-nowrap"
                        aria-label={`Access for invitee ${index + 1}`}
                      >
                        <SelectValue>
                          {getMemberAccessOption(controllerField.value).label}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent align="end" className="max-w-80">
                        {MEMBER_ACCESS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium">
                                {option.label}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {option.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="justify-self-end text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:invisible"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label={`Remove invitee ${index + 1}`}
                >
                  <Icon icon={Delete02Icon} size={16} strokeWidth={2} />
                </Button>
              </div>
            ))}

            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    ...EMPTY_USER,
                    access: form.getValues(`users.${fields.length - 1}.access`),
                  })
                }
                disabled={fields.length >= MAX_INVITES}
              >
                <Icon icon={UserAdd01Icon} size={16} strokeWidth={2} />
                Add another
              </Button>
              <span className="text-xs text-muted-foreground">
                {fields.length} of {MAX_INVITES}
              </span>
            </div>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}

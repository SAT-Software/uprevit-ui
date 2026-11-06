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
import { toast } from "sonner";
import {
  Cancel01Icon,
  Delete02Icon,
  MailSend01Icon,
  UserAdd01Icon,
  MinusSignSquareIcon,
  MailAccount01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Checkbox } from "@uprevit/ui/components/ui/checkbox";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";

const NO_BASE_TYPE = "none";

type InviteMembersFormValues = {
  users: { name: string; email: string }[];
  userType: "user" | "approver" | typeof NO_BASE_TYPE;
  isManager: boolean;
};

export function InviteMembersDialog() {
  const id = useId();
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  const { mutate: inviteMembersMutation, isPending } =
    useInviteWorkspaceMembers();

  const form = useForm<InviteMembersFormValues>({
    defaultValues: {
      users: [{ name: "", email: "" }],
      userType: "user",
      isManager: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "users",
  });

  function onSubmit(data: InviteMembersFormValues) {
    const userType = data.userType === NO_BASE_TYPE ? null : data.userType;
    if (!userType && !data.isManager) {
      toast.error("Pick a User Type, Manager access, or both.");
      return;
    }

    const users = data.users
      .map((user) => ({
        name: user.name.trim(),
        email: user.email.trim(),
        userType,
        isManager: data.isManager,
      }))
      .filter((user) => user.name.length > 0 && user.email.length > 0);
    if (users.length === 0) {
      toast.error(
        "Please enter at least one user with a name and email address.",
      );
      return;
    }

    inviteMembersMutation(users, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  if (!isAdmin) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
        >
          <Icon icon={MailAccount01Icon} size={14} strokeWidth={2} />
          Invite Users
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Invite Users"
        description="Invite users to this workspace by name and email."
        subtitle="Enter the name and email address of the users you want to invite, then pick their access."
        variant="form"
        size="xl"
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
          <FieldGroup className="gap-4 p-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="group flex items-center gap-2 bg-background/50 transition-colors hover:bg-muted/20"
              >
                <div className="flex w-full items-center gap-2">
                  <Controller
                    name={`users.${index}.name`}
                    control={form.control}
                    rules={{ required: "Name is required." }}
                    render={({ field: controllerField, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="space-y-0"
                      >
                        <FormFieldLabel
                          htmlFor={`invite-name-${index}`}
                          label="Name"
                          tooltip="Full name of the person you are inviting."
                        />
                        <InputGroup size="md" className="bg-background">
                          <InputGroupInput
                            {...controllerField}
                            id={`invite-name-${index}`}
                            placeholder="John Doe"
                            autoComplete="off"
                            // className="pl-2"
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
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email address.",
                      },
                    }}
                    render={({ field: controllerField, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="space-y-0"
                      >
                        <FormFieldLabel
                          htmlFor={`invite-email-${index}`}
                          label="Email"
                          tooltip="Email address where the workspace invitation will be sent."
                        />
                        <InputGroup size="md" className="bg-background">
                          <InputGroupInput
                            {...controllerField}
                            id={`invite-email-${index}`}
                            placeholder="name@example.com"
                            type="email"
                            autoComplete="off"
                            aria-invalid={fieldState.invalid}
                          />
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="self-end text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => remove(index)}
                    aria-label={`Remove user ${index + 1}`}
                  >
                    <Icon icon={Delete02Icon} size={16} strokeWidth={2} />
                  </Button>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Controller
                name="userType"
                control={form.control}
                render={({ field: controllerField }) => (
                  <Field className="space-y-0 sm:max-w-56">
                    <FormFieldLabel
                      htmlFor={`invite-user-type-${id}`}
                      label="User Type"
                      tooltip="Users can create and edit. Approvers can view everything and act only in workflows they are assigned to."
                    />
                    <Select
                      value={controllerField.value}
                      onValueChange={controllerField.onChange}
                    >
                      <SelectTrigger id={`invite-user-type-${id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="approver">Approver</SelectItem>
                        <SelectItem value={NO_BASE_TYPE}>None</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Controller
                name="isManager"
                control={form.control}
                render={({ field: controllerField }) => (
                  <div className="flex h-9 items-center gap-2">
                    <Checkbox
                      id={`invite-manager-${id}`}
                      checked={controllerField.value}
                      onCheckedChange={(checked) =>
                        controllerField.onChange(checked === true)
                      }
                    />
                    <Label htmlFor={`invite-manager-${id}`}>
                      Manager (billing access)
                    </Label>
                  </div>
                )}
              />
            </div>

            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 gap-2 border-dashed p-4 text-muted-foreground hover:text-foreground"
                onClick={() => append({ name: "", email: "" })}
                disabled={fields.length >= 10}
              >
                <Icon icon={UserAdd01Icon} size={16} strokeWidth={2} />
                Add Another User
              </Button>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => form.reset()}
                >
                  <Icon icon={MinusSignSquareIcon} size={16} strokeWidth={2} />
                  Reset
                </Button>
              )}
            </div>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}

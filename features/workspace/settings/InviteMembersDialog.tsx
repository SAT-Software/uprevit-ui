"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { XIcon } from "lucide-react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useInviteWorkspaceMembers } from "@/hooks/workspace/useInviteWorkspaceMembers";
import { toast } from "sonner";

type InviteMembersFormValues = {
  users: { name: string; email: string }[];
};

export function InviteMembersDialog() {
  const { mutate: inviteMembersMutation, isPending } =
    useInviteWorkspaceMembers();

  const form = useForm<InviteMembersFormValues>({
    defaultValues: {
      users: [{ name: "", email: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "users",
  });

  function onSubmit(data: InviteMembersFormValues) {
    const users = data.users
      .map((user) => ({
        name: user.name.trim(),
        email: user.email.trim(),
      }))
      .filter((user) => user.name.length > 0 && user.email.length > 0);
    if (users.length === 0) {
      toast.error(
        "Please enter at least one user with a name and email address."
      );
      return;
    }

    console.log("Inviting users:", users);

    inviteMembersMutation(users, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite Members</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Users</DialogTitle>
          <DialogDescription>
            Enter the name and email address of the users you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form id="invite-users-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <Controller
                    name={`users.${index}.name`}
                    control={form.control}
                    rules={{ required: "Name is required." }}
                    render={({ field: controllerField, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`invite-name-${index}`}
                          className="sr-only"
                        >
                          Name {index + 1}
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...controllerField}
                            id={`invite-name-${index}`}
                            placeholder="John Doe"
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
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`invite-email-${index}`}
                          className="sr-only"
                        >
                          Email {index + 1}
                        </FieldLabel>
                        <InputGroup>
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
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    aria-label={`Remove user ${index + 1}`}
                  >
                    <XIcon />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", email: "" })}
              disabled={fields.length >= 10}
            >
              Add Another
            </Button>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="invite-users-form" disabled={isPending}>
            {isPending ? "Sending..." : "Send Invitations"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

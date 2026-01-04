"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useInviteWorkspaceMembers } from "@/hooks/workspace/useInviteWorkspaceMembers";
import { toast } from "sonner";
import {
  PiUserPlusDuotone,
  PiXCircleDuotone,
  PiPaperPlaneRightDuotone,
  PiPlusCircleDuotone,
  PiTrashDuotone,
  PiEnvelopeSimpleDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";

type InviteMembersFormValues = {
  users: { name: string; email: string }[];
};

export function InviteMembersDialog() {
  const auth = useAuth();
  const isAdmin = auth.user?.profile?.userType === "admin";

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
        <Button
          size="sm"
          className="gap-2"
          onClick={(e) => {
            if (!isAdmin) {
              e.preventDefault();
              e.stopPropagation();
              toast.error("Insufficient privileges, contact Admin");
            }
          }}
        >
          <PiUserPlusDuotone className="w-4 h-4" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-[600px] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Invite Users</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
          <div className="px-4 py-3 text-sm text-muted-foreground bg-muted/20 border-b">
            Enter the name and email address of the users you want to invite to
            this workspace.
          </div>
        </DialogHeader>

        <form
          id="invite-users-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="overflow-y-auto p-4"
        >
          <FieldGroup className="space-y-2 gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-2 p-2 border rounded-lg bg-background/50 group hover:bg-muted/20 transition-colors"
              >
                <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-2">
                  <Controller
                    name={`users.${index}.name`}
                    control={form.control}
                    rules={{ required: "Name is required." }}
                    render={({ field: controllerField, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="space-y-0"
                      >
                        <FieldLabel
                          htmlFor={`invite-name-${index}`}
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Name
                        </FieldLabel>
                        <InputGroup className="bg-background">
                          <InputGroupText>
                            <PiUserDuotone className="ml-2" />
                          </InputGroupText>
                          <InputGroupInput
                            {...controllerField}
                            id={`invite-name-${index}`}
                            placeholder="John Doe"
                            autoComplete="off"
                            className="pl-2"
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
                        <FieldLabel
                          htmlFor={`invite-email-${index}`}
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Email
                        </FieldLabel>
                        <InputGroup className="bg-background">
                          <InputGroupText>
                            <PiEnvelopeSimpleDuotone className="ml-2" />
                          </InputGroupText>
                          <InputGroupInput
                            {...controllerField}
                            id={`invite-email-${index}`}
                            placeholder="name@example.com"
                            type="email"
                            className="pl-2"
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
                    size="icon"
                    className="mt-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
                    aria-label={`Remove user ${index + 1}`}
                  >
                    <PiTrashDuotone className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full border-dashed gap-2 p-4 text-muted-foreground hover:text-foreground"
              onClick={() => append({ name: "", email: "" })}
              disabled={fields.length >= 10}
            >
              <PiPlusCircleDuotone className="w-4 h-4" />
              Add Another User
            </Button>
          </FieldGroup>
        </form>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => form.reset()}
            className="text-muted-foreground"
          >
            <PiXCircleDuotone className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            type="submit"
            form="invite-users-form"
            disabled={isPending}
            size="sm"
            className="gap-2"
          >
            {isPending ? (
              <Spinner />
            ) : (
              <PiPaperPlaneRightDuotone className="w-4 h-4" />
            )}
            {isPending ? "Sending..." : "Send Invitations"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

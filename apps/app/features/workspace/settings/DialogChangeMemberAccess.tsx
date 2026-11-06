"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Checkbox } from "@uprevit/ui/components/ui/checkbox";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@uprevit/ui/components/ui/radio-group";
import {
  MemberAccessBlockedError,
  useUpdateUserAccess,
} from "@/hooks/user/useUpdateUserAccess";
import type { MemberAccess, MemberAccessBlockers, User } from "@/types/user";
import { UserTypeBadge } from "./UserTypeBadge";

const NO_BASE_TYPE = "none";

const BASE_TYPE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "approver", label: "Approver" },
  { value: NO_BASE_TYPE, label: "None (Manager only)" },
] as const;

export function DialogChangeMemberAccess({ user }: { user: User }) {
  const id = useId();
  const current: MemberAccess = {
    userType: user.userType === "admin" ? null : (user.userType ?? null),
    isManager: user.isManager === true,
  };
  const [open, setOpen] = useState(false);
  const [next, setNext] = useState<MemberAccess>(current);
  const [blockers, setBlockers] = useState<MemberAccessBlockers | null>(null);
  const { mutate: updateAccess, isPending } = useUpdateUserAccess();

  const changed =
    next.userType !== current.userType || next.isManager !== current.isManager;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setNext(current);
    setBlockers(null);
  }

  function handleConfirm() {
    if (!changed || !user._id) return;
    updateAccess(
      { userId: user._id, access: next },
      {
        onSuccess: () => setOpen(false),
        onError: (error) => {
          if (error instanceof MemberAccessBlockedError) {
            setBlockers(error.blockers);
          }
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 max-w-full gap-1 px-1"
          aria-label={`Change access for ${user.name}`}
        >
          <UserTypeBadge userType={user.userType} isManager={user.isManager} />
          <Icon icon={ArrowDown01Icon} size={12} strokeWidth={2} />
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Change access"
        description={`Change access for ${user.name}.`}
        subtitle="Confirm this with your workspace manager so it fits your usage limits and pricing."
        variant="form"
        size="md"
        primaryAction={{
          label: "Change access",
          loadingLabel: "Changing…",
          onClick: handleConfirm,
          loading: isPending,
          disabled: isPending || !changed,
          icon: UserEdit01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <div className="space-y-4 p-4">
          <RadioGroup
            value={next.userType ?? NO_BASE_TYPE}
            onValueChange={(value) => {
              const userType =
                value === NO_BASE_TYPE ? null : (value as "user" | "approver");
              setNext({ userType, isManager: userType ? next.isManager : true });
              setBlockers(null);
            }}
            aria-label="User Type"
          >
            {BASE_TYPE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${id}-${option.value}`}
                />
                <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex items-center gap-2">
            <Checkbox
              id={`${id}-manager`}
              checked={next.isManager}
              disabled={!next.userType}
              onCheckedChange={(checked) => {
                setNext({ ...next, isManager: checked === true });
                setBlockers(null);
              }}
            />
            <Label htmlFor={`${id}-manager`}>Manager (billing access)</Label>
          </div>
        </div>
        {blockers ? (
          <div className="space-y-3 px-4 pb-4 text-sm">
            <p className="text-destructive">
              Reassign these first, then try again.
            </p>
            {blockers.products.length > 0 ? (
              <div className="space-y-1">
                <p className="font-medium">Products</p>
                <ul className="list-disc space-y-0.5 pl-5">
                  {blockers.products.map((product) => (
                    <li key={product._id}>
                      <Link
                        href={`/products/${product._id}/product-information`}
                        className="underline-offset-2 hover:underline"
                      >
                        {product.name}
                      </Link>{" "}
                      <span className="text-muted-foreground">
                        (
                        {product.relationship === "owner"
                          ? "Product Owner"
                          : "Contributor"}
                        )
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {blockers.workflows.length > 0 ? (
              <div className="space-y-1">
                <p className="font-medium">Active workflows</p>
                <ul className="list-disc space-y-0.5 pl-5">
                  {blockers.workflows.map((workflow) => (
                    <li key={workflow._id}>
                      <Link
                        href={`/workflows/${workflow._id}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {workflow.numberLabel} {workflow.name}
                      </Link>{" "}
                      <span className="text-muted-foreground">
                        (
                        {workflow.relationship === "initiator"
                          ? "Initiator"
                          : "Approver"}
                        )
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </AppDialogContent>
    </Dialog>
  );
}

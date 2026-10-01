"use client";

import { useId } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Cancel01Icon, UserRemove01Icon } from "@hugeicons/core-free-icons";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { useUpdateProductTeam } from "@/hooks/product/useUpdateProductTeam";
import type { ProductTeam } from "@/types/product";
import ProductMemberCombobox from "./ProductMemberCombobox";
import { ProductMemberAvatar } from "./ProductMemberAvatar";

interface ProductTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  team: ProductTeam;
}

export default function ProductTeamDialog({
  open,
  onOpenChange,
  productId,
  team,
}: ProductTeamDialogProps) {
  const id = useId();
  const { mutate: updateTeam, isPending } = useUpdateProductTeam();
  const contributors = team.contributors ?? [];
  const teamIds = [
    ...(team.owner ? [team.owner._id] : []),
    ...contributors.map((member) => member._id),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Product Team"
        description="Choose the Product Owner and the contributors who can edit this product."
        variant="custom"
        size="md"
        secondaryAction={{ label: "Close", icon: Cancel01Icon }}
      >
        <FieldGroup className="gap-4 p-4">
          <Field>
            <FormFieldLabel
              htmlFor={`${id}-owner`}
              label="Product Owner"
              tooltip="Accountable for this product across all versions. Can edit and manage the team."
            />
            <ProductMemberCombobox
              id={`${id}-owner`}
              value={team.owner}
              placeholder="Select owner"
              excludeIds={team.owner ? [team.owner._id] : []}
              disabled={isPending}
              onSelect={(member) =>
                updateTeam(
                  { productId, action: "set-owner", userId: member._id },
                  { onSuccess: () => onOpenChange(false) },
                )
              }
            />
          </Field>

          <Field>
            <FormFieldLabel
              htmlFor={`${id}-contributor`}
              label="Contributors"
              tooltip="Can edit and submit this product's versions."
            />
            <ProductMemberCombobox
              id={`${id}-contributor`}
              placeholder="Add contributor"
              excludeIds={teamIds}
              disabled={isPending}
              onSelect={(member) =>
                updateTeam({
                  productId,
                  action: "add-contributor",
                  userId: member._id,
                })
              }
            />
            {contributors.length > 0 ? (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {contributors.map((member) => (
                  <li
                    key={member._id}
                    className="flex items-center gap-2 px-2 py-1.5"
                  >
                    <ProductMemberAvatar member={member} className="size-7" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      aria-label={`Remove ${member.name}`}
                      disabled={isPending}
                      onClick={() =>
                        updateTeam({
                          productId,
                          action: "remove-contributor",
                          userId: member._id,
                        })
                      }
                    >
                      <Icon icon={UserRemove01Icon} size={14} />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">
                No contributors yet.
              </p>
            )}
          </Field>
        </FieldGroup>
      </AppDialogContent>
    </Dialog>
  );
}

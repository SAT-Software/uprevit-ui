"use client";

import { toast } from "sonner";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { useId, useMemo, useState } from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { useArchiveDepartment } from "@/hooks/department/useArchiveDepartment";
import { useArchiveProject } from "@/hooks/project/useArchiveProject";
import { cn } from "@uprevit/ui/lib/utils";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Alert01Icon,
  ArchiveIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";

export type ArchiveEntityType = "project" | "department";

export interface DialogArchiveEntityProps {
  id: string;
  entityName: string;
  entityType: ArchiveEntityType;
}

export default function DialogArchiveEntity({
  id,
  entityName,
  entityType,
}: DialogArchiveEntityProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  const departmentArchive = useArchiveDepartment();
  const projectArchive = useArchiveProject();

  const { mutateAsync, isPending } = useMemo(() => {
    switch (entityType) {
      case "department":
        return departmentArchive;
      case "project":
        return projectArchive;
      default:
        throw new Error(`Invalid entity type: ${entityType}`);
    }
  }, [entityType, departmentArchive, projectArchive]);

  const disabled = value.trim() !== entityName.trim() || isPending;
  const entityLabel =
    entityType.charAt(0).toUpperCase() + entityType.slice(1);

  async function handleConfirm() {
    if (!isAdmin) {
      toast.warning("Insufficient privileges, contact Admin");
      return;
    }
    if (disabled) return;
    await mutateAsync(id);
    setOpen(false);
    setValue("");
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setValue("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                if (!isAdmin) {
                  e.preventDefault();
                  e.stopPropagation();
                  toast.warning("Insufficient privileges, contact Admin");
                  return;
                }
              }}
            >
              <Icon
                className="transition-colors delay-100 duration-200 ease-in-out"
                icon={ArchiveIcon}
                size={16}
                strokeWidth={2}
              />
              Archive
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              Archive the {entityType}. This action is reversible and you can
              restore the {entityType} from
              <Link
                href="/archive"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-xs -mx-1",
                )}
              >
                Archive
              </Link>
              page.
            </div>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <AppDialogContent
        title={`Archive ${entityLabel}`}
        description={`Archive ${entityName}. This action is reversible from the archive page.`}
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Final confirmation",
          message: (
            <>
              You are archiving {entityType}{" "}
              <strong>{entityName}</strong>. You can restore your {entityType}{" "}
              anytime from the{" "}
              <Link
                href="/archive"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Archive page
              </Link>
              .
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Archive",
          loadingLabel: "Archiving...",
          onClick: handleConfirm,
          loading: isPending,
          disabled,
          icon: ArchiveIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <FieldGroup className="gap-4 px-4 pb-4">
          <Field>
            <FormFieldLabel
              htmlFor={inputId}
              label={`${entityLabel} name`}
              tooltip={`Type "${entityName}" to confirm archiving.`}
            />
            <InputGroup size="md" className="bg-background">
              <InputGroupInput
                id={inputId}
                type="text"
                placeholder={`Type ${entityName} to confirm`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
              />
            </InputGroup>
          </Field>
        </FieldGroup>
      </AppDialogContent>
    </Dialog>
  );
}

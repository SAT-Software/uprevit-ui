"use client";

import { useState, useMemo } from "react";

import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  Copy01Icon,
  Link01Icon,
  Share08Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";

export default function ShareProjectDialog({
  project,
}: {
  project?: { _id: string; project_name?: string };
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const projectLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "/projects/sample-id";
    }
    return project?._id
      ? `${window.location.origin}/projects/${project._id}`
      : "/projects/sample-id";
  }, [project?._id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Dialog>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              <Icon
                className="transition-colors delay-100 duration-200 ease-in-out"
                icon={Share08Icon}
                size={16}
                strokeWidth={2}
              />
              Share
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent>Share this project</TooltipContent>
      </Tooltip>
      <AppDialogContent
        title="Share Project"
        description="Share this project with others by copying the link below."
        subtitle="Copy the link below and send it to workspace members."
        variant="inform"
        size="lg"
        secondaryAction={{
          label: "Close",
          icon: Cancel01Icon,
        }}
      >
        <FieldGroup className="gap-4 p-4">
          <Field>
            <FormFieldLabel
              htmlFor="project-link"
              label="Project Link"
              tooltip="Anyone with this link who belongs to the workspace can open this project."
            />
            <div className="flex items-center gap-2">
              <InputGroup size="md" className="bg-background">
                <InputGroupAddon>
                  <Icon icon={Link01Icon} size={16} strokeWidth={2} />
                </InputGroupAddon>
                <InputGroupInput
                  id="project-link"
                  value={projectLink}
                  readOnly
                />
              </InputGroup>
              <Button
                type="button"
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                <Icon
                  icon={copied ? Tick01Icon : Copy01Icon}
                  size={16}
                  strokeWidth={2}
                />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </Field>

          {project?.project_name ? (
            <div className="rounded-lg border bg-muted/50 p-3">
              <h4 className="text-sm font-medium">{project.project_name}</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Project ID: {project._id}
              </p>
            </div>
          ) : null}
        </FieldGroup>
      </AppDialogContent>
    </Dialog>
  );
}

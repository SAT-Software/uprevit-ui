"use client";

import { useRef, useState, useId } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@uprevit/ui/components/ui/avatar";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import { useUpdateWorkspace } from "@/hooks/workspace/useUpdateWorkspace";
import { useForm, SubmitHandler } from "react-hook-form";
import { Workspace } from "@/types/workspace";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  DashboardSquareEditIcon,
  Delete02Icon,
  UploadSquare01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { toast } from "sonner";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { resolveAssetUrl } from "@/utils/resolveAssetUrl";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";

const WORKSPACE_LOGO_ACCEPT =
  "image/png,image/jpg,image/jpeg,image/gif,image/webp";
const WORKSPACE_LOGO_MAX_SIZE = 500 * 1024;
const WORKSPACE_LOGO_HELPER_TEXT =
  "Supports PNG, JPEG, JPG, GIF, WEBP (under 500KB)";
const WORKSPACE_DESCRIPTION_MAX_LENGTH = 220;

interface DialogUpdateWorkspaceProps {
  workspaceData: Workspace;
}

export function DialogUpdateWorkspace({
  workspaceData,
}: DialogUpdateWorkspaceProps) {
  const id = useId();
  const uploadId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formId = `update-workspace-form-${id}`;
  const [open, setOpen] = useState(false);
  const { mutate: updateWorkspaceMutation, isPending } = useUpdateWorkspace();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoSizeBytes, setLogoSizeBytes] = useState<number | undefined>();
  const [logoUploadedThisSession, setLogoUploadedThisSession] = useState(false);
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const existingLogoValue =
    typeof workspaceData?.logoKey === "string"
      ? workspaceData.logoKey
      : workspaceData?.logo;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Workspace>({
    mode: "onSubmit",
    defaultValues: {
      workspaceName: workspaceData?.workspaceName,
      companyName: workspaceData?.companyName,
      description: workspaceData?.description,
      logo: existingLogoValue,
    },
  });

  const descriptionLength = (watch("description") || "").length;

  const resetUploadSessionState = () => {
    setLogoSizeBytes(undefined);
    setLogoUploadedThisSession(false);
    setLogoPreview("");
  };

  const onSubmit: SubmitHandler<Workspace> = async (formData) => {
    if (!isAdmin) {
      toast.warning("Insufficient privileges, contact Admin");
      return;
    }
    try {
      const payload = logoUploadedThisSession
        ? { ...formData, _id: workspaceData._id, logoSizeBytes }
        : { ...formData, _id: workspaceData._id };

      updateWorkspaceMutation(payload as Workspace, {
        onSuccess: () => {
          resetUploadSessionState();
          setOpen(false);
        },
        onError: (error) => {
          setOpen(false);
          console.error("Failed to update workspace:", error);
        },
      });
    } catch (error) {
      console.error("Failed to update workspace:", error);
    }
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > WORKSPACE_LOGO_MAX_SIZE) {
      toast.error("Logo must be under 500KB.");
      event.target.value = "";
      return;
    }

    try {
      setUploadingLogo(true);

      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);

      const uploadResult = await uploadFileToS3({ file });
      setValue("logo", uploadResult.key, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setLogoSizeBytes(uploadResult.size);
      setLogoUploadedThisSession(true);
    } catch (error) {
      console.error("Failed to upload logo:", error);
      setLogoPreview("");
    } finally {
      setUploadingLogo(false);
      event.target.value = "";
    }
  };

  const removeLogo = () => {
    setValue("logo", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setLogoPreview("");
    setLogoSizeBytes(undefined);
    setLogoUploadedThisSession(false);
  };

  const logoValue = watch("logo");
  const currentLogo =
    logoPreview ||
    (logoValue ? resolveAssetUrl(logoValue, workspaceData?.logo) : "");

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !isAdmin) {
      toast.warning("Insufficient privileges, contact Admin");
      return;
    }
    setOpen(nextOpen);
    if (nextOpen) {
      resetUploadSessionState();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Icon icon={DashboardSquareEditIcon} size={14} strokeWidth={2} />
          Edit Workspace
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Edit Workspace"
        description="Update workspace name, company details, description, and logo."
        variant="form"
        size="xl"
        primaryAction={{
          label: "Save Changes",
          loadingLabel: "Saving...",
          form: formId,
          type: "submit",
          loading: isPending,
          disabled: isPending || uploadingLogo,
          icon: CheckmarkCircle01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending || uploadingLogo,
          icon: Cancel01Icon,
        }}
      >
        <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="hidden" {...register("logo")} />
          <FieldGroup className="gap-6 p-4">
            <div className="flex items-start gap-4">
              <div className="relative size-20 shrink-0">
                <Avatar className="size-20 ring-2 ring-background">
                  <AvatarImage src={currentLogo} alt="Workspace logo" />
                  <AvatarFallback className="border text-lg">
                    {workspaceData?.workspaceName
                      ?.split(" ")
                      .map((word: string) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {uploadingLogo ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Spinner />
                  </div>
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <FormFieldLabel
                  htmlFor={uploadId}
                  label="Workspace Logo"
                  tooltip="Update or remove the logo used to identify this workspace."
                  optional
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingLogo}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon icon={UploadSquare01Icon} size={14} strokeWidth={2} />
                    Upload Image
                  </Button>

                  {currentLogo ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                      disabled={uploadingLogo}
                      onClick={removeLogo}
                    >
                      <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
                      Remove
                    </Button>
                  ) : null}
                </div>

                <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                  {WORKSPACE_LOGO_HELPER_TEXT}
                </p>
              </div>

              <input
                ref={fileInputRef}
                id={uploadId}
                type="file"
                accept={WORKSPACE_LOGO_ACCEPT}
                onChange={handleLogoChange}
                disabled={uploadingLogo}
                className="sr-only"
                aria-label="Upload workspace logo"
              />
            </div>

            <div className="flex flex-col gap-4">
              <Field data-invalid={!!errors.workspaceName}>
                <FormFieldLabel
                  htmlFor={`${id}-workspace-name`}
                  label="Workspace Name"
                  tooltip="The display name for this workspace."
                />
                <InputGroup size="md" className="bg-background">
                  <InputGroupInput
                    id={`${id}-workspace-name`}
                    type="text"
                    placeholder="Enter workspace name"
                    aria-invalid={errors.workspaceName ? "true" : "false"}
                    {...register("workspaceName", {
                      required: "Workspace name is required",
                    })}
                  />
                </InputGroup>
                <FieldError errors={[errors.workspaceName]} />
              </Field>

              <Field data-invalid={!!errors.companyName}>
                <FormFieldLabel
                  htmlFor={`${id}-company-name`}
                  label="Company Name"
                  tooltip="The legal or brand name of your organization."
                />
                <InputGroup size="md" className="bg-background">
                  <InputGroupInput
                    id={`${id}-company-name`}
                    type="text"
                    placeholder="Enter company name"
                    aria-invalid={errors.companyName ? "true" : "false"}
                    {...register("companyName", {
                      required: "Company name is required",
                    })}
                  />
                </InputGroup>
                <FieldError errors={[errors.companyName]} />
              </Field>

              <Field data-invalid={!!errors.description}>
                <FormFieldLabel
                  htmlFor={`${id}-description`}
                  label="Workspace Description"
                  tooltip="A short summary of what this workspace is used for."
                />
                <InputGroup size="md" className="bg-background">
                  <InputGroupTextarea
                    id={`${id}-description`}
                    placeholder="Enter workspace description"
                    maxLength={WORKSPACE_DESCRIPTION_MAX_LENGTH}
                    className="min-h-24 resize-none"
                    aria-invalid={errors.description ? "true" : "false"}
                    {...register("description", {
                      required: "Workspace description is required",
                      maxLength: {
                        value: WORKSPACE_DESCRIPTION_MAX_LENGTH,
                        message: `Description must be at most ${WORKSPACE_DESCRIPTION_MAX_LENGTH} characters`,
                      },
                    })}
                  />
                  <InputGroupAddon align="block-end">
                    <div className="flex w-full items-center justify-between gap-2">
                      {errors.description ? (
                        <FieldError errors={[errors.description]} />
                      ) : (
                        <span />
                      )}
                      <InputGroupText className="text-xs text-muted-foreground/60">
                        <span className="tabular-nums">
                          {WORKSPACE_DESCRIPTION_MAX_LENGTH - descriptionLength}
                        </span>{" "}
                        characters left
                      </InputGroupText>
                    </div>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </div>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}

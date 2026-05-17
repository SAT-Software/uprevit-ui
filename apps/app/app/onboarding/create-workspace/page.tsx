"use client";

import { useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { OnboardingShell } from "@/components/onboarding-shell";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@uprevit/ui/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  OnboardAdminWorkspacePayload,
  useOnboardAdminCreateWorkspace,
} from "@/hooks/onboarding/useOnboardAdminCreateWorkspace";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { ArrowRightIcon, ImagePlusIcon, XIcon } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { PiBuildingsDuotone } from "react-icons/pi";
import { isAdminProfile } from "@/utils/isAdmin";
import { toast } from "sonner";

type WorkspaceFormValues = {
  adminName: string;
  workspaceName: string;
  companyName: string;
  description: string;
  logo: string;
};

export default function OnboardingCreateWorkspacePage() {
  const id = useId();
  const auth = useAuth();
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const { mutate: createWorkspace, isPending } =
    useOnboardAdminCreateWorkspace();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<WorkspaceFormValues>({
    mode: "onChange",
    defaultValues: {
      adminName:
        typeof auth.user?.profile.name === "string"
          ? auth.user.profile.name
          : "",
      workspaceName: "",
      companyName: "",
      description: "",
      logo: "",
    },
  });

  const logo = watch("logo");
  const currentLogo = logoPreview || logo;
  const inputGroupClass = "bg-background/75 shadow-none";

  const handleWorkspaceLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    } catch (error) {
      console.error("Failed to upload workspace logo:", error);
      setLogoPreview("");
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeWorkspaceLogo = () => {
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }

    setValue("logo", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setLogoPreview("");
  };

  const onSubmit = (values: WorkspaceFormValues) => {
    try {
      if (!auth.user?.profile)
        throw new Error("You are not authorized to perform this action");

      const isAdmin = isAdminProfile(auth.user?.profile);
      if (!isAdmin) {
        toast.warning("Insufficient privileges, contact Admin");
        return;
      }

      const { email, sub } = auth.user.profile;
      const fallbackName =
        typeof email === "string" && email.includes("@")
          ? email.split("@")[0]
          : "Admin";
      const { adminName, ...workspaceValues } = values;

      const payload: OnboardAdminWorkspacePayload = {
        ...workspaceValues,
        name: adminName.trim() || fallbackName,
        email,
        cognitoSub: sub,
      };

      createWorkspace(payload);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating the workspace");
    }
  };

  return (
    <OnboardingShell
      title="Create your workspace"
      description="Set up your organization workspace to centralize labeling documentation, reviews, and compliance workflows."
    >
      <div className="mx-auto w-full max-w-3xl bg-accent">
        <Card className="border from-background/95 to-background/80 shadow-[0_28px_80px_-52px_hsl(var(--foreground)/0.55)] ring-1 ring-border/45 backdrop-blur-sm">
          <CardHeader className="space-y-0">
            <CardTitle className="text-base font-semibold tracking-tight">
              Workspace details
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Add the basics now. You can update all workspace details later
              from Settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <input type="hidden" {...register("logo")} />

              <div className="space-y-0">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor={`${id}-logo-upload`}>Workspace logo</Label>
                  <span className="text-[10px] text-muted-foreground">
                    Optional
                  </span>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-muted/35 py-2 ring-1 ring-border/50">
                  <div className="relative">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-border/70 bg-muted">
                      {currentLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentLogo}
                          alt="Workspace logo preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <PiBuildingsDuotone className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {uploadingLogo && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/45">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <input
                        ref={logoInputRef}
                        id={`${id}-logo-upload`}
                        type="file"
                        accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                        onChange={handleWorkspaceLogoChange}
                        disabled={uploadingLogo}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        aria-label="Upload workspace logo"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingLogo}
                        className="w-fit cursor-pointer"
                        asChild
                      >
                        <span>
                          <ImagePlusIcon className="mr-2 h-4 w-4" />
                          {uploadingLogo ? "Uploading..." : "Upload Logo"}
                        </span>
                      </Button>
                    </div>

                    {logo && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeWorkspaceLogo}
                        disabled={uploadingLogo}
                        className="w-fit text-destructive hover:text-destructive"
                      >
                        <XIcon className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}

                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, or WEBP recommended for best clarity.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-workspaceName`}>Workspace name</Label>
                <InputGroup className={inputGroupClass}>
                  {/* <InputGroupAddon align="inline-start">WS</InputGroupAddon> */}
                  <InputGroupInput
                    id={`${id}-workspaceName`}
                    placeholder="e.g. MedTech Labeling Team"
                    // className="h-10"
                    aria-invalid={Boolean(errors.workspaceName)}
                    {...register("workspaceName", {
                      required: "Workspace name is required",
                      maxLength: {
                        value: 80,
                        message: "Workspace name must be at most 80 characters",
                      },
                    })}
                  />
                </InputGroup>
                {errors.workspaceName && (
                  <p className="text-xs text-destructive">
                    {errors.workspaceName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-adminName`}>Your full name</Label>
                  <InputGroup className={inputGroupClass}>
                    <InputGroupInput
                      id={`${id}-adminName`}
                      placeholder="e.g. Amit Patel"
                      aria-invalid={Boolean(errors.adminName)}
                      {...register("adminName", {
                        required: "Full name is required",
                        maxLength: {
                          value: 80,
                          message: "Full name must be at most 80 characters",
                        },
                      })}
                    />
                  </InputGroup>
                  {errors.adminName && (
                    <p className="text-xs text-destructive">
                      {errors.adminName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-companyName`}>Company name</Label>
                  <InputGroup className={inputGroupClass}>
                    <InputGroupAddon align="inline-start">CO</InputGroupAddon>
                    <InputGroupInput
                      id={`${id}-companyName`}
                      placeholder="e.g. Uprevit Medical Devices Pvt Ltd"
                      aria-invalid={Boolean(errors.companyName)}
                      {...register("companyName", {
                        required: "Company name is required",
                        maxLength: {
                          value: 120,
                          message:
                            "Company name must be at most 120 characters",
                        },
                      })}
                    />
                  </InputGroup>
                  {errors.companyName && (
                    <p className="text-xs text-destructive">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor={`${id}-description`}>
                    Workspace description
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    Optional
                  </span>
                </div>
                <InputGroup className={inputGroupClass}>
                  <InputGroupTextarea
                    id={`${id}-description`}
                    placeholder="Describe how your organization will use Uprevit for medical device labeling and documentation."
                    rows={4}
                    className="min-h-28"
                    aria-invalid={Boolean(errors.description)}
                    {...register("description", {
                      maxLength: {
                        value: 240,
                        message: "Description must be at most 240 characters",
                      },
                    })}
                  />
                </InputGroup>
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!isValid || isPending || uploadingLogo}
                  className="gap-2 px-6"
                >
                  {uploadingLogo ? (
                    "Uploading logo..."
                  ) : isPending ? (
                    "Creating workspace..."
                  ) : (
                    <>
                      Create workspace
                      <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </OnboardingShell>
  );
}

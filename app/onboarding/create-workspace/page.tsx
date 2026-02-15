"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { OnboardingShell } from "@/components/onboarding-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  OnboardAdminWorkspacePayload,
  useOnboardAdminCreateWorkspace,
} from "@/hooks/onboarding/useOnboardAdminCreateWorkspace";
import { Workspace } from "@/types/workspace";
import { uploadFiles } from "@/utils/uploadthing";
import { ArrowRightIcon, ImagePlusIcon, XIcon } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { PiBuildingsDuotone } from "react-icons/pi";
import { isAdminProfile } from "@/utils/isAdmin";
import { toast } from "sonner";

type WorkspaceFormValues = Pick<
  Workspace,
  "workspaceName" | "companyName" | "companyId" | "description" | "logo"
>;

export default function OnboardingCreateWorkspacePage() {
  const id = useId();
  const auth = useAuth();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
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
      workspaceName: "",
      companyName: "",
      companyId: "",
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

      const utRes = await uploadFiles("imageUploader", {
        files: [file],
      });

      const uploadedUrl = utRes?.[0]?.ufsUrl;
      if (!uploadedUrl) throw new Error("Logo upload failed");

      setValue("logo", uploadedUrl, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Failed to upload workspace logo:", error);
      setLogoPreview("");
      toast.error("Failed to upload workspace logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeWorkspaceLogo = () => {
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
        toast.error("Insufficient privileges, contact Admin");
        return;
      }

      const { name, email, sub } = auth.user.profile;

      const payload: OnboardAdminWorkspacePayload = {
        ...values,
        name: name || "Test",
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
                        id={`${id}-logo-upload`}
                        type="file"
                        accept="image/*"
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
                      PNG, JPG, or SVG recommended for best clarity.
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

                <div className="space-y-2">
                  <Label htmlFor={`${id}-companyId`}>Company ID</Label>
                  <InputGroup className={inputGroupClass}>
                    <InputGroupAddon align="inline-start">ID</InputGroupAddon>
                    <InputGroupInput
                      id={`${id}-companyId`}
                      placeholder="e.g. MED-REG-10293"
                      aria-invalid={Boolean(errors.companyId)}
                      {...register("companyId", {
                        required: "Company ID is required",
                        maxLength: {
                          value: 80,
                          message: "Company ID must be at most 80 characters",
                        },
                      })}
                    />
                  </InputGroup>
                  {errors.companyId && (
                    <p className="text-xs text-destructive">
                      {errors.companyId.message}
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
                  disabled={!isValid || isPending}
                  className="gap-2 px-6"
                >
                  {isPending ? (
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

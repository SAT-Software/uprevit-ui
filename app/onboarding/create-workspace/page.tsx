"use client";

import Image from "next/image";
import { useId } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  OnboardAdminWorkspacePayload,
  useOnboardAdminCreateWorkspace,
} from "@/hooks/onboarding/useOnboardAdminCreateWorkspace";
import { Workspace } from "@/types/workspace";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

type WorkspaceFormValues = Pick<
  Workspace,
  "workspaceName" | "companyName" | "companyId" | "description" | "logo"
>;

export default function OnboardingCreateWorkspacePage() {
  const id = useId();
  const auth = useAuth();
  const { mutate: createWorkspace, isPending } =
    useOnboardAdminCreateWorkspace();

  console.log("auth", auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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

  const onSubmit = (values: WorkspaceFormValues) => {
    try {
      if (!auth.user?.profile)
        throw new Error("You are not authorized to perform this action");

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top brand bar */}
      <header className="w-full flex items-center justify-between px-8 py-4 border-b bg-background/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Uprevit"
            width={28}
            height={28}
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight">
              Create your workspace
            </span>
            <span className="text-xs text-muted-foreground">
              Configure the workspace that powers your labeling workflows.
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.9fr)]">
          {/* Left: Form */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Set up your workspace
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Provide a few details so your team can easily recognize this
                workspace. You can edit everything later from Settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Workspace Name */}
                <div className="space-y-1.5">
                  <Label htmlFor={`${id}-workspaceName`}>Workspace name</Label>
                  <Input
                    id={`${id}-workspaceName`}
                    placeholder="e.g. MedTech Labeling Team"
                    {...register("workspaceName", {
                      required: "Workspace name is required",
                      maxLength: {
                        value: 80,
                        message: "Workspace name must be at most 80 characters",
                      },
                    })}
                  />
                  {errors.workspaceName && (
                    <p className="text-xs text-destructive">
                      {errors.workspaceName.message}
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div className="space-y-1.5">
                  <Label htmlFor={`${id}-companyName`}>Company name</Label>
                  <Input
                    id={`${id}-companyName`}
                    placeholder="e.g. Uprevit Medical Devices Pvt Ltd"
                    {...register("companyName", {
                      required: "Company name is required",
                      maxLength: {
                        value: 120,
                        message: "Company name must be at most 120 characters",
                      },
                    })}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-destructive">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                {/* Company ID */}
                <div className="space-y-1.5">
                  <Label htmlFor={`${id}-companyId`}>Company ID</Label>
                  <Input
                    id={`${id}-companyId`}
                    placeholder="e.g. MED-REG-10293 or internal org ID"
                    {...register("companyId", {
                      required: "Company ID is required",
                      maxLength: {
                        value: 80,
                        message: "Company ID must be at most 80 characters",
                      },
                    })}
                  />
                  {errors.companyId && (
                    <p className="text-xs text-destructive">
                      {errors.companyId.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor={`${id}-description`}>
                      Workspace description
                    </Label>
                    <span className="text-[10px] text-muted-foreground">
                      Optional
                    </span>
                  </div>
                  <Textarea
                    id={`${id}-description`}
                    placeholder="Describe how your organization will use Uprevit for medical device labeling and documentation."
                    rows={4}
                    className="resize-none"
                    {...register("description", {
                      maxLength: {
                        value: 240,
                        message: "Description must be at most 240 characters",
                      },
                    })}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Logo URL */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor={`${id}-logo`}>Workspace logo URL</Label>
                    <span className="text-[10px] text-muted-foreground">
                      Optional
                    </span>
                  </div>
                  <Input
                    id={`${id}-logo`}
                    placeholder="Paste an image URL or leave blank to use default"
                    {...register("logo", {
                      pattern: {
                        value:
                          /^(https?:\/\/.*\.(?:png|jpg|jpeg|svg|webp|gif|bmp))$/i,
                        message: "Enter a valid image URL",
                      },
                    })}
                  />
                  {errors.logo && (
                    <p className="text-xs text-destructive">
                      {errors.logo.message}
                    </p>
                  )}

                  {logo && !errors.logo && (
                    <div className="flex items-center gap-3 pt-2">
                      <div className="relative h-8 w-8 rounded-md overflow-hidden border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logo}
                          alt="Workspace logo preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Preview of your workspace logo.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <Button
                    type="submit"
                    disabled={!isValid || isPending}
                    className="px-6"
                  >
                    {isPending ? "Creating workspace..." : "Create workspace"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right: Contextual panel */}
          <Card className="hidden lg:flex flex-col justify-between border border-border/80 bg-muted/40">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Welcome to Uprevit
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Your workspace connects teams, departments, projects, and
                products into a single source of truth for compliant medical
                device labeling.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-xs text-muted-foreground">
              <div className="space-y-1.5">
                <p className="font-medium text-foreground">
                  After creating your workspace
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Invite collaborators to join your organization.</li>
                  <li>
                    Create departments and projects for each product line.
                  </li>
                  <li>
                    Upload source files and manage label content centrally.
                  </li>
                </ul>
              </div>
              <div className="space-y-1.5">
                <p className="font-medium text-foreground">Safe to iterate</p>
                <p>
                  All details here can be updated anytime from Settings without
                  impacting your existing projects or audit history.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

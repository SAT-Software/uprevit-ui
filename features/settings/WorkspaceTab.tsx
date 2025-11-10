"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";
import { useUpdateWorkspace } from "@/hooks/workspace/useUpdateWorkspace";
import { useForm, SubmitHandler } from "react-hook-form";
import { useId } from "react";
import { Workspace } from "@/types/workspace";
import { uploadFiles } from "@/utils/uploadthing";
import { ImagePlusIcon, XIcon } from "lucide-react";

function WorkspaceTab() {
  const id = useId();
  const { data, isLoading, error } = useGetWorkspace();
  const { mutate: updateWorkspaceMutation, isPending } = useUpdateWorkspace();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const workspaceData = data?.workspace;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Workspace>({
    mode: "onSubmit",
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message}</div>;

  const onSubmit: SubmitHandler<Workspace> = async (formData) => {
    try {
      console.log("workspace form data", {
        ...formData,
        _id: workspaceData._id,
      });
      updateWorkspaceMutation({ ...formData });
    } catch (error) {
      console.error("Failed to update workspace:", error);
    }
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);

      // Upload the file
      const utRes = await uploadFiles("imageUploader", {
        files: [file],
      });

      if (utRes && utRes[0]?.ufsUrl) {
        setValue("logo", utRes[0].ufsUrl);
      }
    } catch (error) {
      console.error("Failed to upload logo:", error);
      // Reset preview on error
      setLogoPreview("");
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setValue("logo", "");
    setLogoPreview("");
  };

  const currentLogo = logoPreview || workspaceData?.logo;

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center gap-6 p-6 bg-accent rounded-lg border">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={currentLogo} alt={workspaceData?.workspaceName} />
            <AvatarFallback className="text-lg border">
              {workspaceData?.workspaceName
                ?.split(" ")
                .map((word: string) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {uploadingLogo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-semibold">
              {workspaceData?.workspaceName}
            </h2>
            <Badge variant="default">
              {workspaceData?.planName || "Enterprise"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Manage your workspace settings and organization details.
          </p>
        </div>
      </div>

      {/* Workspace Information */}
      <form
        id="update-workspace-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <div className="font-medium">Workspace Information</div>

        {/* Logo Upload Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Workspace Logo</label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={currentLogo} alt="Workspace logo" />
                <AvatarFallback className="text-lg border">
                  {workspaceData?.workspaceName
                    ?.split(" ")
                    .map((word: string) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {uploadingLogo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={uploadingLogo}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                    <ImagePlusIcon className="w-4 h-4 mr-2" />
                    {uploadingLogo ? "Uploading..." : "Change Logo"}
                  </span>
                </Button>
              </div>

              {watch("logo") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeLogo}
                  disabled={uploadingLogo}
                  className="w-fit text-destructive hover:text-destructive"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace Name</label>
            <Input
              id={`${id}-name`}
              type="text"
              placeholder="Enter workspace name"
              defaultValue={workspaceData?.workspaceName}
              className="w-full"
              {...register("workspaceName", {
                required: "Workspace name is required",
              })}
            />
            {errors.workspaceName && (
              <p role="alert" className="text-xs text-destructive">
                {errors.workspaceName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input
              type="text"
              placeholder="Enter company name"
              defaultValue={workspaceData?.companyName}
              className="w-full"
              {...register("companyName", {
                required: "Company name is required",
              })}
            />
            {errors.companyName && (
              <p role="alert" className="text-xs text-destructive">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company ID</label>
            <Input
              type="text"
              value={workspaceData?.companyId || "123456"}
              placeholder="Enter company ID"
              className="w-full"
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Plan</label>
            <Input
              type="text"
              value={workspaceData?.plan || "Pro"}
              placeholder="Enter plan"
              className="w-full"
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">User Count</label>
            <Input
              type="number"
              value={workspaceData?.userIds?.length || 1}
              placeholder="Number of users"
              className="w-full"
              disabled
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Workspace Description</label>
            <Textarea
              placeholder="Enter workspace description"
              defaultValue={workspaceData?.description}
              className="w-full min-h-20"
              {...register("description", {
                required: "Workspace description is required",
              })}
            />
            {errors.description && (
              <p role="alert" className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button type="submit" disabled={isPending} variant="default">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Usage Statistics */}
      {/* <div className="space-y-4">
        <div className="font-medium">Usage Statistics</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-semibold">156</div>
            <div className="text-sm text-muted-foreground">Active Products</div>
            <div className="text-xs text-muted-foreground mt-1">
              +12 this month
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-semibold">23</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
            <div className="text-xs text-muted-foreground mt-1">
              +3 this month
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-semibold">8</div>
            <div className="text-sm text-muted-foreground">Departments</div>
            <div className="text-xs text-muted-foreground mt-1">
              All departments active
            </div>
          </div>
        </div>
      </div> */}

      {/* Workspace Settings */}
      {/* <div className="space-y-4">
        <div className="font-medium">Workspace Settings</div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">Auto-archive completed projects</div>
              <div className="text-sm text-muted-foreground">
                Automatically archive projects that haven't been updated in
                90 days.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                <div className="absolute left-5 top-0.5 w-5 h-5 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">
                Require approval for new products
              </div>
              <div className="text-sm text-muted-foreground">
                New products require administrator approval before becoming
                active.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-muted rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">Enable audit logging</div>
              <div className="text-sm text-muted-foreground">
                Track all changes and user activities for compliance purposes.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                <div className="absolute left-5 top-0.5 w-5 h-5 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default WorkspaceTab;

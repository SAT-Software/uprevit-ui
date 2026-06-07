"use client";

import { useState, useId } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import { Input } from "@uprevit/ui/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@uprevit/ui/components/ui/avatar";
import { Textarea } from "@uprevit/ui/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@uprevit/ui/components/ui/dialog";
import { useUpdateWorkspace } from "@/hooks/workspace/useUpdateWorkspace";
import { useForm, SubmitHandler } from "react-hook-form";
import { Workspace } from "@/types/workspace";
import {
  PiPencilSimpleDuotone,
  PiXCircleDuotone,
  PiCheckCircleDuotone,
  PiCameraDuotone,
  PiTrashDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { toast } from "sonner";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { resolveAssetUrl } from "@/utils/resolveAssetUrl";

interface DialogUpdateWorkspaceProps {
  workspaceData: Workspace;
}

export function DialogUpdateWorkspace({
  workspaceData,
}: DialogUpdateWorkspaceProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const { mutate: updateWorkspaceMutation, isPending } = useUpdateWorkspace();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoSizeBytes, setLogoSizeBytes] = useState<number | undefined>();
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

  const onSubmit: SubmitHandler<Workspace> = async (formData) => {
    if (!isAdmin) {
      toast.warning("Insufficient privileges, contact Admin");
      return;
    }
    try {
      updateWorkspaceMutation(
        { ...formData, _id: workspaceData._id, logoSizeBytes } as Workspace,
        {
          onSuccess: () => {
            setOpen(false);
          },
          onError: (error) => {
            setOpen(false);
            console.error("Failed to update workspace:", error);
          },
        },
      );
    } catch (error) {
      console.error("Failed to update workspace:", error);
    }
  };

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);

      const uploadResult = await uploadFileToS3({ file });
      setValue("logo", uploadResult.key, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setLogoSizeBytes(uploadResult.size);
    } catch (error) {
      console.error("Failed to upload logo:", error);
      // Reset preview on error
      setLogoPreview("");
    } finally {
      setUploadingLogo(false);
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
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <PiPencilSimpleDuotone className="w-4 h-4" />
          Edit Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-[600px] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Edit Workspace</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <form
          id="update-workspace-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="overflow-y-auto"
        >
          <input type="hidden" {...register("logo")} />
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="w-20 h-20 ring-2 ring-background">
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

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px] rounded-full z-10">
                  <label
                    className="cursor-pointer p-2 bg-background text-foreground rounded-full hover:bg-accent transition-colors flex items-center justify-center"
                    title="Change Logo"
                  >
                    <PiCameraDuotone size={16} />
                    <input
                      type="file"
                      accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                      onChange={handleLogoChange}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </label>

                  {watch("logo") && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      disabled={uploadingLogo}
                      className="cursor-pointer p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors flex items-center justify-center"
                      title="Remove Logo"
                    >
                      <PiTrashDuotone size={16} />
                    </button>
                  )}
                </div>

                {uploadingLogo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-20">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-medium text-sm">Workspace Logo</h3>
                <p className="text-xs text-muted-foreground">
                  Upload a new logo for your workspace.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Workspace Name</label>
                <Input
                  id={`${id}-name`}
                  type="text"
                  placeholder="Enter workspace name"
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

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Workspace Description
                </label>
                <Textarea
                  placeholder="Enter workspace description"
                  className="w-full min-h-24 resize-none"
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
          </div>
        </form>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone className="h-4 w-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isPending || uploadingLogo}
            variant="default"
            size="sm"
            form="update-workspace-form"
          >
            {isPending ? (
              <Spinner />
            ) : (
              <PiCheckCircleDuotone className="h-4 w-4" />
            )}
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

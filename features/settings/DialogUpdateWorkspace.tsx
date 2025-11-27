"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateWorkspace } from "@/hooks/workspace/useUpdateWorkspace";
import { useForm, SubmitHandler } from "react-hook-form";
import { Workspace } from "@/types/workspace";
import { uploadFiles } from "@/utils/uploadthing";
import { ImagePlusIcon, XIcon, PencilIcon } from "lucide-react";

interface DialogUpdateWorkspaceProps {
  workspaceData: Workspace;
}

export function DialogUpdateWorkspace({
  workspaceData,
}: DialogUpdateWorkspaceProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const { mutate: updateWorkspaceMutation, isPending } = useUpdateWorkspace();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");

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
      logo: workspaceData?.logo,
    },
  });

  const onSubmit: SubmitHandler<Workspace> = async (formData) => {
    try {
      updateWorkspaceMutation(
        { ...formData, _id: workspaceData._id },
        {
          onSuccess: () => {
            setOpen(false);
          },
          onError: (error) => {
            setOpen(false);
            console.error("Failed to update workspace:", error);
          },
        }
      );
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

  const currentLogo = logoPreview || watch("logo") || workspaceData?.logo;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
        </DialogHeader>

        <form
          id="update-workspace-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* Logo Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace Logo</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
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
                  >
                    <ImagePlusIcon className="w-4 h-4 mr-2" />
                    {uploadingLogo ? "Uploading..." : "Change Logo"}
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} variant="default">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

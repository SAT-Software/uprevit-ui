"use client";

import { useId, useState } from "react";
import { PiPlusSquareDuotone, PiXDuotone } from "react-icons/pi";
import { useForm, Controller } from "react-hook-form";
import {
  useFileUpload,
  FileWithPreview,
} from "@/hooks/general/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import {
  PiPencilSimpleDuotone,
  PiXCircleDuotone,
  PiFloppyDiskDuotone,
  PiPictureInPictureDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";

type FormData = {
  name: string;
  description: string;
  type: string;
  image: FileWithPreview | string | null;
};

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
  key?: string;
  tagged_image?: string;
}

export default function DialogEditLabelTag({
  productId,
  labelTag,
  isSubmitted = false,
}: {
  productId: string;
  labelTag: LabelTagItem;
  isSubmitted?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { mutate: updateLabelTag, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    values: {
      name: labelTag.name || "",
      description: labelTag.description || "",
      type: labelTag.type || "",
      image: labelTag.image || null,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setUploadingImage(true);
      let uploadedImageKey: string | undefined;

      // Only upload if there's a new image file
      if (
        data.image &&
        typeof data.image !== "string" &&
        data.image.file instanceof File
      ) {
        const s3UploadResult = await uploadFileToS3({
          file: data.image.file,
          contentType: data.image.file.type || "application/octet-stream",
        });

        uploadedImageKey = s3UploadResult.key;
      }
      setUploadingImage(false);

      const hasRemovedExistingImage = data.image === null && Boolean(labelTag.image);

      const editLabelTagData = {
        id: productId,
        action: "update_label_tags",
        tab: "label-tags",
        data: {
          id: labelTag._id,
          name: data.name,
          description: data.description,
          type: data.type,
          image: uploadedImageKey
            ? ""
            : hasRemovedExistingImage
            ? ""
            : typeof data.image === "string"
            ? data.image
            : "",
          ...(uploadedImageKey !== undefined && { key: uploadedImageKey }),
          ...(hasRemovedExistingImage && uploadedImageKey === undefined && { key: "" }),
        },
      };

      updateLabelTag(editLabelTagData, {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
        onError: (error) => {
          console.error("Failed to update label tag:", error);
        },
      });
    } catch (error) {
      console.error("Failed to edit label tag:", error);
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" disabled={isSubmitted}>
          <PiPencilSimpleDuotone />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:hidden">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiPencilSimpleDuotone className="w-4 h-4" />
              <span>Edit Label</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit the label details and upload a new image.
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id={`edit-label-tag-form-${id}`}
          className="overflow-y-auto"
          noValidate
        >
          <div className="flex gap-4 p-4">
            <div className="w-1/3">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ComponentImage
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file);
                    }}
                  />
                )}
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-name`}>Name</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id={`${id}-name`}
                    placeholder="Enter label name"
                    type="text"
                    aria-invalid={errors.name ? "true" : "false"}
                    {...register("name", {
                      required: "Label name is required",
                    })}
                  />
                  {errors.name && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-type`}>Type</Label>
                <Input
                  id={`${id}-type`}
                  placeholder="Enter label type"
                  type="text"
                  {...register("type")}
                />
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-description`}>Description</Label>
              <Textarea
                id={`${id}-description`}
                placeholder="Describe the label's purpose and specifications"
                {...register("description")}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        </form>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                reset();
              }}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            form={`edit-label-tag-form-${id}`}
            type="submit"
            size="sm"
            variant="default"
            onClick={handleSubmit(onSubmit)}
            disabled={uploadingImage || isPending}
            aria-busy={uploadingImage || isPending}
          >
            {uploadingImage || isPending ? (
              <Spinner />
            ) : (
              <PiFloppyDiskDuotone />
            )}
            {uploadingImage
              ? "Uploading..."
              : isPending
              ? "Updating..."
              : "Update Label"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ComponentImageProps {
  value: FileWithPreview | string | null;
  onChange: (file: FileWithPreview | string | null) => void;
}

function ComponentImage({ value, onChange }: ComponentImageProps) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/png,image/jpg,image/jpeg,image/gif,image/webp",
      onFilesChange: (newFiles) => {
        if (newFiles.length > 0) {
          onChange(newFiles[0]);
        } else {
          onChange(null);
        }
      },
    });

  // Sync external value with internal state
  const currentImage =
    (typeof value === "string" ? value : value?.preview) ||
    files[0]?.preview ||
    null;

  return (
    <div className="h-40 w-full">
      <div className="bg-muted/30 border border-border relative flex size-full rounded-xl items-center justify-center overflow-hidden group transition-colors hover:bg-muted/50">
        {currentImage ? (
          <Image
            className="size-full object-cover rounded-xl"
            src={currentImage}
            alt={
              (typeof value !== "string" && value?.file.name) ||
              files[0]?.file.name
                ? "Preview of uploaded label image"
                : "Current label image"
            }
            width={512}
            height={160}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/50">
            <PiPictureInPictureDuotone className="w-12 h-12" />
            <span className="text-xs font-medium">Upload Image</span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-background text-foreground transition-[color,box-shadow] outline-none hover:bg-accent focus-visible:ring-[3px]"
            onClick={openFileDialog}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <PiPlusSquareDuotone size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-[color,box-shadow] outline-none hover:bg-destructive/90 focus-visible:ring-[3px]"
              onClick={() => {
                const fileId =
                  (typeof value !== "string" ? value?.id : undefined) ||
                  files[0]?.id;
                if (fileId) {
                  removeFile(fileId);
                }
                onChange(null);
              }}
              aria-label="Remove image"
            >
              <PiXDuotone size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload label image"
        />
      </div>
    </div>
  );
}

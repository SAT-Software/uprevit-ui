"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PiPlusSquareDuotone, PiXDuotone } from "react-icons/pi";
import { useForm, Controller } from "react-hook-form";
import {
  useFileUpload,
  FileWithPreview,
} from "@/hooks/general/use-file-upload";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Textarea } from "@uprevit/ui/components/ui/textarea";
import { TagInput, Tag } from "@uprevit/ui/components/ui/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import Image from "next/image";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import {
  PiPencilSimpleDuotone,
  PiXCircleDuotone,
  PiCheckCircleDuotone,
  PiPictureInPictureDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

type ComponentItem = {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  key?: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
};

type FormData = {
  componentNumber: string;
  componentDescription: string;
  image: FileWithPreview | null;
  labelType: Tag[];
  dimensions: string;
  componentType: string;
};

type ImageChangeState = "unchanged" | "removed" | "replaced";

export default function EditComponentDialog({
  productId,
  component,
  open,
  onOpenChange,
}: {
  productId: string;
  component: ComponentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageState, setImageState] = useState<ImageChangeState>("unchanged");
  const buildTags = (labels: string[]) =>
    labels.map((text, index) => ({
      id: `tag-${index}-${text}`,
      text,
    }));
  const formDefaults = useMemo(
    () => ({
      componentNumber: component.component_number || "",
      componentDescription: component.component_description || "",
      image: null,
      labelType: buildTags(component.label_type || []),
      dimensions: component.dimensions || "",
      componentType: component.component_type || "",
    }),
    [
      component.component_description,
      component.component_number,
      component.component_type,
      component.dimensions,
      component.label_type,
    ],
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: formDefaults,
  });
  const { mutate: updateComponent, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadFilesToS3();

  useEffect(() => {
    if (!open) return;
    reset(formDefaults);
    setImageState("unchanged");
  }, [formDefaults, open, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setUploadingImage(true);
      let uploadedImageKey: string | undefined;
      let uploadedImageSizeBytes: number | undefined;

      // Only upload if there's a new image file
      if (data.image && data.image.file instanceof File) {
        const uploadRes = await uploadImage({
          file: data.image.file,
          contentType: data.image.file.type || "application/octet-stream",
          uploadScope: "product-assets",
          productId,
        });
        uploadedImageKey = uploadRes.key;
        uploadedImageSizeBytes = uploadRes.size;
      }
      setUploadingImage(false);

      const nextImage =
        imageState === "unchanged" ? component.image : "";
      const nextKey =
        imageState === "replaced"
          ? (uploadedImageKey ?? "")
          : imageState === "removed"
            ? ""
            : (component.key ?? "");

      const updatedComponentData = {
        id: productId,
        action: "update_label_component",
        tab: "label-components",
        data: {
          id: component._id,
          component_number: data.componentNumber,
          image: nextImage,
          key: nextKey,
          ...(uploadedImageSizeBytes ? { sizeBytes: uploadedImageSizeBytes } : {}),
          component_description: data.componentDescription,
          label_type: (data.labelType || []).map((tag: Tag) => tag.text),
          dimensions: data.dimensions,
          component_type: data.componentType,
        },
      };

      updateComponent(updatedComponentData, {
        onSuccess: async () => {
          try {
            await Promise.all([
              queryClient.refetchQueries({
                queryKey: ["product-tab-data", productId, "label-components"],
                type: "active",
              }),
              queryClient.refetchQueries({
                queryKey: ["product-diff-redline", productId],
                type: "active",
              }),
            ]);
          } finally {
            onOpenChange(false);
            reset();
            setImageState("unchanged");
          }
        },
        onError: () => {
          setUploadingImage(false);
        },
      });
    } catch (error) {
      console.error("Failed to update component:", error);
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:hidden">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiPencilSimpleDuotone className="w-4 h-4" />
              <span>Edit Component</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit component by updating component details and uploading a new
          image.
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="edit-component-form"
          className="overflow-y-auto"
        >
          <div className="flex gap-4 p-4">
            <div className="w-1/3">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ComponentImage
                    currentImage={component.image}
                    value={field.value}
                    imageState={imageState}
                    onImageStateChange={setImageState}
                    onChange={(file) => {
                      field.onChange(file);
                      setValue("image", file);
                    }}
                  />
                )}
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-component-number`}>
                  Component Number
                </Label>
                <Input
                  id={`${id}-component-number`}
                  placeholder="Enter component number"
                  type="text"
                  {...register("componentNumber", {
                    required: "Component number is required",
                  })}
                />
                {errors.componentNumber && (
                  <p className="text-xs text-red-500">
                    {errors.componentNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-component-type`}>Component Type</Label>
                <Controller
                  name="componentType"
                  control={control}
                  rules={{
                    required: "Component type is required",
                  }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select component type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preprinted">Preprinted</SelectItem>
                        <SelectItem value="Pre-printed">Pre-printed</SelectItem>
                        <SelectItem value="Blank">Blank</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.componentType && (
                  <p className="text-xs text-red-500">
                    {errors.componentType.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Describe the component's purpose and specifications"
                  {...register("componentDescription")}
                  className="min-h-[100px] resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-dimensions`}>Dimensions</Label>
                <Input
                  id={`${id}-dimensions`}
                  placeholder="Enter dimensions"
                  type="text"
                  {...register("dimensions")}
                />
              </div>
              <div className="space-y-2">
                <Controller
                  name="labelType"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      label="Label Type"
                      tags={field.value || []}
                      setTags={field.onChange}
                      placeholder="Add label type and press Enter"
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground -mt-1">
                  Press Enter to add a label type. You can add multiple label
                  types.
                </p>
              </div>
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
                setImageState("unchanged");
              }}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            form="edit-component-form"
            type="button"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || uploadingImage}
            variant="default"
          >
            {isPending || uploadingImage || isUploadingImage ? (
              <Spinner />
            ) : (
              <PiCheckCircleDuotone />
            )}
            {isPending
              ? "Updating..."
              : uploadingImage || isUploadingImage
              ? "Uploading..."
              : "Update Component"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ComponentImageProps {
  currentImage: string;
  value: FileWithPreview | null;
  imageState: ImageChangeState;
  onImageStateChange: (state: ImageChangeState) => void;
  onChange: (file: FileWithPreview | null) => void;
}

function ComponentImage({
  currentImage,
  value,
  imageState,
  onImageStateChange,
  onChange,
}: ComponentImageProps) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/png,image/jpg,image/jpeg,image/gif,image/webp",
      onFilesChange: (newFiles) => {
        if (newFiles.length > 0) {
          onImageStateChange("replaced");
          onChange(newFiles[0]);
        } else {
          onChange(null);
        }
      },
    });

  // Show current image if no new file is selected
  const displayImage =
    value?.preview ||
    files[0]?.preview ||
    (imageState !== "removed" ? currentImage : "");

  return (
    <div className="h-40 w-full">
      <div className="bg-muted/30 border border-border relative flex size-full rounded-xl items-center justify-center overflow-hidden group transition-colors hover:bg-muted/50">
        {displayImage ? (
          <Image
            className="size-full object-cover rounded-xl"
            src={displayImage}
            alt="Component image"
            width={512}
            height={96}
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
            aria-label={displayImage ? "Change image" : "Upload image"}
          >
            <PiPlusSquareDuotone size={16} aria-hidden="true" />
          </button>
          {displayImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-[color,box-shadow] outline-none hover:bg-destructive/90 focus-visible:ring-[3px]"
              onClick={() => {
                const fileId = value?.id || files[0]?.id;
                if (fileId) {
                  removeFile(fileId);
                  onImageStateChange(currentImage ? "unchanged" : "removed");
                } else if (currentImage) {
                  onImageStateChange("removed");
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
          aria-label="Upload component image"
        />
      </div>
    </div>
  );
}

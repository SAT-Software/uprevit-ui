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

type Item = {
  id: string;
  componentName: string;
  componentImage: string;
  key?: string;
  description: string;
  labelPresence: string[];
};

type FormData = {
  componentName: string;
  componentDescription: string;
  labelPresence: Tag[];
  image: FileWithPreview | null;
};

type ImageChangeState = "unchanged" | "removed" | "replaced";

export default function EditSchematicsDialog({
  productId,
  schematic,
  open,
  onOpenChange,
}: {
  productId: string;
  schematic: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [labelPresence, setLabelPresence] = useState<Tag[]>(
    schematic.labelPresence.map((label, index) => ({
      id: `tag-${index}-${label}`,
      text: label,
    }))
  );
  const buildTags = (labels: string[]) =>
    labels.map((label, index) => ({
      id: `tag-${index}-${label}`,
      text: label,
    }));
  const formDefaults = useMemo(
    () => ({
      componentName: schematic.componentName,
      componentDescription: schematic.description,
      labelPresence: buildTags(schematic.labelPresence),
      image: null,
    }),
    [
      schematic.componentName,
      schematic.description,
      schematic.labelPresence,
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
  const [imageState, setImageState] = useState<ImageChangeState>("unchanged");

  useEffect(() => {
    if (!open) return;
    reset(formDefaults);
    setLabelPresence(formDefaults.labelPresence);
    setImageState("unchanged");
  }, [formDefaults, open, reset]);

  const { mutate: updateSchematicsData, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();

  const onSubmit = async (data: FormData) => {
    try {
      setUploadingImage(true);
      let uploadedImageKey: string | undefined;

      if (data.image && data.image.file instanceof File) {
        const s3UploadResult = await uploadFileToS3({
          file: data.image.file,
          contentType: data.image.file.type || "application/octet-stream",
        });

        uploadedImageKey = s3UploadResult.key;
      }
      setUploadingImage(false);

      const finalImage =
        imageState === "unchanged" ? schematic.componentImage : "";
      const finalKey =
        imageState === "replaced"
          ? (uploadedImageKey ?? "")
          : imageState === "removed"
            ? ""
            : (schematic.key ?? "");

      const updatedSchematicsData = {
        id: productId,
        action: "update_symbols_graphics",
        tab: "symbols-graphics",
        data: {
          id: schematic.id,
          text: data.componentName,
          image: finalImage,
          key: finalKey,
          entity: "Schematics",
          description: data.componentDescription,
          label_presence: labelPresence.map((tag: Tag) => tag.text),
        },
      };

      updateSchematicsData(updatedSchematicsData, {
        onSuccess: async () => {
          try {
            await Promise.all([
              queryClient.refetchQueries({
                queryKey: ["product-tab-data", productId, "symbols-graphics"],
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
            setLabelPresence([]);
            setImageState("unchanged");
          }
        },
        onError: () => {
          setUploadingImage(false);
        },
      });
    } catch (error) {
      console.error("Failed to update schematics item:", error);
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
              <span>Edit Schematic</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit schematics item by updating details and uploading a new image.
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="edit-schematics-form"
          className="overflow-y-auto"
        >
          <div className="flex gap-4 p-4">
            <div className="w-1/3">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ComponentImage
                    currentImage={schematic.componentImage}
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
                <Label htmlFor={`${id}-component-name`}>Schematic Name</Label>
                <Input
                  id={`${id}-component-name`}
                  placeholder="Enter schematic name"
                  type="text"
                  {...register("componentName", {
                    required: "Schematic name is required",
                  })}
                />
                {errors.componentName && (
                  <p className="text-xs text-red-500">
                    {errors.componentName.message}
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
                  placeholder="Describe the schematic's purpose and specifications"
                  {...register("componentDescription")}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <TagInput
                  label="Presence on labels"
                  tags={labelPresence}
                  setTags={setLabelPresence}
                  placeholder="Add label and press Enter"
                />
                <input
                  type="hidden"
                  {...register("labelPresence")}
                  value={JSON.stringify(labelPresence)}
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
            form="edit-schematics-form"
            type="button"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || uploadingImage}
            aria-busy={isPending || uploadingImage}
            variant="default"
          >
            {isPending || uploadingImage ? <Spinner /> : <PiCheckCircleDuotone />}
            {isPending
              ? "Updating..."
              : uploadingImage
              ? "Uploading..."
              : "Update Schematic"}
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
            alt="Schematic image"
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
                } else {
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
          aria-label="Upload schematic image"
        />
      </div>
    </div>
  );
}

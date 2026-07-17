"use client";

import { useEffect, useId } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  useFileUpload,
  type FileMetadata,
} from "@/hooks/general/use-file-upload";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Delete02Icon,
  Image01Icon,
  UploadSquare01Icon,
} from "@hugeicons/core-free-icons";

const LABEL_TAG_IMAGE_ACCEPT =
  "image/png,image/jpg,image/jpeg,image/gif,image/webp";
const LABEL_TAG_IMAGE_HELPER_TEXT = "Supports PNG, JPEG, JPG, GIF, WEBP";

export function LabelTagImageUpload({
  imageUrl,
  setNewLabelTagImage,
  setRemoveLabelTagImage,
}: {
  imageUrl?: string;
  setNewLabelTagImage: (file: File | null) => void;
  setRemoveLabelTagImage?: (removed: boolean) => void;
}) {
  const uploadId = useId();

  const initialFiles = imageUrl
    ? [
        {
          name: imageUrl.split("/").pop() || "image",
          size: 0,
          type: "image/*",
          url: imageUrl,
          id: `label-tag-${imageUrl}`,
        },
      ]
    : [];

  const [
    { files, errors },
    { removeFile, openFileDialog, clearErrors, getInputProps },
  ] = useFileUpload({
    accept: LABEL_TAG_IMAGE_ACCEPT,
    initialFiles,
  });

  const imageFile = files[0]?.file;

  const currentImage =
    files[0]?.preview ||
    (imageFile && !(imageFile instanceof File)
      ? (imageFile as FileMetadata).url
      : null);

  useEffect(() => {
    const hadInitialImage = !!imageUrl;

    if (files.length === 0) {
      setNewLabelTagImage(null);
      setRemoveLabelTagImage?.(hadInitialImage);
      return;
    }

    const file = files[0]?.file;
    if (file instanceof File) {
      setNewLabelTagImage(file);
      setRemoveLabelTagImage?.(false);
      return;
    }

    setNewLabelTagImage(null);
    setRemoveLabelTagImage?.(false);
  }, [files, imageUrl, setNewLabelTagImage, setRemoveLabelTagImage]);

  useEffect(() => {
    if (errors.length === 0) return;

    toast.error(errors[0]);
    clearErrors();
  }, [errors, clearErrors]);

  const handleRemove = () => {
    if (files[0]?.id) {
      removeFile(files[0].id);
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30">
        {currentImage ? (
          <Image
            className="size-full object-cover"
            src={currentImage}
            alt={
              files[0]?.preview
                ? "Preview of uploaded label image"
                : "Label image"
            }
            width={112}
            height={80}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground/50">
            <Icon icon={Image01Icon} size={28} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <FormFieldLabel
          htmlFor={uploadId}
          label="Label Image"
          tooltip="Upload a reference image for this label tag."
          optional
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFileDialog}
          >
            <Icon icon={UploadSquare01Icon} size={14} strokeWidth={2} />
            Upload Image
          </Button>

          {currentImage ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
              Remove
            </Button>
          ) : null}
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground/70">
          {LABEL_TAG_IMAGE_HELPER_TEXT}
        </p>
      </div>

      <input
        {...getInputProps({ id: uploadId })}
        className="sr-only"
        aria-label="Upload label image"
      />
    </div>
  );
}

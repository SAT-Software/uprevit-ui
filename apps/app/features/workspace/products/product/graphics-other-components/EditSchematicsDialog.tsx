"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import { TagInput, Tag } from "@uprevit/ui/components/ui/tag-input";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { GraphicsImageUpload } from "./GraphicsImageUpload";

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
};

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
  const formId = `edit-schematics-form-${id}`;
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newGraphicImage, setNewGraphicImage] = useState<File | null>(null);
  const [removeGraphicImage, setRemoveGraphicImage] = useState(false);
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
    }),
    [schematic.componentName, schematic.description, schematic.labelPresence],
  );
  const [labelPresence, setLabelPresence] = useState<Tag[]>(
    formDefaults.labelPresence,
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: formDefaults,
  });

  useEffect(() => {
    if (!open) return;
    reset(formDefaults);
    setLabelPresence(formDefaults.labelPresence);
    setNewGraphicImage(null);
    setRemoveGraphicImage(false);
  }, [formDefaults, open, reset]);

  const { mutate: updateSchematicsData, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();

  const isSaving = uploadingImage || isPending;

  const onSubmit = async (data: FormData) => {
    try {
      setUploadingImage(true);
      let uploadedImageKey: string | undefined;
      let uploadedImageSizeBytes: number | undefined;

      if (newGraphicImage) {
        const s3UploadResult = await uploadFileToS3({
          file: newGraphicImage,
          contentType: newGraphicImage.type || "application/octet-stream",
          uploadScope: "product-assets",
          productId,
        });

        uploadedImageKey = s3UploadResult.key;
        uploadedImageSizeBytes = s3UploadResult.size;
      }
      setUploadingImage(false);

      const nextImage = removeGraphicImage
        ? ""
        : newGraphicImage
          ? ""
          : schematic.componentImage;
      const nextKey = removeGraphicImage
        ? ""
        : newGraphicImage
          ? (uploadedImageKey ?? "")
          : (schematic.key ?? "");

      const updatedSchematicsData = {
        id: productId,
        action: "update_symbols_graphics",
        tab: "symbols-graphics",
        data: {
          id: schematic.id,
          text: data.componentName,
          image: nextImage,
          key: nextKey,
          ...(uploadedImageSizeBytes ? { sizeBytes: uploadedImageSizeBytes } : {}),
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
            setNewGraphicImage(null);
            setRemoveGraphicImage(false);
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

  const handleCancel = () => {
    reset(formDefaults);
    setLabelPresence(formDefaults.labelPresence);
    setNewGraphicImage(null);
    setRemoveGraphicImage(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Edit Schematic"
        description="Edit schematics item by updating details and uploading a new image."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Update Schematic",
          loadingLabel: isPending ? "Updating..." : "Uploading...",
          form: formId,
          type: "submit",
          loading: isSaving,
          disabled: isSaving,
          icon: CheckmarkCircle01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          icon: Cancel01Icon,
          onClick: handleCancel,
        }}
      >
        <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="gap-4 p-4">
            <Field>
              <GraphicsImageUpload
                key={`${schematic.id}-${open ? "open" : "closed"}`}
                imageUrl={schematic.componentImage}
                label="Schematic Image"
                tooltip="Upload a reference image for this schematic."
                setNewImage={setNewGraphicImage}
                setRemoveImage={setRemoveGraphicImage}
              />
            </Field>

            <Field data-invalid={!!errors.componentName}>
              <FormFieldLabel
                htmlFor={`${id}-component-name`}
                label="Schematic Name"
                tooltip="The display name for this schematic."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-component-name`}
                  placeholder="Enter schematic name"
                  type="text"
                  aria-invalid={errors.componentName ? "true" : "false"}
                  {...register("componentName", {
                    required: "Schematic name is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.componentName]} />
            </Field>

            <Field>
              <FormFieldLabel
                htmlFor={`${id}-description`}
                label="Description"
                tooltip="Describe the schematic's purpose, content, and specifications."
                optional
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupTextarea
                  id={`${id}-description`}
                  placeholder="Describe the schematic's purpose and specifications"
                  className="min-h-24 resize-none"
                  {...register("componentDescription")}
                />
              </InputGroup>
            </Field>

            <Field>
              <FormFieldLabel
                htmlFor={`${id}-label-presence`}
                label="Presence on labels"
                tooltip="Label types where this schematic appears. Press Enter after each entry."
                optional
              />
              <TagInput
                id={`${id}-label-presence`}
                tags={labelPresence}
                setTags={setLabelPresence}
                placeholder="Add label and press Enter"
              />
              <input
                type="hidden"
                {...register("labelPresence")}
                value={JSON.stringify(labelPresence)}
              />
              <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                Press Enter to add a label type. You can add multiple label
                types.
              </p>
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}

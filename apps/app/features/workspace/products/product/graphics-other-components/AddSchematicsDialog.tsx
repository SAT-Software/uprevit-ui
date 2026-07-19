"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
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
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  PlusSignSquareIcon,
} from "@hugeicons/core-free-icons";
import { GraphicsImageUpload } from "./GraphicsImageUpload";

type FormData = {
  componentName: string;
  componentDescription: string;
  labelPresence: Tag[];
};

export default function AddSchematicsDialog({
  productId,
  isSubmitted = false,
}: {
  productId: string;
  isSubmitted?: boolean;
}) {
  const id = useId();
  const formId = `add-schematics-form-${id}`;
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [graphicImage, setGraphicImage] = useState<File | null>(null);
  const [labelPresence, setLabelPresence] = useState<Tag[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      labelPresence: [],
    },
  });
  const { mutate: addSchematicsData, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();

  const isSaving = uploadingImage || isPending;

  const onSubmit = async (data: FormData) => {
    try {
      setUploadingImage(true);
      let uploadedImageKey: string | undefined;
      let uploadedImageSizeBytes: number | undefined;

      if (graphicImage) {
        const s3UploadResult = await uploadFileToS3({
          file: graphicImage,
          contentType: graphicImage.type || "application/octet-stream",
          uploadScope: "product-assets",
          productId,
        });

        uploadedImageKey = s3UploadResult.key;
        uploadedImageSizeBytes = s3UploadResult.size;
      }
      setUploadingImage(false);

      const newSchematicsData = {
        id: productId,
        action: "add_symbols_graphics",
        tab: "symbols-graphics",
        data: [
          {
            text: data.componentName,
            image: null,
            key: uploadedImageKey,
            sizeBytes: uploadedImageSizeBytes,
            entity: "Schematics",
            label_presence: labelPresence.map((tag: Tag) => tag.text),
            description: data.componentDescription,
          },
        ],
      };

      addSchematicsData(newSchematicsData, {
        onSuccess: () => {
          setOpen(false);
          reset();
          setLabelPresence([]);
          setGraphicImage(null);
        },
        onError: () => {
          setUploadingImage(false);
        },
      });
    } catch (error) {
      console.error("Failed to add schematics item:", error);
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    reset();
    setLabelPresence([]);
    setGraphicImage(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
      setLabelPresence([]);
      setGraphicImage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" disabled={isSubmitted}>
          <Icon icon={PlusSignSquareIcon} />
          Add Schematic
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Add New Schematic"
        description="Add a new schematics item by providing details and uploading an image."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Add Schematic",
          loadingLabel: isPending ? "Adding..." : "Uploading...",
          form: formId,
          type: "submit",
          loading: isSaving,
          disabled: isSaving || isSubmitted,
          icon: PlusSignSquareIcon,
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
                key={open ? "open" : "closed"}
                label="Schematic Image"
                tooltip="Upload a reference image for this schematic."
                setNewImage={setGraphicImage}
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

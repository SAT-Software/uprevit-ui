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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  PlusSignSquareIcon,
} from "@hugeicons/core-free-icons";
import { LabelTagImageUpload } from "./LabelTagImageUpload";

type FormData = {
  name: string;
  description: string;
  type: string;
};

export default function DialogAddLabelTag({
  productId,
  isSubmitted = false,
}: {
  productId: string;
  isSubmitted?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [labelTagImage, setLabelTagImage] = useState<File | null>(null);
  const { mutate: addLabelTag, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      type: "",
    },
  });

  const isSaving = uploadingImage || isPending;

  const onSubmit = async (data: FormData) => {
    try {
      setUploadingImage(true);
      let uploadedImageKey: string | undefined;
      let uploadedImageSizeBytes: number | undefined;

      if (labelTagImage) {
        const s3UploadResult = await uploadFileToS3({
          file: labelTagImage,
          contentType: labelTagImage.type || "application/octet-stream",
          uploadScope: "product-assets",
          productId,
        });

        uploadedImageKey = s3UploadResult.key;
        uploadedImageSizeBytes = s3UploadResult.size;
      }
      setUploadingImage(false);

      const newLabelTagData = {
        id: productId,
        action: "add_label_tags",
        tab: "label-tags",
        data: [
          {
            name: data.name,
            description: data.description,
            type: data.type,
            image: "",
            key: uploadedImageKey,
            sizeBytes: uploadedImageSizeBytes,
          },
        ],
      };

      addLabelTag(newLabelTagData, {
        onSuccess: () => {
          setOpen(false);
          reset();
          setLabelTagImage(null);
        },
        onError: (error) => {
          console.error("Failed to add label tag:", error);
          setOpen(false);
          reset();
          setLabelTagImage(null);
        },
      });
    } catch (error) {
      console.error("Failed to add label tag:", error);
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    reset();
    setLabelTagImage(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
      setLabelTagImage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary" disabled={isSubmitted}>
              <Icon icon={PlusSignSquareIcon} />
              Add Label
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent side="bottom">
          {isSubmitted
            ? "Submitted products can't be edited"
            : "Add a new label tag"}
        </TooltipContent>
      </Tooltip>
      <AppDialogContent
        title="Add New Label"
        description="Add a new label by providing details and uploading an image."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Add Label",
          loadingLabel: isPending ? "Adding..." : "Uploading...",
          form: `add-label-tag-form-${id}`,
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          id={`add-label-tag-form-${id}`}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field>
              <LabelTagImageUpload
                key={open ? "open" : "closed"}
                setNewLabelTagImage={setLabelTagImage}
              />
            </Field>

            <Field data-invalid={!!errors.name}>
              <FormFieldLabel
                htmlFor={`${id}-name`}
                label="Name"
                tooltip="The display name for this label tag."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-name`}
                  placeholder="Enter label name"
                  type="text"
                  aria-invalid={errors.name ? "true" : "false"}
                  {...register("name", {
                    required: "Label name is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FormFieldLabel
                htmlFor={`${id}-type`}
                label="Type"
                tooltip="Category or classification for the label (e.g., primary, warning, instruction)."
                optional
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-type`}
                  placeholder="Enter label type"
                  type="text"
                  {...register("type")}
                />
              </InputGroup>
            </Field>

            <Field>
              <FormFieldLabel
                htmlFor={`${id}-description`}
                label="Description"
                tooltip="Describe the label's purpose, content, and specifications."
                optional
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupTextarea
                  id={`${id}-description`}
                  placeholder="Describe the label's purpose and specifications"
                  className="min-h-24 resize-none"
                  {...register("description")}
                />
              </InputGroup>
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}

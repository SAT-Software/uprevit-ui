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
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  PropertyEditIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { LabelTagImageUpload } from "./LabelTagImageUpload";

type FormData = {
  name: string;
  description: string;
  type: string;
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
  const [newLabelTagImage, setNewLabelTagImage] = useState<File | null>(null);
  const [removeLabelTagImage, setRemoveLabelTagImage] = useState(false);
  const { mutate: updateLabelTag, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    values: {
      name: labelTag.name || "",
      description: labelTag.description || "",
      type: labelTag.type || "",
    },
  });

  const isSaving = uploadingImage || isPending;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setNewLabelTagImage(null);
      setRemoveLabelTagImage(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setUploadingImage(true);
      let uploadedImageKey: string | undefined;
      let uploadedImageSizeBytes: number | undefined;

      if (newLabelTagImage) {
        const s3UploadResult = await uploadFileToS3({
          file: newLabelTagImage,
          contentType: newLabelTagImage.type || "application/octet-stream",
          uploadScope: "product-assets",
          productId,
        });

        uploadedImageKey = s3UploadResult.key;
        uploadedImageSizeBytes = s3UploadResult.size;
      }
      setUploadingImage(false);

      const nextImage = removeLabelTagImage
        ? ""
        : newLabelTagImage
          ? ""
          : labelTag.image || "";
      const nextKey = removeLabelTagImage
        ? ""
        : newLabelTagImage
          ? (uploadedImageKey ?? "")
          : (labelTag.key ?? "");

      const editLabelTagData = {
        id: productId,
        action: "update_label_tags",
        tab: "label-tags",
        data: {
          id: labelTag._id,
          name: data.name,
          description: data.description,
          type: data.type,
          image: nextImage,
          key: nextKey,
          ...(uploadedImageSizeBytes
            ? { sizeBytes: uploadedImageSizeBytes }
            : {}),
        },
      };

      updateLabelTag(editLabelTagData, {
        onSuccess: () => {
          setOpen(false);
          reset();
          setNewLabelTagImage(null);
          setRemoveLabelTagImage(false);
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

  const handleCancel = () => {
    reset();
    setNewLabelTagImage(null);
    setRemoveLabelTagImage(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              size="icon-xs"
              variant="outline"
              disabled={isSubmitted}
              aria-label="Edit label"
            >
              <Icon icon={PropertyEditIcon} size={14} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent side="bottom">
          {isSubmitted
            ? "Submitted products can't be edited"
            : "Edit label"}
        </TooltipContent>
      </Tooltip>
      <AppDialogContent
        title="Edit Label"
        description="Edit the label details and upload a new image."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Update Label",
          loadingLabel: isPending ? "Updating..." : "Uploading...",
          form: `edit-label-tag-form-${id}`,
          type: "submit",
          loading: isSaving,
          disabled: isSaving || isSubmitted,
          icon: CheckmarkCircle01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          icon: Cancel01Icon,
          onClick: handleCancel,
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          id={`edit-label-tag-form-${id}`}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field>
              <LabelTagImageUpload
                key={`${labelTag._id}-${open ? "open" : "closed"}`}
                imageUrl={labelTag.image}
                setNewLabelTagImage={setNewLabelTagImage}
                setRemoveLabelTagImage={setRemoveLabelTagImage}
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

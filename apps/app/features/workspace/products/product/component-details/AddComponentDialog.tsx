"use client";

import { useId, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
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
import { ComponentImageUpload } from "./ComponentImageUpload";

type FormData = {
  componentNumber: string;
  componentDescription: string;
  labelType: Tag[];
  dimensions: string;
  componentType: string;
};

export default function AddComponentDialog({
  productId,
  isSubmitted = false,
}: {
  productId: string;
  isSubmitted?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [componentImage, setComponentImage] = useState<File | null>(null);
  const [labelType, setLabelType] = useState<Tag[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      labelType: [],
      dimensions: "",
      componentType: "",
    },
  });
  const { mutate: addComponent, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadFilesToS3();

  const isSaving = isPending || isUploadingImage || uploadingImage;

  const onSubmit = async (data: FormData) => {
    try {
      setUploadingImage(true);
      let uploadRes;

      if (componentImage) {
        uploadRes = await uploadImage({
          file: componentImage,
          contentType: componentImage.type,
          uploadScope: "product-assets",
          productId,
        });
      }
      setUploadingImage(false);

      const newComponentData = {
        id: productId,
        action: "add_label_component",
        tab: "label-components",
        data: [
          {
            component_number: data.componentNumber,
            key: uploadRes?.key,
            sizeBytes: uploadRes?.size,
            component_description: data.componentDescription,
            label_type: (Array.isArray(labelType)
              ? labelType
              : JSON.parse(labelType || "[]")
            ).map((tag: Tag) => tag.text),
            dimensions: data.dimensions,
            component_type: data.componentType,
          },
        ],
      };

      addComponent(newComponentData, {
        onSuccess: () => {
          setOpen(false);
          reset();
          setLabelType([]);
          setComponentImage(null);
        },
        onError: () => {
          setOpen(false);
          reset();
          setLabelType([]);
          setComponentImage(null);
        },
      });
    } catch (error) {
      console.error("Failed to add component:", error);
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    reset();
    setLabelType([]);
    setComponentImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary" disabled={isSubmitted}>
              <Icon icon={PlusSignSquareIcon} />
              Add Component
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent side="bottom">
          {isSubmitted
            ? "Submitted products can't be edited"
            : "Add a new label component"}
        </TooltipContent>
      </Tooltip>
      <AppDialogContent
        title="Add New Component"
        description="Add a new component by providing component details and uploading an image."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Add Component",
          loadingLabel: isPending ? "Adding..." : "Uploading...",
          form: `add-component-form-${id}`,
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
          id={`add-component-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field>
              <ComponentImageUpload setNewComponentImage={setComponentImage} />
            </Field>

            <Field data-invalid={!!errors.componentNumber}>
              <FormFieldLabel
                htmlFor={`${id}-component-number`}
                label="Component Number"
                tooltip="A unique identifier or reference number for this label component."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-component-number`}
                  placeholder="Enter component number"
                  type="text"
                  aria-invalid={errors.componentNumber ? "true" : "false"}
                  {...register("componentNumber", {
                    required: "Component number is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.componentNumber]} />
            </Field>

            <Field data-invalid={!!errors.componentType}>
              <FormFieldLabel
                htmlFor={`${id}-component-type`}
                label="Component Type"
                tooltip="Indicates whether the component is pre-printed, blank, or not applicable."
              />
              <Controller
                name="componentType"
                control={control}
                rules={{
                  required: "Component type is required",
                }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      id={`${id}-component-type`}
                      size="md"
                      className="w-full bg-background"
                    >
                      <SelectValue placeholder="Select component type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preprinted">Pre-printed</SelectItem>
                      <SelectItem value="Blank">Blank</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.componentType]} />
            </Field>

            <Field>
              <FormFieldLabel
                htmlFor={`${id}-description`}
                label="Description"
                tooltip="Describe the component's purpose, material, and specifications."
                optional
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupTextarea
                  id={`${id}-description`}
                  placeholder="Describe the component's purpose and specifications"
                  className="min-h-24 resize-none"
                  {...register("componentDescription")}
                />
              </InputGroup>
            </Field>

            <Field>
              <FormFieldLabel
                htmlFor={`${id}-dimensions`}
                label="Dimensions"
                tooltip="Physical dimensions of the component (e.g., width x height)."
                optional
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-dimensions`}
                  placeholder="Enter dimensions"
                  type="text"
                  {...register("dimensions")}
                />
              </InputGroup>
            </Field>

            <Field>
              <FormFieldLabel
                htmlFor={`${id}-label-type`}
                label="Label Type"
                tooltip="Label types associated with this component. Press Enter after each entry."
                optional
              />
              <TagInput
                id={`${id}-label-type`}
                tags={labelType}
                setTags={setLabelType}
                placeholder="Add label type and press Enter"
              />
              <input
                type="hidden"
                {...register("labelType")}
                value={JSON.stringify(labelType)}
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

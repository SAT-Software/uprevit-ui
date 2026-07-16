"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
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
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { ComponentImageUpload } from "./ComponentImageUpload";

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
  labelType: Tag[];
  dimensions: string;
  componentType: string;
};

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
  const [newComponentImage, setNewComponentImage] = useState<File | null>(null);
  const [removeComponentImage, setRemoveComponentImage] = useState(false);
  const buildTags = (labels: string[]) =>
    labels.map((text, index) => ({
      id: `tag-${index}-${text}`,
      text,
    }));
  const formDefaults = useMemo(
    () => ({
      componentNumber: component.component_number || "",
      componentDescription: component.component_description || "",
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
  } = useForm<FormData>({
    defaultValues: formDefaults,
  });
  const { mutate: updateComponent, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadFilesToS3();

  useEffect(() => {
    if (!open) return;
    reset(formDefaults);
    setNewComponentImage(null);
    setRemoveComponentImage(false);
  }, [formDefaults, open, reset]);

  const isSaving = isPending || isUploadingImage || uploadingImage;

  const onSubmit = async (data: FormData) => {
    try {
      setUploadingImage(true);
      let uploadedImageKey: string | undefined;
      let uploadedImageSizeBytes: number | undefined;

      if (newComponentImage) {
        const uploadRes = await uploadImage({
          file: newComponentImage,
          contentType: newComponentImage.type || "application/octet-stream",
          uploadScope: "product-assets",
          productId,
        });
        uploadedImageKey = uploadRes.key;
        uploadedImageSizeBytes = uploadRes.size;
      }
      setUploadingImage(false);

      const nextImage = removeComponentImage
        ? ""
        : newComponentImage
          ? ""
          : component.image;
      const nextKey = removeComponentImage
        ? ""
        : newComponentImage
          ? (uploadedImageKey ?? "")
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
            setNewComponentImage(null);
            setRemoveComponentImage(false);
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

  const handleCancel = () => {
    reset(formDefaults);
    setNewComponentImage(null);
    setRemoveComponentImage(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Edit Component"
        description="Edit component by updating component details and uploading a new image."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Update Component",
          loadingLabel: isPending ? "Updating..." : "Uploading...",
          form: `edit-component-form-${id}`,
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
        <form
          id={`edit-component-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field>
              <ComponentImageUpload
                imageUrl={component.image}
                setNewComponentImage={setNewComponentImage}
                setRemoveComponentImage={setRemoveComponentImage}
              />
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
                      <SelectItem value="Preprinted">Preprinted</SelectItem>
                      <SelectItem value="Pre-printed">Pre-printed</SelectItem>
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
              <Controller
                name="labelType"
                control={control}
                render={({ field }) => (
                  <TagInput
                    id={`${id}-label-type`}
                    tags={field.value || []}
                    setTags={field.onChange}
                    placeholder="Add label type and press Enter"
                  />
                )}
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

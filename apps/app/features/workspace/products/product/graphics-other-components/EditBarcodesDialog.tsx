"use client";

import { useEffect, useId, useState } from "react";
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
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@uprevit/ui/components/ui/command";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Tick01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { BARCODE_STANDARDS } from "@/data/barcode-standards";
import { cn } from "@uprevit/ui/lib/utils";
import { GraphicsImageUpload } from "./GraphicsImageUpload";

type Item = {
  id: string;
  componentName: string;
  componentImage: string;
  key?: string;
  description: string;
  labelPresence: string[];
  count?: number;
};

type FormData = {
  barcodeTypeSelect: string;
  barcodeTypeInput: string;
  componentDescription: string;
  labelPresence: Tag[];
  count: number;
};

export default function EditBarcodesDialog({
  productId,
  barcode,
  open,
  onOpenChange,
}: {
  productId: string;
  barcode: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const formId = `edit-barcodes-form-${id}`;
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newGraphicImage, setNewGraphicImage] = useState<File | null>(null);
  const [removeGraphicImage, setRemoveGraphicImage] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const isStandardBarcode = BARCODE_STANDARDS.some(
    (std) => std.name === barcode.componentName,
  );

  const buildTags = (labels: string[]) =>
    labels.map((label, index) => ({
      id: `tag-${index}-${label}`,
      text: label,
    }));

  const [labelPresence, setLabelPresence] = useState<Tag[]>(
    buildTags(barcode.labelPresence),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    clearErrors,
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: {
      barcodeTypeSelect: isStandardBarcode ? barcode.componentName : "",
      barcodeTypeInput: isStandardBarcode ? "" : barcode.componentName,
      componentDescription: barcode.description,
      labelPresence: buildTags(barcode.labelPresence),
      count: barcode.count ?? 1,
    },
  });

  const barcodeTypeSelect = watch("barcodeTypeSelect");
  const barcodeTypeInput = watch("barcodeTypeInput");

  useEffect(() => {
    const isStandard = BARCODE_STANDARDS.some(
      (std) => std.name === barcode.componentName,
    );

    reset({
      barcodeTypeSelect: isStandard ? barcode.componentName : "",
      barcodeTypeInput: isStandard ? "" : barcode.componentName,
      componentDescription: barcode.description,
      labelPresence: buildTags(barcode.labelPresence),
      count: barcode.count ?? 1,
    });
    setLabelPresence(buildTags(barcode.labelPresence));
    setNewGraphicImage(null);
    setRemoveGraphicImage(false);
  }, [barcode, reset]);

  const { mutate: updateBarcodesData, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();

  const isSaving = uploadingImage || isPending;

  const onSubmit = async (data: FormData) => {
    const componentName = data.barcodeTypeSelect || data.barcodeTypeInput;

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
          : barcode.componentImage;
      const nextKey = removeGraphicImage
        ? ""
        : newGraphicImage
          ? (uploadedImageKey ?? "")
          : (barcode.key ?? "");

      const updatedBarcodesData = {
        id: productId,
        action: "update_symbols_graphics",
        tab: "symbols-graphics",
        data: {
          id: barcode.id,
          text: componentName,
          image: nextImage,
          key: nextKey,
          ...(uploadedImageSizeBytes ? { sizeBytes: uploadedImageSizeBytes } : {}),
          entity: "Barcodes",
          description: data.componentDescription,
          label_presence: labelPresence.map((tag: Tag) => tag.text),
          count: data.count,
        },
      };

      updateBarcodesData(updatedBarcodesData, {
        onSuccess: () => {
          onOpenChange(false);
          setNewGraphicImage(null);
          setRemoveGraphicImage(false);
        },
        onError: () => {
          setUploadingImage(false);
        },
      });
    } catch (error) {
      console.error("Failed to update barcodes item:", error);
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    const isStandard = BARCODE_STANDARDS.some(
      (std) => std.name === barcode.componentName,
    );
    reset({
      barcodeTypeSelect: isStandard ? barcode.componentName : "",
      barcodeTypeInput: isStandard ? "" : barcode.componentName,
      componentDescription: barcode.description,
      labelPresence: buildTags(barcode.labelPresence),
      count: barcode.count ?? 1,
    });
    setLabelPresence(buildTags(barcode.labelPresence));
    setNewGraphicImage(null);
    setRemoveGraphicImage(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Edit Barcode"
        description="Edit barcodes item by updating details and uploading a new image."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Update Barcode",
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
                key={`${barcode.id}-${open ? "open" : "closed"}`}
                imageUrl={barcode.componentImage}
                label="Barcode Image"
                tooltip="Upload a reference image for this barcode."
                setNewImage={setNewGraphicImage}
                setRemoveImage={setRemoveGraphicImage}
              />
            </Field>

            <div
              className="space-y-3 rounded-lg border bg-muted/30 p-4"
              data-invalid={!!(errors.barcodeTypeSelect || errors.barcodeTypeInput)}
            >
              <FormFieldLabel
                label="Barcode Type"
                tooltip="Choose a standard barcode format from the list or enter a custom type."
              />
              <div className="space-y-2">
                <Field>
                  <FormFieldLabel
                    htmlFor={`${id}-barcode-select`}
                    label="Select from list"
                    className="text-xs text-muted-foreground"
                  />
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id={`${id}-barcode-select`}
                        type="button"
                        variant="outline"
                        size="default"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="w-full justify-between bg-background font-normal text-foreground/80"
                        disabled={!!barcodeTypeInput}
                      >
                        <span className="truncate">
                          {barcodeTypeSelect || "Select barcode type..."}
                        </span>
                        <Icon
                          icon={UnfoldMoreIcon}
                          size={16}
                          strokeWidth={2}
                          className="ml-2 shrink-0 opacity-50"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <Command>
                        <CommandInput placeholder="Search barcode type..." />
                        <CommandList>
                          <CommandEmpty>No barcode type found.</CommandEmpty>
                          <CommandGroup>
                            {BARCODE_STANDARDS.map((framework) => (
                              <CommandItem
                                key={framework.name}
                                value={framework.name}
                                onSelect={(currentValue) => {
                                  setValue(
                                    "barcodeTypeSelect",
                                    currentValue === barcodeTypeSelect
                                      ? ""
                                      : currentValue,
                                    { shouldValidate: true },
                                  );
                                  clearErrors("barcodeTypeInput");
                                  setComboboxOpen(false);
                                }}
                              >
                                <Icon
                                  icon={Tick01Icon}
                                  size={16}
                                  strokeWidth={2}
                                  className={cn(
                                    "mr-2",
                                    barcodeTypeSelect === framework.name
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {framework.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Field>

                <div className="flex items-center gap-2 py-1">
                  <div className="h-0 w-full border-t border-dashed border-border" />
                  <p className="shrink-0 px-2 text-[10px] font-light uppercase text-muted-foreground">
                    OR
                  </p>
                  <div className="h-0 w-full border-t border-dashed border-border" />
                </div>

                <Field data-invalid={!!errors.barcodeTypeInput}>
                  <FormFieldLabel
                    htmlFor={`${id}-barcode-type-input`}
                    label="Enter custom"
                    className="text-xs text-muted-foreground"
                  />
                  <InputGroup size="md" className="bg-background">
                    <InputGroupInput
                      id={`${id}-barcode-type-input`}
                      placeholder="Enter custom barcode type"
                      type="text"
                      disabled={!!barcodeTypeSelect}
                      aria-invalid={errors.barcodeTypeInput ? "true" : "false"}
                      {...register("barcodeTypeInput", {
                        validate: (value) => {
                          const selectValue = watch("barcodeTypeSelect");
                          if (!value && !selectValue) {
                            return "Please select a barcode type or enter one manually.";
                          }
                          return true;
                        },
                      })}
                    />
                  </InputGroup>
                </Field>
              </div>
              <FieldError
                errors={[
                  errors.barcodeTypeSelect || errors.barcodeTypeInput
                    ? {
                        message:
                          "Please select a barcode type or enter one manually.",
                      }
                    : undefined,
                ]}
              />
            </div>

            <Field data-invalid={!!errors.componentDescription}>
              <FormFieldLabel
                htmlFor={`${id}-component-description`}
                label="Barcode Data"
                tooltip="The encoded data or content represented by this barcode."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupTextarea
                  id={`${id}-component-description`}
                  placeholder="Enter barcode data/content"
                  className="min-h-20 resize-none"
                  aria-invalid={
                    errors.componentDescription ? "true" : "false"
                  }
                  {...register("componentDescription", {
                    required: "Barcode data is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.componentDescription]} />
            </Field>

            <Field>
              <FormFieldLabel
                htmlFor={`${id}-label-presence`}
                label="Presence on labels"
                tooltip="Label types where this barcode appears. Press Enter after each entry."
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

            <Field data-invalid={!!errors.count}>
              <FormFieldLabel
                htmlFor={`${id}-count`}
                label="Count"
                tooltip="Number of barcodes of this type on the product labels."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-count`}
                  type="number"
                  min={1}
                  aria-invalid={errors.count ? "true" : "false"}
                  {...register("count", {
                    required: "Count is required",
                    min: { value: 1, message: "Count must be at least 1" },
                    valueAsNumber: true,
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.count]} />
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}

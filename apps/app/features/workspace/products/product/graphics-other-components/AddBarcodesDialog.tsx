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
  PlusSignSquareIcon,
  Tick01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { BARCODE_STANDARDS } from "@/data/barcode-standards";
import { cn } from "@uprevit/ui/lib/utils";
import { GraphicsImageUpload } from "./GraphicsImageUpload";

type FormData = {
  barcodeTypeSelect: string;
  barcodeTypeInput: string;
  componentDescription: string;
  labelPresence: Tag[];
  count: number;
};

export default function AddBarcodesDialog({
  productId,
  isSubmitted = false,
}: {
  productId: string;
  isSubmitted?: boolean;
}) {
  const id = useId();
  const formId = `add-barcodes-form-${id}`;
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [graphicImage, setGraphicImage] = useState<File | null>(null);
  const [labelPresence, setLabelPresence] = useState<Tag[]>([]);
  const [comboboxOpen, setComboboxOpen] = useState(false);

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
      barcodeTypeSelect: "",
      barcodeTypeInput: "",
      labelPresence: [],
      count: 1,
    },
  });

  const barcodeTypeSelect = watch("barcodeTypeSelect");
  const barcodeTypeInput = watch("barcodeTypeInput");

  const { mutate: addBarcodesData, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();

  const isSaving = uploadingImage || isPending;

  const onSubmit = async (data: FormData) => {
    const componentName = data.barcodeTypeSelect || data.barcodeTypeInput;

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

      const newBarcodesData = {
        id: productId,
        action: "add_symbols_graphics",
        tab: "symbols-graphics",
        data: [
          {
            text: componentName,
            image: null,
            key: uploadedImageKey,
            sizeBytes: uploadedImageSizeBytes,
            entity: "Barcodes",
            label_presence: labelPresence.map((tag: Tag) => tag.text),
            description: data.componentDescription,
            count: data.count,
          },
        ],
      };

      addBarcodesData(newBarcodesData, {
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
      console.error("Failed to add barcodes item:", error);
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
          Add Barcode
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Add New Barcode"
        description="Add a new barcodes item by providing details and uploading an image."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Add Barcode",
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
                label="Barcode Image"
                tooltip="Upload a reference image for this barcode."
                setNewImage={setGraphicImage}
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

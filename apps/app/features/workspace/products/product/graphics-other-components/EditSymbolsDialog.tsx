"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@uprevit/ui/components/ui/radio-group";
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
  symbolsTextPresent: string[];
  textPresent: boolean;
  standard_symbol_id?: string;
  standard_ref_number?: string;
};

type FormData = {
  componentName: string;
  textPresent: string;
  labelPresence: Tag[];
};

export default function EditSymbolsDialog({
  productId,
  symbol,
  open,
  onOpenChange,
}: {
  productId: string;
  symbol: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const formId = `edit-symbols-form-${id}`;
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
      componentName: symbol.componentName,
      textPresent: symbol.textPresent ? "yes" : "no",
      labelPresence: buildTags(symbol.symbolsTextPresent),
    }),
    [symbol.componentName, symbol.symbolsTextPresent, symbol.textPresent],
  );
  const [labelPresence, setLabelPresence] = useState<Tag[]>(
    formDefaults.labelPresence,
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: formDefaults,
  });

  const watchedComponentName = watch("componentName");
  const isStandardLinked = Boolean(
    symbol.standard_symbol_id || symbol.standard_ref_number,
  );
  const standardCoreFieldsChanged =
    isStandardLinked &&
    ((watchedComponentName ?? "").trim() !== symbol.componentName.trim() ||
      newGraphicImage !== null ||
      removeGraphicImage);

  useEffect(() => {
    if (!open) return;
    reset(formDefaults);
    setLabelPresence(formDefaults.labelPresence);
    setNewGraphicImage(null);
    setRemoveGraphicImage(false);
  }, [formDefaults, open, reset]);

  const { mutate: updateSymbolsData, isPending } = useUpdateProductTabData();
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
          : symbol.componentImage;
      const nextKey = removeGraphicImage
        ? ""
        : newGraphicImage
          ? (uploadedImageKey ?? "")
          : (symbol.key ?? "");

      const updatedSymbolsData = {
        id: productId,
        action: "update_symbols_graphics",
        tab: "symbols-graphics",
        data: {
          id: symbol.id,
          text: data.componentName,
          image: nextImage,
          key: nextKey,
          ...(uploadedImageSizeBytes ? { sizeBytes: uploadedImageSizeBytes } : {}),
          entity: "Symbols",
          text_present: data.textPresent === "yes",
          label_presence: labelPresence.map((tag: Tag) => tag.text),
        },
      };

      updateSymbolsData(updatedSymbolsData, {
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
      console.error("Failed to update symbols item:", error);
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
        title="Edit Symbol"
        description="Edit symbols item by updating details and uploading a new image."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Update Symbol",
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
                key={`${symbol.id}-${open ? "open" : "closed"}`}
                imageUrl={symbol.componentImage}
                label="Symbol Image"
                tooltip="Upload a reference image for this symbol."
                setNewImage={setNewGraphicImage}
                setRemoveImage={setRemoveGraphicImage}
              />
            </Field>

            <Field data-invalid={!!errors.componentName}>
              <FormFieldLabel
                htmlFor={`${id}-component-name`}
                label="Symbol Text"
                tooltip="The text displayed for this symbol on the label."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-component-name`}
                  placeholder="Enter symbol text"
                  type="text"
                  aria-invalid={errors.componentName ? "true" : "false"}
                  {...register("componentName", {
                    required: "Symbol text is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.componentName]} />
            </Field>

            {standardCoreFieldsChanged ? (
              <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                Changing the symbol text or image will convert this
                standard-library symbol into a custom product symbol and remove
                its standard reference.
              </div>
            ) : null}

            <Field>
              <FormFieldLabel
                label="Symbol text present"
                tooltip="Whether the symbol includes visible text on the label."
              />
              <Controller
                name="textPresent"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="yes"
                        id={`${id}-text-present-yes`}
                      />
                      <Label htmlFor={`${id}-text-present-yes`}>Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="no"
                        id={`${id}-text-present-no`}
                      />
                      <Label htmlFor={`${id}-text-present-no`}>No</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </Field>

            <Field>
              <FormFieldLabel
                htmlFor={`${id}-label-presence`}
                label="Presence on labels"
                tooltip="Label types where this symbol appears. Press Enter after each entry."
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

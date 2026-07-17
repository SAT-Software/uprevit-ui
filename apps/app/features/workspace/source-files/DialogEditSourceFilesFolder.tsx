"use client";

import { useId, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { ProductCombobox } from "@/components/common/ProductCombobox";
import { useUpdateSourceFilesFolder } from "@/hooks/source-files/useUpdateSourceFilesFolder";
import { SourceFilesFolder } from "@/types/source-files";
import { SourceFilesDuplicateProductLinkAlert } from "@/features/workspace/source-files/SourceFilesDuplicateProductLinkAlert";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  PropertyEditIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

interface FormValues {
  folderName: string;
}

export default function DialogEditSourceFilesFolder({
  currentFolder,
  folderId,
  linkedProductName,
}: {
  currentFolder: SourceFilesFolder;
  folderId: string;
  linkedProductName?: string;
}) {
  const formId = useId();
  const productComboboxId = useId();
  const { mutate: updateSourceFilesFolder, isPending } =
    useUpdateSourceFilesFolder(folderId);
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const isRootFolder = currentFolder?.parentId == null;
  const initialProductId = currentFolder?.product_id || "";
  const productLinkChanged = selectedProductId !== initialProductId;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
  });

  const folderName = watch("folderName");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const trimmedName = data.folderName.trim();
    const payload: {
      id: string;
      name?: string;
      product_id?: string | null;
    } = { id: currentFolder._id };

    if (trimmedName !== currentFolder.name) {
      payload.name = trimmedName;
    }

    if (isRootFolder) {
      const nextProductId = selectedProductId || null;
      const currentProductId = currentFolder.product_id || null;
      if (nextProductId !== currentProductId) {
        payload.product_id = nextProductId;
      }
    }

    if (
      !payload.name &&
      !Object.prototype.hasOwnProperty.call(payload, "product_id")
    ) {
      setOpen(false);
      return;
    }

    updateSourceFilesFolder(payload, {
      onSuccess: () => {
        reset();
        setSelectedProductId("");
        setSelectedProductName("");
        setOpen(false);
      },
    });
  };

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setSelectedProductId(currentFolder?.product_id || "");
      setSelectedProductName(linkedProductName ?? "");
      return;
    }
    reset();
    setSelectedProductId("");
    setSelectedProductName("");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Edit folder"
        >
          <Icon icon={PropertyEditIcon} />
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Edit Folder"
        description="Update the name for the folder."
        variant="form"
        size="md"
        primaryAction={{
          label: "Update Folder",
          loadingLabel: "Updating...",
          form: formId,
          type: "submit",
          loading: isPending,
          disabled: (!folderName && !currentFolder?.name) || isPending,
          icon: Tick01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="gap-4 p-4">
            <Field data-invalid={!!errors.folderName}>
              <FormFieldLabel
                htmlFor={`${formId}-folder-name`}
                label="Folder Name"
                tooltip="Update the folder name."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${formId}-folder-name`}
                  placeholder="e.g. 'Marketing Materials'"
                  defaultValue={currentFolder?.name}
                  aria-invalid={errors.folderName ? "true" : "false"}
                  {...register("folderName", {
                    required: "Folder name is required.",
                  })}
                />
              </InputGroup>
              {errors.folderName ? (
                <FieldError>{errors.folderName.message}</FieldError>
              ) : null}
            </Field>
            {isRootFolder ? (
              <Field>
                <FormFieldLabel
                  htmlFor={productComboboxId}
                  label="Linked Product"
                  optional
                  tooltip="Optionally link this folder to a product."
                />
                <ProductCombobox
                  id={productComboboxId}
                  value={selectedProductId}
                  onValueChange={(productId, product) => {
                    setSelectedProductId(productId);
                    setSelectedProductName(product?.product_name ?? "");
                  }}
                  allowNone
                  enabled={open}
                  placeholder="Select a product"
                  initialSelectedLabel={linkedProductName}
                />
                {selectedProductId && productLinkChanged ? (
                  <SourceFilesDuplicateProductLinkAlert
                    productId={selectedProductId}
                    productName={selectedProductName}
                    excludeFolderId={currentFolder._id}
                  />
                ) : null}
              </Field>
            ) : null}
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}

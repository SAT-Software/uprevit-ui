"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useId, useState } from "react";
import { useAuth } from "react-oidc-context";

import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { ProductCombobox } from "@/components/common/ProductCombobox";
import { useAddSourceFilesFolder } from "@/hooks/source-files/useAddSourceFilesFolder";
import { SourceFilesDuplicateProductLinkAlert } from "@/features/workspace/source-files/SourceFilesDuplicateProductLinkAlert";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  FolderAddIcon,
} from "@hugeicons/core-free-icons";

interface FormValues {
  folderName: string;
}

export default function DialogAddProductFolder({
  parentId,
  folderId,
}: {
  parentId?: string;
  folderId?: string;
}) {
  const formId = useId();
  const productComboboxId = useId();
  const { mutate: addSourceFilesFolder, isPending } =
    useAddSourceFilesFolder(folderId);
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const workspaceId = auth?.user?.profile?.workspaceId;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      folderName: "",
    },
    mode: "onSubmit",
  });

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");

  const folderName = watch("folderName");
  const isRootFolder = !parentId;

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const sourceFilesFolderData = {
      workspace_id: workspaceId as string,
      name: data.folderName,
      type: "folder",
      parentId: parentId,
      ...(selectedProductId && { product_id: selectedProductId }),
    };

    addSourceFilesFolder(sourceFilesFolderData, {
      onSuccess: () => {
        reset();
        setSelectedProductId("");
        setSelectedProductName("");
        setOpen(false);
      },
      onError: () => {
        reset();
        setSelectedProductId("");
        setSelectedProductName("");
        setOpen(false);
      },
    });
  };

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
      setSelectedProductId("");
      setSelectedProductName("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="[&_svg]:text-muted-foreground/60 hover:[&_svg]:text-foreground"
        >
          <Icon icon={FolderAddIcon} />
          Add Folder
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Add New Folder"
        description="Enter a name for the new folder in your source files."
        variant="form"
        size="md"
        primaryAction={{
          label: "Add Folder",
          loadingLabel: "Adding...",
          form: formId,
          type: "submit",
          loading: isPending,
          disabled: !folderName || isPending,
          icon: FolderAddIcon,
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
                tooltip="Enter a name for the new folder."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${formId}-folder-name`}
                  placeholder="e.g. 'Marketing Materials'"
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
                  label="Link to Product"
                  optional
                  tooltip="Optionally link this folder to a product for quick access."
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
                />
                {selectedProductId ? (
                  <SourceFilesDuplicateProductLinkAlert
                    productId={selectedProductId}
                    productName={selectedProductName}
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

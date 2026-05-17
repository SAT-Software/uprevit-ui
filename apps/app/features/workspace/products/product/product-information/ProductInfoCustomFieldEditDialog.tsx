"use client";

import { useId, useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@uprevit/ui/components/ui/alert-dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { toast } from "sonner";
import {
  PiPencilLineDuotone,
  PiCheckCircleDuotone,
  PiXCircleDuotone,
  PiPlusCircleDuotone,
  PiPencilCircleDuotone,
  PiTrashDuotone,
} from "react-icons/pi";
import { ProductMetadata } from "@/types/product";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

// Interface that matches the actual API response structure
interface ProductData {
  id?: string;
  custom_fields?: Array<{
    _id?: string;
    parent_id?: string | null;
    label: string;
    value: string;
  }>;
}

interface CustomField {
  label: string;
  value: string;
}

interface FormValues {
  customFields: CustomField[];
}

interface CustomFieldEditDialogProps {
  product: ProductData;
  productMetadata: ProductMetadata;
  customFieldsData: Array<{
    _id: string;
    parent_id?: string | null;
    label: string;
    value: string;
  }>;
}

export default function ProductInformationCustomFieldEditDialog({
  product,
  productMetadata,
  customFieldsData,
}: CustomFieldEditDialogProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);
  const [deleteFieldOpen, setDeleteFieldOpen] = useState(false);
  const { mutate: updateProductTabData, isPending } = useUpdateProductTabData();
  const isSubmitted = productMetadata?.status === "submitted";

  // Initialize form with react-hook-form and field array for new fields
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      customFields: [{ label: "", value: "" }],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  });

  // Form for managing existing fields
  const {
    register: registerManage,
    control: controlManage,
    reset: resetManage,
    getValues: getValuesManage,
    formState: { errors: errorsManage },
  } = useForm<{
    existingFields: Array<{
      _id: string;
      parent_id?: string | null;
      label: string;
      value: string;
    }>;
  }>({
    defaultValues: {
      existingFields: [],
    },
  });

  const { fields: manageFields } = useFieldArray({
    control: controlManage,
    name: "existingFields",
  });

  // Sync manage form with product data
  useEffect(() => {
    if (customFieldsData) {
      resetManage({
        existingFields: customFieldsData.map((f) => ({
          _id: f._id || "",
          parent_id: f.parent_id ?? null,
          label: f.label,
          value: f.value,
        })),
      });
    }
  }, [customFieldsData, resetManage]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isSubmitted) {
      return;
    }

    if (!product?.id) {
      toast.error("Product ID is missing");
      return;
    }

    // Filter out empty fields
    const validFields = data.customFields.filter(
      (field) => field.label.trim() !== "" || field.value.trim() !== ""
    );

    if (validFields.length === 0) {
      toast.error("No valid fields to add");
      return;
    }

    const updateData = {
      id: product.id,
      action: "add_custom_field",
      tab: "product-information",
      data: [
        {
          label: validFields[0].label,
          value: validFields[0].value,
        },
      ],
    };

    updateProductTabData(updateData, {
      onSuccess: () => {
        reset();
        setOpen(false);
        remove(fields.length - 1);
        append({ label: "", value: "" });
      },
      onError: () => {
        reset();
        setOpen(false);
      },
    });
  };

  const handleUpdateCustomField = async (
    fieldId: string,
    label: string,
    value: string
  ) => {
    if (isSubmitted) {
      return;
    }

    if (!product?.id) {
      toast.error("Product ID is missing");
      return;
    }

    // Send all custom fields data instead of just the updated field
    const allCustomFields = customFieldsData?.map((field) =>
      field._id === fieldId ? { ...field, label: label, value: value } : field
    );

    const updateData = {
      id: product.id,
      action: "update_custom_field",
      tab: "product-information",
      data:
        allCustomFields?.map((field) => ({
          id: field._id!,
          label: field.label,
          value: field.value,
        })) || [],
    };

    updateProductTabData(updateData, {
      onSuccess: () => {
        toast.success("Custom field updated successfully");
        reset();
        setOpen(false);
      },
      onError: () => {
        reset();
        setOpen(false);
      },
    });
  };

  const handleDeleteCustomField = async (fieldId: string) => {
    if (isSubmitted) {
      return;
    }

    if (!product?.id) {
      toast.error("Product ID is missing");
      return;
    }

    console.log("Deleting custom field with ID:", fieldId);

    const deleteData = {
      id: product.id,
      action: "delete_custom_field",
      tab: "product-information",
      data: {
        id: fieldId,
      },
    };

    updateProductTabData(deleteData, {
      onSuccess: () => {
        toast.success("Custom field deleted successfully");
        reset();
        setOpen(false);
        setDeleteFieldOpen(true);
      },
      onError: () => {
        reset();
        setOpen(false);
        setDeleteFieldOpen(true);
      },
    });
  };

  const removeCustomField = (index: number) => {
    remove(index);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="flex items-center gap-2"
          disabled={isSubmitted}
        >
          <PiPencilLineDuotone className="w-4 h-4" />
          Manage Custom Fields
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-2xl max-h-[90vh] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Manage Custom Fields</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Manage custom fields for product information.
        </DialogDescription>

        {/* Tab Navigation */}
        <div className="border-b px-4 py-3 bg-muted/5">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeTab === "add" ? "secondary" : "outline"}
              onClick={() => setActiveTab("add")}
            >
              <PiPlusCircleDuotone className="h-4 w-4 mr-1" />
              Add New Field
            </Button>
            <Button
              size="sm"
              variant={activeTab === "manage" ? "secondary" : "outline"}
              onClick={() => setActiveTab("manage")}
            >
              <PiPencilCircleDuotone className="h-4 w-4 mr-1" />
              Manage Existing Fields
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "add" ? (
            <form
              id={`edit-custom-fields-form-${id}`}
              className="p-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-3 p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-muted-foreground">
                        New Field
                      </span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(index)}
                          className="h-6 w-6 p-0"
                        >
                          <PiXCircleDuotone className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`${id}-field-name-${index}`}
                        className="text-sm"
                      >
                        Label
                      </Label>
                      <Input
                        id={`${id}-field-name-${index}`}
                        placeholder="Enter label"
                        type="text"
                        {...register(`customFields.${index}.label` as const, {
                          required: "Label is required",
                        })}
                      />
                      {errors.customFields?.[index]?.label && (
                        <p role="alert" className="text-xs text-destructive">
                          {errors.customFields[index]?.label?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`${id}-field-value-${index}`}
                        className="text-sm"
                      >
                        Value
                      </Label>
                      <Input
                        id={`${id}-field-value-${index}`}
                        placeholder="Enter value"
                        type="text"
                        {...register(`customFields.${index}.value` as const, {
                          required: "Value is required",
                        })}
                      />
                      {errors.customFields?.[index]?.value && (
                        <p role="alert" className="text-xs text-destructive">
                          {errors.customFields[index]?.value?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          ) : (
            <form className="p-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                {manageFields.length > 0 ? (
                  manageFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="space-y-3 p-4 border rounded-lg bg-muted/30"
                    >
                      <div className="space-y-2">
                        <Label className="text-sm">Field Label</Label>
                        <Input
                          placeholder="Enter field label"
                          type="text"
                          {...registerManage(
                            `existingFields.${index}.label` as const,
                            { required: "Label is required" }
                          )}
                        />
                        {errorsManage.existingFields?.[index]?.label && (
                          <p role="alert" className="text-xs text-destructive">
                            {errorsManage.existingFields[index]?.label?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Field Value</Label>
                        <Input
                          placeholder="Enter field value"
                          type="text"
                          {...registerManage(
                            `existingFields.${index}.value` as const,
                            { required: "Value is required" }
                          )}
                        />
                        {errorsManage.existingFields?.[index]?.value && (
                          <p role="alert" className="text-xs text-destructive">
                            {errorsManage.existingFields[index]?.value?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const data = getValuesManage(
                              `existingFields.${index}`
                            );
                            handleUpdateCustomField(
                              data._id,
                              data.label,
                              data.value
                            );
                          }}
                          disabled={isPending || isSubmitted}
                        >
                          <PiCheckCircleDuotone className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeleteFieldId(field._id);
                            setDeleteFieldOpen(true);
                          }}
                          disabled={isPending || isSubmitted}
                        >
                          <PiTrashDuotone className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      No custom fields available.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Switch to &quot;Add New Field&quot; tab to create your
                      first custom field.
                    </p>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone />
              Close
            </Button>
          </DialogClose>
          {activeTab === "add" && (
            <Button
              type="submit"
              form={`edit-custom-fields-form-${id}`}
              disabled={isPending || isSubmitted}
              aria-busy={isPending}
              size="sm"
            >
              {isPending ? (
                <Spinner className="w-4 h-4 mr-1" />
              ) : (
                <PiCheckCircleDuotone className="w-4 h-4 mr-1" />
              )}
              {isPending ? "Adding..." : "Add Field(s)"}
            </Button>
          )}
        </DialogFooter>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog open={deleteFieldOpen} onOpenChange={setDeleteFieldOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this custom field? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteFieldId) {
                    handleDeleteCustomField(deleteFieldId);
                    setDeleteFieldId(null);
                  }
                }}
                disabled={isPending || isSubmitted}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {isPending ? "Deleting..." : "Delete Field"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

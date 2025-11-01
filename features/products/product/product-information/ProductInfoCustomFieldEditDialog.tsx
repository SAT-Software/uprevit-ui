"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Edit, Trash2, Save } from "lucide-react";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { toast } from "sonner";

// Interface that matches the actual API response structure
interface ProductData {
  id?: string;
  custom_fields?: Array<{
    _id?: string;
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
}

export default function ProductInformationCustomFieldEditDialog({
  product,
}: CustomFieldEditDialogProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");
  const [localCustomFields, setLocalCustomFields] = useState(
    product?.custom_fields || []
  );
  const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);
  const [deleteFieldOpen, setDeleteFieldOpen] = useState(false);
  const { mutate: updateProductTabData, isPending } = useUpdateProductTabData();

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
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
        // Reset to single empty field
        remove(fields.length - 1);
        append({ label: "", value: "" });
      },
      onError: () => {
        toast.error("Failed to create custom field");
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
    if (!product?.id) {
      toast.error("Product ID is missing");
      return;
    }

    // Send all custom fields data instead of just the updated field
    const allCustomFields = localCustomFields.map((field) =>
      field._id === fieldId ? { ...field, label: label, value: value } : field
    );

    const updateData = {
      id: product.id,
      action: "update_custom_field",
      tab: "product-information",
      data: allCustomFields.map((field) => ({
        field_id: field._id!,
        label: field.label,
        value: field.value,
      })),
    };

    updateProductTabData(updateData, {
      onSuccess: () => {
        // Update local state immediately for better UX
        setLocalCustomFields(allCustomFields);
        toast.success("Custom field updated successfully");
        reset();
        setOpen(false);
      },
      onError: () => {
        toast.error("Failed to update custom field");
        reset();
        setOpen(false);
      },
    });
  };

  const handleDeleteCustomField = async (fieldId: string) => {
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
        // Update local state immediately for better UX
        setLocalCustomFields((prev) =>
          prev.filter((field) => field._id !== fieldId)
        );
        toast.success("Custom field deleted successfully");
        reset();
        setOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete custom field");
        reset();
        setOpen(false);
      },
    });
  };

  const removeCustomField = (index: number) => {
    remove(index);
  };

  // Handle input changes for existing fields
  const handleExistingFieldChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setLocalCustomFields((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Handle individual field update
  const handleIndividualFieldUpdate = (field: {
    _id?: string;
    field_name: string;
    field_value: string;
  }) => {
    if (!field._id) return;

    handleUpdateCustomField(field._id, field.field_name, field.field_value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="text-xs">
          Manage Custom Fields
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-2xl max-h-[90vh] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Manage Custom Fields
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Manage custom fields for product information.
        </DialogDescription>

        {/* Tab Navigation */}
        <div className="border-b px-6 py-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeTab === "add" ? "default" : "outline"}
              onClick={() => setActiveTab("add")}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add New Field
            </Button>
            <Button
              size="sm"
              variant={activeTab === "manage" ? "default" : "outline"}
              onClick={() => setActiveTab("manage")}
            >
              <Edit className="h-3 w-3 mr-1" />
              Manage Existing Fields
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "add" ? (
            /* Add New Field Tab */
            <form
              id={`edit-custom-fields-form-${id}`}
              className="p-6"
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
                      <span className="text-sm font-medium text-muted-foreground">
                        New Field {index + 1}
                      </span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
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
            /* Manage Existing Fields Tab */
            <form className="p-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                {localCustomFields && localCustomFields.length > 0 ? (
                  localCustomFields.map((field, index) => (
                    <div
                      key={field._id}
                      className="space-y-3 p-4 border rounded-lg bg-muted/30"
                    >
                      <div className="space-y-2">
                        <Label className="text-sm">Field Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) =>
                            handleExistingFieldChange(
                              index,
                              "label",
                              e.target.value
                            )
                          }
                          placeholder="Enter field label"
                          type="text"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Field Value</Label>
                        <Input
                          value={field.value}
                          onChange={(e) =>
                            handleExistingFieldChange(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                          placeholder="Enter field value"
                          type="text"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleIndividualFieldUpdate({
                              _id: field._id,
                              field_name: field.label,
                              field_value: field.value,
                            })
                          }
                          disabled={isPending}
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Update
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setDeleteFieldId(field._id!);
                            setDeleteFieldOpen(true);
                          }}
                          disabled={isPending}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
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

        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          {activeTab === "add" && (
            <Button
              type="submit"
              form={`edit-custom-fields-form-${id}`}
              disabled={isPending}
              aria-busy={isPending}
            >
              <Save className="h-3 w-3 mr-1" />
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
                    setDeleteFieldOpen(false);
                    setDeleteFieldId(null);
                  }
                }}
                disabled={isPending}
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

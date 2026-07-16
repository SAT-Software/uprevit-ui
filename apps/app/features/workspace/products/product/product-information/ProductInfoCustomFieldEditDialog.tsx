"use client";

import { useId, useState, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { toast } from "sonner";
import { ProductMetadata } from "@/types/product";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Alert01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  PencilEdit01Icon,
  PlusSignSquareIcon,
  Settings05Icon,
} from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";

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

    const validFields = data.customFields.filter(
      (field) => field.label.trim() !== "" || field.value.trim() !== "",
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
    value: string,
  ) => {
    if (isSubmitted) {
      return;
    }

    if (!product?.id) {
      toast.error("Product ID is missing");
      return;
    }

    const allCustomFields = customFieldsData?.map((field) =>
      field._id === fieldId ? { ...field, label: label, value: value } : field,
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
        setDeleteFieldOpen(false);
        setDeleteFieldId(null);
      },
      onError: () => {
        reset();
        setOpen(false);
        setDeleteFieldOpen(false);
        setDeleteFieldId(null);
      },
    });
  };

  const removeCustomField = (index: number) => {
    remove(index);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" disabled={isSubmitted}>
                  <Icon icon={Settings05Icon} />
                  Manage Custom Fields
                </Button>
              </DialogTrigger>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isSubmitted
              ? "Submitted products can't be edited"
              : "Add and manage custom fields"}
          </TooltipContent>
        </Tooltip>
        <AppDialogContent
          title="Manage Custom Fields"
          description="Manage custom fields for product information."
          variant="form"
          size="xl"
          headerExtra={
            <div className="border-b bg-muted/5 px-4 py-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={activeTab === "add" ? "secondary" : "outline"}
                  onClick={() => setActiveTab("add")}
                >
                  <Icon icon={PlusSignSquareIcon} size={16} strokeWidth={2} />
                  Add New Field
                </Button>
                <Button
                  size="sm"
                  variant={activeTab === "manage" ? "secondary" : "outline"}
                  onClick={() => setActiveTab("manage")}
                >
                  <Icon icon={PencilEdit01Icon} size={16} strokeWidth={2} />
                  Manage Existing Fields
                </Button>
              </div>
            </div>
          }
          primaryAction={
            activeTab === "add"
              ? {
                  label: "Add Field(s)",
                  loadingLabel: "Adding...",
                  form: `edit-custom-fields-form-${id}`,
                  type: "submit",
                  loading: isPending,
                  disabled: isPending || isSubmitted,
                  icon: CheckmarkCircle01Icon,
                }
              : undefined
          }
          secondaryAction={{
            label: "Close",
            icon: Cancel01Icon,
          }}
        >
          {activeTab === "add" ? (
            <form
              id={`edit-custom-fields-form-${id}`}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <FieldGroup className="gap-4 p-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-3 rounded-lg border bg-muted/30 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-muted-foreground">
                        New Field
                      </span>
                      {fields.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(index)}
                          className="h-6 w-6 p-0"
                          aria-label="Remove field"
                        >
                          <Icon icon={Cancel01Icon} size={16} strokeWidth={2} />
                        </Button>
                      ) : null}
                    </div>

                    <Field data-invalid={!!errors.customFields?.[index]?.label}>
                      <FormFieldLabel
                        htmlFor={`${id}-field-name-${index}`}
                        label="Label"
                      />
                      <InputGroup size="md" className="bg-background">
                        <InputGroupInput
                          id={`${id}-field-name-${index}`}
                          placeholder="Enter label"
                          type="text"
                          {...register(`customFields.${index}.label` as const, {
                            required: "Label is required",
                          })}
                        />
                      </InputGroup>
                      <FieldError
                        errors={[errors.customFields?.[index]?.label]}
                      />
                    </Field>

                    <Field data-invalid={!!errors.customFields?.[index]?.value}>
                      <FormFieldLabel
                        htmlFor={`${id}-field-value-${index}`}
                        label="Value"
                      />
                      <InputGroup size="md" className="bg-background">
                        <InputGroupInput
                          id={`${id}-field-value-${index}`}
                          placeholder="Enter value"
                          type="text"
                          {...register(`customFields.${index}.value` as const, {
                            required: "Value is required",
                          })}
                        />
                      </InputGroup>
                      <FieldError
                        errors={[errors.customFields?.[index]?.value]}
                      />
                    </Field>
                  </div>
                ))}
              </FieldGroup>
            </form>
          ) : (
            <form className="p-4" onSubmit={(e) => e.preventDefault()}>
              <FieldGroup className="gap-4">
                {manageFields.length > 0 ? (
                  manageFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="space-y-3 rounded-lg border bg-muted/30 p-4"
                    >
                      <Field
                        data-invalid={
                          !!errorsManage.existingFields?.[index]?.label
                        }
                      >
                        <FormFieldLabel label="Field Label" />
                        <InputGroup size="md" className="bg-background">
                          <InputGroupInput
                            placeholder="Enter field label"
                            type="text"
                            {...registerManage(
                              `existingFields.${index}.label` as const,
                              { required: "Label is required" },
                            )}
                          />
                        </InputGroup>
                        <FieldError
                          errors={[
                            errorsManage.existingFields?.[index]?.label,
                          ]}
                        />
                      </Field>

                      <Field
                        data-invalid={
                          !!errorsManage.existingFields?.[index]?.value
                        }
                      >
                        <FormFieldLabel label="Field Value" />
                        <InputGroup size="md" className="bg-background">
                          <InputGroupInput
                            placeholder="Enter field value"
                            type="text"
                            {...registerManage(
                              `existingFields.${index}.value` as const,
                              { required: "Value is required" },
                            )}
                          />
                        </InputGroup>
                        <FieldError
                          errors={[
                            errorsManage.existingFields?.[index]?.value,
                          ]}
                        />
                      </Field>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const data = getValuesManage(
                              `existingFields.${index}`,
                            );
                            handleUpdateCustomField(
                              data._id,
                              data.label,
                              data.value,
                            );
                          }}
                          disabled={isPending || isSubmitted}
                        >
                          <Icon
                            icon={CheckmarkCircle01Icon}
                            size={16}
                            strokeWidth={2}
                          />
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
                          <Icon icon={Delete02Icon} size={16} strokeWidth={2} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No custom fields available.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Switch to &quot;Add New Field&quot; tab to create your
                      first custom field.
                    </p>
                  </div>
                )}
              </FieldGroup>
            </form>
          )}
        </AppDialogContent>
      </Dialog>

      <Dialog open={deleteFieldOpen} onOpenChange={setDeleteFieldOpen}>
        <AppDialogContent
          title="Delete Custom Field"
          description="Delete this custom field. This action cannot be undone."
          variant="confirm-destructive"
          size="md"
          confirmContent={{
            heading: "Are you sure?",
            message:
              "Are you sure you want to delete this custom field? This action cannot be undone.",
            icon: Alert01Icon,
          }}
          primaryAction={{
            label: "Delete Field",
            loadingLabel: "Deleting...",
            onClick: () => {
              if (deleteFieldId) {
                handleDeleteCustomField(deleteFieldId);
              }
            },
            loading: isPending,
            disabled: isPending || isSubmitted,
            icon: Delete02Icon,
            variant: "destructive",
          }}
          secondaryAction={{
            label: "Cancel",
            disabled: isPending,
            icon: Cancel01Icon,
          }}
        />
      </Dialog>
    </>
  );
}

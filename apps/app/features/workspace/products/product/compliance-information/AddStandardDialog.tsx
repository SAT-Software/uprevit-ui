"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  PlusSignSquareIcon,
  Tick01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
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
import { cn } from "@uprevit/ui/lib/utils";
import { COMPLIANCE_STANDARDS } from "@/data/compliance-standards";

interface FormValues {
  standardSelect: string;
  standardInput: string;
  description: string;
}

export default function AddStandardDialog({
  productId,
  isSubmitted = false,
}: {
  productId: string;
  isSubmitted?: boolean;
}) {
  const id = useId();
  const { mutate: addNewStandard, isPending } = useUpdateProductTabData();
  const [open, setOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      standardSelect: "",
      standardInput: "",
      description: "",
    },
    mode: "onSubmit",
  });

  const standardSelect = watch("standardSelect");
  const standardInput = watch("standardInput");

  const selectedStandardData = COMPLIANCE_STANDARDS.find(
    (s) => s.id === standardSelect,
  );

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const standardName = data.standardSelect || data.standardInput;
      const standardDescription =
        data.standardSelect && selectedStandardData
          ? selectedStandardData.description
          : data.description;

      const addNewStandardData = {
        id: productId,
        action: "add_compliance_standard",
        tab: "compliance-information",
        data: [
          {
            standard: standardName,
            standard_description: standardDescription,
          },
        ],
      };

      addNewStandard(addNewStandardData, {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
        onError: (error) => {
          console.error("Failed to update product information:", error);
          setOpen(false);
          reset();
        },
      });
    } catch (error) {
      console.error("Failed to add standard:", error);
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary" disabled={isSubmitted}>
              <Icon icon={PlusSignSquareIcon} />
              Add Standard
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent side="bottom">
          {isSubmitted
            ? "Submitted products can't be edited"
            : "Add a new compliance standard"}
        </TooltipContent>
      </Tooltip>
      <AppDialogContent
        title="Add New Standard"
        description="Add a new compliance standard by providing standard details."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Add Standard",
          loadingLabel: "Adding...",
          form: `add-standard-form-${id}`,
          type: "submit",
          loading: isPending,
          disabled: isPending || isSubmitted,
          icon: PlusSignSquareIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          icon: Cancel01Icon,
          onClick: handleCancel,
        }}
      >
        <form
          id={`add-standard-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <div
              className="space-y-3 rounded-lg border bg-muted/30 p-4"
              data-invalid={
                !!(errors.standardSelect || errors.standardInput)
              }
            >
              <FormFieldLabel
                label="Standard Number / Regulation"
                tooltip="Regulatory standard or certification for this product. Choose one option: select from the catalog or enter a custom designation."
              />
              <div className="space-y-2">
                <Field>
                  <FormFieldLabel
                    htmlFor={`${id}-standard-select`}
                    label="Select from list"
                    className="text-xs text-muted-foreground"
                  />
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id={`${id}-standard-select`}
                        type="button"
                        variant="outline"
                        size="default"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="w-full justify-between font-normal text-foreground/80"
                        disabled={!!standardInput}
                      >
                        {standardSelect
                          ? COMPLIANCE_STANDARDS.find(
                              (s) => s.id === standardSelect,
                            )?.id
                          : "Select standard..."}
                        <Icon
                          icon={UnfoldMoreIcon}
                          size={16}
                          className="ml-2 shrink-0 opacity-50"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <Command>
                        <CommandInput placeholder="Search standard or regulation..." />
                        <CommandList className="max-h-64 overflow-y-auto">
                          <CommandEmpty>No standard found.</CommandEmpty>
                          <CommandGroup>
                            {COMPLIANCE_STANDARDS.map((standard) => (
                              <CommandItem
                                key={standard.id}
                                value={standard.id}
                                onSelect={(currentValue) => {
                                  const selectedStandard =
                                    COMPLIANCE_STANDARDS.find(
                                      (s) =>
                                        s.id.toLowerCase() ===
                                        currentValue.toLowerCase(),
                                    );

                                  if (selectedStandard) {
                                    const isDeselecting =
                                      selectedStandard.id === standardSelect;
                                    setValue(
                                      "standardSelect",
                                      isDeselecting ? "" : selectedStandard.id,
                                      { shouldValidate: true },
                                    );
                                    clearErrors("standardInput");
                                    setValue(
                                      "description",
                                      isDeselecting
                                        ? ""
                                        : selectedStandard.description,
                                    );
                                    setComboboxOpen(false);
                                  }
                                }}
                              >
                                <Icon
                                  icon={Tick01Icon}
                                  size={16}
                                  className={cn(
                                    "mr-2",
                                    standardSelect === standard.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {standard.id}
                                  </span>
                                  <span className="text-[10px] uppercase tracking-tight text-muted-foreground">
                                    {standard.type} • {standard.category} •{" "}
                                    {standard.scope}
                                  </span>
                                </div>
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

                <Field data-invalid={!!errors.standardInput}>
                  <FormFieldLabel
                    htmlFor={`${id}-standard-custom`}
                    label="Enter custom"
                    className="text-xs text-muted-foreground"
                  />
                  <InputGroup size="md" className="bg-background">
                    <InputGroupInput
                      id={`${id}-standard-custom`}
                      placeholder="Enter (e.g., ISO 9001)"
                      type="text"
                      disabled={!!standardSelect}
                      aria-invalid={errors.standardInput ? "true" : "false"}
                      {...register("standardInput", {
                        validate: (value) => {
                          const selectValue = watch("standardSelect");
                          if (!value && !selectValue) {
                            return "Standard is required";
                          }
                          if (value && value.length < 3) {
                            return "Standard must be at least 3 characters";
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
                  errors.standardSelect || errors.standardInput
                    ? { message: "Standard or Regulation is required" }
                    : undefined,
                ]}
              />

              {standardSelect && selectedStandardData && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs dark:border-blue-800/30 dark:bg-blue-950/30">
                  <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-200">
                    Selected Details
                  </h4>
                  <div className="space-y-1 text-blue-800 dark:text-blue-300">
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {selectedStandardData.type}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {selectedStandardData.category}
                    </p>
                    <p>
                      <span className="font-medium">Scope:</span>{" "}
                      {selectedStandardData.scope}
                    </p>
                    <p className="mt-2 italic leading-relaxed text-foreground/80">
                      {selectedStandardData.description}
                    </p>
                  </div>
                </div>
              )}

              {!standardSelect && (
                <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs">
                  <h4 className="mb-2 font-medium text-foreground">
                    Guidelines
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                    <li>
                      Use official designation (e.g., ISO 9001, IEC 60601)
                    </li>
                    <li>
                      Include version/year if applicable (e.g., ISO 13485:2016)
                    </li>
                    <li>Use standard industry notation</li>
                  </ul>
                </div>
              )}
            </div>

            <Field data-invalid={!!errors.description}>
              <FormFieldLabel
                htmlFor={`${id}-description`}
                label="Description"
                tooltip="Describe the standard's purpose, scope, and requirements."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupTextarea
                  id={`${id}-description`}
                  placeholder="Describe the standard's purpose, scope, and requirements"
                  className="min-h-24 resize-none"
                  aria-invalid={errors.description ? "true" : "false"}
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description must not exceed 500 characters",
                    },
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.description]} />
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}

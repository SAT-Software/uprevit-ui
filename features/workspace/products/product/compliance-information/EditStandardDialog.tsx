"use client";
import { useId, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import {
  PiPencilSimpleDuotone,
  PiXCircleDuotone,
  PiFloppyDiskDuotone,
  PiCheck,
  PiCaretUpDown,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { COMPLIANCE_STANDARDS } from "@/data/compliance-standards";

interface FormValues {
  standardSelect: string;
  standardInput: string;
  description: string;
}

interface Standards {
  _id: string;
  standard: string;
  standard_description: string;
}

export default function EditStandardDialog({
  productId,
  standards,
  isSubmitted = false,
}: {
  productId: string;
  standards: Standards;
  isSubmitted?: boolean;
}) {
  const id = useId();
  const { mutate: updateStandard, isPending } = useUpdateProductTabData();
  const [open, setOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  // Check if the current standard exists in COMPLIANCE_STANDARDS
  const isExistingStandard = COMPLIANCE_STANDARDS.some(
    (s) => s.id === standards.standard
  );

  const initialValues = {
    standardSelect: isExistingStandard ? standards.standard : "",
    standardInput: isExistingStandard ? "" : standards.standard,
    description: standards.standard_description || "",
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const standardSelect = watch("standardSelect");
  const standardInput = watch("standardInput");

  // Get the selected standard's description from COMPLIANCE_STANDARDS
  const selectedStandardData = COMPLIANCE_STANDARDS.find(
    (s) => s.id === standardSelect
  );

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const standardName = data.standardSelect || data.standardInput;
      // Use description from form (which may have been edited by user)
      const standardDescription = data.description;

      const updateStandardData = {
        id: productId,
        action: "update_compliance_standard",
        tab: "compliance-information",
        data: {
          id: standards._id,
          standard: standardName,
          standard_description: standardDescription,
        },
      };

      updateStandard(updateStandardData, {
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
      console.error("Failed to edit standard:", error);
    }
  };

  // Update description when selecting a standard from dropdown
  const handleStandardSelect = (standardId: string) => {
    const standard = COMPLIANCE_STANDARDS.find((s) => s.id === standardId);
    if (standard) {
      setValue("standardSelect", standardId, { shouldValidate: true });
      setValue("standardInput", "");
      // Auto-fill description with standard details
      setValue("description", standard.description);
    }
    setComboboxOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" disabled={isSubmitted}>
          <PiPencilSimpleDuotone />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:hidden">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiPencilSimpleDuotone className="w-4 h-4" />
              <span>Update Standard Details</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Update this current compliance standard by providing standard details.
        </DialogDescription>
        <form
          id={`update-standard-form-${id}`}
          className="overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-standard-select`}>
                Standard Number / Regulation
              </Label>

              {/* Standard Selection Combobox */}
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between text-foreground/80 font-normal h-9"
                    disabled={!!standardInput}
                  >
                    {standardSelect
                      ? COMPLIANCE_STANDARDS.find(
                          (s) => s.id === standardSelect
                        )?.id
                      : "Select standard or regulation..."}
                    <PiCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                              const originalValue = COMPLIANCE_STANDARDS.find(
                                (s) =>
                                  s.id.toLowerCase() ===
                                  currentValue.toLowerCase()
                              )?.id;

                              if (originalValue) {
                                if (originalValue === standardSelect) {
                                  // Deselect
                                  setValue("standardSelect", "", {
                                    shouldValidate: true,
                                  });
                                  setComboboxOpen(false);
                                } else {
                                  handleStandardSelect(originalValue);
                                }
                              }
                            }}
                          >
                            <PiCheck
                              className={cn(
                                "mr-2 h-4 w-4",
                                standardSelect === standard.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{standard.id}</span>
                              <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
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

              {/* OR Separator */}
              <div className="flex items-center gap-2 py-1">
                <div className="h-0 w-full border-t border-dashed" />
                <p className="text-[10px] font-light text-muted-foreground uppercase">
                  OR
                </p>
                <div className="h-0 w-full border-t border-dashed" />
              </div>

              {/* Custom Standard Input */}
              <div className="space-y-2">
                <Label htmlFor={`${id}-standard-custom`} className="text-sm">
                  Enter Custom Standard / Regulation
                </Label>
                <Input
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
                {(errors.standardSelect || errors.standardInput) && (
                  <p role="alert" className="text-xs text-destructive">
                    Standard or Regulation is required
                  </p>
                )}
              </div>

              {/* Show selected standard details if selected from dropdown */}
              {standardSelect && selectedStandardData && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/30 p-3 text-xs">
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
                    <p className="mt-2 text-foreground/80 leading-relaxed italic">
                      {selectedStandardData.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Guidelines for custom input */}
              {!standardSelect && (
                <div className="rounded-lg bg-muted/50 border border-border p-3 text-xs">
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

            {/* Description field - always visible for editing */}
            <div className="space-y-2">
              <Label htmlFor={`${id}-description`}>Description</Label>
              <Textarea
                id={`${id}-description`}
                placeholder="Describe the standard's purpose, scope, and requirements"
                className="h-24 resize-none"
                aria-invalid={errors.description ? "true" : "false"}
                {...register("description", {
                  maxLength: {
                    value: 500,
                    message: "Description must not exceed 500 characters",
                  },
                })}
              />
              {errors.description && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </form>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            size="sm"
            variant="default"
            form={`update-standard-form-${id}`}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? <Spinner /> : <PiFloppyDiskDuotone />}
            {isPending ? "Updating..." : "Update Standard"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

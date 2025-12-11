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
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";

interface FormValues {
  standard: string;
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      standard: standards.standard || "",
      description: standards.standard_description || "",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      console.log("Form submitted:", data);

      const updateStandardData = {
        id: productId,
        action: "update_compliance_standard",
        tab: "compliance-information",
        data: {
          id: standards._id,
          standard: data.standard,
          standard_description: data.description,
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
      console.error("Failed to add standard:", error);
    }
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
              <Label htmlFor={`${id}-standard`}>Standard Number</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id={`${id}-standard`}
                  placeholder="Enter standard (e.g., ISO 9001)"
                  type="text"
                  aria-invalid={errors.standard ? "true" : "false"}
                  {...register("standard", {
                    required: "Standard is required",
                    minLength: {
                      value: 3,
                      message: "Standard must be at least 3 characters",
                    },
                  })}
                />
                {errors.standard && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.standard.message}
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-muted/50 border border-border p-3 text-xs">
                <h4 className="mb-2 font-medium text-foreground">
                  Standard Number Guidelines
                </h4>
                <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                  <li>
                    Use official standard designation (e.g., ISO 9001, IEC
                    60601)
                  </li>
                  <li>
                    Include version/year if applicable (e.g., ISO 13485:2016)
                  </li>
                  <li>Use standard industry notation</li>
                </ul>
              </div>
            </div>

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

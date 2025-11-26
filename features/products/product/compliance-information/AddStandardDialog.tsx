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

interface FormValues {
  standard: string;
  description: string;
}

export default function AddStandardDialog({
  productId,
}: {
  productId: string;
}) {
  const id = useId();
  const { mutate: addNewStandard, isPending } = useUpdateProductTabData();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      standard: "",
      description: "",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      console.log("Form submitted:", data);

      const addNewStandardData = {
        id: productId,
        action: "add_compliance_standard",
        tab: "compliance-information",
        data: [
          { standard: data.standard, standard_description: data.description },
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="text-xs">
          Add Standard
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Add New Standard
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add a new compliance standard by providing standard details.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="px-6 pt-4 pb-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="add-standard-form"
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor={`${id}-standard`}>Standard Number</Label>
                <Input
                  id={`${id}-standard`}
                  placeholder="Enter standard  (e.g., ISO 9001)"
                  type="text"
                  {...register("standard", {
                    required: "Standard  is required",
                    minLength: {
                      value: 3,
                      message: "Standard must be at least 3 characters",
                    },
                  })}
                />
                {errors.standard && (
                  <p className="text-sm text-destructive">
                    {errors.standard.message}
                  </p>
                )}
                <div className="rounded-md bg-blue-50 p-3 text-xs">
                  <h4 className="mb-2 font-medium text-blue-700">
                    Standard Number Guidelines
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-blue-600">
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
                  className="min-h-[100px] resize-none"
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description must not exceed 500 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button form="add-standard-form" disabled={isPending} type="submit">
            {isPending ? "Adding..." : "Add Standard"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

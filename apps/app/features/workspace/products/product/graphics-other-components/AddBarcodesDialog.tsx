"use client";

import { useId, useState } from "react";
import { PiPlusSquareDuotone, PiXDuotone } from "react-icons/pi";
import { useForm, Controller } from "react-hook-form";
import {
  useFileUpload,
  FileWithPreview,
} from "@/hooks/general/use-file-upload";
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
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Textarea } from "@uprevit/ui/components/ui/textarea";
import { TagInput, Tag } from "@uprevit/ui/components/ui/tag-input";
import Image from "next/image";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import {
  PiPlusCircleDuotone,
  PiXCircleDuotone,
  PiPictureInPictureDuotone,
  PiCaretUpDown,
  PiCheck,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { BARCODE_STANDARDS } from "@/data/barcode-standards";
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

type FormData = {
  barcodeTypeSelect: string;
  barcodeTypeInput: string;
  componentDescription: string;
  labelPresence: Tag[];
  image: FileWithPreview | null;
  count: number;
};

export default function AddBarcodesDialog({
  productId,
  isSubmitted = false,
}: {
  productId: string;
  isSubmitted?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [labelPresence, setLabelPresence] = useState<Tag[]>([]);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      barcodeTypeSelect: "",
      barcodeTypeInput: "",
      labelPresence: [],
      image: null,
      count: 1,
    },
  });

  const barcodeTypeSelect = watch("barcodeTypeSelect");
  const barcodeTypeInput = watch("barcodeTypeInput");

  const { mutate: addBarcodesData, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();

  const onSubmit = async (data: FormData) => {
    // Validate that at least one barcode type is selected/entered
    if (!data.barcodeTypeSelect && !data.barcodeTypeInput) {
      // You might want to handle this validation error more gracefully
      return;
    }

    const componentName = data.barcodeTypeSelect || data.barcodeTypeInput;

    try {
      setUploadingImage(true);
      let uploadedImageKey: string | undefined;

      if (data.image && data.image.file instanceof File) {
        const s3UploadResult = await uploadFileToS3({
          file: data.image.file,
          contentType: data.image.file.type || "application/octet-stream",
          uploadScope: "product-assets",
          productId,
        });

        uploadedImageKey = s3UploadResult.key;
      }
      setUploadingImage(false);
      const newBarcodesData = {
        id: productId,
        action: "add_symbols_graphics",
        tab: "symbols-graphics",
        data: [
          {
            text: componentName,
            image: null,
            key: uploadedImageKey,
            entity: "Barcodes",
            label_presence: (Array.isArray(labelPresence)
              ? labelPresence
              : JSON.parse(labelPresence || "[]")
            ).map((tag: Tag) => tag.text),
            description: data.componentDescription,
            count: data.count,
          },
        ],
      };

      addBarcodesData(newBarcodesData, {
        onSuccess: () => {
          setOpen(false);
          reset();
          setLabelPresence([]);
        },
        onError: () => {
          setUploadingImage(false);
        },
      });
    } catch (error) {
      console.error("Failed to add barcodes item:", error);
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" disabled={isSubmitted}>
          <PiPlusCircleDuotone />
          Add Barcode
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:hidden">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiPlusCircleDuotone className="w-4 h-4" />
              <span>Add New Barcode</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add a new barcodes item by providing details and uploading an image.
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="add-barcodes-form"
          className="overflow-y-auto"
        >
          <div className="flex gap-4 p-4">
            <div className="w-1/3">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ComponentImage
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file);
                      setValue("image", file);
                    }}
                  />
                )}
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="space-y-2">
                <Label>Select Barcode Type</Label>
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="default"
                      role="combobox"
                      aria-expanded={comboboxOpen}
                      className="w-full justify-between text-foreground/80"
                      disabled={!!barcodeTypeInput}
                    >
                      {barcodeTypeSelect
                        ? BARCODE_STANDARDS.find(
                            (framework) => framework.name === barcodeTypeSelect
                          )?.name
                        : "Select barcode type..."}
                      <PiCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <Command>
                      <CommandInput placeholder="Search barcode type..." />
                      <CommandList>
                        <CommandEmpty>No barcode type found.</CommandEmpty>
                        <CommandGroup>
                          {BARCODE_STANDARDS.map((framework) => (
                            <CommandItem
                              key={framework.name}
                              value={framework.name}
                              onSelect={(currentValue) => {
                                setValue(
                                  "barcodeTypeSelect",
                                  currentValue === barcodeTypeSelect
                                    ? ""
                                    : currentValue
                                );
                                setComboboxOpen(false);
                              }}
                            >
                              <PiCheck
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  barcodeTypeSelect === framework.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {framework.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0 w-full border-t border-dashed" />
                <p className="text-xs font-light text-muted-foreground">OR</p>
                <div className="h-0 w-full border-t border-dashed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-component-name`}>
                  Enter Custom Barcode Type
                </Label>
                <Input
                  id={`${id}-component-name`}
                  placeholder="Enter custom barcode type"
                  type="text"
                  {...register("barcodeTypeInput")}
                  disabled={!!barcodeTypeSelect}
                />
              </div>

              {/* Validation Error Display */}
              {!barcodeTypeSelect &&
                !barcodeTypeInput &&
                (errors.barcodeTypeSelect || errors.barcodeTypeInput) && (
                  <p className="text-xs text-red-500">
                    Please select a barcode type or enter one manually.
                  </p>
                )}
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-component-description`}>
                  Barcode Data
                </Label>
                <Textarea
                  id={`${id}-component-description`}
                  placeholder="Enter barcode data/content"
                  {...register("componentDescription", {
                    required: "Barcode data is required",
                  })}
                  className="min-h-[80px] resize-none"
                />
                {errors.componentDescription && (
                  <p className="text-xs text-red-500">
                    {errors.componentDescription.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <TagInput
                  label="Presence on labels"
                  tags={labelPresence}
                  setTags={setLabelPresence}
                  placeholder="Add label and press Enter"
                />
                <input
                  type="hidden"
                  {...register("labelPresence")}
                  value={JSON.stringify(labelPresence)}
                />
                <p className="text-xs text-muted-foreground -mt-1">
                  Press Enter to add a label type. You can add multiple label
                  types.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-count`}>Count</Label>
                <Input
                  id={`${id}-count`}
                  type="number"
                  min={1}
                  {...register("count", {
                    required: "Count is required",
                    min: { value: 1, message: "Count must be at least 1" },
                    valueAsNumber: true,
                  })}
                  defaultValue={1}
                />
                {errors.count && (
                  <p className="text-xs text-red-500">{errors.count.message}</p>
                )}
              </div>
            </div>
          </div>
        </form>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                reset();
                setLabelPresence([]);
              }}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            form="add-barcodes-form"
            type="button"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={
              isPending ||
              uploadingImage ||
              (!barcodeTypeSelect && !barcodeTypeInput)
            }
            aria-busy={isPending || uploadingImage}
            variant="default"
          >
            {isPending || uploadingImage ? <Spinner /> : <PiPlusCircleDuotone />}
            {isPending
              ? "Adding..."
              : uploadingImage
              ? "Uploading..."
              : "Add Barcode"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ComponentImageProps {
  value: FileWithPreview | null;
  onChange: (file: FileWithPreview | null) => void;
}

function ComponentImage({ value, onChange }: ComponentImageProps) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/png,image/jpg,image/jpeg,image/gif,image/webp",
      onFilesChange: (newFiles) => {
        if (newFiles.length > 0) {
          onChange(newFiles[0]);
        } else {
          onChange(null);
        }
      },
    });

  const currentImage = value?.preview || files[0]?.preview || null;

  return (
    <div className="h-40 w-full">
      <div className="bg-muted/30 border border-border relative flex size-full rounded-xl items-center justify-center overflow-hidden group transition-colors hover:bg-muted/50">
        {currentImage ? (
          <Image
            className="size-full object-cover rounded-xl"
            src={currentImage}
            alt={
              value?.file.name || files[0]?.file.name
                ? "Preview of uploaded barcode image"
                : "Barcode image"
            }
            width={512}
            height={96}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/50">
            <PiPictureInPictureDuotone className="w-12 h-12" />
            <span className="text-xs font-medium">Upload Image</span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-background text-foreground transition-[color,box-shadow] outline-none hover:bg-accent focus-visible:ring-[3px]"
            onClick={openFileDialog}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <PiPlusSquareDuotone size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-[color,box-shadow] outline-none hover:bg-destructive/90 focus-visible:ring-[3px]"
              onClick={() => {
                const fileId = value?.id || files[0]?.id;
                if (fileId) {
                  removeFile(fileId);
                }
                onChange(null);
              }}
              aria-label="Remove image"
            >
              <PiXDuotone size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload barcode image"
        />
      </div>
    </div>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import Image from "next/image";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import {
  PiPlusCircleDuotone,
  PiXCircleDuotone,
  PiPictureInPictureDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";

type FormData = {
  componentNumber: string;
  componentDescription: string;
  image: FileWithPreview | null;
  labelType: Tag[];
  dimensions: string;
  componentType: string;
};

export default function AddComponentDialog({
  productId,
  isSubmitted = false,
}: {
  productId: string;
  isSubmitted?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [labelType, setLabelType] = useState<Tag[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      image: null,
      labelType: [],
      dimensions: "",
      componentType: "",
    },
  });
  const { mutate: addComponent, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } =
    useUploadFilesToS3();

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form data:", data);
      setUploadingImage(true);
      let uploadRes;

      // Only upload if there's an image file
      if (data.image && data.image.file instanceof File) {

        uploadRes = await uploadImage({
          file: data.image.file,
          contentType: data.image.file.type,
          uploadScope: "product-assets",
          productId,
        });

        console.log("S3 upload response:", uploadRes);
      }
      setUploadingImage(false);
      const newComponentData = {
        id: productId,
        action: "add_label_component",
        tab: "label-components",
        data: [
          {
            component_number: data.componentNumber,
            key: uploadRes?.key,
            sizeBytes: uploadRes?.size,
            component_description: data.componentDescription,
            label_type: (Array.isArray(labelType)
              ? labelType
              : JSON.parse(labelType || "[]")
            ).map((tag: Tag) => tag.text),
            dimensions: data.dimensions,
            component_type: data.componentType,
          },
        ],
      };

      addComponent(newComponentData, {
        onSuccess: () => {
          setOpen(false);
          reset();
          setLabelType([]);
        },
        onError: () => {
          setOpen(false);
          reset();
          setLabelType([]);
        },
      });
    } catch (error) {
      console.error("Failed to add component:", error);
    }
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
          <PiPlusCircleDuotone className="w-4 h-4" />
          Add Component
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:hidden">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiPlusCircleDuotone className="w-4 h-4" />
              <span>Add New Component</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add a new component by providing component details and uploading an
          image.
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="add-component-form"
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
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-component-number`}>
                  Component Number
                </Label>
                <Input
                  id={`${id}-component-number`}
                  placeholder="Enter component number"
                  type="text"
                  {...register("componentNumber", {
                    required: "Component number is required",
                  })}
                />
                {errors.componentNumber && (
                  <p className="text-xs text-red-500">
                    {errors.componentNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-component-type`}>Component Type</Label>
                <Controller
                  name="componentType"
                  control={control}
                  rules={{
                    required: "Component type is required",
                  }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select component type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preprinted">Pre-printed</SelectItem>
                        <SelectItem value="Blank">Blank</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.componentType && (
                  <p className="text-xs text-red-500">
                    {errors.componentType.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Describe the component's purpose and specifications"
                  {...register("componentDescription")}
                  className="min-h-[100px] resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-dimensions`}>Dimensions</Label>
                <Input
                  id={`${id}-dimensions`}
                  placeholder="Enter dimensions"
                  type="text"
                  {...register("dimensions")}
                />
              </div>
              <div className="space-y-2">
                <TagInput
                  label="Label Type"
                  tags={labelType}
                  setTags={setLabelType}
                  placeholder="Add label type and press Enter"
                />
                <input
                  type="hidden"
                  {...register("labelType")}
                  value={JSON.stringify(labelType)}
                />
                <p className="text-xs text-muted-foreground -mt-1">
                  Press Enter to add a label type. You can add multiple label
                  types.
                </p>
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
                setLabelType([]);
              }}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            form="add-component-form"
            type="button"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || uploadingImage}
            variant="default"
          >
            {isPending || isUploadingImage || uploadingImage ? (
              <Spinner />
            ) : (
              <PiPlusCircleDuotone />
            )}
            {isPending
              ? "Adding..."
              : isUploadingImage || uploadingImage
                ? "Uploading..."
                : "Add Component"}
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

  // Sync external value with internal state
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
                ? "Preview of uploaded component image"
                : "Component image"
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
          aria-label="Upload component image"
        />
      </div>
    </div>
  );
}

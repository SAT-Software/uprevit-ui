"use client";

import { useId, useState, useEffect } from "react";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import {
  useFileUpload,
  FileWithPreview,
} from "@/hooks/general/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagInput, Tag } from "@/components/ui/tag-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { uploadFiles } from "@/utils/uploadthing";

type ComponentItem = {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
};

type FormData = {
  componentNumber: string;
  componentDescription: string;
  image: FileWithPreview | null;
  labelType: Tag[];
  dimensions: string;
  componentType: string;
};

export default function EditComponentDialog({
  productId,
  component,
  open,
  onOpenChange,
}: {
  productId: string;
  component: ComponentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
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
      componentNumber: "",
      componentDescription: "",
      image: null,
      labelType: [],
      dimensions: "",
      componentType: "",
    },
  });
  const { mutate: updateComponent, isPending } = useUpdateProductTabData();

  // Set form values when component data changes
  useEffect(() => {
    if (component && open) {
      reset({
        componentNumber: component.component_number,
        componentDescription: component.component_description,
        image: null,
        labelType: [], // This will be handled by the state
        dimensions: component.dimensions || "",
        componentType: component.component_type || "",
      });
      setLabelType(
        (component.label_type || []).map((text, index) => ({
          id: index.toString(),
          text,
        }))
      );
    }
  }, [component, open, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Edit form data:", data);
      setUploadingImage(true);
      let utRes;

      // Only upload if there's a new image file
      if (data.image && data.image.file instanceof File) {
        utRes = await uploadFiles("imageUploader", {
          files: [data.image.file],
        });

        console.log("UploadThing response:", utRes);
      }
      setUploadingImage(false);

      const updatedComponentData = {
        id: productId,
        action: "update_label_component",
        tab: "label-components",
        data: {
          id: component._id,
          component_number: data.componentNumber,
          image: utRes?.[0]?.ufsUrl || component.image,
          component_description: data.componentDescription,
          label_type: (Array.isArray(labelType)
            ? labelType
            : JSON.parse(labelType || "[]")
          ).map((tag: Tag) => tag.text),
          dimensions: data.dimensions,
          component_type: data.componentType,
        },
      };

      updateComponent(updatedComponentData, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
        onError: () => {
          onOpenChange(false);
          reset();
        },
      });
    } catch (error) {
      console.error("Failed to update component:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edit Component
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit component by updating component details and uploading a new
          image.
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="edit-component-form"
          className="overflow-y-auto"
        >
          <div className="flex gap-4 px-6 pt-4">
            <div className="w-1/3">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ComponentImage
                    currentImage={component.image}
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
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select component type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preprinted">Preprinted</SelectItem>
                        <SelectItem value="Blank">Blank</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-6">
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
              </div>
            </div>
          </div>
        </form>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={() => reset()}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              form="edit-component-form"
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending
                ? "Updating..."
                : uploadingImage
                ? "Uploading..."
                : "Update Component"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ComponentImageProps {
  currentImage: string;
  value: FileWithPreview | null;
  onChange: (file: FileWithPreview | null) => void;
}

function ComponentImage({
  currentImage,
  value,
  onChange,
}: ComponentImageProps) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      onFilesChange: (newFiles) => {
        if (newFiles.length > 0) {
          onChange(newFiles[0]);
        } else {
          onChange(null);
        }
      },
    });

  // Show current image if no new file is selected
  const displayImage = value?.preview || files[0]?.preview || currentImage;

  return (
    <div className="h-32 bg-muted relative flex size-full rounded-xl items-center justify-center overflow-hidden">
      {displayImage ? (
        <Image
          className="size-full object-cover rounded-xl"
          src={displayImage}
          alt="Component image"
          width={512}
          height={96}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
          <div className="flex flex-col items-center text-muted-foreground/60">
            <ImagePlusIcon className="w-8 h-8 mb-2" />
            <span className="text-xs">Component Image</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center gap-2">
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
          onClick={openFileDialog}
          aria-label={displayImage ? "Change image" : "Upload image"}
        >
          <ImagePlusIcon size={16} aria-hidden="true" />
        </button>
        {displayImage && (
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={() => {
              const fileId = value?.id || files[0]?.id;
              if (fileId) {
                removeFile(fileId);
              }
              onChange(null);
            }}
            aria-label="Remove image"
          >
            <XIcon size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload component image"
      />
    </div>
  );
}

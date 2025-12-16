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
import {
  PiPencilSimpleDuotone,
  PiXCircleDuotone,
  PiCheckCircleDuotone,
  PiCubeDuotone,
  PiPictureInPictureDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";

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
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:hidden">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiPencilSimpleDuotone className="w-4 h-4" />
              <span>Edit Component</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
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
          <div className="flex gap-4 p-4">
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
              onClick={() => reset()}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            form="edit-component-form"
            type="button"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || uploadingImage}
            variant="default"
          >
            {isPending || uploadingImage ? (
              <Spinner />
            ) : (
              <PiCheckCircleDuotone />
            )}
            {isPending
              ? "Updating..."
              : uploadingImage
              ? "Uploading..."
              : "Update Component"}
          </Button>
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
    <div className="h-40 w-full">
      <div className="bg-muted/30 border border-border relative flex size-full rounded-xl items-center justify-center overflow-hidden group transition-colors hover:bg-muted/50">
        {displayImage ? (
          <Image
            className="size-full object-cover rounded-xl"
            src={displayImage}
            alt="Component image"
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
            aria-label={displayImage ? "Change image" : "Upload image"}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          {displayImage && (
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
    </div>
  );
}

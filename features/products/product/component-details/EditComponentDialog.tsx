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
import Image from "next/image";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { uploadFiles } from "@/utils/uploadthing";

type ComponentItem = {
  _id: string;
  name: string;
  specification_details: string;
  number: string;
  image: string;
};

type FormData = {
  name: string;
  number: string;
  specification_details: string;
  image: FileWithPreview | null;
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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      number: "",
      specification_details: "",
      image: null,
    },
  });
  const { mutate: updateComponent, isPending } = useUpdateProductTabData();

  // Set form values when component data changes
  useEffect(() => {
    if (component && open) {
      reset({
        name: component.name,
        number: component.number,
        specification_details: component.specification_details,
        image: null,
      });
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
          name: data.name,
          number: data.number,
          image: utRes?.[0]?.ufsUrl || component.image,
          specification_details: data.specification_details,
        },
      };

      updateComponent(updatedComponentData);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error("Failed to update component:", error);
      setUploadingImage(false);
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
                <Label htmlFor={`${id}-component-name`}>Component Name</Label>
                <Input
                  id={`${id}-component-name`}
                  placeholder="Enter component name"
                  type="text"
                  {...register("name", {
                    required: "Component name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-component-number`}>
                  Component Number
                </Label>
                <Input
                  id={`${id}-component-number`}
                  placeholder="Enter component number"
                  type="text"
                  {...register("number")}
                />
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-specification_details`}>
                  specification_details
                </Label>
                <Textarea
                  id={`${id}-specification_details`}
                  placeholder="Describe the component's purpose and specifications"
                  {...register("specification_details")}
                  className="min-h-[100px] resize-none"
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

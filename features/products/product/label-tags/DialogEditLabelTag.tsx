"use client";

import { useId, useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { uploadFiles } from "@/utils/uploadthing";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { PiPencilDuotone } from "react-icons/pi";

type FormData = {
  name: string;
  description: string;
  type: string;
  image: FileWithPreview | string | null;
};

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
}

export default function DialogEditLabelTag({
  productId,
  labelTag,
}: {
  productId: string;
  labelTag: LabelTagItem;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { mutate: updateLabelTag, isPending } = useUpdateProductTabData();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    values: {
      name: labelTag.name || "",
      description: labelTag.description || "",
      type: labelTag.type || "",
      image: labelTag.image || null,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form data:", data);
      setUploadingImage(true);
      let utRes;

      // Only upload if there's a new image file
      if (
        data.image &&
        typeof data.image !== "string" &&
        data.image.file instanceof File
      ) {
        utRes = await uploadFiles("imageUploader", {
          files: [data.image.file],
        });

        console.log("UploadThing response:", utRes);
      }
      setUploadingImage(false);

      const editLabelTagData = {
        id: productId,
        action: "update_label_tags",
        tab: "label-tags",
        data: {
          id: labelTag._id,
          name: data.name,
          description: data.description,
          type: data.type,
          image:
            utRes?.[0]?.ufsUrl ||
            (typeof data.image === "string" ? data.image : ""),
        },
      };

      updateLabelTag(editLabelTagData, {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
        onError: (error) => {
          console.error("Failed to update label tag:", error);
        },
      });
    } catch (error) {
      console.error("Failed to edit label tag:", error);
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <PiPencilDuotone className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edit Label
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit the label details and upload a new image.
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="edit-label-tag-form"
          className="overflow-y-auto"
        >
          <div className="flex gap-4 px-6 pt-4">
            <div className="w-1/3">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ComponentImage
                    value={field.value}
                    onChange={(file) => {
                      field.onChange(file);
                    }}
                  />
                )}
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-name`}>Name</Label>
                <Input
                  id={`${id}-name`}
                  placeholder="Enter label name"
                  type="text"
                  {...register("name", {
                    required: "Label name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-type`}>Type</Label>
                <Input
                  id={`${id}-type`}
                  placeholder="Enter label type"
                  type="text"
                  {...register("type")}
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
                  placeholder="Describe the label's purpose and specifications"
                  {...register("description")}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>
        </form>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            form="edit-label-tag-form"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={uploadingImage || isPending}
          >
            {uploadingImage
              ? "Uploading Label..."
              : isPending
              ? "Updating Data..."
              : "Update Label"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ComponentImageProps {
  value: FileWithPreview | string | null;
  onChange: (file: FileWithPreview | string | null) => void;
}

function ComponentImage({ value, onChange }: ComponentImageProps) {
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

  // Sync external value with internal state
  const currentImage =
    (typeof value === "string" ? value : value?.preview) ||
    files[0]?.preview ||
    null;

  return (
    <div className="h-32 bg-muted relative flex size-full rounded-xl items-center justify-center overflow-hidden">
      {currentImage ? (
        <Image
          className="size-full object-cover rounded-xl"
          src={currentImage}
          alt={
            (typeof value !== "string" && value?.file.name) ||
            files[0]?.file.name
              ? "Preview of uploaded label image"
              : "Current label image"
          }
          width={512}
          height={96}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
          <div className="flex flex-col items-center text-muted-foreground/60">
            <ImagePlusIcon className="w-8 h-8 mb-2" />
            <span className="text-xs">Label Image</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center gap-2">
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
          onClick={openFileDialog}
          aria-label={currentImage ? "Change image" : "Upload image"}
        >
          <ImagePlusIcon size={16} aria-hidden="true" />
        </button>
        {currentImage && (
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={() => {
              const fileId =
                (typeof value !== "string" ? value?.id : undefined) ||
                files[0]?.id;
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
        aria-label="Upload label image"
      />
    </div>
  );
}

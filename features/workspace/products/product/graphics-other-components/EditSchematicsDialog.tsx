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
import Image from "next/image";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { uploadFiles } from "@/utils/uploadthing";
import {
  PiPencilSimpleDuotone,
  PiXCircleDuotone,
  PiCheckCircleDuotone,
  PiPictureInPictureDuotone,
} from "react-icons/pi";

type Item = {
  id: string;
  componentName: string;
  componentImage: string;
  description: string;
  labelPresence: string[];
};

type FormData = {
  componentName: string;
  componentDescription: string;
  labelPresence: Tag[];
  image: FileWithPreview | null;
};

export default function EditSchematicsDialog({
  productId,
  schematic,
  open,
  onOpenChange,
}: {
  productId: string;
  schematic: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [labelPresence, setLabelPresence] = useState<Tag[]>(
    schematic.labelPresence.map((label, index) => ({
      id: `tag-${index}-${label}`,
      text: label,
    }))
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      componentName: schematic.componentName,
      componentDescription: schematic.description,
      labelPresence: schematic.labelPresence.map((label, index) => ({
        id: `tag-${index}-${label}`,
        text: label,
      })),
      image: null,
    },
  });
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  useEffect(() => {
    reset({
      componentName: schematic.componentName,
      componentDescription: schematic.description,
      labelPresence: schematic.labelPresence.map((label, index) => ({
        id: `tag-${index}-${label}`,
        text: label,
      })),
      image: null,
    });
    setLabelPresence(
      schematic.labelPresence.map((label, index) => ({
        id: `tag-${index}-${label}`,
        text: label,
      }))
    );
    setIsImageRemoved(false);
  }, [schematic, reset]);

  const { mutate: updateSchematicsData, isPending } = useUpdateProductTabData();

  const onSubmit = async (data: FormData) => {
    try {
      setUploadingImage(true);
      let utRes;

      if (data.image && data.image.file instanceof File) {
        utRes = await uploadFiles("imageUploader", {
          files: [data.image.file],
        });
      }
      setUploadingImage(false);

      let finalImage: string = schematic.componentImage;
      if (isImageRemoved) {
        finalImage = "";
      }
      if (utRes?.[0]?.ufsUrl) {
        finalImage = utRes[0].ufsUrl;
      }

      const updatedSchematicsData = {
        id: productId,
        action: "update_symbols_graphics",
        tab: "symbols-graphics",
        data: {
          id: schematic.id,
          text: data.componentName,
          image: finalImage,
          entity: "Schematics",
          description: data.componentDescription,
          label_presence: labelPresence.map((tag: Tag) => tag.text),
        },
      };

      updateSchematicsData(updatedSchematicsData, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
          setLabelPresence([]);
          setIsImageRemoved(false);
        },
        onError: () => {
          setUploadingImage(false);
        },
      });
    } catch (error) {
      console.error("Failed to update schematics item:", error);
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:hidden">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiPencilSimpleDuotone className="w-4 h-4" />
              <span>Edit Schematic</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit schematics item by updating details and uploading a new image.
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="edit-schematics-form"
          className="overflow-y-auto"
        >
          <div className="flex gap-4 p-4">
            <div className="w-1/3">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ComponentImage
                    currentImage={schematic.componentImage}
                    value={field.value}
                    isRemoved={isImageRemoved}
                    onRemove={() => setIsImageRemoved(true)}
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
                <Label htmlFor={`${id}-component-name`}>Schematic Name</Label>
                <Input
                  id={`${id}-component-name`}
                  placeholder="Enter schematic name"
                  type="text"
                  {...register("componentName", {
                    required: "Schematic name is required",
                  })}
                />
                {errors.componentName && (
                  <p className="text-xs text-red-500">
                    {errors.componentName.message}
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
                  placeholder="Describe the schematic's purpose and specifications"
                  {...register("componentDescription")}
                  className="min-h-[100px] resize-none"
                />
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
                setIsImageRemoved(false);
              }}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            form="edit-schematics-form"
            type="button"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            variant="default"
          >
            <PiCheckCircleDuotone />
            {isPending
              ? "Updating..."
              : uploadingImage
              ? "Uploading..."
              : "Update Schematic"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ComponentImageProps {
  currentImage: string;
  value: FileWithPreview | null;
  isRemoved: boolean;
  onRemove: () => void;
  onChange: (file: FileWithPreview | null) => void;
}

function ComponentImage({
  currentImage,
  value,
  isRemoved,
  onRemove,
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

  const displayImage =
    value?.preview || files[0]?.preview || (!isRemoved && currentImage);

  return (
    <div className="h-40 w-full">
      <div className="bg-muted/30 border border-border relative flex size-full rounded-xl items-center justify-center overflow-hidden group transition-colors hover:bg-muted/50">
        {displayImage ? (
          <Image
            className="size-full object-cover rounded-xl"
            src={displayImage}
            alt="Schematic image"
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
                  onChange(null);
                } else {
                  onRemove();
                  onChange(null);
                }
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
          aria-label="Upload schematic image"
        />
      </div>
    </div>
  );
}

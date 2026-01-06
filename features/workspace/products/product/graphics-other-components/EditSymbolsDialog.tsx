"use client";

import { useId, useState, useEffect } from "react";
import { PiPlusSquareDuotone, PiXDuotone } from "react-icons/pi";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  symbolsTextPresent: string[];
  textPresent: boolean;
};

type FormData = {
  componentName: string;
  textPresent: string;
  labelPresence: Tag[];
  image: FileWithPreview | null;
};

export default function EditSymbolsDialog({
  productId,
  symbol,
  open,
  onOpenChange,
}: {
  productId: string;
  symbol: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [labelPresence, setLabelPresence] = useState<Tag[]>(
    symbol.symbolsTextPresent.map((label, index) => ({
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
      componentName: symbol.componentName,
      textPresent: symbol.textPresent ? "yes" : "no",
      labelPresence: symbol.symbolsTextPresent.map((label, index) => ({
        id: `tag-${index}-${label}`,
        text: label,
      })),
      image: null,
    },
  });

  const [isImageRemoved, setIsImageRemoved] = useState(false);

  useEffect(() => {
    reset({
      componentName: symbol.componentName,
      textPresent: symbol.textPresent ? "yes" : "no",
      labelPresence: symbol.symbolsTextPresent.map((label, index) => ({
        id: `tag-${index}-${label}`,
        text: label,
      })),
      image: null,
    });
    setLabelPresence(
      symbol.symbolsTextPresent.map((label, index) => ({
        id: `tag-${index}-${label}`,
        text: label,
      }))
    );
    setIsImageRemoved(false);
  }, [symbol, reset]);

  const { mutate: updateSymbolsData, isPending } = useUpdateProductTabData();

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

      let finalImage: string = symbol.componentImage;
      if (isImageRemoved) {
        finalImage = "";
      }
      if (utRes?.[0]?.ufsUrl) {
        finalImage = utRes[0].ufsUrl;
      }

      const updatedSymbolsData = {
        id: productId,
        action: "update_symbols_graphics",
        tab: "symbols-graphics",
        data: {
          id: symbol.id,
          text: data.componentName,
          image: finalImage,
          entity: "Symbols",
          text_present: data.textPresent === "yes",
          label_presence: labelPresence.map((tag: Tag) => tag.text),
        },
      };

      updateSymbolsData(updatedSymbolsData, {
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
      console.error("Failed to update symbols item:", error);
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
              <span>Edit Symbol</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit symbols item by updating details and uploading a new image.
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="edit-symbols-form"
          className="overflow-y-auto"
        >
          <div className="flex gap-4 p-4">
            <div className="w-1/3">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ComponentImage
                    currentImage={symbol.componentImage}
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
                <Label htmlFor={`${id}-component-name`}>Symbol Text</Label>
                <Input
                  id={`${id}-component-name`}
                  placeholder="Enter symbol text"
                  type="text"
                  {...register("componentName", {
                    required: "Symbol text is required",
                  })}
                />
                {errors.componentName && (
                  <p className="text-xs text-red-500">
                    {errors.componentName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Symbol text present</Label>
                <Controller
                  name="textPresent"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="yes"
                          id={`${id}-text-present-yes`}
                        />
                        <Label htmlFor={`${id}-text-present-yes`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="no"
                          id={`${id}-text-present-no`}
                        />
                        <Label htmlFor={`${id}-text-present-no`}>No</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="space-y-4">
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
            form="edit-symbols-form"
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
              : "Update Symbol"}
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
            alt="Symbol image"
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
            <PiPlusSquareDuotone size={16} aria-hidden="true" />
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
              <PiXDuotone size={16} aria-hidden="true" />
            </button>
          )}
        </div>
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload symbol image"
        />
      </div>
    </div>
  );
}

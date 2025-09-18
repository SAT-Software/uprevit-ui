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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TagInput, Tag } from "@/components/ui/tag-input";
import Image from "next/image";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { uploadFiles } from "@/utils/uploadthing";

type FormData = {
  componentName: string;
  componentDescription: string;
  textPresent: string;
  labelPresence: Tag[];
  image: FileWithPreview | null;
};

export default function AddSymbolsDialog({ productId }: { productId: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [textPresent, setTextPresent] = useState("yes");
  const [labelPresence, setLabelPresence] = useState<Tag[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      textPresent: "yes",
      labelPresence: [],
      image: null,
    },
  });
  const { mutate: addSymbolsData, isPending } = useUpdateProductTabData();

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form data:", data);
      setUploadingImage(true);
      let utRes;

      // Only upload if there's an image file
      console.log("Image data:", data.image);
      if (data.image && data.image.file instanceof File) {
        console.log("Uploading file:", data.image.file);
        utRes = await uploadFiles("imageUploader", {
          files: [data.image.file],
        });

        console.log("UploadThing response:", utRes);
      }
      setUploadingImage(false);
      const newSymbolsData = {
        id: productId,
        action: "add_symbols_graphics_item",
        tab: "symbols-graphics",
        data: {
          text: data.componentName,
          image: utRes?.[0]?.ufsUrl || null,
          entity: "Symbols",
          text_present: data.textPresent === "yes",
          label_presence: (Array.isArray(labelPresence)
            ? labelPresence
            : JSON.parse(labelPresence || "[]")
          ).map((tag: Tag) => tag.text),
        },
      };

      console.log("Symbols data", newSymbolsData);

      addSymbolsData(newSymbolsData);
      setOpen(false);
      reset();
      // Reset local state
      setTextPresent("yes");
      setLabelPresence([]);
    } catch (error) {
      console.error("Failed to add symbols item:", error);
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="text-xs">
          Add Symbols Item
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Add New Symbols Item
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add a new symbols item by providing details and uploading an image.
        </DialogDescription>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="add-symbols-form"
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
                <RadioGroup
                  value={textPresent}
                  onValueChange={setTextPresent}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`${id}-text-present-yes`} />
                    <Label htmlFor={`${id}-text-present-yes`}>Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`${id}-text-present-no`} />
                    <Label htmlFor={`${id}-text-present-no`}>No</Label>
                  </div>
                </RadioGroup>
                <input
                  type="hidden"
                  {...register("textPresent")}
                  value={textPresent}
                />
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-6">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Describe the symbol's purpose and specifications"
                  {...register("componentDescription")}
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
                setTextPresent("yes");
                setLabelPresence([]);
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              form="add-symbols-form"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending
                ? "Adding..."
                : uploadingImage
                ? "Uploading..."
                : "Add Symbols Item"}
            </Button>
          </DialogClose>
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
  const currentImage = value?.preview || files[0]?.preview || null;

  return (
    <div className="h-32 bg-muted relative flex size-full rounded-xl items-center justify-center overflow-hidden">
      {currentImage ? (
        <Image
          className="size-full object-cover rounded-xl"
          src={currentImage}
          alt={
            value?.file.name || files[0]?.file.name
              ? "Preview of uploaded symbol image"
              : "Default symbol image"
          }
          width={512}
          height={96}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
          <div className="flex flex-col items-center text-muted-foreground/60">
            <ImagePlusIcon className="w-8 h-8 mb-2" />
            <span className="text-xs">Symbol Image</span>
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
        aria-label="Upload symbol image"
      />
    </div>
  );
}

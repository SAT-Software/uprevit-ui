"use client";

import { useId, useState } from "react";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
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

export default function AddComponentDialog() {
  const id = useId();
  const [componentName, setComponentName] = useState("");
  const [componentNumber, setComponentNumber] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="text-xs">
          Add Component
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Add New Component
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add a new component by providing component details and uploading an
          image.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="flex gap-4 px-6 pt-4">
            <div className="w-1/3">
              <ComponentImage />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-component-name`}>Component Name</Label>
                <Input
                  id={`${id}-component-name`}
                  placeholder="Enter component name"
                  type="text"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-component-number`}>
                  Component Number
                </Label>
                <Input
                  id={`${id}-component-number`}
                  placeholder="Enter component number"
                  type="text"
                  value={componentNumber}
                  onChange={(e) => setComponentNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Describe the component's purpose and specifications"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
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
          <DialogClose asChild>
            <Button type="button">Add Component</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ComponentImage() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const currentImage = files[0]?.preview || null;

  return (
    <div className="h-32">
      <div className="bg-muted relative flex size-full rounded-xl items-center justify-center overflow-hidden">
        {currentImage ? (
          <Image
            className="size-full object-cover rounded-xl"
            src={currentImage}
            alt={
              files[0]?.preview
                ? "Preview of uploaded component image"
                : "Default component image"
            }
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
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload component image"
      />
    </div>
  );
}

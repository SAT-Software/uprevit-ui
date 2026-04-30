"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import {
  PiCheckCircleDuotone,
  PiMagnifyingGlassDuotone,
  PiPictureInPictureDuotone,
  PiPlusCircleDuotone,
  PiPlusSquareDuotone,
  PiXCircleDuotone,
  PiXDuotone,
} from "react-icons/pi";

import {
  FileWithPreview,
  useFileUpload,
} from "@/hooks/general/use-file-upload";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { useGetStandardSymbols } from "@/hooks/standard-symbols/useGetStandardSymbols";
import type { StandardSymbol } from "@/types/standard-symbol";
import { Button } from "@uprevit/ui/components/ui/button";
import { Checkbox } from "@uprevit/ui/components/ui/checkbox";
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@uprevit/ui/components/ui/radio-group";
import { Tag, TagInput } from "@uprevit/ui/components/ui/tag-input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { cn } from "@uprevit/ui/lib/utils";

type FormData = {
  componentName: string;
  componentDescription: string;
  textPresent: string;
  labelPresence: Tag[];
  image: FileWithPreview | null;
};

type ExistingSymbol = {
  componentName: string;
  standard_symbol_id?: string;
};

const normalizeSymbolText = (value: string) =>
  value.trim().replace(/\s+/g, " ").toLowerCase();

export default function AddSymbolsDialog({
  productId,
  isSubmitted = false,
  existingSymbols = [],
}: {
  productId: string;
  isSubmitted?: boolean;
  existingSymbols?: ExistingSymbol[];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"library" | "custom">("library");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [customLabelPresence, setCustomLabelPresence] = useState<Tag[]>([]);
  const [libraryLabelPresence, setLibraryLabelPresence] = useState<Tag[]>([]);
  const [libraryTextPresent, setLibraryTextPresent] = useState("yes");
  const [librarySearch, setLibrarySearch] = useState("");
  const [selectedSymbolIds, setSelectedSymbolIds] = useState<string[]>([]);

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

  const {
    data: standardSymbolsResponse,
    isLoading,
    error,
  } = useGetStandardSymbols();
  const standardSymbols = useMemo(
    () => standardSymbolsResponse?.result ?? [],
    [standardSymbolsResponse?.result],
  );

  console.log(standardSymbolsResponse);
  const { mutate: addSymbolsData, isPending } = useUpdateProductTabData();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();

  const existingStandardIds = useMemo(
    () =>
      new Set(
        existingSymbols
          .map((symbol) => symbol.standard_symbol_id)
          .filter((value): value is string => Boolean(value)),
      ),
    [existingSymbols],
  );
  const existingSymbolNames = useMemo(
    () =>
      new Set(
        existingSymbols.map((symbol) =>
          normalizeSymbolText(symbol.componentName),
        ),
      ),
    [existingSymbols],
  );

  const isAlreadyAdded = (symbol: StandardSymbol) =>
    existingStandardIds.has(symbol.id) ||
    existingSymbolNames.has(normalizeSymbolText(symbol.title));

  const filteredSymbols = useMemo(() => {
    const search = normalizeSymbolText(librarySearch);
    if (!search) return standardSymbols;

    return standardSymbols.filter((symbol) => {
      const searchableText = [
        symbol.title,
        symbol.ref_number,
        symbol.standard,
        symbol.description,
        symbol.standard_description,
      ]
        .filter(Boolean)
        .join(" ");

      return normalizeSymbolText(searchableText).includes(search);
    });
  }, [librarySearch, standardSymbols]);

  const selectableVisibleSymbolIds = filteredSymbols
    .filter((symbol) => !isAlreadyAdded(symbol))
    .map((symbol) => symbol.id);
  const allVisibleSelected =
    selectableVisibleSymbolIds.length > 0 &&
    selectableVisibleSymbolIds.every((symbolId) =>
      selectedSymbolIds.includes(symbolId),
    );
  const selectedSymbols = standardSymbols.filter(
    (symbol) =>
      selectedSymbolIds.includes(symbol.id) && !isAlreadyAdded(symbol),
  );

  const resetLibraryState = () => {
    setLibraryLabelPresence([]);
    setLibraryTextPresent("yes");
    setLibrarySearch("");
    setSelectedSymbolIds([]);
  };

  const resetDialogState = () => {
    reset();
    setCustomLabelPresence([]);
    resetLibraryState();
    setActiveTab("library");
  };

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetDialogState();
  };

  const toggleLibrarySymbol = (symbol: StandardSymbol) => {
    if (isAlreadyAdded(symbol)) return;

    setSelectedSymbolIds((current) =>
      current.includes(symbol.id)
        ? current.filter((symbolId) => symbolId !== symbol.id)
        : [...current, symbol.id],
    );
  };

  const toggleAllVisibleSymbols = () => {
    if (!selectableVisibleSymbolIds.length) return;

    setSelectedSymbolIds((current) => {
      if (allVisibleSelected) {
        return current.filter(
          (symbolId) => !selectableVisibleSymbolIds.includes(symbolId),
        );
      }

      return Array.from(new Set([...current, ...selectableVisibleSymbolIds]));
    });
  };

  const onSubmitLibrary = () => {
    if (isPending || selectedSymbols.length === 0) return;

    addSymbolsData(
      {
        id: productId,
        action: "add_standard_symbols_graphics",
        tab: "symbols-graphics",
        data: {
          symbols: selectedSymbols.map((symbol) => ({
            id: symbol.id,
            text_present: libraryTextPresent === "yes",
            label_presence: libraryLabelPresence.map((tag) => tag.text),
          })),
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          resetDialogState();
        },
      },
    );
  };

  const onSubmitCustom = async (data: FormData) => {
    if (isPending || uploadingImage) return;

    setUploadingImage(true);
    try {
      let uploadedImageKey: string | undefined;

      if (data.image && data.image.file instanceof File) {
        const s3UploadResult = await uploadFileToS3({
          file: data.image.file,
          contentType: data.image.file.type || "application/octet-stream",
        });

        uploadedImageKey = s3UploadResult.key;
      }
      setUploadingImage(false);

      addSymbolsData(
        {
          id: productId,
          action: "add_symbols_graphics",
          tab: "symbols-graphics",
          data: [
            {
              text: data.componentName,
              image: null,
              key: uploadedImageKey,
              entity: "Symbols",
              text_present: data.textPresent === "yes",
              label_presence: customLabelPresence.map((tag) => tag.text),
            },
          ],
        },
        {
          onSuccess: () => {
            setOpen(false);
            setUploadingImage(false);
            resetDialogState();
          },
          onError: () => {
            setUploadingImage(false);
          },
        },
      );
    } catch (error) {
      console.error("Failed to add symbols item:", error);
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" disabled={isSubmitted}>
          <PiPlusCircleDuotone />
          Add Symbol
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[86vh] max-h-[86vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl [&>button:last-child]:hidden">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="flex w-full items-center justify-between border-b bg-accent px-4 py-4 text-sm">
            <div className="flex items-center gap-2">
              <PiPlusCircleDuotone className="h-4 w-4" />
              <span>Add Symbol</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add symbols from the standard library or upload a custom symbol.
        </DialogDescription>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "library" | "custom")}
          className="min-h-0 flex-1 gap-0 overflow-hidden"
        >
          <div className="border-b px-4 py-3">
            <TabsList>
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="library"
            className="min-h-0 overflow-hidden data-[state=active]:flex"
          >
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 md:grid-cols-[1fr_280px]">
              <div className="flex min-h-0 flex-col border-b md:border-b-0 md:border-r">
                <div className="flex flex-col gap-3 border-b p-4">
                  <div className="relative">
                    <PiMagnifyingGlassDuotone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={librarySearch}
                      onChange={(event) => setLibrarySearch(event.target.value)}
                      placeholder="Search title, reference, standard, or description"
                      className="pl-9"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={toggleAllVisibleSymbols}
                      disabled={!selectableVisibleSymbolIds.length}
                    >
                      {allVisibleSelected ? "Clear selected" : "Select all"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedSymbolIds([])}
                      disabled={!selectedSymbolIds.length}
                    >
                      Clear selected
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {selectedSymbols.length} selected
                    </span>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto p-4">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      <Spinner />
                      <span className="ml-2">Loading symbols...</span>
                    </div>
                  ) : error ? (
                    <div className="flex h-full items-center justify-center text-sm text-destructive">
                      {error.message}
                    </div>
                  ) : filteredSymbols.length ? (
                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                      {filteredSymbols.map((symbol) => {
                        const alreadyAdded = isAlreadyAdded(symbol);
                        const selected = selectedSymbolIds.includes(symbol.id);

                        return (
                          <label
                            key={symbol.id}
                            htmlFor={`${id}-standard-symbol-${symbol.id}`}
                            className={cn(
                              "grid min-h-24 grid-cols-[76px_1fr] gap-3 rounded-md border bg-background p-2 text-left transition-colors",
                              selected && "border-primary bg-accent/50",
                              !alreadyAdded &&
                                "cursor-pointer hover:bg-accent/40",
                              alreadyAdded &&
                                "cursor-not-allowed bg-muted/40 opacity-60 hover:bg-muted/40",
                            )}
                          >
                            <div className="relative h-20 overflow-hidden rounded-md border bg-muted">
                              {symbol.image ? (
                                <Image
                                  src={symbol.image}
                                  alt={symbol.title}
                                  fill
                                  className="object-contain p-2"
                                  sizes="76px"
                                />
                              ) : (
                                <PiPictureInPictureDuotone className="size-full p-5 text-muted-foreground/50" />
                              )}
                            </div>
                            <div className="flex min-w-0 flex-col gap-2">
                              <div className="flex items-start gap-2">
                                <Checkbox
                                  id={`${id}-standard-symbol-${symbol.id}`}
                                  checked={selected}
                                  disabled={alreadyAdded}
                                  className="mt-0.5"
                                  onCheckedChange={() =>
                                    toggleLibrarySymbol(symbol)
                                  }
                                  aria-label={`Select ${symbol.title}`}
                                />
                                <div className="min-w-0">
                                  <p className="line-clamp-2 text-sm font-medium">
                                    {symbol.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Ref {symbol.ref_number}
                                  </p>
                                </div>
                              </div>
                              {alreadyAdded && (
                                <p className="text-xs text-muted-foreground">
                                  Already added to this product
                                </p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No standard symbols found.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex min-h-0 flex-col gap-4 overflow-hidden p-4">
                <div className="space-y-2">
                  <Label>Symbol text present</Label>
                  <RadioGroup
                    value={libraryTextPresent}
                    onValueChange={setLibraryTextPresent}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="yes"
                        id={`${id}-library-text-present-yes`}
                      />
                      <Label htmlFor={`${id}-library-text-present-yes`}>
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="no"
                        id={`${id}-library-text-present-no`}
                      />
                      <Label htmlFor={`${id}-library-text-present-no`}>
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <TagInput
                    label="Presence on labels"
                    tags={libraryLabelPresence}
                    setTags={setLibraryLabelPresence}
                    placeholder="Add label and press Enter"
                  />
                  <p className="text-xs text-muted-foreground">
                    Applied to all selected symbols.
                  </p>
                </div>

                <div className="min-h-0 flex-1 overflow-auto rounded-md border">
                  {selectedSymbols.length ? (
                    <div className="divide-y">
                      {selectedSymbols.map((symbol) => (
                        <div
                          key={symbol.id}
                          className="flex items-start justify-between gap-2 p-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {symbol.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Ref {symbol.ref_number}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                            onClick={() =>
                              setSelectedSymbolIds((current) =>
                                current.filter(
                                  (symbolId) => symbolId !== symbol.id,
                                ),
                              )
                            }
                            aria-label={`Remove ${symbol.title}`}
                          >
                            <PiXDuotone size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full min-h-32 items-center justify-center px-4 text-center text-sm text-muted-foreground">
                      Selected symbols will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="min-h-0 overflow-auto">
            <form onSubmit={handleSubmit(onSubmitCustom)} id="add-symbols-form">
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
                            <Label htmlFor={`${id}-text-present-yes`}>
                              Yes
                            </Label>
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
                <div className="space-y-2">
                  <TagInput
                    label="Presence on labels"
                    tags={customLabelPresence}
                    setTags={setCustomLabelPresence}
                    placeholder="Add label and press Enter"
                  />
                  <input
                    type="hidden"
                    {...register("labelPresence")}
                    value={JSON.stringify(customLabelPresence)}
                  />
                  <p className="text-xs text-muted-foreground -mt-1">
                    Press Enter to add a label type. You can add multiple label
                    types.
                  </p>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter className="shrink-0 border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={resetDialogState}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          {activeTab === "library" ? (
            <Button
              type="button"
              size="sm"
              onClick={onSubmitLibrary}
              disabled={isPending || selectedSymbols.length === 0}
              aria-busy={isPending}
            >
              {isPending ? <Spinner /> : <PiCheckCircleDuotone />}
              {isPending ? "Adding..." : "Add Selected"}
            </Button>
          ) : (
            <Button
              form="add-symbols-form"
              type="button"
              size="sm"
              onClick={handleSubmit(onSubmitCustom)}
              disabled={isPending || uploadingImage}
              aria-busy={isPending || uploadingImage}
            >
              {isPending || uploadingImage ? (
                <Spinner />
              ) : (
                <PiPlusCircleDuotone />
              )}
              {isPending
                ? "Adding..."
                : uploadingImage
                  ? "Uploading..."
                  : "Add Symbol"}
            </Button>
          )}
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
      <div className="group relative flex size-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30 transition-colors hover:bg-muted/50">
        {currentImage ? (
          <Image
            className="size-full rounded-xl object-cover"
            src={currentImage}
            alt={
              value?.file.name || files[0]?.file.name
                ? "Preview of uploaded symbol image"
                : "Symbol image"
            }
            width={512}
            height={96}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/50">
            <PiPictureInPictureDuotone className="h-12 w-12" />
            <span className="text-xs font-medium">Upload Image</span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-background text-foreground outline-none transition-[color,box-shadow] hover:bg-accent focus-visible:ring-[3px]"
            onClick={openFileDialog}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <PiPlusSquareDuotone size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground outline-none transition-[color,box-shadow] hover:bg-destructive/90 focus-visible:ring-[3px]"
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
          aria-label="Upload symbol image"
        />
      </div>
    </div>
  );
}

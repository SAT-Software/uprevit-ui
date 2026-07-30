"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { useGetStandardSymbols } from "@/hooks/standard-symbols/useGetStandardSymbols";
import type { StandardSymbol } from "@/types/standard-symbol";
import { Button } from "@uprevit/ui/components/ui/button";
import { Checkbox } from "@uprevit/ui/components/ui/checkbox";
import { Dialog, DialogClose, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@uprevit/ui/components/ui/radio-group";
import { TagInput, Tag } from "@uprevit/ui/components/ui/tag-input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { ScrollArea } from "@uprevit/ui/components/ui/scroll-area";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Image01Icon,
  PlusSignSquareIcon,
  Search02Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@uprevit/ui/lib/utils";
import { GraphicsImageUpload } from "./GraphicsImageUpload";

type FormData = {
  componentName: string;
  textPresent: string;
  labelPresence: Tag[];
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
  const customFormId = `add-symbols-form-${id}`;
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"library" | "custom">("library");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [customGraphicImage, setCustomGraphicImage] = useState<File | null>(
    null,
  );
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
  } = useForm<FormData>({
    defaultValues: {
      textPresent: "yes",
      labelPresence: [],
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
    setCustomGraphicImage(null);
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
      let uploadedImageSizeBytes: number | undefined;

      if (customGraphicImage) {
        const s3UploadResult = await uploadFileToS3({
          file: customGraphicImage,
          contentType: customGraphicImage.type || "application/octet-stream",
          uploadScope: "product-assets",
          productId,
        });

        uploadedImageKey = s3UploadResult.key;
        uploadedImageSizeBytes = s3UploadResult.size;
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
              sizeBytes: uploadedImageSizeBytes,
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
    } catch (submitError) {
      console.error("Failed to add symbols item:", submitError);
      setUploadingImage(false);
    }
  };

  const isCustomSaving = uploadingImage || isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" disabled={isSubmitted}>
          <Icon icon={PlusSignSquareIcon} />
          Add Symbol
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Add Symbol"
        description="Add symbols from the standard library or upload a custom symbol."
        variant="custom"
        className="sm:max-w-2xl"
        bodyClassName="overflow-hidden p-0 [&>[data-slot=scroll-area-viewport]]:overflow-hidden [&>[data-slot=scroll-area-scrollbar]]:hidden"
        footer={
          <>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={resetDialogState}
                disabled={isPending || uploadingImage}
              >
                <Icon icon={Cancel01Icon} size={16} strokeWidth={2} />
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
                {isPending ? (
                  <Spinner />
                ) : (
                  <Icon icon={CheckmarkCircle01Icon} size={16} strokeWidth={2} />
                )}
                {isPending ? "Adding..." : "Add Selected"}
              </Button>
            ) : (
              <Button
                form={customFormId}
                type="submit"
                size="sm"
                disabled={isCustomSaving || isSubmitted}
                aria-busy={isCustomSaving}
              >
                {isCustomSaving ? (
                  <Spinner />
                ) : (
                  <Icon icon={PlusSignSquareIcon} size={16} strokeWidth={2} />
                )}
                {isPending
                  ? "Adding..."
                  : uploadingImage
                    ? "Uploading..."
                    : "Add Symbol"}
              </Button>
            )}
          </>
        }
      >
        <div className="flex h-[640px] max-h-[calc(90vh-5rem)] flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "library" | "custom")
            }
            className="flex h-full min-h-0 flex-1 flex-col gap-0 overflow-hidden"
          >
            <div className="flex h-10 shrink-0 items-center border-b border-border px-2">
              <TabsList variant="line">
                <TabsTrigger value="library">Library</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </div>

          <TabsContent
            value="library"
            className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden data-[state=active]:flex"
          >
            <FieldGroup className="shrink-0 gap-4 px-3 py-2">
              <Field>
                <FormFieldLabel
                  label="Symbol text present"
                  tooltip="Whether selected symbols include visible text on the label."
                />
                <RadioGroup
                  value={libraryTextPresent}
                  onValueChange={setLibraryTextPresent}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="yes"
                      id={`${id}-library-text-present-yes`}
                    />
                    <Label htmlFor={`${id}-library-text-present-yes`}>
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="no"
                      id={`${id}-library-text-present-no`}
                    />
                    <Label htmlFor={`${id}-library-text-present-no`}>
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </Field>

              <Field>
                <FormFieldLabel
                  htmlFor={`${id}-library-label-presence`}
                  label="Presence on labels"
                  tooltip="Applied to all selected symbols. Press Enter after each entry."
                  optional
                />
                <TagInput
                  id={`${id}-library-label-presence`}
                  tags={libraryLabelPresence}
                  setTags={setLibraryLabelPresence}
                  placeholder="Add label and press Enter"
                />
              </Field>
            </FieldGroup>

            <div className="flex h-10 shrink-0 items-center gap-2 border-y border-border px-3">
              <InputGroup size="sm" className="min-w-0 flex-1 bg-background">
                <InputGroupAddon>
                  <Icon icon={Search02Icon} size={14} strokeWidth={2} />
                </InputGroupAddon>
                <InputGroupInput
                  value={librarySearch}
                  onChange={(event) => setLibrarySearch(event.target.value)}
                  placeholder="Search title, reference, standard, or description"
                />
              </InputGroup>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={toggleAllVisibleSymbols}
                disabled={!selectableVisibleSymbolIds.length}
                className="shrink-0"
              >
                <Icon
                  icon={allVisibleSelected ? Cancel01Icon : Tick01Icon}
                  size={14}
                  strokeWidth={2}
                />
                {allVisibleSelected ? "Clear visible" : "Select all"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setSelectedSymbolIds([])}
                disabled={!selectedSymbolIds.length}
                className="shrink-0"
              >
                Clear selected
              </Button>
              <span className="shrink-0 text-xs text-muted-foreground">
                {selectedSymbols.length} selected
              </span>
            </div>

            <ScrollArea className="min-h-0 flex-1" scrollFade type="always">
              {isLoading ? (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  <Spinner />
                  <span className="ml-2">Loading symbols...</span>
                </div>
              ) : error ? (
                <div className="flex h-40 items-center justify-center text-sm text-destructive">
                  {error.message}
                </div>
              ) : filteredSymbols.length ? (
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {filteredSymbols.map((symbol, index) => {
                    const alreadyAdded = isAlreadyAdded(symbol);
                    const selected = selectedSymbolIds.includes(symbol.id);
                    const isLastItem = index === filteredSymbols.length - 1;
                    const isLastRowLg =
                      index >=
                      filteredSymbols.length -
                        (filteredSymbols.length % 2 === 0 ? 2 : 1);

                    return (
                      <label
                        key={symbol.id}
                        htmlFor={`${id}-standard-symbol-${symbol.id}`}
                        className={cn(
                          "flex items-start gap-3 border-b border-border px-3 py-3 text-left transition-colors",
                          index % 2 === 0 && "lg:border-r",
                          isLastItem && "border-b-0 lg:border-b",
                          isLastRowLg && "lg:border-b-0",
                          selected && "bg-accent/50",
                          !alreadyAdded && "cursor-pointer hover:bg-accent/30",
                          alreadyAdded &&
                            "cursor-not-allowed bg-muted/40 opacity-60 hover:bg-muted/40",
                        )}
                      >
                        <Checkbox
                          id={`${id}-standard-symbol-${symbol.id}`}
                          checked={selected}
                          disabled={alreadyAdded}
                          className="mt-0.5 shadow-none"
                          onCheckedChange={() => toggleLibrarySymbol(symbol)}
                          aria-label={`Select ${symbol.title}`}
                        />
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                          {symbol.image ? (
                            <Image
                              src={symbol.image}
                              alt={symbol.title}
                              fill
                              className="object-contain p-1.5"
                              sizes="56px"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground/50">
                              <Icon
                                icon={Image01Icon}
                                size={22}
                                strokeWidth={1.5}
                              />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium text-foreground">
                            {symbol.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Ref {symbol.ref_number}
                          </p>
                          {alreadyAdded ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Already added to this product
                            </p>
                          ) : null}
                        </div>
                        <Icon
                          icon={CheckmarkCircle01Icon}
                          size={16}
                          strokeWidth={2}
                          className={cn(
                            "mt-0.5 shrink-0 transition-opacity",
                            selected
                              ? "text-primary opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  No standard symbols found.
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="custom"
            className="mt-0 min-h-0 flex-1 overflow-auto data-[state=active]:block"
          >
            <form
              id={customFormId}
              onSubmit={handleSubmit(onSubmitCustom)}
              noValidate
            >
              <FieldGroup className="gap-4 p-3">
                <Field>
                  <GraphicsImageUpload
                    key={open ? "custom-open" : "custom-closed"}
                    label="Symbol Image"
                    tooltip="Upload a reference image for this custom symbol."
                    setNewImage={setCustomGraphicImage}
                  />
                </Field>

                <Field data-invalid={!!errors.componentName}>
                  <FormFieldLabel
                    htmlFor={`${id}-component-name`}
                    label="Symbol Text"
                    tooltip="The text displayed for this symbol on the label."
                  />
                  <InputGroup size="md" className="bg-background">
                    <InputGroupInput
                      id={`${id}-component-name`}
                      placeholder="Enter symbol text"
                      type="text"
                      aria-invalid={errors.componentName ? "true" : "false"}
                      {...register("componentName", {
                        required: "Symbol text is required",
                      })}
                    />
                  </InputGroup>
                  <FieldError errors={[errors.componentName]} />
                </Field>

                <Field>
                  <FormFieldLabel
                    label="Symbol text present"
                    tooltip="Whether the symbol includes visible text on the label."
                  />
                  <Controller
                    name="textPresent"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
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
                </Field>

                <Field>
                  <FormFieldLabel
                    htmlFor={`${id}-custom-label-presence`}
                    label="Presence on labels"
                    tooltip="Label types where this symbol appears. Press Enter after each entry."
                    optional
                  />
                  <TagInput
                    id={`${id}-custom-label-presence`}
                    tags={customLabelPresence}
                    setTags={setCustomLabelPresence}
                    placeholder="Add label and press Enter"
                  />
                  <input
                    type="hidden"
                    {...register("labelPresence")}
                    value={JSON.stringify(customLabelPresence)}
                  />
                  <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                    Press Enter to add a label type. You can add multiple label
                    types.
                  </p>
                </Field>
              </FieldGroup>
            </form>
          </TabsContent>
          </Tabs>
        </div>
      </AppDialogContent>
    </Dialog>
  );
}

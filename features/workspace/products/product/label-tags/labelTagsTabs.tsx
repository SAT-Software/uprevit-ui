"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AnnotationState } from "@markerjs/markerjs3";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { PiArrowRightBold, PiImageDuotone, PiTagDuotone } from "react-icons/pi";
import DialogAddLabelTag from "./DialogAddLabelTag";
import DialogDeleteLabelTag from "./DialogDeleteLabelTag";
import DialogEditLabelTag from "./DialogEditLabelTag";
import Editor from "./Editor";
import Render from "./Renderer";
import SaveTaggedImageDialog from "./SaveTaggedImageDialog";
import UnsavedAnnotationDialog from "./UnsavedAnnotationDialog";
import { useUpdateLabelTaggedImage } from "@/hooks/product/useUpdateLabelTaggedImage";
import { uploadFiles } from "@/utils/uploadthing";
import { toast } from "sonner";

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
  tagged_image?: string;
  annotation_state?: AnnotationState;
  _isFromDiff?: boolean;
  _isRemovedFromDiff?: boolean;
}

interface DiffItem {
  path: string;
  status: "added" | "removed" | "modified";
  old_value: any;
  new_value: any;
}

interface LabelTagsTabsProps {
  labelTagsData: LabelTagItem[];
  productId: string;
  isSubmitted?: boolean;
  isRedlineView?: boolean;
  diffs?: DiffItem[];
}

export default function LabelTagsTabs({
  labelTagsData,
  productId,
  isSubmitted = false,
  isRedlineView = false,
  diffs = [],
}: LabelTagsTabsProps) {
  const [activeTab, setActiveTab] = useState("");
  const [annotations, setAnnotations] = useState<
    Record<string, AnnotationState>
  >({});

  console.log("annotations", annotations);

  const [renderItem, setRenderItem] = useState<{
    id: string;
    image: string;
  } | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState<{
    itemId: string;
    itemImage: string;
    annotation: AnnotationState;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Dirty state tracking
  const [currentEditorState, setCurrentEditorState] = useState<
    Record<string, AnnotationState>
  >({});
  const [savedAnnotations, setSavedAnnotations] = useState<
    Record<string, AnnotationState>
  >({});
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);

  const { mutateAsync: updateLabelTaggedImage, isPending: isUpdating } =
    useUpdateLabelTaggedImage();

  const handleSave = (
    itemId: string,
    itemImage: string,
    annotation: AnnotationState
  ) => {
    setAnnotations((prev) => ({ ...prev, [itemId]: annotation }));
    setPendingSave({ itemId, itemImage, annotation });
    setSaveDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingSave) return;
    setRenderItem({
      id: pendingSave.itemId,
      image: pendingSave.itemImage,
    });
  };

  const handleRendered = async (dataUrl: string) => {
    if (!pendingSave) return;

    try {
      setIsSaving(true);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "tagged-image.png", { type: "image/png" });

      const utRes = await uploadFiles("imageUploader", { files: [file] });
      const uploadedUrl = utRes?.[0]?.ufsUrl || "";

      if (!uploadedUrl) {
        throw new Error("Failed to get uploaded image URL");
      }

      await updateLabelTaggedImage({
        productId,
        labelTagId: pendingSave.itemId,
        taggedImage: uploadedUrl,
        annotationState: pendingSave.annotation,
      });

      setSavedAnnotations((prev) => ({
        ...prev,
        [pendingSave.itemId]: pendingSave.annotation,
      }));

      setPendingSave(null);
      setSaveDialogOpen(false);
    } catch (error) {
      console.error("Failed to upload tagged image:", error);
      toast.error("Failed to upload tagged image");
      setPendingSave(null);
      setSaveDialogOpen(false);
    } finally {
      setIsSaving(false);
      setRenderItem(null);
    }
  };

  const filteredLabelTypesForTabs: string[] = [
    ...new Set(
      labelTagsData
        ?.map((item: LabelTagItem) => item.type)
        ?.filter((type): type is string => !!type)
    ),
  ];

  const effectiveActiveTab =
    activeTab || filteredLabelTypesForTabs[0] || "tab-1";

  const getCurrentItemId = useCallback(() => {
    const currentTabData = labelTagsData.filter(
      (item: LabelTagItem) => item.type === effectiveActiveTab
    );
    return currentTabData[0]?._id || null;
  }, [labelTagsData, effectiveActiveTab]);

  const isDirty = useCallback(
    (itemId: string) => {
      const current = currentEditorState[itemId];
      if (!current) return false;

      const baseline = savedAnnotations[itemId];
      if (!baseline) {
        return current.markers && current.markers.length > 0;
      }

      return JSON.stringify(current) !== JSON.stringify(baseline);
    },
    [currentEditorState, savedAnnotations]
  );

  const hasAnyDirtyItems = useCallback(() => {
    return Object.keys(currentEditorState).some((itemId) => isDirty(itemId));
  }, [currentEditorState, isDirty]);

  const handleStateChange = useCallback(
    (itemId: string, annotation: AnnotationState) => {
      setCurrentEditorState((prev) => ({ ...prev, [itemId]: annotation }));
    },
    []
  );

  const handleTabChange = useCallback(
    (newTab: string) => {
      const currentItemId = getCurrentItemId();
      if (currentItemId && isDirty(currentItemId)) {
        setPendingTabChange(newTab);
        setUnsavedDialogOpen(true);
      } else {
        setActiveTab(newTab);
      }
    },
    [getCurrentItemId, isDirty]
  );

  const handleUnsavedSave = async () => {
    const currentItemId = getCurrentItemId();
    if (!currentItemId) return;

    const currentState = currentEditorState[currentItemId];
    const currentItem = labelTagsData.find(
      (item) => item._id === currentItemId
    );
    if (!currentState || !currentItem?.image) return;

    handleSave(currentItemId, currentItem.image, currentState);

    setUnsavedDialogOpen(false);
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
  };

  const handleUnsavedDiscard = () => {
    const currentItemId = getCurrentItemId();
    if (currentItemId) {
      const currentItem = labelTagsData.find(
        (item) => item._id === currentItemId
      );
      setCurrentEditorState((prev) => ({
        ...prev,
        [currentItemId]:
          savedAnnotations[currentItemId] ?? currentItem?.annotation_state,
      }));
    }
    setUnsavedDialogOpen(false);
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
  };

  const handleUnsavedCancel = () => {
    setUnsavedDialogOpen(false);
    setPendingTabChange(null);
  };

  // Initialize savedAnnotations from labelTagsData on mount
  useEffect(() => {
    const initialSaved: Record<string, AnnotationState> = {};
    labelTagsData.forEach((item: LabelTagItem) => {
      if (item._id && item.annotation_state) {
        initialSaved[item._id] = item.annotation_state;
      }
    });
    setSavedAnnotations(initialSaved);
  }, [labelTagsData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasAnyDirtyItems()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasAnyDirtyItems]);

  const getDiff = (index: number, property?: string) => {
    const basePath = `label_tags.data[${index}]`;
    if (property) {
      return diffs.find((d) => d.path === `${basePath}.${property}`);
    }
    return diffs.find((d) => d.path === basePath);
  };

  const getItemStatus = (
    item: LabelTagItem,
    index: number
  ): "added" | "removed" | "modified" | null => {
    if (item._isFromDiff) return "added";
    if (item._isRemovedFromDiff) return "removed";

    // Check if this item has any modifications
    const itemDiffs = diffs.filter((d) =>
      d.path.startsWith(`label_tags.data[${index}].`)
    );
    if (itemDiffs.length > 0) return "modified";

    return null;
  };

  const RedlineValue = ({
    value,
    diff,
    formatFn,
    isImage = false,
  }: {
    value: string;
    diff: DiffItem | undefined;
    formatFn?: (v: any) => string;
    isImage?: boolean;
  }) => {
    if (!isRedlineView || !diff) return <>{value}</>;

    const format = formatFn || ((v: any) => v?.toString() || "");
    const isRemoved = diff.status === "removed";
    const isAdded = diff.status === "added";

    if (isImage) {
      return (
        <div className="flex flex-col gap-2">
          {(diff.old_value || isRemoved) && (
            <div className="relative">
              <span className="absolute top-2 left-2 z-10 text-[10px] font-bold tracking-wider text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full shadow-sm">
                OLD
              </span>
              {diff.old_value ? (
                <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-red-300 bg-red-50/30 opacity-60">
                  <Image
                    src={diff.old_value}
                    alt="Previous image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-muted-foreground bg-red-50/30 rounded-lg border-2 border-red-300 border-dashed opacity-60">
                  <PiImageDuotone className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs">No image</p>
                </div>
              )}
            </div>
          )}
          {diff.old_value && diff.new_value && !isRemoved && !isAdded && (
            <div className="flex items-center justify-center">
              <PiArrowRightBold className="text-muted-foreground/50 rotate-90" />
            </div>
          )}
          {(diff.new_value || isAdded) && !isRemoved && (
            <div className="relative">
              <span className="absolute top-2 left-2 z-10 text-[10px] font-bold tracking-wider text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full shadow-sm">
                NEW
              </span>
              {diff.new_value ? (
                <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-blue-300 bg-blue-50/30">
                  <Image
                    src={diff.new_value}
                    alt="New image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-muted-foreground bg-blue-50/30 rounded-lg border-2 border-blue-300 border-dashed">
                  <PiImageDuotone className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs">No image</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        {(diff.old_value !== null || isRemoved) && (
          <span className="relative group/old">
            <span className="line-through text-sm text-red-600/70 bg-red-100/50 dark:bg-red-900/10 px-1.5 py-0.5 rounded border border-red-200/50 dark:border-red-800/20">
              {format(diff.old_value) || ""}
            </span>
          </span>
        )}

        {diff.old_value !== null &&
          diff.new_value !== null &&
          !isRemoved &&
          !isAdded && (
            <PiArrowRightBold className="text-muted-foreground/50 text-xs" />
          )}

        {(diff.new_value !== null || isAdded) && !isRemoved && (
          <span className="text-sm text-blue-700 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-semibold border border-blue-200 dark:border-blue-800/30 shadow-sm">
            {format(diff.new_value) || ""}
          </span>
        )}
      </span>
    );
  };

  if (!labelTagsData || labelTagsData.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between border-b border-border p-2">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Label Tags</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              Manage label tags and their images for this product
            </p>
          </div>
          <DialogAddLabelTag productId={productId} isSubmitted={isSubmitted} />
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-4 p-4">
          <div className="p-4 rounded-full bg-muted">
            <PiTagDuotone className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              No Label Tags Added
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Add label tags to organize and visualize different labels for this
              product.
            </p>
          </div>
          <DialogAddLabelTag productId={productId} isSubmitted={isSubmitted} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-border p-2">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold">Label Tags</p>
          <div className="w-1 h-1 bg-border border border-border rounded-full" />
          <p className="text-xs text-muted-foreground font-medium">
            Manage label tags and their images for this product
          </p>
        </div>
        <DialogAddLabelTag productId={productId} isSubmitted={isSubmitted} />
      </div>

      <div className="p-2">
        <Tabs
          defaultValue="tab-1"
          value={effectiveActiveTab}
          onValueChange={handleTabChange}
        >
          <ScrollArea className="flex-1 pb-2">
            <TabsList>
              {filteredLabelTypesForTabs?.map((type, i) => {
                return (
                  <TabsTrigger key={`${i}-${type}`} value={type}>
                    {type}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {filteredLabelTypesForTabs.map((type) => {
            const currentTabData = labelTagsData.filter(
              (item: LabelTagItem) => item.type === type
            );
            return currentTabData.map((item: LabelTagItem, i) => {
              const originalIndex = labelTagsData.findIndex(
                (d) => d._id === item._id
              );
              const itemStatus = getItemStatus(item, originalIndex);
              const isRemoved = itemStatus === "removed";
              const isAdded = itemStatus === "added";
              const isModified = itemStatus === "modified";

              const nameDiff = getDiff(originalIndex, "name");
              const descriptionDiff = getDiff(originalIndex, "description");
              const imageDiff = getDiff(originalIndex, "image");

              return (
                <TabsContent key={`${i}-${type}`} value={type}>
                  <div
                    className={cn(
                      "w-full shadow-none transition-all duration-200",
                      isRedlineView &&
                        isRemoved &&
                        "border-red-500/50 bg-red-100/5 opacity-60",
                      isRedlineView &&
                        isAdded &&
                        "border-blue-500/50 bg-blue-100/5",
                      isRedlineView &&
                        isModified &&
                        "border-amber-500/50 bg-amber-100/10",
                      !isRedlineView || !itemStatus ? "border-border" : ""
                    )}
                  >
                    <div className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div
                            className={cn(
                              "text-sm font-semibold flex items-center gap-2",
                              isRedlineView &&
                                isRemoved &&
                                "line-through text-red-500/70"
                            )}
                          >
                            {isRedlineView && nameDiff ? (
                              <RedlineValue
                                value={item.name || "Untitled Label"}
                                diff={nameDiff}
                              />
                            ) : (
                              item.name || "Untitled Label"
                            )}
                            <span className="text-sm font-normal text-muted-foreground">
                              -
                            </span>
                            <span
                              className={cn(
                                "text-sm font-normal text-muted-foreground",
                                isRedlineView &&
                                  isRemoved &&
                                  "line-through text-red-500/70"
                              )}
                            >
                              {isRedlineView && descriptionDiff ? (
                                <RedlineValue
                                  value={item.description || ""}
                                  diff={descriptionDiff}
                                />
                              ) : (
                                item.description
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* <Badge variant="secondary" className="text-xs">
                              {item.type || "Unknown Type"}
                            </Badge> */}
                            {isRedlineView && isAdded && (
                              <span className="text-[10px] font-bold tracking-wider text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full shadow-sm">
                                NEW
                              </span>
                            )}
                            {isRedlineView && isRemoved && (
                              <span className="text-[10px] font-bold tracking-wider text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full shadow-sm">
                                REMOVED
                              </span>
                            )}
                            {isRedlineView && isModified && (
                              <span className="text-[10px] font-bold tracking-wider text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full shadow-sm">
                                MODIFIED
                              </span>
                            )}
                          </div>
                        </div>
                        {!isRedlineView && (
                          <div className="flex items-center gap-2">
                            <DialogEditLabelTag
                              productId={productId}
                              labelTag={item}
                              isSubmitted={isSubmitted}
                            />
                            <DialogDeleteLabelTag
                              productId={productId}
                              labelTag={item}
                              isSubmitted={isSubmitted}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-start">
                          {isRedlineView && imageDiff ? (
                            <div className="relative w-full max-w-md">
                              <RedlineValue
                                value={item.image || ""}
                                diff={imageDiff}
                                isImage={true}
                              />
                            </div>
                          ) : item.image ? (
                            // <div className="relative w-full max-w-md">
                            //   <div
                            //     className={cn(
                            //       "aspect-square relative overflow-hidden rounded-lg border bg-muted",
                            //       isRedlineView && isRemoved
                            //         ? "border-red-300 opacity-60"
                            //         : isRedlineView && isAdded
                            //         ? "border-blue-300"
                            //         : "border-border"
                            //     )}
                            //   >
                            //     <Image
                            //       src={item.image}
                            //       alt={item.name || "label image"}
                            //       fill
                            //       className="object-cover"
                            //       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            //     />
                            //   </div>
                            // </div>
                            // <EditorLabelTag
                            //   targetImage={item.image}
                            //   onSave={handleSave}
                            // />
                            <Editor
                              targetImageSrc={item.image}
                              annotation={
                                currentEditorState[item._id] ??
                                savedAnnotations[item._id] ??
                                item.annotation_state ??
                                annotations[item._id] ??
                                null
                              }
                              onSave={(newAnnotation) => {
                                handleSave(
                                  item._id,
                                  item.image!,
                                  newAnnotation
                                );
                              }}
                              onStateChange={(newAnnotation) => {
                                handleStateChange(item._id, newAnnotation);
                              }}
                            />
                          ) : (
                            <div
                              className={cn(
                                "flex flex-col items-center justify-center p-12 text-muted-foreground rounded-lg border border-dashed w-full max-w-md",
                                isRedlineView && isRemoved
                                  ? "border-red-300 bg-red-50/30 opacity-60"
                                  : isRedlineView && isAdded
                                  ? "border-blue-300 bg-blue-50/30"
                                  : "bg-muted/50 border-border"
                              )}
                            >
                              <PiImageDuotone className="w-12 h-12 mb-3 opacity-50" />
                              <p className="text-sm font-medium">
                                No Image Available
                              </p>
                              <p className="text-xs text-center mt-1">
                                Add an image to better visualize this label
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              );
            });
          })}
          {/* {filteredLabelTypesForTabs.map((type) => {
            const currentTabData = labelTagsData.filter(
              (item: LabelTagItem) => item.type === type
            );

            return currentTabData.map((item: LabelTagItem, i) => {
              if (!item.image) {
                return null;
              }
              return (
                <EditorLabelTag targetImage={item.image} onSave={handleSave} />
              );
            });
          })} */}

          {renderItem && annotations[renderItem.id] && (
            <Render
              targetImage={renderItem.image}
              annotation={annotations[renderItem.id]}
              mode="upload"
              onRendered={handleRendered}
              onComplete={() => setRenderItem(null)}
            />
          )}

          <SaveTaggedImageDialog
            open={saveDialogOpen}
            onOpenChange={(open) => {
              setSaveDialogOpen(open);
              if (!open) {
                setPendingSave(null);
              }
            }}
            onConfirm={handleConfirmSave}
            isPending={isSaving || isUpdating}
          />

          <UnsavedAnnotationDialog
            open={unsavedDialogOpen}
            onOpenChange={setUnsavedDialogOpen}
            onSave={handleUnsavedSave}
            onDiscard={handleUnsavedDiscard}
            onCancel={handleUnsavedCancel}
            isSaving={isSaving || isUpdating}
          />
        </Tabs>
      </div>
    </>
  );
}

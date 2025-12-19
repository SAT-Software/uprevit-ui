"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AnnotationState } from "@markerjs/markerjs3";
import Image from "next/image";
import { useState } from "react";
import { PiArrowRightBold, PiImageDuotone, PiTagDuotone } from "react-icons/pi";
import DialogAddLabelTag from "./DialogAddLabelTag";
import DialogDeleteLabelTag from "./DialogDeleteLabelTag";
import DialogEditLabelTag from "./DialogEditLabelTag";
import Editor from "./Editor";
import Render from "./Viewer";

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
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
  const [annotation, setAnnotation] = useState<AnnotationState | null>(null);

  const handleSave = (annotation: AnnotationState) => {
    setAnnotation(annotation);
  };

  // Helper to find a diff by path and optional property (e.g., "name", "description", "image")
  const getDiff = (index: number, property?: string) => {
    const basePath = `label_tags.data[${index}]`;
    if (property) {
      return diffs.find((d) => d.path === `${basePath}.${property}`);
    }
    return diffs.find((d) => d.path === basePath);
  };

  // Helper to get status for an item (whole row)
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

  // Simple inline component for redline display
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
      // For images, show old/new side by side or with indication
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
        {/* Old value - show for modified and removed */}
        {(diff.old_value !== null || isRemoved) && (
          <span className="relative group/old">
            <span className="line-through text-sm text-red-600/70 bg-red-100/50 dark:bg-red-900/10 px-1.5 py-0.5 rounded border border-red-200/50 dark:border-red-800/20">
              {format(diff.old_value) || ""}
            </span>
          </span>
        )}

        {/* Arrow separator for modified */}
        {diff.old_value !== null &&
          diff.new_value !== null &&
          !isRemoved &&
          !isAdded && (
            <PiArrowRightBold className="text-muted-foreground/50 text-xs" />
          )}

        {/* New value - show for modified and added */}
        {(diff.new_value !== null || isAdded) && !isRemoved && (
          <span className="text-sm text-blue-700 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-semibold border border-blue-200 dark:border-blue-800/30 shadow-sm">
            {format(diff.new_value) || ""}
          </span>
        )}
      </span>
    );
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

  // Empty state when no label tags exist
  if (!labelTagsData || labelTagsData.length === 0) {
    return (
      <>
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-border p-4">
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
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold">Label Tags</p>
          <div className="w-1 h-1 bg-border border border-border rounded-full" />
          <p className="text-xs text-muted-foreground font-medium">
            Manage label tags and their images for this product
          </p>
        </div>
        <DialogAddLabelTag productId={productId} isSubmitted={isSubmitted} />
      </div>

      <div className="p-4">
        <Tabs
          defaultValue="tab-1"
          value={effectiveActiveTab}
          onValueChange={setActiveTab}
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
              // Find the original index in labelTagsData for diff lookup
              const originalIndex = labelTagsData.findIndex(
                (d) => d._id === item._id
              );
              const itemStatus = getItemStatus(item, originalIndex);
              const isRemoved = itemStatus === "removed";
              const isAdded = itemStatus === "added";
              const isModified = itemStatus === "modified";

              // Get diffs for individual fields
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
                    <div className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div
                            className={cn(
                              "text-xl font-semibold flex items-center gap-2",
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
                            <span className="text-base font-normal text-muted-foreground">
                              -
                            </span>
                            <span
                              className={cn(
                                "text-base font-normal text-muted-foreground",
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
                              annotation={annotation}
                              onSave={(newAnnotation) => {
                                handleSave(newAnnotation);
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
          {/* Render only the currently active tab's image */}
          {(() => {
            const activeItem = labelTagsData.find(
              (item: LabelTagItem) =>
                item.type === effectiveActiveTab && item.image
            );
            if (activeItem?.image && annotation) {
              return (
                <Render
                  targetImage={activeItem.image}
                  annotation={annotation}
                />
              );
            }
            return null;
          })()}
        </Tabs>
      </div>
    </>
  );
}

"use client";

import { ScrollArea, ScrollBar } from "@uprevit/ui/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";
import { cn } from "@uprevit/ui/lib/utils";
import { AnnotationState } from "@markerjs/markerjs3";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PiArrowRightBold,
  PiCloudCheckDuotone,
  PiImageDuotone,
  PiTagDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import DialogAddLabelTag from "./DialogAddLabelTag";
import DialogDeleteLabelTag from "./DialogDeleteLabelTag";
import DialogEditLabelTag from "./DialogEditLabelTag";
import { PageInfoDialog } from "@/features/workspace/products/product/PageInfoDialog";
import Editor from "./Editor";
import Render from "./Renderer";
import SaveTaggedImageDialog from "./SaveTaggedImageDialog";
import { UnsavedWorkbookChangesDialog } from "@/features/workspace/products/product/product-data-table/UnsavedWorkbookChangesDialog";
import { useUpdateLabelTaggedImage } from "@/hooks/product/useUpdateLabelTaggedImage";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { useRegisterProductWorkbookGuard } from "@/lib/product-workbook-unsaved-guard";
import { LegendPanel } from "./LegendPanel";
import { LegendItem } from "./legendTypes";
import type { DiffItem } from "@/utils/deepDiff";
import { annotationsMatchForComparison } from "@/utils/product/label-tag-annotation";
import {
  cnRedlineBadge,
  redlineCardAdded,
  redlineCardModified,
  redlineCardRemoved,
  redlineNewValue,
  redlineOldValue,
} from "@/utils/redlineStyles";

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
  key?: string;
  tagged_image?: string;
  tagged_image_key?: string;
  annotation_state?: AnnotationState;
  legend_items?: LegendItem[];
  _redlineStatus?: "added" | "removed" | "modified" | "unchanged";
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
  _redlineBaseImage?: string;
  _redlineNextImage?: string;
}

interface LabelTagsTabsProps {
  labelTagsData: LabelTagItem[];
  productId: string;
  isSubmitted?: boolean;
  isRedlineView?: boolean;
}

type PendingSaveCompletion = {
  kind: "itemComplete";
  resolve: () => void;
  reject: (error: Error) => void;
};

export default function LabelTagsTabs({
  labelTagsData,
  productId,
  isSubmitted = false,
  isRedlineView = false,
}: LabelTagsTabsProps) {
  const [activeTab, setActiveTab] = useState("");
  const [annotations, setAnnotations] = useState<
    Record<string, AnnotationState>
  >({});

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
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const [legendOverlayById, setLegendOverlayById] = useState<
    Record<string, boolean>
  >({});

  // Dirty state tracking
  const [currentEditorState, setCurrentEditorState] = useState<
    Record<string, AnnotationState>
  >({});
  const [savedAnnotations, setSavedAnnotations] = useState<
    Record<string, AnnotationState>
  >({});
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);

  const pendingSaveRef = useRef(pendingSave);
  const pendingSaveFlowRef = useRef<PendingSaveCompletion | null>(null);
  const isRenderingRef = useRef(false);

  useEffect(() => {
    pendingSaveRef.current = pendingSave;
  }, [pendingSave]);

  const { mutateAsync: updateLabelTaggedImage, isPending: isUpdating } =
    useUpdateLabelTaggedImage();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();

  const handleSave = (
    itemId: string,
    itemImage: string,
    annotation: AnnotationState,
  ) => {
    setAnnotations((prev) => ({ ...prev, [itemId]: annotation }));
    setPendingSave({ itemId, itemImage, annotation });
    setSaveDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!pendingSave) return;
    setIsSaving(true);
    setRenderItem({
      id: pendingSave.itemId,
      image: pendingSave.itemImage,
    });
  };

  const completePendingSaveFlow = useCallback(
    (error?: unknown) => {
      const completion = pendingSaveFlowRef.current;
      if (!completion) return;

      pendingSaveFlowRef.current = null;
      if (error) {
        completion.reject(
          error instanceof Error ? error : new Error("Failed to save annotation"),
        );
      } else {
        completion.resolve();
      }
    },
    [],
  );

  const handleRendered = useCallback(
    async (dataUrl: string) => {
      const save = pendingSaveRef.current;
      if (!save || isRenderingRef.current) return;
      isRenderingRef.current = true;

      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "tagged-image.png", {
          type: "image/png",
        });

        const s3UploadResult = await uploadFileToS3({
          file,
          contentType: file.type || "application/octet-stream",
          uploadScope: "product-assets",
          productId,
        });
        const uploadedKey = s3UploadResult.key;

        if (!uploadedKey) {
          throw new Error("Failed to get uploaded image key");
        }

        await updateLabelTaggedImage({
          productId,
          labelTagId: save.itemId,
          taggedImage: "",
          taggedImageKey: uploadedKey,
          annotationState: save.annotation,
        });

        setSavedAnnotations((prev) => ({
          ...prev,
          [save.itemId]: save.annotation,
        }));
        setLastSavedAt(new Date());

        setPendingSave(null);
        setSaveDialogOpen(false);
        completePendingSaveFlow();
      } catch (error) {
        console.error("Failed to upload tagged image:", error);
        completePendingSaveFlow(error);
        setPendingSave(null);
        setSaveDialogOpen(false);
      } finally {
        setIsSaving(false);
        setRenderItem(null);
        isRenderingRef.current = false;
      }
    },
    [
      completePendingSaveFlow,
      productId,
      updateLabelTaggedImage,
      uploadFileToS3,
    ],
  );

  const filteredLabelTypesForTabs: string[] = [
    ...new Set(
      labelTagsData
        ?.map((item: LabelTagItem) => item.type)
        ?.filter((type): type is string => !!type),
    ),
  ];

  const typeStatusMap = useMemo(() => {
    const accumulator = new Map<
      string,
      {
        hasAdded: boolean;
        hasRemoved: boolean;
        hasCurrent: boolean;
        hasModified: boolean;
        typeDiff?: DiffItem;
      }
    >();

    labelTagsData.forEach((item) => {
      const type = item.type;
      if (!type) return;
      const entry = accumulator.get(type) ?? {
        hasAdded: false,
        hasRemoved: false,
        hasCurrent: false,
        hasModified: false,
      };
      if (item._redlineStatus === "added") {
        entry.hasAdded = true;
      } else if (item._redlineStatus === "removed") {
        entry.hasRemoved = true;
      } else {
        entry.hasCurrent = true;
      }
      if (item._redlineStatus === "modified") {
        entry.hasModified = true;
        entry.typeDiff = item._redlineDiffs?.find((d) => d.path === "type");
      }
      accumulator.set(type, entry);
    });

    const result: Record<
      string,
      { status: "added" | "removed" | "modified" | null; typeDiff?: DiffItem }
    > = {};
    accumulator.forEach((entry, type) => {
      if (entry.hasAdded && !entry.hasCurrent && !entry.hasRemoved) {
        result[type] = { status: "added" };
      } else if (entry.hasRemoved && !entry.hasCurrent && !entry.hasAdded) {
        result[type] = { status: "removed" };
      } else if (entry.hasAdded || entry.hasRemoved || entry.hasModified) {
        result[type] = { status: "modified", typeDiff: entry.typeDiff };
      } else {
        result[type] = { status: null };
      }
    });

    return result;
  }, [labelTagsData]);

  const effectiveActiveTab =
    activeTab || filteredLabelTypesForTabs[0] || "tab-1";

  const getAnnotationBaseline = useCallback(
    (itemId: string): AnnotationState | undefined => {
      const item = labelTagsData.find((labelTag) => labelTag._id === itemId);
      return savedAnnotations[itemId] ?? item?.annotation_state;
    },
    [labelTagsData, savedAnnotations],
  );

  const isDirty = useCallback(
    (itemId: string) => {
      const current = currentEditorState[itemId];
      if (!current) return false;

      const baseline = getAnnotationBaseline(itemId);
      if (baseline === undefined) {
        return Boolean(current.markers && current.markers.length > 0);
      }

      return !annotationsMatchForComparison(current, baseline);
    },
    [currentEditorState, getAnnotationBaseline],
  );

  const hasAnyDirtyItems = useCallback(() => {
    return Object.keys(currentEditorState).some((itemId) => isDirty(itemId));
  }, [currentEditorState, isDirty]);

  const hasEditableDirtyItems = useMemo(
    () => hasAnyDirtyItems(),
    [hasAnyDirtyItems],
  );

  const showEditStatus = !isSubmitted && !isRedlineView;
  const isPersisting = isSaving || isUpdating;

  const getDirtyItemIds = useCallback(
    (itemIds?: string[]) => {
      const ids =
        itemIds ?? Object.keys(currentEditorState).filter((id) => isDirty(id));
      return ids.filter((id) => isDirty(id));
    },
    [currentEditorState, isDirty],
  );

  const persistAnnotation = useCallback(
    (itemId: string, annotation: AnnotationState): Promise<void> => {
      const item = labelTagsData.find((labelTag) => labelTag._id === itemId);
      const itemImage = item?.image;
      if (!itemImage) {
        return Promise.reject(new Error("No image available for this label tag"));
      }

      return new Promise((resolve, reject) => {
        pendingSaveFlowRef.current = {
          kind: "itemComplete",
          resolve,
          reject,
        };

        setIsSaving(true);
        setAnnotations((prev) => ({ ...prev, [itemId]: annotation }));
        setPendingSave({
          itemId,
          itemImage,
          annotation,
        });
        setRenderItem({
          id: itemId,
          image: itemImage,
        });
      });
    },
    [labelTagsData],
  );

  const saveDirtyItemIds = useCallback(
    async (itemIds?: string[]) => {
      const dirtyIds = getDirtyItemIds(itemIds);
      for (const itemId of dirtyIds) {
        const annotation = currentEditorState[itemId];
        if (!annotation) continue;
        await persistAnnotation(itemId, annotation);
      }
    },
    [currentEditorState, getDirtyItemIds, persistAnnotation],
  );

  const revertItemEditorState = useCallback(
    (itemId: string) => {
      const item = labelTagsData.find((labelTag) => labelTag._id === itemId);
      const baseline = savedAnnotations[itemId] ?? item?.annotation_state;

      setCurrentEditorState((prev) => {
        const next = { ...prev };
        if (baseline !== undefined) {
          next[itemId] = baseline;
        } else {
          delete next[itemId];
        }
        return next;
      });
    },
    [labelTagsData, savedAnnotations],
  );

  const discardDirtyInTab = useCallback(
    (tab: string) => {
      const itemsInTab = labelTagsData.filter((item) => item.type === tab);
      for (const item of itemsInTab) {
        if (isDirty(item._id)) {
          revertItemEditorState(item._id);
        }
      }
    },
    [isDirty, labelTagsData, revertItemEditorState],
  );

  const discardAllDirty = useCallback(() => {
    for (const itemId of Object.keys(currentEditorState)) {
      if (isDirty(itemId)) {
        revertItemEditorState(itemId);
      }
    }
  }, [currentEditorState, isDirty, revertItemEditorState]);

  const saveAllDirtyAndContinue = useCallback(async () => {
    await saveDirtyItemIds();
  }, [saveDirtyItemIds]);

  const handleStateChange = useCallback(
    (itemId: string, annotation: AnnotationState) => {
      const baseline = getAnnotationBaseline(itemId);

      if (
        baseline !== undefined &&
        annotationsMatchForComparison(annotation, baseline)
      ) {
        setCurrentEditorState((prev) => {
          if (!prev[itemId]) return prev;
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
        return;
      }

      if (
        baseline === undefined &&
        (!annotation.markers || annotation.markers.length === 0)
      ) {
        setCurrentEditorState((prev) => {
          if (!prev[itemId]) return prev;
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
        return;
      }

      setCurrentEditorState((prev) => ({ ...prev, [itemId]: annotation }));
    },
    [getAnnotationBaseline],
  );

  const handleTabChange = useCallback(
    (newTab: string) => {
      const itemsInTab = labelTagsData.filter(
        (item) => item.type === effectiveActiveTab,
      );
      const hasDirtyInTab = itemsInTab.some((item) => isDirty(item._id));
      if (hasDirtyInTab) {
        setPendingTabChange(newTab);
        setUnsavedDialogOpen(true);
      } else {
        setActiveTab(newTab);
      }
    },
    [effectiveActiveTab, isDirty, labelTagsData],
  );

  const handleLegendOverlayToggle = useCallback(
    (itemId: string, value: boolean) => {
      setLegendOverlayById((prev) => ({ ...prev, [itemId]: value }));
    },
    [],
  );

  const handleUnsavedSave = useCallback(async () => {
    const itemsInTab = labelTagsData.filter(
      (item) => item.type === effectiveActiveTab,
    );
    const dirtyIds = itemsInTab.map((item) => item._id);

    await saveDirtyItemIds(dirtyIds);

    setUnsavedDialogOpen(false);
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
  }, [
    effectiveActiveTab,
    labelTagsData,
    pendingTabChange,
    saveDirtyItemIds,
  ]);

  const handleUnsavedDiscard = useCallback(() => {
    discardDirtyInTab(effectiveActiveTab);
    setUnsavedDialogOpen(false);
    if (pendingTabChange) {
      setActiveTab(pendingTabChange);
      setPendingTabChange(null);
    }
  }, [discardDirtyInTab, effectiveActiveTab, pendingTabChange]);

  const handleUnsavedCancel = useCallback(() => {
    setUnsavedDialogOpen(false);
    setPendingTabChange(null);
  }, []);

  const labelTagsGuardRegistration = useMemo(
    () => ({
      tabLabel: "Label Tags",
      isDirty: hasEditableDirtyItems,
      save: saveAllDirtyAndContinue,
      discard: discardAllDirty,
    }),
    [
      discardAllDirty,
      hasEditableDirtyItems,
      saveAllDirtyAndContinue,
    ],
  );

  useRegisterProductWorkbookGuard(
    labelTagsGuardRegistration,
    !isSubmitted && !isRedlineView,
  );

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

  const getItemStatus = (
    item: LabelTagItem,
  ): "added" | "removed" | "modified" | null => {
    const status = item._redlineStatus;
    if (!status || status === "unchanged") return null;
    return status;
  };

  const getFieldDiff = (
    item: LabelTagItem,
    field: "name" | "description" | "image" | "type",
  ) => {
    if (!isRedlineView) return undefined;
    const status = item._redlineStatus;
    const rawValue = item[field] ?? "";
    if (status === "added") {
      return {
        path: field,
        status: "added" as const,
        old_value: null,
        new_value: rawValue,
      } as DiffItem;
    }
    if (status === "removed") {
      return {
        path: field,
        status: "removed" as const,
        old_value: rawValue,
        new_value: null,
      } as DiffItem;
    }
    return item._redlineDiffs?.find((d) => d.path === field);
  };

  const getImageDiff = (item: LabelTagItem) => {
    const imageDiff = getFieldDiff(item, "image");
    const keyDiff = item._redlineDiffs?.find((d) => d.path === "key");
    const diff = imageDiff ?? keyDiff;

    if (!diff) return undefined;
    const resolvedOld =
      item._redlineBaseImage ??
      (typeof diff.old_value === "string" ? diff.old_value : null);
    const resolvedNew =
      item._redlineNextImage ??
      item.image ??
      (typeof diff.new_value === "string" ? diff.new_value : null);

    if (diff === keyDiff && resolvedOld && resolvedNew && resolvedOld === resolvedNew) {
      return undefined;
    }

    return {
      ...diff,
      old_value: resolvedOld,
      new_value: resolvedNew,
    } as DiffItem;
  };

  const RedlineValue = ({
    value,
    diff,
    formatFn,
    isImage = false,
    emptyLabel,
  }: {
    value: string;
    diff: DiffItem | undefined;
    formatFn?: (v: unknown) => string;
    isImage?: boolean;
    emptyLabel?: string;
  }) => {
    if (!isRedlineView || !diff) return <>{value}</>;

    const format =
      formatFn ||
      ((v: unknown) =>
        typeof v === "string" ? v : v != null ? String(v) : "");
    const isRemoved = diff.status === "removed";
    const isAdded = diff.status === "added";
    const oldValue = typeof diff.old_value === "string" ? diff.old_value : "";
    const newValue = typeof diff.new_value === "string" ? diff.new_value : "";

    if (isImage) {
      return (
        <div className="flex flex-col gap-2">
          {(oldValue || isRemoved) && (
            <div className="relative">
              <span
                className={cn(
                  "absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[10px]",
                  cnRedlineBadge("removed"),
                )}
              >
                OLD
              </span>
              {oldValue ? (
                <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-red-300 bg-red-50/30 opacity-60 dark:border-red-700/50 dark:bg-red-950/20">
                  <Image
                    src={oldValue}
                    alt="Previous image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-muted-foreground bg-red-50/30 rounded-lg border-2 border-red-300 border-dashed opacity-60 dark:border-red-700/50 dark:bg-red-950/20">
                  <PiImageDuotone className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs">No image</p>
                </div>
              )}
            </div>
          )}
          {oldValue && newValue && !isRemoved && !isAdded && (
            <div className="flex items-center justify-center">
              <PiArrowRightBold className="text-muted-foreground/50 rotate-90" />
            </div>
          )}
          {(newValue || isAdded) && !isRemoved && (
            <div className="relative">
              <span
                className={cn(
                  "absolute top-2 left-2 z-10 rounded-full px-2 py-0.5 text-[10px]",
                  cnRedlineBadge("added"),
                )}
              >
                NEW
              </span>
              {newValue ? (
                <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-blue-300 bg-blue-50/30 dark:border-blue-700/50 dark:bg-blue-950/20">
                  <Image
                    src={newValue}
                    alt="New image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-muted-foreground bg-blue-50/30 rounded-lg border-2 border-blue-300 border-dashed dark:border-blue-700/50 dark:bg-blue-950/20">
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
        {(diff.old_value != null || isRemoved) && (
          <span className="inline-flex items-center gap-1">
            {/* <span className="text-[9px] font-bold tracking-wider text-red-700 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded-full shadow-sm">
              OLD
            </span> */}
            <span className={redlineOldValue}>
              {format(diff.old_value) || ""}
            </span>
          </span>
        )}

        {diff.old_value != null &&
          diff.new_value != null &&
          !isRemoved &&
          !isAdded && (
            <PiArrowRightBold className="text-muted-foreground/50 text-xs" />
          )}

        {(diff.new_value != null || isAdded) && !isRemoved && (
          <span className="inline-flex items-center gap-1">
            {/* <span className="text-[9px] font-bold tracking-wider text-blue-700 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded-full shadow-sm">
              NEW
            </span> */}
            <span className={redlineNewValue}>
              {format(diff.new_value) ||
                (emptyLabel ? (
                  <span className="text-muted-foreground/35 italic">
                    {emptyLabel}
                  </span>
                ) : (
                  ""
                ))}
            </span>
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
            <PageInfoDialog
              title="Label Tags"
              content="Add and organize label tags with annotations to highlight specific areas on label images."
            />
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
          <PageInfoDialog
            title="Label Tags"
            content="Add and organize label tags with annotations to highlight specific areas on label images."
          />
        </div>
        <div className="flex items-center gap-3">
          {showEditStatus &&
            (isPersisting ? (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Spinner className="w-4 h-4" />
                <span className="text-xs">Saving</span>
              </div>
            ) : hasEditableDirtyItems ? (
              <span className="text-xs text-amber-600">Unsaved changes</span>
            ) : lastSavedAt ? (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiCloudCheckDuotone className="w-4 h-4 text-green-600" />
                <span className="text-xs">Saved</span>
              </div>
            ) : null)}
          <DialogAddLabelTag productId={productId} isSubmitted={isSubmitted} />
        </div>
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
                const typeStatus = typeStatusMap[type]?.status;
                const typeDiff = typeStatusMap[type]?.typeDiff;
                const isTypeAdded = isRedlineView && typeStatus === "added";
                const isTypeRemoved = isRedlineView && typeStatus === "removed";
                const isTypeModified =
                  isRedlineView && typeStatus === "modified";
                return (
                  <TabsTrigger
                    key={`${i}-${type}`}
                    value={type}
                    className={cn(
                      "gap-2",
                      isTypeAdded &&
                        "text-blue-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800 dark:text-blue-400 dark:data-[state=active]:bg-blue-950/30 dark:data-[state=active]:text-blue-300",
                      isTypeRemoved &&
                        "text-red-700 data-[state=active]:bg-red-50 data-[state=active]:text-red-800 dark:text-red-400 dark:data-[state=active]:bg-red-950/30 dark:data-[state=active]:text-red-300",
                      isTypeModified &&
                        "text-amber-700 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800 dark:text-amber-400 dark:data-[state=active]:bg-amber-950/30 dark:data-[state=active]:text-amber-300",
                    )}
                  >
                    {isTypeModified && typeDiff ? (
                      <RedlineValue value={type} diff={typeDiff} />
                    ) : (
                      <span>{type}</span>
                    )}
                    {isTypeAdded && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px]",
                          cnRedlineBadge("added"),
                        )}
                      >
                        NEW
                      </span>
                    )}
                    {isTypeRemoved && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px]",
                          cnRedlineBadge("removed"),
                        )}
                      >
                        DEL
                      </span>
                    )}
                    {isTypeModified && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9px]",
                          cnRedlineBadge("modified"),
                        )}
                      >
                        MOD
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="flex flex-col gap-10">
            {filteredLabelTypesForTabs.map((type) => {
              const currentTabData = labelTagsData.filter(
                (item: LabelTagItem) => item.type === type,
              );
              return currentTabData.map((item: LabelTagItem, i) => {
                const itemStatus = getItemStatus(item);
                const isRemoved = itemStatus === "removed";
                const isAdded = itemStatus === "added";
                const isModified = itemStatus === "modified";

                const nameDiff = getFieldDiff(item, "name");
                const descriptionDiff = getFieldDiff(item, "description");
                const imageDiff = getImageDiff(item);

                return (
                  <TabsContent key={`${i}-${type}`} value={type}>
                    <div
                      className={cn(
                        "w-full shadow-none transition-all duration-200 mb-4 last:mb-0",
                        isRedlineView &&
                          isRemoved &&
                          redlineCardRemoved,
                        isRedlineView &&
                          isAdded &&
                          redlineCardAdded,
                        isRedlineView &&
                          isModified &&
                          redlineCardModified,
                        !isRedlineView || !itemStatus ? "border-border" : "",
                      )}
                    >
                      <div className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {isRedlineView && isAdded && (
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px]",
                                    cnRedlineBadge("added"),
                                  )}
                                >
                                  NEW
                                </span>
                              )}
                              {isRedlineView && isRemoved && (
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px]",
                                    cnRedlineBadge("removed"),
                                  )}
                                >
                                  DEL
                                </span>
                              )}
                              {isRedlineView && isModified && (
                                <span
                                  className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px]",
                                    cnRedlineBadge("modified"),
                                  )}
                                >
                                  MOD
                                </span>
                              )}
                            </div>
                            <div
                              className={cn(
                                "text-sm font-semibold flex items-center gap-2",
                                isRedlineView &&
                                  isRemoved &&
                                  "line-through text-red-500/70 dark:text-red-400/80",
                              )}
                            >
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted/60 border border-border/60 px-2 py-0.5 rounded-full">
                                Label {i + 1}
                              </span>
                              {isRedlineView && nameDiff ? (
                                <RedlineValue
                                  value={item.name || "Untitled Label"}
                                  diff={nameDiff}
                                />
                              ) : (
                                item.name || "Untitled Label"
                              )}
                              {item.description && (
                                <span className="text-sm font-normal text-muted-foreground">
                                  -
                                </span>
                              )}
                              <span
                                className={cn(
                                  "text-sm font-normal text-muted-foreground",
                                  isRedlineView &&
                                    isRemoved &&
                                    "line-through text-red-500/70 dark:text-red-400/80",
                                )}
                              >
                                {isRedlineView && descriptionDiff ? (
                                  <RedlineValue
                                    value={item.description || ""}
                                    diff={descriptionDiff}
                                    emptyLabel="Blank"
                                  />
                                ) : (
                                  item.description
                                )}
                              </span>
                            </div>
                          </div>
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
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                          <div className="flex-1 min-w-0">
                            {isRedlineView && imageDiff ? (
                              <div className="relative w-full max-w-md">
                                <RedlineValue
                                  value={item.image || ""}
                                  diff={imageDiff}
                                  isImage={true}
                                />
                              </div>
                            ) : item.image ? (
                              <Editor
                                targetImageSrc={item.image}
                                annotation={
                                  currentEditorState[item._id] ??
                                  savedAnnotations[item._id] ??
                                  item.annotation_state ??
                                  annotations[item._id] ??
                                  null
                                }
                                legendItems={item.legend_items ?? []}
                                showLegendOverlay={
                                  !!legendOverlayById[item._id]
                                }
                                onSave={(newAnnotation) => {
                                  handleSave(
                                    item._id,
                                    item.image!,
                                    newAnnotation,
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
                                    ? "border-red-300 bg-red-50/30 opacity-60 dark:border-red-700/50 dark:bg-red-950/20"
                                    : isRedlineView && isAdded
                                      ? "border-blue-300 bg-blue-50/30 dark:border-blue-700/50 dark:bg-blue-950/20"
                                      : "bg-muted/50 border-border",
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

                          <LegendPanel
                            productId={productId}
                            labelTagId={item._id}
                            legendItems={item.legend_items ?? []}
                            isEditable={!isSubmitted && !isRedlineView}
                            overlayEnabled={!!legendOverlayById[item._id]}
                            onOverlayToggle={(value) =>
                              handleLegendOverlayToggle(item._id, value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                );
              });
            })}
          </div>
          {renderItem && annotations[renderItem.id] && (
            <Render
              targetImage={renderItem.image}
              annotation={annotations[renderItem.id]}
              mode="upload"
              onRendered={handleRendered}
              onComplete={() => {
                setRenderItem(null);
                if (!isRenderingRef.current) {
                  setIsSaving(false);
                }
              }}
            />
          )}

          <SaveTaggedImageDialog
            open={saveDialogOpen}
            onOpenChange={(open) => {
              if ((isSaving || isUpdating) && !open) {
                return;
              }
              setSaveDialogOpen(open);
              if (!open) {
                setPendingSave(null);
              }
            }}
            onConfirm={handleConfirmSave}
            isPending={isSaving || isUpdating}
          />

          <UnsavedWorkbookChangesDialog
            open={unsavedDialogOpen}
            tabLabel="Label Tags"
            onOpenChange={(open) => {
              if (!open) handleUnsavedCancel();
            }}
            onSave={handleUnsavedSave}
            onDiscard={handleUnsavedDiscard}
            onCancel={handleUnsavedCancel}
            isSaving={isPersisting}
          />
        </Tabs>
      </div>
    </>
  );
}

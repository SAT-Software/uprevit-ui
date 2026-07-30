"use client";

import { EditorState } from "@/types/editor";
import { MarkerTypeItem, MarkerTypeList, ToolbarAction } from "@/types/toolbar";
import {
  AnnotationState,
  ArrowMarker,
  CalloutMarker,
  CaptionFrameMarker,
  CoverMarker,
  CurveMarker,
  CustomImageMarker,
  EllipseFrameMarker,
  EllipseMarker,
  FrameMarker,
  FreehandMarker,
  HighlighterMarker,
  HighlightMarker,
  LineMarker,
  MarkerArea,
  MarkerBaseEditor,
  MeasurementMarker,
  PolygonMarker,
  TextMarker,
} from "@markerjs/markerjs3";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight01Icon,
  CaptionsIcon,
  Chat01Icon,
  CircleIcon,
  EllipseIcon,
  HighlighterIcon,
  LinerIcon,
  Pen01Icon,
  BendToolIcon,
  PolygonIcon,
  RulerIcon,
  SquareIcon,
  TextFontIcon,
  BackgroundIcon,
  FlipBottomIcon,
} from "@hugeicons/core-free-icons";
import EditorToolbar from "./EditorToolbar";
import EditorToolbox from "./EditorToolbox";
import { LegendOverlay } from "./LegendOverlay";
import { LegendItem } from "./legendTypes";

const markerTypes: MarkerTypeList = [
  {
    name: "Basic shapes",
    markerTypes: [
      {
        icon: SquareIcon,
        name: "Rectangle",
        markerType: FrameMarker,
      },
      {
        icon: BackgroundIcon,
        name: "Cover (filled rectangle)",
        markerType: CoverMarker,
      },
      {
        icon: FlipBottomIcon,
        name: "Highlight",
        markerType: HighlightMarker,
      },
      {
        icon: EllipseIcon,
        name: "Ellipse",
        markerType: EllipseFrameMarker,
      },
      {
        icon: CircleIcon,
        name: "Ellipse (filled)",
        markerType: EllipseMarker,
      },
    ],
  },
  {
    name: "Lines",
    markerTypes: [
      {
        icon: ArrowUpRight01Icon,
        name: "Arrow",
        markerType: ArrowMarker,
      },
      {
        icon: LinerIcon,
        name: "Line",
        markerType: LineMarker,
      },
      {
        icon: RulerIcon,
        name: "Measure",
        markerType: MeasurementMarker,
      },
      {
        icon: BendToolIcon,
        name: "Curve",
        markerType: CurveMarker,
      },
    ],
  },
  {
    name: "Text",
    markerTypes: [
      {
        icon: TextFontIcon,
        name: "Text",
        markerType: TextMarker,
      },
      {
        icon: Chat01Icon,
        name: "Callout",
        markerType: CalloutMarker,
      },
      {
        icon: CaptionsIcon,
        name: "Captioned frame",
        markerType: CaptionFrameMarker,
      },
    ],
  },
  {
    name: "Advanced shapes",
    markerTypes: [
      {
        icon: Pen01Icon,
        name: "Freehand",
        markerType: FreehandMarker,
      },
      {
        icon: HighlighterIcon,
        name: "Highlighter",
        markerType: HighlighterMarker,
      },
      {
        icon: PolygonIcon,
        name: "Polygon",
        markerType: PolygonMarker,
      },
    ],
  },
];

type Props = {
  targetImageSrc: string;
  variant?: "ghost" | "outline" | "secondary";
  annotation: AnnotationState | null;
  legendItems?: LegendItem[];
  showLegendOverlay?: boolean;
  onSave?: (annotation: AnnotationState) => void;
  onStateChange?: (annotation: AnnotationState) => void;
};

const Editor = ({
  targetImageSrc,
  variant = "outline",
  annotation,
  legendItems = [],
  showLegendOverlay = false,
  onSave,
  onStateChange,
}: Props) => {
  const editorContainer = useRef<HTMLDivElement | null>(null);
  const editor = useRef<MarkerArea | null>(null);
  const imageNaturalWidth = useRef<number>(0);
  const containerMaxWidthRef = useRef<number>(0);
  const onStateChangeRef = useRef<typeof onStateChange>(onStateChange);
  const annotationRef = useRef<AnnotationState | null>(annotation);
  const initializationIdRef = useRef(0);

  const [editorState, setEditorState] = useState<EditorState>({
    mode: "select",
    canUndo: false,
    canRedo: false,
    canDelete: false,
  });

  const [currentMarkerType, setCurrentMarkerType] =
    useState<MarkerTypeItem | null>(null);

  const [currentMarkerEditor, setCurrentMarkerEditor] =
    useState<MarkerBaseEditor | null>(null);

  const getMarkerTextEditor = useCallback((): HTMLTextAreaElement | null => {
    const markerArea = editor.current;
    if (!markerArea?.shadowRoot) return null;

    return markerArea.shadowRoot.querySelector("textarea");
  }, []);

  const applyTextEditorKey = useCallback(
    (textEditor: HTMLTextAreaElement, event: KeyboardEvent) => {
      textEditor.focus();

      const start = textEditor.selectionStart ?? 0;
      const end = textEditor.selectionEnd ?? 0;

      if (event.key === "Backspace") {
        if (start !== end) {
          textEditor.setRangeText("", start, end, "end");
        } else if (start > 0) {
          textEditor.setRangeText("", start - 1, start, "end");
        }
      } else if (start !== end) {
        textEditor.setRangeText("", start, end, "end");
      } else if (end < textEditor.value.length) {
        textEditor.setRangeText("", end, end + 1, "end");
      }

      textEditor.dispatchEvent(
        new KeyboardEvent("keyup", { key: event.key, bubbles: true }),
      );
    },
    [],
  );

  const previousImageSrc = useRef<string | null>(null);
  const reportStateChangesRef = useRef(false);

  const enableStateChangeReporting = useCallback(() => {
    reportStateChangesRef.current = true;
  }, []);

  const handleKeyboardShortcuts = useCallback(
    (event: KeyboardEvent) => {
      if (!editor.current || !editorContainer.current) return;

      const isEditorFocused =
        editorContainer.current.contains(document.activeElement) ||
        editorContainer.current.contains(event.target as Node);

      if (!isEditorFocused) return;

      if (event.key !== "Delete" && event.key !== "Backspace") return;

      const textEditor = getMarkerTextEditor();
      if (textEditor) {
        // markerjs3 renders the textarea in shadow DOM; focus stays on <mjs-marker-area>
        event.preventDefault();
        event.stopPropagation();
        applyTextEditorKey(textEditor, event);
        return;
      }

      event.preventDefault();
      enableStateChangeReporting();
      editor.current.deleteSelectedMarkers();
    },
    [applyTextEditorKey, enableStateChangeReporting, getMarkerTextEditor],
  );

  const handleToolbarAction = (action: ToolbarAction) => {
    if (editor.current) {
      switch (action) {
        case "select": {
          setEditorState((prevState) => ({
            ...prevState,
            mode: "select",
          }));
          editor.current.switchToSelectMode();
          break;
        }
        case "delete": {
          enableStateChangeReporting();
          editor.current.deleteSelectedMarkers();
          break;
        }
        case "clear-all": {
          enableStateChangeReporting();
          const currentState = editor.current.getState();
          editor.current.restoreState({
            width: currentState.width,
            height: currentState.height,
            markers: [],
          });
          break;
        }
        case "undo": {
          enableStateChangeReporting();
          editor.current.undo();
          break;
        }
        case "redo": {
          enableStateChangeReporting();
          editor.current.redo();
          break;
        }
        case "zoom-in": {
          editor.current.zoomLevel += 0.1;
          break;
        }
        case "zoom-out": {
          if (editor.current.zoomLevel > 0.2) {
            editor.current.zoomLevel -= 0.1;
          }
          break;
        }
        case "zoom-reset": {
          if (
            imageNaturalWidth.current > 0 &&
            containerMaxWidthRef.current > 0
          ) {
            if (imageNaturalWidth.current <= containerMaxWidthRef.current) {
              editor.current.zoomLevel = 1;
            } else {
              editor.current.zoomLevel = 1;
            }
          } else {
            editor.current.zoomLevel = 1;
          }
          break;
        }
        case "save": {
          if (onSave) {
            onSave(editor.current.getState());
          }
          break;
        }
      }
      updateCalculatedEditorState();
    }
  };

  const handleNewMarker = (markerType: MarkerTypeItem | null) => {
    setCurrentMarkerType(markerType);
    if (editor.current && markerType) {
      enableStateChangeReporting();
      setEditorState((prevState) => ({
        ...prevState,
        mode: "create",
      }));
      const markerEditor = editor.current.createMarker(markerType.markerType);
      if (markerEditor && markerEditor.marker instanceof CustomImageMarker) {
        markerEditor.marker.defaultSize = { width: 32, height: 32 };
        markerEditor.marker.svgString = markerType.icon as unknown as string;
      }
    }
  };

  const updateCalculatedEditorState = useCallback(() => {
    if (editor.current) {
      const editorInstance = editor.current;
      setEditorState((prevState) => ({
        ...prevState,
        canUndo: editorInstance.isUndoPossible,
        canRedo: editorInstance.isRedoPossible,
        canDelete: editorInstance.selectedMarkerEditors.length > 0,
      }));
    }
  }, []);

  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  useEffect(() => {
    annotationRef.current = annotation;
  }, [annotation]);

  useEffect(() => {
    const imageChanged =
      previousImageSrc.current !== null &&
      previousImageSrc.current !== targetImageSrc;

    const containerRef = editorContainer.current;
    if (!containerRef) return;

    if (
      imageChanged &&
      editor.current &&
      containerRef.contains(editor.current)
    ) {
      containerRef.removeChild(editor.current);
      editor.current = null;
    }

    previousImageSrc.current = targetImageSrc;
    reportStateChangesRef.current = false;

    if (editor.current) return;

    const targetImg = document.createElement("img");
    targetImg.crossOrigin = "anonymous";
    targetImg.src = targetImageSrc;

    const editorAreaWidth = containerRef.clientWidth;
    const containerMaxWidth = Math.max(editorAreaWidth - 40, 200);
    const initializationId = ++initializationIdRef.current;
    let isCancelled = false;

    const initializeEditor = (naturalWidth: number) => {
      if (
        isCancelled ||
        initializationId !== initializationIdRef.current ||
        editor.current
      ) {
        return;
      }

      const naturalHeight = targetImg.naturalHeight;

      imageNaturalWidth.current = naturalWidth;
      containerMaxWidthRef.current = containerMaxWidth;

      const newEditor = new MarkerArea();
      newEditor.targetImage = targetImg;

      if (naturalWidth > containerMaxWidth) {
        const scale = containerMaxWidth / naturalWidth;
        newEditor.targetWidth = containerMaxWidth;
        newEditor.targetHeight = Math.round(naturalHeight * scale);
      } else {
        newEditor.targetWidth = naturalWidth;
        newEditor.targetHeight = naturalHeight;
      }

      newEditor.addEventListener("areastatechange", () => {
        updateCalculatedEditorState();
        if (reportStateChangesRef.current && onStateChangeRef.current) {
          onStateChangeRef.current(newEditor.getState());
        }
      });

      newEditor.addEventListener("markerselect", (ev) => {
        setCurrentMarkerEditor(ev.detail.markerEditor);
        updateCalculatedEditorState();
      });

      newEditor.addEventListener("markerdeselect", () => {
        setCurrentMarkerEditor(null);
        updateCalculatedEditorState();
      });

      newEditor.addEventListener("markercreate", () => {
        enableStateChangeReporting();
        setEditorState((prevState) => ({
          ...prevState,
          mode: "select",
        }));
      });

      containerRef.replaceChildren();
      containerRef.appendChild(newEditor);
      editor.current = newEditor;

      const handleEditorPointerDown = () => {
        enableStateChangeReporting();
      };
      newEditor.addEventListener("pointerdown", handleEditorPointerDown);

      if (
        annotationRef.current &&
        JSON.stringify(annotationRef.current) !==
          JSON.stringify(newEditor.getState())
      ) {
        newEditor.restoreState(annotationRef.current);
      }
    };

    if (targetImg.complete && targetImg.naturalWidth > 0) {
      initializeEditor(targetImg.naturalWidth);
    } else {
      targetImg.onload = () => {
        initializeEditor(targetImg.naturalWidth);
      };
    }

    return () => {
      isCancelled = true;
      targetImg.onload = null;
    };
  }, [enableStateChangeReporting, targetImageSrc, updateCalculatedEditorState]);

  useEffect(() => {
    if (
      editor.current &&
      annotation &&
      JSON.stringify(annotation) !== JSON.stringify(editor.current.getState())
    ) {
      editor.current.restoreState(annotation);
    }
  }, [annotation]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcuts, true);
    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcuts, true);
    };
  }, [handleKeyboardShortcuts]);

  return (
    <div className="grid h-full min-h-[360px] w-full grid-rows-[auto_1fr_auto] overflow-hidden bg-background">
      <EditorToolbar
        variant={variant}
        markerTypes={markerTypes}
        currentMarkerType={currentMarkerType}
        editorState={editorState}
        onAction={handleToolbarAction}
        onNewMarker={handleNewMarker}
      />
      <div className="relative min-h-0">
        <div
          ref={editorContainer}
          className="flex h-full min-h-[280px] overflow-hidden bg-muted/20 **:bg-no-repeat"
        ></div>
        {showLegendOverlay && legendItems.length > 0 && (
          <LegendOverlay items={legendItems} />
        )}
      </div>
      <EditorToolbox
        variant={variant}
        editorState={editorState}
        markerEditor={currentMarkerEditor}
        onAction={handleToolbarAction}
      />
    </div>
  );
};

export default Editor;

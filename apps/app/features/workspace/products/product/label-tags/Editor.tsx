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
  PiArrowUpRightDuotone,
  PiBezierCurveDuotone,
  PiChatTeardropDuotone,
  PiCircle,
  PiCircleFill,
  PiFrameCornersDuotone,
  PiHighlighterCircleDuotone,
  PiLineSegmentDuotone,
  PiPolygonDuotone,
  PiRulerDuotone,
  PiScribbleLoopDuotone,
  PiSquare,
  PiSquareDuotone,
  PiSquareFill,
  PiTextTDuotone,
} from "react-icons/pi";
import EditorToolbar from "./EditorToolbar";
import EditorToolbox from "./EditorToolbox";
import { LegendOverlay } from "./LegendOverlay";
import { LegendItem } from "./legendTypes";

const markerTypes: MarkerTypeList = [
  {
    name: "Basic shapes",
    markerTypes: [
      {
        icon: PiSquare,
        name: "Rectangle",
        markerType: FrameMarker,
      },
      {
        icon: PiSquareFill,
        name: "Cover (filled rectangle)",
        markerType: CoverMarker,
      },
      {
        icon: PiSquareDuotone,
        name: "Highlight",
        markerType: HighlightMarker,
      },
      {
        icon: PiCircle,
        name: "Ellipse",
        markerType: EllipseFrameMarker,
      },
      {
        icon: PiCircleFill,
        name: "Ellipse (filled)",
        markerType: EllipseMarker,
      },
    ],
  },
  {
    name: "Lines",
    markerTypes: [
      {
        icon: PiArrowUpRightDuotone,
        name: "Arrow",
        markerType: ArrowMarker,
      },
      {
        icon: PiLineSegmentDuotone,
        name: "Line",
        markerType: LineMarker,
      },
      {
        icon: PiRulerDuotone,
        name: "Measure",
        markerType: MeasurementMarker,
      },
      {
        icon: PiBezierCurveDuotone,
        name: "Curve",
        markerType: CurveMarker,
      },
    ],
  },
  {
    name: "Text",
    markerTypes: [
      {
        icon: PiTextTDuotone,
        name: "Text",
        markerType: TextMarker,
      },
      {
        icon: PiChatTeardropDuotone,
        name: "Callout",
        markerType: CalloutMarker,
      },
      {
        icon: PiFrameCornersDuotone,
        name: "Captioned frame",
        markerType: CaptionFrameMarker,
      },
    ],
  },
  {
    name: "Advanced shapes",
    markerTypes: [
      {
        icon: PiScribbleLoopDuotone,
        name: "Freehand",
        markerType: FreehandMarker,
      },
      {
        icon: PiHighlighterCircleDuotone,
        name: "Highlighter",
        markerType: HighlighterMarker,
      },
      {
        icon: PiPolygonDuotone,
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
  variant = "secondary",
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

  const handleKeyboardShortcuts = useCallback((event: KeyboardEvent) => {
    if (!editor.current || !editorContainer.current) return;

    // Only handle shortcuts when the editor container or its children are focused
    const isEditorFocused =
      editorContainer.current.contains(document.activeElement) ||
      editorContainer.current.contains(event.target as Node);

    if (!isEditorFocused) return;

    // Delete/Backspace - delete selected markers
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      editor.current.deleteSelectedMarkers();
    }
  }, []);

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
          editor.current.deleteSelectedMarkers();
          break;
        }
        case "clear-all": {
          const currentState = editor.current.getState();
          editor.current.restoreState({
            width: currentState.width,
            height: currentState.height,
            markers: [],
          });
          break;
        }
        case "undo": {
          editor.current.undo();
          break;
        }
        case "redo": {
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

  const previousImageSrc = useRef<string | null>(null);

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

    if (imageChanged && editor.current && containerRef.contains(editor.current)) {
      containerRef.removeChild(editor.current);
      editor.current = null;
    }

    previousImageSrc.current = targetImageSrc;

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
        if (onStateChangeRef.current) {
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
        setEditorState((prevState) => ({
          ...prevState,
          mode: "select",
        }));
      });

      containerRef.replaceChildren();
      containerRef.appendChild(newEditor);
      editor.current = newEditor;

      if (
        annotationRef.current &&
        JSON.stringify(annotationRef.current) !== JSON.stringify(newEditor.getState())
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
  }, [targetImageSrc, updateCalculatedEditorState]);

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
    document.addEventListener("keydown", handleKeyboardShortcuts);
    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, [handleKeyboardShortcuts]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] w-full h-full border border-border rounded-xl">
      <div>
        <EditorToolbar
          variant={variant}
          markerTypes={markerTypes}
          currentMarkerType={currentMarkerType}
          editorState={editorState}
          saveVisible={!!onSave}
          onAction={handleToolbarAction}
          onNewMarker={handleNewMarker}
        />
      </div>
      <div className="relative">
        <div
          ref={editorContainer}
          className="flex overflow-hidden bg-slate-50 border-y border-border rounded-none **:bg-no-repeat"
        ></div>
        {showLegendOverlay && legendItems.length > 0 && (
          <LegendOverlay items={legendItems} />
        )}
      </div>
      <div>
        <EditorToolbox
          variant={variant}
          editorState={editorState}
          markerEditor={currentMarkerEditor}
          onAction={handleToolbarAction}
        />
      </div>
    </div>
  );
};

export default Editor;

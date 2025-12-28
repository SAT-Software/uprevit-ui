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
import { useEffect, useRef, useState } from "react";
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
  onSave?: (annotation: AnnotationState) => void;
  onStateChange?: (annotation: AnnotationState) => void;
};

const Editor = ({
  targetImageSrc,
  variant = "secondary",
  annotation,
  onSave,
  onStateChange,
}: Props) => {
  const editorContainer = useRef<HTMLDivElement | null>(null);
  const editor = useRef<MarkerArea | null>(null);
  const imageNaturalWidth = useRef<number>(0);
  const containerMaxWidthRef = useRef<number>(0);

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

  function deleteSelctedMarkers(event: KeyboardEvent) {
    if (
      editor.current &&
      (event.key === "Delete" || event.key === "Backspace")
    ) {
      event.preventDefault();
      editor.current.deleteSelectedMarkers();
    }
  }

  const handleToolbarAction = (action: ToolbarAction) => {
    if (editor.current) {
      switch (action) {
        case "select": {
          setEditorState((prevState: any) => ({
            ...prevState,
            mode: "select",
          }));
          editor.current.switchToSelectMode();
          break;
        }
        case "delete": {
          // @todo confirm delete
          editor.current.deleteSelectedMarkers();
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
      setEditorState((prevState: any) => ({
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

  const updateCalculatedEditorState = () => {
    if (editor.current) {
      const editorInstance = editor.current;
      setEditorState((prevState: any) => ({
        ...prevState,
        canUndo: editorInstance.isUndoPossible,
        canRedo: editorInstance.isRedoPossible,
        canDelete: editorInstance.selectedMarkerEditors.length > 0,
      }));
    }
  };

  const previousImageSrc = useRef<string | null>(null);

  useEffect(() => {
    const imageChanged =
      previousImageSrc.current !== null &&
      previousImageSrc.current !== targetImageSrc;

    if (imageChanged && editor.current && editorContainer.current) {
      editorContainer.current.removeChild(editor.current);
      editor.current = null;
    }

    if (!editor.current && editorContainer.current) {
      const targetImg = document.createElement("img");
      targetImg.src = targetImageSrc;

      const editorAreaWidth = editorContainer.current.clientWidth;
      const containerMaxWidth = Math.max(editorAreaWidth - 40, 200);
      const containerRef = editorContainer.current;

      const initializeEditor = (naturalWidth: number) => {
        if (!containerRef) return;

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
          if (onStateChange) {
            onStateChange(newEditor.getState());
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
          setEditorState((prevState: any) => ({
            ...prevState,
            mode: "select",
          }));
        });

        containerRef.appendChild(newEditor);
        editor.current = newEditor;

        if (
          annotation &&
          JSON.stringify(annotation) !== JSON.stringify(newEditor.getState())
        ) {
          newEditor.restoreState(annotation);
        }
      };

      if (targetImg.complete && targetImg.naturalWidth > 0) {
        initializeEditor(targetImg.naturalWidth);
      } else {
        targetImg.onload = () => {
          initializeEditor(targetImg.naturalWidth);
        };
      }
    } else if (
      editor.current &&
      annotation &&
      JSON.stringify(annotation) !== JSON.stringify(editor.current.getState())
    ) {
      editor.current.restoreState(annotation);
    }

    previousImageSrc.current = targetImageSrc;
  }, [annotation, targetImageSrc]);

  useEffect(() => {
    document.addEventListener("keydown", deleteSelctedMarkers);
    return () => {
      document.removeEventListener("keydown", deleteSelctedMarkers);
    };
  }, []);

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
      <div
        ref={editorContainer}
        className="flex overflow-hidden bg-slate-50 border-y border-border rounded-none **:bg-no-repeat"
      ></div>
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

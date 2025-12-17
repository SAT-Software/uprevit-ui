"use client";

import { useEffect, useRef, useState } from "react";
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
  HighlightMarker,
  LineMarker,
  MarkerArea,
  MarkerBaseEditor,
  MeasurementMarker,
  PolygonMarker,
  Renderer,
  TextMarker,
  HighlighterMarker,
} from "@markerjs/markerjs3";
import EditorToolbar from "./EditorToolbar";
import EditorToolbox from "./EditorToolbox";
import { MarkerTypeItem, MarkerTypeList, ToolbarAction } from "@/types/toolbar";
import { EditorState } from "@/types/editor";
import {
  PiArrowUpRightDuotone,
  PiChatTeardropDuotone,
  PiFrameCornersDuotone,
  PiSquareDuotone,
  PiCircleDuotone,
  PiRectangleDuotone,
  PiScribbleLoopDuotone,
  PiHighlighterCircleDuotone,
  PiLineSegmentDuotone,
  PiRulerDuotone,
  PiBezierCurveDuotone,
  PiPolygonDuotone,
  PiTextTDuotone,
} from "react-icons/pi";

const markerTypes: MarkerTypeList = [
  {
    name: "Basic shapes",
    markerTypes: [
      {
        icon: PiRectangleDuotone,
        name: "Rectangle",
        markerType: FrameMarker,
      },
      {
        icon: PiSquareDuotone,
        name: "Cover (filled rectangle)",
        markerType: CoverMarker,
      },
      {
        icon: PiHighlighterCircleDuotone,
        name: "Highlight",
        markerType: HighlightMarker,
      },
      {
        icon: PiCircleDuotone,
        name: "Ellipse",
        markerType: EllipseFrameMarker,
      },
      {
        icon: PiCircleDuotone,
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
  variant?: "ghost" | "outline";
  annotation: AnnotationState | null;
  onSave?: (annotation: AnnotationState) => void;
};

const Editor = ({
  targetImageSrc,
  variant = "ghost",
  annotation,
  onSave,
}: Props) => {
  const editorContainer = useRef<HTMLDivElement | null>(null);
  const editor = useRef<MarkerArea | null>(null);

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
          editor.current.zoomLevel = 1;
          break;
        }
        // case "download": {
        //   downloadMarkedImage();
        //   break;
        // }
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

  // const downloadMarkedImage = async () => {
  //   if (editor.current) {
  //     setEditorState((prevState: any) => ({
  //       ...prevState,
  //       mode: "rendering",
  //     }));
  //     const currentState = editor.current.getState();

  //     const renderer = new Renderer();
  //     renderer.targetImage = editor.current.targetImage;
  //     renderer.naturalSize = true;
  //     renderer.imageType = "image/png";

  //     const renderedImage = await renderer.rasterize(currentState);

  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = renderedImage;
  //     downloadLink.download = "marked-image.png";
  //     downloadLink.click();

  //     setEditorState((prevState: any) => ({
  //       ...prevState,
  //       mode: "select",
  //     }));
  //   }
  // };

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

  useEffect(() => {
    if (!editor.current && editorContainer.current) {
      const targetImg = document.createElement("img");
      targetImg.src = targetImageSrc;

      editor.current = new MarkerArea();

      editor.current.targetImage = targetImg;

      // set a reasonable size for the target image in the editor
      const editorAreaWidth = editorContainer.current.clientWidth;
      editor.current.targetWidth =
        editorAreaWidth < 400
          ? 400
          : editorAreaWidth < 2000
          ? Math.round((editorAreaWidth * 0.9) / 10) * 10
          : -1;

      editor.current.addEventListener("areastatechange", () => {
        updateCalculatedEditorState();
      });

      editor.current.addEventListener("markerselect", (ev) => {
        setCurrentMarkerEditor(ev.detail.markerEditor);
        updateCalculatedEditorState();
      });

      editor.current.addEventListener("markerdeselect", () => {
        setCurrentMarkerEditor(null);
        updateCalculatedEditorState();
      });

      editor.current.addEventListener("markercreate", () => {
        setEditorState((prevState: any) => ({
          ...prevState,
          mode: "select",
        }));
      });

      editorContainer.current.appendChild(editor.current);
    }
    if (
      annotation &&
      JSON.stringify(annotation) !== JSON.stringify(editor.current?.getState()) // make sure it actually changed
    ) {
      editor.current?.restoreState(annotation);
    }
  }, [annotation, targetImageSrc]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] w-full h-full">
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
        className="flex overflow-hidden bg-slate-50"
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

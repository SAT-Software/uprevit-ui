"use client";

import { EditorState } from "@/types/editor";
import { ToolbarAction } from "@/types/toolbar";
import {
  CalloutMarkerEditor,
  CaptionFrameMarkerEditor,
  FreehandMarkerEditor,
  LinearMarkerEditor,
  MarkerBaseEditor,
  PolygonMarkerEditor,
  ShapeMarkerEditor,
  ShapeOutlineMarkerEditor,
  TextMarkerEditor,
} from "@markerjs/markerjs3";
import {
  PiArrowClockwiseDuotone,
  PiArrowCounterClockwiseDuotone,
  PiMagnifyingGlassMinusDuotone,
  PiMagnifyingGlassPlusDuotone,
  PiScanDuotone,
} from "react-icons/pi";
import ToolbarActionButton from "./toolbar/ToolbarActionButton";
import FillPanel from "./toolbox/FillPanel";
import FontPanel from "./toolbox/FontPanel";
import NotesPanel from "./toolbox/NotesPanel";
import OpacityPanel from "./toolbox/OpacityPanel";
import StrokePanel from "./toolbox/StrokePanel";
import { ButtonGroup } from "@uprevit/ui/components/ui/button-group";

type Props = {
  editorState: EditorState;
  variant?: "ghost" | "outline" | "secondary";
  markerEditor: MarkerBaseEditor | null;
  onAction: (action: ToolbarAction) => void;
} & React.ComponentProps<"div">;

const EditorToolbox = ({
  editorState,
  variant = "secondary",
  markerEditor,
  onAction,
  ...props
}: Props) => {
  const canEditOpacity = (
    editor: MarkerBaseEditor | null
  ): editor is MarkerBaseEditor => {
    if (editor === null) {
      return false;
    }

    return editor.is(MarkerBaseEditor);
  };

  const canEditStroke = (
    editor: MarkerBaseEditor | null
  ): editor is MarkerBaseEditor => {
    if (editor === null) {
      return false;
    }

    return (
      editor.is(ShapeOutlineMarkerEditor) ||
      editor.is(LinearMarkerEditor) ||
      editor.is(CalloutMarkerEditor) ||
      editor.is(FreehandMarkerEditor) ||
      editor.is(PolygonMarkerEditor) ||
      editor.is(CaptionFrameMarkerEditor)
    );
  };

  const canEditFill = (
    editor: MarkerBaseEditor | null
  ): editor is MarkerBaseEditor => {
    if (editor === null) {
      return false;
    }

    return (
      editor.is(ShapeMarkerEditor) ||
      editor.is(CaptionFrameMarkerEditor) ||
      editor.is(CalloutMarkerEditor) ||
      editor.is(PolygonMarkerEditor)
    );
  };

  const canEditFont = (
    editor: MarkerBaseEditor | null
  ): editor is TextMarkerEditor => {
    if (editor === null) {
      return false;
    }

    return editor.is(TextMarkerEditor);
  };

  const canEditNotes = (
    editor: MarkerBaseEditor | null
  ): editor is MarkerBaseEditor => {
    if (editor === null) {
      return false;
    }

    return editor.is(MarkerBaseEditor);
  };

  return (
    <div className="flex space-x-1 p-2 justify-between" {...props}>
      <ButtonGroup>
        <ToolbarActionButton
          icon={PiArrowCounterClockwiseDuotone}
          title="Undo"
          variant={variant}
          action="undo"
          onAction={onAction}
          disabled={!editorState.canUndo}
        />
        <ToolbarActionButton
          icon={PiArrowClockwiseDuotone}
          title="Redo"
          variant={variant}
          className="hidden sm:inline-flex"
          action="redo"
          onAction={onAction}
          disabled={!editorState.canRedo}
        />
      </ButtonGroup>

      <div className="flex items-center gap-2">
        {canEditFont(markerEditor) && (
          <FontPanel markerEditor={markerEditor} variant={variant} />
        )}
        {canEditStroke(markerEditor) && (
          <StrokePanel markerEditor={markerEditor} variant={variant} />
        )}
        {canEditFill(markerEditor) && (
          <FillPanel markerEditor={markerEditor} variant={variant} />
        )}
        {canEditOpacity(markerEditor) && (
          <OpacityPanel markerEditor={markerEditor} variant={variant} />
        )}
        {canEditNotes(markerEditor) && (
          <NotesPanel markerEditor={markerEditor} variant={variant} />
        )}
      </div>

      <ButtonGroup>
        <ToolbarActionButton
          icon={PiMagnifyingGlassMinusDuotone}
          title="Zoom-out"
          variant={variant}
          action="zoom-out"
          onAction={onAction}
        />
        <ToolbarActionButton
          icon={PiScanDuotone}
          title="Reset zoom"
          variant={variant}
          className="hidden sm:inline-flex"
          action="zoom-reset"
          onAction={onAction}
        />
        <ToolbarActionButton
          icon={PiMagnifyingGlassPlusDuotone}
          title="Zoom-in"
          variant={variant}
          action="zoom-in"
          onAction={onAction}
        />
      </ButtonGroup>
    </div>
  );
};

export default EditorToolbox;

"use client";

import {
  MarkerTypeList,
  ToolbarAction,
  MarkerTypeItem,
  isMarkerTypeGroup,
} from "@/types/toolbar";
import {
  PiTrashDuotone,
  PiCursorDuotone,
  PiFloppyDiskDuotone,
  PiEraserDuotone,
} from "react-icons/pi";
import { EditorState } from "@/types/editor";
import ToolbarMarkerGroup from "./toolbar/ToolbarMarkerGroup";
import ToolbarActionButton from "./toolbar/ToolbarActionButton";
import ToolbarMarkersButton from "./toolbar/ToolbarMarkersButton";
import { ButtonGroup } from "@uprevit/ui/components/ui/button-group";

type Props = {
  markerTypes: MarkerTypeList;
  currentMarkerType: MarkerTypeItem | null;
  editorState: EditorState;
  variant?: "ghost" | "outline" | "secondary";
  saveVisible?: boolean;
  onAction: (action: ToolbarAction) => void;
  onNewMarker: (markerType: MarkerTypeItem) => void;
} & React.ComponentProps<"div">;

const EditorToolbar = ({
  markerTypes,
  currentMarkerType,
  editorState,
  variant = "secondary",
  saveVisible = false,
  onAction,
  onNewMarker,
  ...props
}: Props) => {
  return (
    <div className="flex space-x-1 p-2 items-center justify-between" {...props}>
      <ButtonGroup>
        <ToolbarActionButton
          icon={PiCursorDuotone}
          title="Select"
          buttonType="toggle"
          variant={variant}
          toggled={editorState.mode === "select"}
          action="select"
          onAction={onAction}
        />
        <ToolbarActionButton
          icon={PiTrashDuotone}
          title="Delete Selected"
          variant={variant}
          action="delete"
          onAction={onAction}
          disabled={!editorState.canDelete}
        />
        <ToolbarActionButton
          icon={PiEraserDuotone}
          title="Clear All Annotations"
          variant={variant}
          action="clear-all"
          onAction={onAction}
        />
      </ButtonGroup>

      <ButtonGroup>
        {markerTypes.map(
          (markerListItem) =>
            isMarkerTypeGroup(markerListItem) ? (
              <ToolbarMarkerGroup
                key={markerListItem.name}
                markers={markerListItem}
                variant={variant}
                toggled={
                  editorState.mode === "create" && currentMarkerType
                    ? markerListItem.markerTypes.includes(currentMarkerType)
                    : false
                }
                onSelectionChange={onNewMarker}
              />
            ) : null // @todo handle single marker items
        )}
      </ButtonGroup>
      <div className="sm:hidden space-x-1 items-center">
        <ToolbarMarkersButton
          markerList={markerTypes}
          onSelectionChange={onNewMarker}
        />
      </div>

      <div className="inline-flex space-x-1">
        {saveVisible && (
          <ToolbarActionButton
            icon={PiFloppyDiskDuotone}
            title="Save"
            variant={variant}
            action="save"
            onAction={onAction}
          />
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;

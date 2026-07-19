"use client";

import { EditorState } from "@/types/editor";
import {
  MarkerTypeItem,
  MarkerTypeList,
  ToolbarAction,
  isMarkerTypeGroup,
} from "@/types/toolbar";
import {
  Cursor02Icon,
  EraserIcon,
  Delete03Icon,
} from "@hugeicons/core-free-icons";
import { ButtonGroup } from "@uprevit/ui/components/ui/button-group";
import ToolbarActionButton from "./toolbar/ToolbarActionButton";
import ToolbarMarkerGroup from "./toolbar/ToolbarMarkerGroup";
import ToolbarMarkersButton from "./toolbar/ToolbarMarkersButton";

type Props = {
  markerTypes: MarkerTypeList;
  currentMarkerType: MarkerTypeItem | null;
  editorState: EditorState;
  variant?: "ghost" | "outline" | "secondary";
  onAction: (action: ToolbarAction) => void;
  onNewMarker: (markerType: MarkerTypeItem) => void;
} & React.ComponentProps<"div">;

const EditorToolbar = ({
  markerTypes,
  currentMarkerType,
  editorState,
  variant = "outline",
  onAction,
  onNewMarker,
  ...props
}: Props) => {
  return (
    <div
      className="flex items-center justify-between border-b border-border h-10 px-2"
      {...props}
    >
      <ButtonGroup>
        <ToolbarActionButton
          icon={Cursor02Icon}
          title="Select"
          buttonType="toggle"
          variant={variant}
          toggled={editorState.mode === "select"}
          action="select"
          onAction={onAction}
        />
        <ToolbarActionButton
          icon={EraserIcon}
          title="Delete Selected"
          variant={variant}
          action="delete"
          onAction={onAction}
          disabled={!editorState.canDelete}
        />
        <ToolbarActionButton
          icon={Delete03Icon}
          title="Clear All Annotations"
          variant={variant}
          action="clear-all"
          onAction={onAction}
        />
      </ButtonGroup>

      <ButtonGroup className="hidden flex-wrap sm:inline-flex">
        {markerTypes.map((markerListItem) =>
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
          ) : null,
        )}
      </ButtonGroup>
      <div className="items-center space-x-1 sm:hidden">
        <ToolbarMarkersButton
          markerList={markerTypes}
          onSelectionChange={onNewMarker}
        />
      </div>
    </div>
  );
};

export default EditorToolbar;

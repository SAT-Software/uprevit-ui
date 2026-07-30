"use client";

import { useState } from "react";

import { Button } from "@uprevit/ui/components/ui/button";
import { Icon } from "@uprevit/ui/components/common/Icon";

import { MarkerTypeGroup, MarkerTypeItem } from "@/types/toolbar";
import { ButtonGroup } from "@uprevit/ui/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

type Props = {
  markers: MarkerTypeGroup;
  variant?: "ghost" | "outline" | "secondary";
  toggled: boolean;
  onSelectionChange: (markerType: MarkerTypeItem) => void;
};

const ToolbarMarkerGroup = ({
  markers,
  variant = "ghost",
  toggled,
  onSelectionChange,
}: Props) => {
  const [currentMarkerType, setCurrentMarkerType] = useState(
    markers.markerTypes[0],
  );

  const handleMarkerSelection = (markerType: MarkerTypeItem) => {
    setCurrentMarkerType(markerType);
    onSelectionChange(markerType);
  };

  return (
    <ButtonGroup className="inline-flex items-center gap-0">
      <ButtonGroup>
        {markers.markerTypes.map((markerType) => {
          const isActive =
            toggled && currentMarkerType.name === markerType.name;
          return (
            <Tooltip key={markerType.name}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "secondary" : variant}
                  size="icon-sm"
                  className="size-7"
                  onClick={() => handleMarkerSelection(markerType)}
                >
                  <Icon icon={markerType.icon} size={14} strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{markerType.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </ButtonGroup>
    </ButtonGroup>
  );
};

export default ToolbarMarkerGroup;

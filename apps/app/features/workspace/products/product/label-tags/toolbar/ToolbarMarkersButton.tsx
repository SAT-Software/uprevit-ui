"use client";

import { useState } from "react";

import { Button } from "@uprevit/ui/components/ui/button";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import { Add01Icon } from "@hugeicons/core-free-icons";

import {
  MarkerTypeList,
  MarkerTypeItem,
  isMarkerTypeGroup,
} from "@/types/toolbar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

type Props = {
  markerList: MarkerTypeList;
  variant?: "ghost" | "outline";
  onSelectionChange: (markerType: MarkerTypeItem) => void;
};

const ToolbarMarkersButton = ({
  markerList,
  variant = "ghost",
  onSelectionChange,
}: Props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleMarkerSelection = (markerType: MarkerTypeItem) => {
    setPopoverOpen(false);
    onSelectionChange(markerType);
  };

  return (
    <div className="inline-flex">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            size="icon-sm"
            className="size-7"
            aria-label="Add marker"
            onClick={() => setPopoverOpen(!popoverOpen)}
          >
            <Icon icon={Add01Icon} size={14} strokeWidth={2} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto max-w-60 flex-col p-2">
          {markerList.map((markers) => (
            <div key={markers.name} className="mb-3 flex flex-col last:mb-0">
              <h2 className="mb-1 rounded-sm bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                {markers.name}
              </h2>
              <div className="flex flex-wrap">
                {isMarkerTypeGroup(markers) &&
                  markers.markerTypes.map((markerType) => (
                    <Tooltip key={markerType.name}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="size-7"
                          onClick={() => handleMarkerSelection(markerType)}
                        >
                          <Icon
                            icon={markerType.icon}
                            size={14}
                            strokeWidth={2}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{markerType.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ToolbarMarkersButton;

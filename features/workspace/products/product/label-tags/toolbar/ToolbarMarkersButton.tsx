"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  MarkerTypeList,
  MarkerTypeItem,
  isMarkerTypeGroup,
} from "@/types/toolbar";
import { PiPlusDuotone } from "react-icons/pi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <div className="inline-flex border rounded-md border-transparent hover:border hover:border-slate-200">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            title="Add Marker"
            className="bg-transparent"
            onClick={() => setPopoverOpen(!popoverOpen)}
          >
            <PiPlusDuotone />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col w-auto max-w-60 p-2">
          {markerList.map((markers) => (
            <div key={markers.name} className="flex flex-col mb-3 last:mb-0">
              <h2 className="text-sm bg-slate-100 py-1 px-2 rounded-sm mb-1">
                {markers.name}
              </h2>
              <div className="flex flex-wrap">
                {isMarkerTypeGroup(markers) &&
                  markers.markerTypes.map((markerType) => (
                    <Tooltip key={markerType.name}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          // title={markerType.name}
                          onClick={() => handleMarkerSelection(markerType)}
                        >
                          <markerType.icon />
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

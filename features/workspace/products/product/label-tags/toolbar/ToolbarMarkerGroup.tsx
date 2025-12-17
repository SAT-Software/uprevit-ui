"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";

import { MarkerTypeGroup, MarkerTypeItem } from "@/types/toolbar";
import { PiCaretDown } from "react-icons/pi";

type Props = {
  markers: MarkerTypeGroup;
  variant?: "ghost" | "outline";
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
    markers.markerTypes[0]
  );

  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleMarkerSelection = (markerType: MarkerTypeItem) => {
    setCurrentMarkerType(markerType);
    setPopoverOpen(false);
    onSelectionChange(markerType);
  };

  return (
    <div className="inline-flex items-center gap-0">
      <Toggle
        title={currentMarkerType.name}
        pressed={toggled}
        variant={variant === "ghost" ? "default" : "outline"}
        className="rounded-r-none border-r-0 cursor-pointer"
        onClick={() => handleMarkerSelection(currentMarkerType)}
      >
        <currentMarkerType.icon />
      </Toggle>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            title={markers.name}
            className="rounded-l-none border-l-0 bg-transparent pr-1 cursor-pointer"
            onClick={() => setPopoverOpen(!popoverOpen)}
          >
            <PiCaretDown />
          </button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-wrap w-auto p-2">
          {markers.markerTypes.map((markerType) => (
            <Button
              variant="ghost"
              size="icon"
              key={markerType.name}
              title={markerType.name}
              onClick={() => handleMarkerSelection(markerType)}
            >
              <markerType.icon />
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ToolbarMarkerGroup;

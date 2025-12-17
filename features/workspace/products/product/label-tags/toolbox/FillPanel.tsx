"use client";

import { useEffect, useState } from "react";

import { PiPaintBucketDuotone } from "react-icons/pi";
import ToolboxPanel, { PanelProps } from "../ui/ToolboxPanel";
import ColorPicker from "../ui/ColorPicker";
import { defaultColorsWithTransparent } from "@/types/colors";

const FillPanel = ({ markerEditor, variant = "ghost" }: PanelProps) => {
  const [fillColor, setFillColor] = useState(markerEditor.fillColor);

  useEffect(() => {
    setFillColor(markerEditor.fillColor);
  }, [markerEditor]);

  const handleFillColorChange = (newValue: string) => {
    markerEditor.fillColor = newValue;
    setFillColor(newValue);
  };

  return (
    <ToolboxPanel title="Fill" icon={PiPaintBucketDuotone} variant={variant}>
      <div className="flex flex-col space-y-4">
        <ColorPicker
          color={fillColor}
          colors={defaultColorsWithTransparent}
          onValueChange={handleFillColorChange}
        />
      </div>
    </ToolboxPanel>
  );
};

export default FillPanel;

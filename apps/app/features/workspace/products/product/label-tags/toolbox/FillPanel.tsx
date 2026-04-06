"use client";

import { useEffect, useRef, useState } from "react";

import { PiPaintBucketDuotone } from "react-icons/pi";
import ToolboxPanel, { PanelProps } from "../ui/ToolboxPanel";
import ColorPicker from "../ui/ColorPicker";
import { defaultColorsWithTransparent } from "@/types/colors";

let markerEditorIdCounter = 0;
const markerEditorIds = new WeakMap<object, number>();

const getMarkerEditorKey = (editor: object) => {
  if (!markerEditorIds.has(editor)) {
    markerEditorIdCounter += 1;
    markerEditorIds.set(editor, markerEditorIdCounter);
  }
  return markerEditorIds.get(editor) ?? 0;
};

const FillPanelBody = ({ markerEditor, variant = "ghost" }: PanelProps) => {
  const markerEditorRef = useRef(markerEditor);
  const [fillColor, setFillColor] = useState(() => markerEditor.fillColor);

  useEffect(() => {
    markerEditorRef.current = markerEditor;
  }, [markerEditor]);

  const handleFillColorChange = (newValue: string) => {
    markerEditorRef.current.fillColor = newValue;
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

const FillPanel = (props: PanelProps) => {
  const markerKey = getMarkerEditorKey(props.markerEditor as object);
  return <FillPanelBody key={markerKey} {...props} />;
};

export default FillPanel;

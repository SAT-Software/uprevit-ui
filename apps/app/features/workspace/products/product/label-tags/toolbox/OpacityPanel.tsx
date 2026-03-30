"use client";

import { useEffect, useRef, useState } from "react";

import { PiDropHalfBottomDuotone } from "react-icons/pi";
import { Slider } from "@uprevit/ui/components/ui/slider";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import ToolboxPanel, { PanelProps } from "../ui/ToolboxPanel";

let markerEditorIdCounter = 0;
const markerEditorIds = new WeakMap<object, number>();

const getMarkerEditorKey = (editor: object) => {
  if (!markerEditorIds.has(editor)) {
    markerEditorIdCounter += 1;
    markerEditorIds.set(editor, markerEditorIdCounter);
  }
  return markerEditorIds.get(editor) ?? 0;
};

const OpacityPanelBody = ({ markerEditor }: PanelProps) => {
  const markerEditorRef = useRef(markerEditor);
  const [opacity, setOpacity] = useState(() => markerEditor.opacity);

  useEffect(() => {
    markerEditorRef.current = markerEditor;
  }, [markerEditor]);

  const handleOpacityChange = (newValue: number) => {
    if (newValue < 0 || newValue > 1) {
      setOpacity(markerEditorRef.current.opacity);
    } else {
      markerEditorRef.current.opacity = newValue;
      setOpacity(newValue);
    }
  };

  return (
    <ToolboxPanel title="Opacity" icon={PiDropHalfBottomDuotone}>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center space-x-2">
          <Label htmlFor="opacityInput">Value</Label>
          <Input
            id="opacityInput"
            value={Math.round(opacity * 100)}
            type="number"
            min={0}
            max={100}
            step={10}
            className="w-auto p-1 text-right"
            onChange={(ev) =>
              handleOpacityChange(ev.target.valueAsNumber / 100)
            }
          />
        </div>
        <Slider
          value={[opacity]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={(ev) => handleOpacityChange(ev[0])}
        />
      </div>
    </ToolboxPanel>
  );
};

const OpacityPanel = (props: PanelProps) => {
  const markerKey = getMarkerEditorKey(props.markerEditor as object);
  return <OpacityPanelBody key={markerKey} {...props} />;
};

export default OpacityPanel;

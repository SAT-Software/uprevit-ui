"use client";

import { FC, SVGProps, useEffect, useRef, useState } from "react";

import {
  PiPenDuotone,
  PiLineSegmentDuotone,
  PiArrowLeftDuotone,
  PiArrowRightDuotone,
  PiArrowsLeftRightDuotone,
} from "react-icons/pi";
import { Slider } from "@uprevit/ui/components/ui/slider";
import { Input } from "@uprevit/ui/components/ui/input";
import ToolboxPanel, { PanelProps } from "../ui/ToolboxPanel";
import { Label } from "@uprevit/ui/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@uprevit/ui/components/ui/toggle-group";
import { ArrowMarkerEditor, ArrowType } from "@markerjs/markerjs3";
import ColorPicker from "../ui/ColorPicker";

const StrokeStyleVisual: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="butt"
    strokeLinejoin="round"
  >
    <path strokeDasharray={props.strokeDasharray} d="M2,12 H22" />
  </svg>
);

let markerEditorIdCounter = 0;
const markerEditorIds = new WeakMap<object, number>();

const getMarkerEditorKey = (editor: object) => {
  if (!markerEditorIds.has(editor)) {
    markerEditorIdCounter += 1;
    markerEditorIds.set(editor, markerEditorIdCounter);
  }
  return markerEditorIds.get(editor) ?? 0;
};

const StrokePanelBody = ({ markerEditor, variant = "ghost" }: PanelProps) => {
  const markerEditorRef = useRef(markerEditor);
  const [strokeWidth, setStrokeWidth] = useState(
    () => markerEditor.strokeWidth
  );
  const [strokeStyle, setStrokeStyle] = useState(
    () => (markerEditor.strokeDasharray === "" ? "0" : markerEditor.strokeDasharray)
  );
  const [strokeColor, setStrokeColor] = useState(
    () => markerEditor.strokeColor
  );
  const [arrowType, setArrowType] = useState(() =>
    markerEditor.is(ArrowMarkerEditor) ? markerEditor.arrowType : "none"
  );

  useEffect(() => {
    markerEditorRef.current = markerEditor;
  }, [markerEditor]);

  const handleStrokeWidthChange = (newValue: number) => {
    markerEditorRef.current.strokeWidth = newValue;
    setStrokeWidth(newValue);
  };

  const handleStrokeStyleChange = (newValue: string) => {
    markerEditorRef.current.strokeDasharray = newValue;
    setStrokeStyle(newValue);
  };

  const handleStrokeColorChange = (newValue: string) => {
    markerEditorRef.current.strokeColor = newValue;
    setStrokeColor(newValue);
  };

  const handleArrowTypeChange = (newValue: ArrowType) => {
    if (!markerEditorRef.current.is(ArrowMarkerEditor)) {
      return;
    }
    markerEditorRef.current.arrowType = newValue;
    setArrowType(newValue);
  };

  return (
    <ToolboxPanel title="Stroke" icon={PiPenDuotone} variant={variant}>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center space-x-2">
          <Label htmlFor="strokeWidthInput">Width</Label>
          <Input
            id="strokeWidthInput"
            value={strokeWidth}
            type="number"
            min={1}
            max={10}
            step={1}
            className="w-auto p-1 text-right"
            onChange={(ev) => handleStrokeWidthChange(ev.target.valueAsNumber)}
          />
        </div>
        <Slider
          value={[strokeWidth]}
          min={0}
          max={50}
          step={1}
          onValueChange={(ev) => handleStrokeWidthChange(ev[0])}
        />
      </div>

      <div className="flex items-center space-x-4 justify-between">
        <Label>Style</Label>
        <ToggleGroup
          type="single"
          value={strokeStyle}
          variant="outline"
          onValueChange={handleStrokeStyleChange}
        >
          <ToggleGroupItem value="0" title="Solid">
            <StrokeStyleVisual strokeDasharray="0" />
          </ToggleGroupItem>
          <ToggleGroupItem value="4,4" title="Dashed">
            <StrokeStyleVisual strokeDasharray="4,4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="2,3" title="Dotted">
            <StrokeStyleVisual strokeDasharray="2,3" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {markerEditor.is(ArrowMarkerEditor) && (
        <div className="flex items-center space-x-4 justify-between">
          <Label>Arrows</Label>
          <ToggleGroup
            type="single"
            value={arrowType}
            variant="outline"
            onValueChange={handleArrowTypeChange}
          >
            <ToggleGroupItem value="none" title="None">
              <PiLineSegmentDuotone />
            </ToggleGroupItem>
            <ToggleGroupItem value="start" title="Start">
              <PiArrowLeftDuotone />
            </ToggleGroupItem>
            <ToggleGroupItem value="end" title="End">
              <PiArrowRightDuotone />
            </ToggleGroupItem>
            <ToggleGroupItem value="both" title="Both">
              <PiArrowsLeftRightDuotone />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <Label>Color</Label>
        <ColorPicker
          color={strokeColor}
          onValueChange={handleStrokeColorChange}
        />
      </div>
    </ToolboxPanel>
  );
};

const StrokePanel = (props: PanelProps) => {
  const markerKey = getMarkerEditorKey(props.markerEditor as object);
  return <StrokePanelBody key={markerKey} {...props} />;
};

export default StrokePanel;

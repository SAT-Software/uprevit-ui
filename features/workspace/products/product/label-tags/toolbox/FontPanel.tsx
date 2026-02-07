"use client";

import { useEffect, useRef, useState } from "react";

import { PiTextAaDuotone } from "react-icons/pi";
import ToolboxPanel, { PanelProps } from "../ui/ToolboxPanel";
import { Label } from "@/components/ui/label";
import ColorPicker from "../ui/ColorPicker";
import { TextMarkerEditor } from "@markerjs/markerjs3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Props = {
  markerEditor: TextMarkerEditor;
} & PanelProps;

let markerEditorIdCounter = 0;
const markerEditorIds = new WeakMap<object, number>();

const getMarkerEditorKey = (editor: object) => {
  if (!markerEditorIds.has(editor)) {
    markerEditorIdCounter += 1;
    markerEditorIds.set(editor, markerEditorIdCounter);
  }
  return markerEditorIds.get(editor) ?? 0;
};

const FontPanelBody = ({ markerEditor, variant = "secondary" }: Props) => {
  const markerEditorRef = useRef(markerEditor);
  const [color, setColor] = useState(() => markerEditor.color);
  const [fontFamily, setFontFamily] = useState(() => markerEditor.fontFamily);
  const [fontSize, setFontSize] = useState(() => markerEditor.fontSize.value);

  useEffect(() => {
    markerEditorRef.current = markerEditor;
  }, [markerEditor]);

  const handleColorChange = (newValue: string) => {
    markerEditorRef.current.color = newValue;
    setColor(newValue);
  };

  const handleFontFamilyChange = (newValue: string) => {
    markerEditorRef.current.fontFamily = newValue;
    setFontFamily(newValue);
  };

  const handleFontSizeChange = (newValue: string) => {
    const newValueNum = parseFloat(newValue);
    const currentFontSize = markerEditorRef.current.fontSize;
    markerEditorRef.current.fontSize = {
      value: newValueNum,
      units: currentFontSize.units,
      step: currentFontSize.step,
    };
    setFontSize(newValueNum);
  };

  return (
    <ToolboxPanel title="Font" icon={PiTextAaDuotone} variant={variant}>
      <div className="flex justify-between items-center space-x-2">
        <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Helvetica, Arial, sans-serif">
              Sans-serif
            </SelectItem>
            <SelectItem value="Georgia, 'Times New Roman', Times, serif">
              Serif
            </SelectItem>
            <SelectItem value="'Courier New', Courier, monospace">
              Monospace
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4 justify-between">
        <Label>Size</Label>
        <ToggleGroup
          type="single"
          value={fontSize.toString()}
          variant="outline"
          onValueChange={handleFontSizeChange}
        >
          <ToggleGroupItem value="0.5" title="Small">
            XS
          </ToggleGroupItem>
          <ToggleGroupItem value="0.8" title="Small">
            S
          </ToggleGroupItem>
          <ToggleGroupItem value="1" title="Normal">
            M
          </ToggleGroupItem>
          <ToggleGroupItem value="1.5" title="Large">
            L
          </ToggleGroupItem>
          <ToggleGroupItem value="3" title="Large">
            XL
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-col space-y-4">
        <Label>Color</Label>
        <ColorPicker color={color} onValueChange={handleColorChange} />
      </div>
    </ToolboxPanel>
  );
};

const FontPanel = (props: Props) => {
  const markerKey = getMarkerEditorKey(props.markerEditor as object);
  return <FontPanelBody key={markerKey} {...props} />;
};

export default FontPanel;

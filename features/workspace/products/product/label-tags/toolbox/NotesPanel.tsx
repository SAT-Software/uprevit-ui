"use client";

import { useEffect, useRef, useState } from "react";

import { PiNoteDuotone } from "react-icons/pi";
import ToolboxPanel, { PanelProps } from "../ui/ToolboxPanel";
import { Textarea } from "@/components/ui/textarea";

let markerEditorIdCounter = 0;
const markerEditorIds = new WeakMap<object, number>();

const getMarkerEditorKey = (editor: object) => {
  if (!markerEditorIds.has(editor)) {
    markerEditorIdCounter += 1;
    markerEditorIds.set(editor, markerEditorIdCounter);
  }
  return markerEditorIds.get(editor) ?? 0;
};

const NotesPanelBody = ({ markerEditor, variant = "ghost" }: PanelProps) => {
  // @todo replace with markerEditor.notes in the next release
  const markerEditorRef = useRef(markerEditor);
  const [notes, setNotes] = useState(() => markerEditor.marker.notes);

  useEffect(() => {
    markerEditorRef.current = markerEditor;
  }, [markerEditor]);

  const handleNotesChange = (newValue: string) => {
    markerEditorRef.current.marker.notes = newValue;
    setNotes(newValue);
  };

  return (
    <ToolboxPanel
      title="Notes"
      icon={PiNoteDuotone}
      variant={variant}
      className="w-80"
    >
      <div className="flex flex-col space-y-4">
        <Textarea
          className="min-h-24"
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
        />
      </div>
    </ToolboxPanel>
  );
};

const NotesPanel = (props: PanelProps) => {
  const markerKey = getMarkerEditorKey(props.markerEditor as object);
  return <NotesPanelBody key={markerKey} {...props} />;
};

export default NotesPanel;

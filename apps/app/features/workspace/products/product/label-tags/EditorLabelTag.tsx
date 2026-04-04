"use client";

import { useEffect, useRef } from "react";
import {
  AnnotationState,
  ArrowMarker,
  FrameMarker,
  MarkerArea,
  RectangularBoxMarkerBase,
} from "@markerjs/markerjs3";
import { Button } from "@uprevit/ui/components/ui/button";
import Image from "next/image";
import {
  PiArrowUpRightDuotone,
  PiFloppyDiskBackDuotone,
  PiSquareDuotone,
  PiTrashDuotone,
} from "react-icons/pi";

type Props = {
  targetImage: string;
  onSave: (annotation: AnnotationState) => void;
};

export default function EditorLabelTag({ targetImage, onSave }: Props) {
  const editorContainer = useRef<HTMLDivElement | null>(null);
  const editor = useRef<MarkerArea | null>(null);

  useEffect(() => {
    if (!editor.current && editorContainer.current) {
      const targetImg = document.createElement("img");
      targetImg.src = targetImage;
      targetImg.className = "object-contain";

      editor.current = new MarkerArea();
      editor.current.targetImage = targetImg;

      editorContainer.current.appendChild(editor.current);
    }
  }, [targetImage]);

  return (
    <div className="flex justify-between items-start w-full gap-20">
      <div
        ref={editorContainer}
        className="w-[70%] h-auto border border-border rounded-lg"
      />

      <div className="flex flex-col gap-2 p-2 border border-border rounded-lg">
        <Button
          onClick={() => {
            editor.current?.createMarker(ArrowMarker);
          }}
          variant="secondary"
        >
          <PiArrowUpRightDuotone />
        </Button>
        <Button
          onClick={() => {
            editor.current?.createMarker(FrameMarker);
          }}
          variant="secondary"
        >
          <PiSquareDuotone />
        </Button>
        <Button
          onClick={() => {
            if (editor.current) {
              onSave(editor.current.getState());
            }
          }}
          variant="secondary"
        >
          <PiFloppyDiskBackDuotone />
        </Button>
        <Button
          onClick={() => {
            if (editor.current) {
              editor.current.deleteSelectedMarkers();
            }
          }}
          variant="secondary"
        >
          <PiTrashDuotone />
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import {
  AnnotationState,
  ArrowMarker,
  FrameMarker,
  MarkerArea,
  RectangularBoxMarkerBase,
} from "@markerjs/markerjs3";
import {
  ArrowUpRight01Icon,
  Delete02Icon,
  FloppyDiskIcon,
  SquareIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";

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
          <Icon icon={ArrowUpRight01Icon} size={16} strokeWidth={2} />
        </Button>
        <Button
          onClick={() => {
            editor.current?.createMarker(FrameMarker);
          }}
          variant="secondary"
        >
          <Icon icon={SquareIcon} size={16} strokeWidth={2} />
        </Button>
        <Button
          onClick={() => {
            if (editor.current) {
              onSave(editor.current.getState());
            }
          }}
          variant="secondary"
        >
          <Icon icon={FloppyDiskIcon} size={16} strokeWidth={2} />
        </Button>
        <Button
          onClick={() => {
            if (editor.current) {
              editor.current.deleteSelectedMarkers();
            }
          }}
          variant="secondary"
        >
          <Icon icon={Delete02Icon} size={16} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

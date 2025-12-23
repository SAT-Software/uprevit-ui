import { AnnotationState, Renderer } from "@markerjs/markerjs3";
import { useEffect } from "react";

type Props = {
  targetImage: string;
  annotation: AnnotationState;
  filename?: string;
  mode?: "download" | "upload";
  onComplete?: () => void;
  onRendered?: (dataUrl: string) => void;
};

const Render = ({
  targetImage,
  annotation,
  filename = "label-tag.png",
  mode = "upload",
  onComplete,
  onRendered,
}: Props) => {
  useEffect(() => {
    const targetImg = document.createElement("img");
    // Set crossOrigin before src to avoid tainted canvas
    targetImg.crossOrigin = "anonymous";

    targetImg.onload = async () => {
      const renderer = new Renderer();
      renderer.targetImage = targetImg;

      const dataUrl = await renderer.rasterize(annotation);

      if (mode === "download") {
        // Download the rendered image locally
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (mode === "upload" && onRendered) {
        // Pass the data URL to the callback for upload
        onRendered(dataUrl);
      }

      // Notify parent that render is complete
      onComplete?.();
    };

    targetImg.onerror = (error) => {
      console.error("Failed to load image:", error);
      onComplete?.();
    };

    targetImg.src = targetImage;
  }, [targetImage, annotation, filename, mode, onRendered, onComplete]);

  return null;
};

export default Render;

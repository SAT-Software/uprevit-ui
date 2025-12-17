import { AnnotationState, Renderer } from "@markerjs/markerjs3";
import { useEffect } from "react";

type Props = {
  targetImage: string;
  annotation: AnnotationState;
  filename?: string;
};

const Render = ({
  targetImage,
  annotation,
  filename = "label-tag.png",
}: Props) => {
  useEffect(() => {
    const targetImg = document.createElement("img");
    // Set crossOrigin before src to avoid tainted canvas
    targetImg.crossOrigin = "anonymous";

    targetImg.onload = async () => {
      const renderer = new Renderer();
      renderer.targetImage = targetImg;

      const dataUrl = await renderer.rasterize(annotation);

      // Download the rendered image locally
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    targetImg.onerror = (error) => {
      console.error("Failed to load image:", error);
    };

    targetImg.src = targetImage;
  }, [targetImage, annotation, filename]);

  return null;
};

export default Render;

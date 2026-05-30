import type { AnnotationState } from "@markerjs/markerjs3";

function normalizeMarkers(
  markers: AnnotationState["markers"] | undefined,
): AnnotationState["markers"] | undefined {
  if (!markers) return markers;

  return markers.map((marker) => {
    const typeName = marker.typeName;
    return {
      ...marker,
      typeName:
        typeof typeName === "string" ? typeName.toLowerCase() : typeName,
    };
  });
}

export function normalizeAnnotationForComparison(
  state: AnnotationState | undefined | null,
): AnnotationState | null {
  if (!state) return null;

  return {
    ...state,
    markers: normalizeMarkers(state.markers),
  };
}

export function serializeAnnotationForComparison(
  state: AnnotationState | undefined | null,
): string {
  const normalized = normalizeAnnotationForComparison(state);
  if (!normalized) return "";
  return JSON.stringify(normalized);
}

export function annotationsMatchForComparison(
  left: AnnotationState | undefined | null,
  right: AnnotationState | undefined | null,
): boolean {
  return (
    serializeAnnotationForComparison(left) ===
    serializeAnnotationForComparison(right)
  );
}

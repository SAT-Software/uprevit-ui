"use client";

export function DottedVerticalLines() {
  return (
    <div className="absolute inset-0 w-full max-w-6xl mx-auto pointer-events-none">
      <div className="absolute top-0 left-0 w-px bottom-0 border-l border-dashed border-border/80 z-30" />
      <div className="absolute top-0 right-0 w-px bottom-0 border-r border-dashed border-border/80 z-30" />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ColorPicker from "./ui/ColorPicker";
import {
  DEFAULT_LEGEND_ITEM,
  LegendFormValues,
  LegendShape,
  LegendStrokeStyle,
} from "./legendTypes";
import { LegendSwatch } from "./LegendSwatch";
import {
  PiArrowUpRightDuotone,
  PiCircle,
  PiFloppyDiskDuotone,
  PiLineSegmentDuotone,
  PiPlusCircleDuotone,
  PiSquare,
  PiXCircleDuotone,
} from "react-icons/pi";
import { defaultColorsWithTransparent } from "@/types/colors";
import { Spinner } from "@/components/ui/spinner";

type LegendDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  defaultValues?: LegendFormValues | null;
  onSave: (values: LegendFormValues) => Promise<boolean>;
  disabled?: boolean;
};

const StrokeStyleVisual = ({ dashArray }: { dashArray?: string }) => (
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
    <path strokeDasharray={dashArray} d="M2,12 H22" />
  </svg>
);

export function LegendDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSave,
  disabled = false,
}: LegendDialogProps) {
  const [values, setValues] = useState<LegendFormValues>(() => ({
    ...DEFAULT_LEGEND_ITEM,
    ...defaultValues,
  }));
  const [textTouched, setTextTouched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValues({
        ...DEFAULT_LEGEND_ITEM,
        ...defaultValues,
      });
      setTextTouched(false);
      setIsSaving(false);
    }
  }, [open, defaultValues]);

  const isTextValid = values.text.trim().length > 0;
  const fillOpacityPercent = Math.round((values.fillOpacity ?? 0.2) * 100);

  const handleSave = async () => {
    if (disabled || isSaving) {
      return;
    }
    if (!isTextValid) {
      setTextTouched(true);
      return;
    }
    setIsSaving(true);
    try {
      const success = await onSave({
        ...values,
        text: values.text.trim(),
      });
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleShapeChange = (shape: LegendShape) => {
    setValues((prev) => ({ ...prev, shape }));
  };

  const handleStrokeStyleChange = (strokeStyle: LegendStrokeStyle) => {
    setValues((prev) => ({ ...prev, strokeStyle }));
  };

  const handleFillOpacityChange = (value: number) => {
    const clamped = Math.min(100, Math.max(0, value));
    setValues((prev) => ({ ...prev, fillOpacity: clamped / 100 }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:hidden"
        onPointerDownOutside={(event) => {
          if (isSaving) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (isSaving) event.preventDefault();
        }}
      >
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <span className="font-semibold">
              {mode === "add" ? "Add Legend Item" : "Edit Legend Item"}
            </span>
            <DialogClose asChild>
              <button
                type="button"
                className={`cursor-pointer ${
                  isSaving ? "pointer-events-none opacity-50" : ""
                }`}
                disabled={isSaving}
              >
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Configure legend appearance and label text.
        </DialogDescription>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
            <LegendSwatch
              item={{ id: "preview", ...values }}
              size={22}
              className="text-muted-foreground"
            />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Preview</span>
              <span className="text-sm font-medium text-foreground">
                {values.text || "Legend text"}
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Shape</Label>
              <ToggleGroup
                type="single"
                value={values.shape}
                variant="outline"
                size="sm"
                className="justify-start"
                disabled={isSaving || disabled}
                onValueChange={(value: string) =>
                  value && handleShapeChange(value as LegendShape)
                }
              >
                <ToggleGroupItem value="rectangle" title="Rectangle">
                  <PiSquare />
                </ToggleGroupItem>
                <ToggleGroupItem value="ellipse" title="Ellipse">
                  <PiCircle />
                </ToggleGroupItem>
                <ToggleGroupItem value="line" title="Line">
                  <PiLineSegmentDuotone />
                </ToggleGroupItem>
                <ToggleGroupItem value="arrow" title="Arrow">
                  <PiArrowUpRightDuotone />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <Label>Line Style</Label>
              <ToggleGroup
                type="single"
                value={values.strokeStyle || "solid"}
                variant="outline"
                size="sm"
                className="justify-start"
                disabled={isSaving || disabled}
                onValueChange={(value: string) =>
                  value && handleStrokeStyleChange(value as LegendStrokeStyle)
                }
              >
                <ToggleGroupItem value="solid" title="Solid">
                  <StrokeStyleVisual />
                </ToggleGroupItem>
                <ToggleGroupItem value="dashed" title="Dashed">
                  <StrokeStyleVisual dashArray="6 4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="dotted" title="Dotted">
                  <StrokeStyleVisual dashArray="2 3" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="legendText">Legend Text</Label>
            <Input
              id="legendText"
              value={values.text}
              placeholder="Describe the annotation"
              disabled={isSaving || disabled}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, text: e.target.value }));
                if (!textTouched) setTextTouched(true);
              }}
              maxLength={80}
            />
            {textTouched && !isTextValid && (
              <p className="text-xs text-destructive">Text is required.</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Border</Label>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="strokeWidth"
                    className="text-[11px] text-muted-foreground"
                  >
                    Width
                  </Label>
                  <Input
                    id="strokeWidth"
                    type="number"
                    min={0}
                    max={12}
                    value={values.strokeWidth ?? 2}
                    disabled={isSaving || disabled}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        strokeWidth: Number(e.target.value || 0),
                      }))
                    }
                    className="h-7 w-14 px-2 text-xs"
                  />
                </div>
              </div>
              <ColorPicker
                color={values.strokeColor || "#000000"}
                onValueChange={(value) =>
                  setValues((prev) => ({ ...prev, strokeColor: value }))
                }
                size="icon-sm"
                variant="outline"
                className="max-w-none gap-0.5"
                itemClassName="p-0"
              />
              <Slider
                value={[values.strokeWidth ?? 2]}
                min={0}
                max={12}
                step={1}
                disabled={isSaving || disabled}
                onValueChange={(v) =>
                  setValues((prev) => ({ ...prev, strokeWidth: v[0] }))
                }
                className="mt-6"
              />
            </div>

            <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Fill</Label>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="fillOpacity"
                    className="text-[11px] text-muted-foreground"
                  >
                    Opacity
                  </Label>
                  <Input
                    id="fillOpacity"
                    type="number"
                    min={0}
                    max={100}
                    value={fillOpacityPercent}
                    disabled={
                      values.fillColor === "transparent" || isSaving || disabled
                    }
                    onChange={(e) =>
                      handleFillOpacityChange(Number(e.target.value || 0))
                    }
                    className="h-7 w-14 px-2 text-xs"
                  />
                </div>
              </div>
              <ColorPicker
                colors={defaultColorsWithTransparent}
                color={values.fillColor || "transparent"}
                onValueChange={(value) =>
                  setValues((prev) => ({ ...prev, fillColor: value }))
                }
                size="icon-sm"
                variant="outline"
                className="max-w-none gap-0.5"
                itemClassName="p-0"
              />
              <Slider
                value={[fillOpacityPercent]}
                min={0}
                max={100}
                step={5}
                disabled={
                  values.fillColor === "transparent" || isSaving || disabled
                }
                onValueChange={(v) => handleFillOpacityChange(v[0])}
                className="mt-6"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={disabled || isSaving}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={disabled || isSaving}
            aria-busy={isSaving}
          >
            {isSaving ? (
              <Spinner />
            ) : mode === "add" ? (
              <PiPlusCircleDuotone />
            ) : (
              <PiFloppyDiskDuotone />
            )}
            {isSaving
              ? mode === "add"
                ? "Adding..."
                : "Saving..."
              : mode === "add"
                ? "Add Legend"
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

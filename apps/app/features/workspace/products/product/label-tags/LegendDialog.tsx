"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Slider } from "@uprevit/ui/components/ui/slider";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@uprevit/ui/components/ui/toggle-group";
import ColorPicker from "./ui/ColorPicker";
import {
  DEFAULT_LEGEND_ITEM,
  LegendFormValues,
  LegendShape,
  LegendStrokeStyle,
} from "./legendTypes";
import { LegendSwatch } from "./LegendSwatch";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import {
  ArrowUpRight01Icon,
  Cancel01Icon,
  EllipseIcon,
  FloppyDiskIcon,
  LinerIcon,
  PlusSignSquareIcon,
  SquareIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { defaultColorsWithTransparent } from "@/types/colors";
import { cn } from "@uprevit/ui/lib/utils";

type LegendDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  defaultValues?: LegendFormValues | null;
  onSave: (values: LegendFormValues) => Promise<boolean>;
  disabled?: boolean;
};

const toggleItemClassName =
  "size-8 min-w-8 shrink-0 border border-border/60 shadow-none p-0 data-[state=on]:border-primary data-[state=on]:bg-accent";

const colorPickerItemClassName =
  "size-7 min-w-7 shrink-0 border border-border/60 shadow-none p-0.5 data-[state=on]:border-primary data-[state=on]:ring-1 data-[state=on]:ring-primary/40";

const StrokeStyleVisual = ({ dashArray }: { dashArray?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="butt"
    strokeLinejoin="round"
    aria-hidden="true"
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
      <AppDialogContent
        title={mode === "add" ? "Add Legend Item" : "Edit Legend Item"}
        description="Configure legend appearance and label text."
        variant="form"
        size="lg"
        onPointerDownOutside={(event) => {
          if (isSaving) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (isSaving) event.preventDefault();
        }}
        primaryAction={{
          label: mode === "add" ? "Add Legend" : "Save Changes",
          loadingLabel: mode === "add" ? "Adding..." : "Saving...",
          onClick: handleSave,
          loading: isSaving,
          disabled: disabled || isSaving,
          icon: mode === "add" ? PlusSignSquareIcon : FloppyDiskIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: disabled || isSaving,
          icon: Cancel01Icon,
        }}
      >
        <FieldGroup className="gap-4 p-4">
          <Field data-invalid={textTouched && !isTextValid}>
            <FormFieldLabel
              htmlFor="legendText"
              label="Legend Text"
              tooltip="Short description shown next to the legend swatch in the panel."
            />
            <InputGroup size="md" className="bg-background">
              <InputGroupInput
                id="legendText"
                value={values.text}
                placeholder="Describe the annotation"
                disabled={isSaving || disabled}
                aria-invalid={textTouched && !isTextValid ? "true" : "false"}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, text: e.target.value }));
                  if (!textTouched) setTextTouched(true);
                }}
                maxLength={80}
              />
            </InputGroup>
            {textTouched && !isTextValid ? (
              <p className="text-xs text-destructive">Text is required.</p>
            ) : null}
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FormFieldLabel
                label="Shape"
                tooltip="Visual shape used to represent this legend item."
              />
              <ToggleGroup
                type="single"
                value={values.shape}
                variant="default"
                size="sm"
                className="flex-wrap justify-start gap-1.5"
                disabled={isSaving || disabled}
                onValueChange={(value: string) =>
                  value && handleShapeChange(value as LegendShape)
                }
              >
                <ToggleGroupItem
                  value="rectangle"
                  title="Rectangle"
                  className={toggleItemClassName}
                >
                  <Icon icon={SquareIcon} size={14} strokeWidth={2} />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="ellipse"
                  title="Ellipse"
                  className={toggleItemClassName}
                >
                  <Icon icon={EllipseIcon} size={14} strokeWidth={2} />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="line"
                  title="Line"
                  className={toggleItemClassName}
                >
                  <Icon icon={LinerIcon} size={14} strokeWidth={2} />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="arrow"
                  title="Arrow"
                  className={toggleItemClassName}
                >
                  <Icon icon={ArrowUpRight01Icon} size={14} strokeWidth={2} />
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>

            <Field>
              <FormFieldLabel
                label="Line Style"
                tooltip="Stroke pattern for the legend shape outline."
              />
              <ToggleGroup
                type="single"
                value={values.strokeStyle || "solid"}
                variant="default"
                size="sm"
                className="flex-wrap justify-start gap-1.5"
                disabled={isSaving || disabled}
                onValueChange={(value: string) =>
                  value && handleStrokeStyleChange(value as LegendStrokeStyle)
                }
              >
                <ToggleGroupItem
                  value="solid"
                  title="Solid"
                  className={toggleItemClassName}
                >
                  <StrokeStyleVisual />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dashed"
                  title="Dashed"
                  className={toggleItemClassName}
                >
                  <StrokeStyleVisual dashArray="6 4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dotted"
                  title="Dotted"
                  className={toggleItemClassName}
                >
                  <StrokeStyleVisual dashArray="2 3" />
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="flex items-start justify-between gap-3">
                <FormFieldLabel
                  label="Border"
                  tooltip="Color and width of the legend shape outline."
                  className="min-w-0"
                />
                <div className="flex shrink-0 items-center gap-2">
                  <Label
                    htmlFor="strokeWidth"
                    className="text-xs text-muted-foreground"
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
                    className="h-8 w-14 px-2 text-xs"
                  />
                </div>
              </div>
              <ColorPicker
                color={values.strokeColor || "#000000"}
                onValueChange={(value) =>
                  setValues((prev) => ({ ...prev, strokeColor: value }))
                }
                size="sm"
                variant="default"
                className="max-w-none gap-1.5"
                itemClassName={colorPickerItemClassName}
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
              />
            </div>

            <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="flex items-start justify-between gap-3">
                <FormFieldLabel
                  label="Fill"
                  tooltip="Interior color and opacity of the legend shape."
                  className="min-w-0"
                />
                <div className="flex shrink-0 items-center gap-2">
                  <Label
                    htmlFor="fillOpacity"
                    className="text-xs text-muted-foreground"
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
                    className="h-8 w-14 px-2 text-xs"
                  />
                </div>
              </div>
              <ColorPicker
                colors={defaultColorsWithTransparent}
                color={values.fillColor || "transparent"}
                onValueChange={(value) =>
                  setValues((prev) => ({ ...prev, fillColor: value }))
                }
                size="sm"
                variant="default"
                className="max-w-none gap-1.5"
                itemClassName={colorPickerItemClassName}
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
              />
            </div>
          </div>

          <Field>
            <FormFieldLabel
              label="Live Preview"
              tooltip="How this legend item will appear in the legend panel."
            />
            <div
              className={cn(
                "rounded-lg border border-dashed border-border bg-muted/20 p-3",
              )}
            >
              <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
                <LegendSwatch
                  item={{ id: "preview", ...values }}
                  size={24}
                  className="shrink-0 text-foreground"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {values.text.trim() || "Legend text"}
                  </p>
                  <p className="truncate text-xs capitalize text-muted-foreground">
                    {values.shape}
                    {values.strokeStyle && values.strokeStyle !== "solid"
                      ? ` · ${values.strokeStyle}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </Field>
        </FieldGroup>
      </AppDialogContent>
    </Dialog>
  );
}

import type { LabelProps } from "recharts";

const FONT_SIZE = 12;
const AVG_CHAR_WIDTH = 7;
const PADDING = 8;

export function TruncatedBarLabel({ x, y, width, height, value }: LabelProps) {
  const text = String(value ?? "");
  const maxChars = Math.floor(
    (Number(width) - PADDING * 2) / AVG_CHAR_WIDTH,
  );
  if (maxChars < 4) return null;

  return (
    <text
      x={Number(x) + PADDING}
      y={Number(y) + Number(height) / 2}
      dominantBaseline="central"
      fontSize={FONT_SIZE}
      className="fill-background dark:fill-foreground"
    >
      <title>{text}</title>
      {text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text}
    </text>
  );
}

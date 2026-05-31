export const NO_FILL_COLOR = "transparent";

export const LIGHT_FILL_COLORS = [
  NO_FILL_COLOR,
  "#f9fafb",
  "#fffbeb",
  "#f0fdf4",
  "#eff6ff",
  "#fdf2f8",
  "#fef2f2",
  "#eef2ff",
] as const;

export const DARK_FILL_COLORS = [
  NO_FILL_COLOR,
  "#27272a",
  "#422006",
  "#052e16",
  "#172554",
  "#4a044e",
  "#450a0a",
  "#312e81",
] as const;

export const LIGHT_TEXT_COLORS = [
  "#000000",
  "#4b5563",
  "#d97706",
  "#16a34a",
  "#2563eb",
  "#db2777",
  "#dc2626",
  "#4f46e5",
] as const;

export const DARK_TEXT_COLORS = [
  "#fafafa",
  "#a1a1aa",
  "#fbbf24",
  "#4ade80",
  "#60a5fa",
  "#f472b6",
  "#f87171",
  "#a78bfa",
] as const;

export type WorkbookTheme = "light" | "dark";

export function isDefaultWorkbookTextColor(color: string | undefined): boolean {
  if (!color) return true;
  return (
    color === LIGHT_TEXT_COLORS[0] ||
    color === DARK_TEXT_COLORS[0]
  );
}

function resolvePaletteColor(
  stored: string | undefined,
  theme: WorkbookTheme,
  lightPalette: readonly string[],
  darkPalette: readonly string[],
): string | undefined {
  if (!stored || stored === NO_FILL_COLOR) return stored;

  const lightIndex = lightPalette.indexOf(stored);
  if (lightIndex >= 0) {
    return theme === "dark" ? darkPalette[lightIndex] : stored;
  }

  const darkIndex = darkPalette.indexOf(stored);
  if (darkIndex >= 0) {
    return theme === "light" ? lightPalette[darkIndex] : stored;
  }

  return stored;
}

export function resolveWorkbookFillColor(
  stored: string | undefined,
  theme: WorkbookTheme,
): string | undefined {
  return resolvePaletteColor(
    stored,
    theme,
    LIGHT_FILL_COLORS,
    DARK_FILL_COLORS,
  );
}

export function resolveWorkbookTextColor(
  stored: string | undefined,
  theme: WorkbookTheme,
): string | undefined {
  if (!stored || isDefaultWorkbookTextColor(stored)) return undefined;
  return resolvePaletteColor(
    stored,
    theme,
    LIGHT_TEXT_COLORS,
    DARK_TEXT_COLORS,
  );
}

export function getWorkbookFillPalette(theme: WorkbookTheme): readonly string[] {
  return theme === "dark" ? DARK_FILL_COLORS : LIGHT_FILL_COLORS;
}

export function getWorkbookTextPalette(
  theme: WorkbookTheme,
): readonly string[] {
  return theme === "dark" ? DARK_TEXT_COLORS : LIGHT_TEXT_COLORS;
}

export function getWorkbookTheme(resolvedTheme: string | undefined): WorkbookTheme {
  return resolvedTheme === "dark" ? "dark" : "light";
}

/**
 * Display visibility values for element rendering.
 */
export enum Display {
  SHOW = "show",
  HIDE = "hide",
  EXCLUDE = "exclude",
}

/**
 * Readable display options for interface.
 */
export const DISPLAY_OPTIONS: { name: string; value: Display }[] = [
  { name: "Show", value: Display.SHOW },
  { name: "Hide", value: Display.HIDE },
  { name: "Exclude", value: Display.EXCLUDE },
]

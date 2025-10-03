/**
 * Alignment values for positioning elements.
 */
export enum Alignment {
  AUTO = "auto",
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  CENTER_LEFT = "left",
  CENTER = "center",
  CENTER_RIGHT = "right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_RIGHT = "bottom-right",
}

/**
 * Readable alignment options for interface.
 */
export const ALIGN_OPTIONS: {
  name: string
  value: Alignment
}[] = [
  { value: Alignment.AUTO, name: "Auto" },
  { value: Alignment.TOP_LEFT, name: "Top left" },
  { value: Alignment.TOP_CENTER, name: "Top center" },
  { value: Alignment.TOP_RIGHT, name: "Top right" },
  { value: Alignment.CENTER_LEFT, name: "Left" },
  { value: Alignment.CENTER, name: "Center" },
  { value: Alignment.CENTER_RIGHT, name: "Right" },
  { value: Alignment.BOTTOM_LEFT, name: "Bottom left" },
  { value: Alignment.BOTTOM_CENTER, name: "Bottom center" },
  { value: Alignment.BOTTOM_RIGHT, name: "Bottom right" },
]

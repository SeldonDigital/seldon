/**
 * Background position values for image placement.
 */
export enum BackgroundPosition {
  DEFAULT = "default",
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  CENTER_LEFT = "center-left",
  CENTER = "center",
  CENTER_RIGHT = "center-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_RIGHT = "bottom-right",
}

/**
 * Readable background position options for interface.
 */
export const BACKGROUND_POSITION_OPTIONS: {
  name: string
  value: BackgroundPosition
}[] = [
  { value: BackgroundPosition.TOP_LEFT, name: "Top left" },
  { value: BackgroundPosition.TOP_CENTER, name: "Top center" },
  { value: BackgroundPosition.TOP_RIGHT, name: "Top right" },
  { value: BackgroundPosition.CENTER_LEFT, name: "Left" },
  { value: BackgroundPosition.CENTER, name: "Center" },
  { value: BackgroundPosition.CENTER_RIGHT, name: "Right" },
  { value: BackgroundPosition.BOTTOM_LEFT, name: "Bottom left" },
  { value: BackgroundPosition.BOTTOM_CENTER, name: "Bottom center" },
  { value: BackgroundPosition.BOTTOM_RIGHT, name: "Bottom right" },
]

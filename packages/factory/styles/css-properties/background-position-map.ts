import { BackgroundPosition } from "@seldon/core"
import { CSSObject } from "./types"

export const backgroundPositionMap: Record<
  BackgroundPosition,
  CSSObject["backgroundPosition"]
> = {
  [BackgroundPosition.DEFAULT]: "auto",
  [BackgroundPosition.TOP_LEFT]: "top left",
  [BackgroundPosition.TOP_CENTER]: "top center",
  [BackgroundPosition.TOP_RIGHT]: "top right",
  [BackgroundPosition.CENTER_LEFT]: "left center",
  [BackgroundPosition.CENTER]: "center",
  [BackgroundPosition.CENTER_RIGHT]: "right center",
  [BackgroundPosition.BOTTOM_LEFT]: "left bottom",
  [BackgroundPosition.BOTTOM_CENTER]: "center bottom",
  [BackgroundPosition.BOTTOM_RIGHT]: "right bottom",
}

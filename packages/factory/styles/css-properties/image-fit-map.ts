import type { CSSObject } from "./types"
import type { ImageFit } from "@seldon/core"

export const objectFitMap: Record<ImageFit, CSSObject["objectFit"]> = {
  original: "none",
  contain: "contain",
  cover: "cover",
  stretch: "fill",
}

export const backgroundSizeMap: Record<ImageFit, CSSObject["backgroundSize"]> = {
  original: "auto",
  contain: "contain",
  cover: "cover",
  stretch: "100% 100%",
}

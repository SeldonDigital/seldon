import { ImageFit } from "@seldon/core"
import { CSSObject } from "./types"

export const objectFitMap: Record<ImageFit, CSSObject["objectFit"]> = {
  original: "none",
  contain: "contain",
  cover: "cover",
  stretch: "fill",
}

export const backgroundSizeMap: Record<ImageFit, CSSObject["backgroundSize"]> =
  {
    original: "auto",
    contain: "contain",
    cover: "cover",
    stretch: "100% 100%",
  }

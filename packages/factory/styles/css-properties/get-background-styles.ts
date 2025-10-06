import { StyleGenerationContext } from "../types"
import { getBackgroundColorStyles } from "./get-background-color-styles"
import { getBackgroundImageStyles } from "./get-background-image-styles"
import { getGradientStyles } from "./get-gradient-styles"
import { CSSObject } from "./types"

export function getBackgroundStyles(
  context: StyleGenerationContext,
): CSSObject {
  const bgColor = getBackgroundColorStyles(context)
  const bgImage = getBackgroundImageStyles(context)
  const bgGradient = getGradientStyles(context)
  const result = {
    ...bgColor,
    ...bgImage,
    ...bgGradient,
  }
  const backgroundImage = joinBackgroundImages(bgGradient, bgImage)
  if (backgroundImage) {
    result.backgroundImage = backgroundImage
  }

  return result
}

function joinBackgroundImages(bgGradient: CSSObject, bgImage: CSSObject) {
  if (!bgGradient.backgroundImage && !bgImage.backgroundImage) {
    return undefined
  }

  return [bgGradient.backgroundImage, bgImage.backgroundImage]
    .filter(Boolean)
    .join(", ")
}

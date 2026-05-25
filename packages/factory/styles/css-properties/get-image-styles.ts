import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { objectFitMap } from "./image-fit-map"
import { CSSObject } from "./types"

export function getImageStyles({
  properties,
}: {
  properties: Properties
}): CSSObject {
  const styles: CSSObject = {}

  const source = resolveValue(properties.source)
  const imageFit = resolveValue(properties.imageFit)

  if (source) {
    if (imageFit) {
      styles.objectFit = objectFitMap[imageFit.value] ?? "cover"
    } else {
      styles.objectFit = "cover"
    }
  }

  return styles
}

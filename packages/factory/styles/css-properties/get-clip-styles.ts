import { Properties } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { CSSObject } from "./types"

export function getClipStyles({
  properties,
}: {
  properties: Properties
}): CSSObject {
  const styles: CSSObject = {}
  const clip = resolveValue(properties.clip)

  if (
    clip?.value === true ||
    (typeof clip?.value === "number" && clip.value === 1)
  ) {
    styles.overflow = "hidden"
  } else if (typeof clip?.value === "string") {
    const lowerValue = (clip.value as string).toLowerCase()
    if (lowerValue === "true" || lowerValue === "on") {
      styles.overflow = "hidden"
    }
  }

  return styles
}

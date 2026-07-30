import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"

import type { CSSObject } from "./types"
import type { Properties } from "@seldon/core"

export function getAspectRatioStyles({ properties }: { properties: Properties }): CSSObject {
  const styles: CSSObject = {}
  const aspectRatio = resolveValue(properties.aspectRatio)

  if (aspectRatio === undefined || aspectRatio === null) return styles

  const value = aspectRatio.value

  if (typeof value === "string" && value.length > 0) {
    styles.aspectRatio = value
  } else if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    styles.aspectRatio = String(value)
  } else if (typeof value === "object" && value !== null) {
    const inner = (value as { value?: unknown }).value

    if (typeof inner === "number" && Number.isFinite(inner) && inner > 0) {
      styles.aspectRatio = String(inner)
    }
  }

  return styles
}

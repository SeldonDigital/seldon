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

  if (clip?.value === true) {
    styles.overflow = "hidden"
  }

  return styles
}

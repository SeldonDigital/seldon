import { Display, Properties } from "@seldon/core"
import { CSSObject } from "./types"

export function getDisplayStyles({
  properties,
}: {
  properties: Properties
}): CSSObject {
  const styles: CSSObject = {}

  if (properties.display?.value === Display.EXCLUDE) {
    styles.display = "none"
  } else if (properties.display?.value === Display.HIDE) {
    styles.visibility = "hidden"
  }

  return styles
}

import { Display } from "@seldon/core"

import type { CSSObject } from "./types"
import type { Properties } from "@seldon/core"

export function getDisplayStyles({ properties }: { properties: Properties }): CSSObject {
  const styles: CSSObject = {}

  // `HIDE` and `EXCLUDE` are handled upstream: `HIDE` exports as an opt-in slot
  // that renders nothing until a caller opts in, and `EXCLUDE` is not emitted at
  // all. Neither needs a display rule here. `EXCLUDE` keeps `display: none` for
  // any consumer that renders its CSS directly.
  if (properties.display?.value === Display.EXCLUDE) {
    styles.display = "none"
  }

  return styles
}

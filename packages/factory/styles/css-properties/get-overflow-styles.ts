import { ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"

import type { CSSObject } from "./types"
import type { Properties } from "@seldon/core"

type AxisOverflow = "auto" | "hidden"

interface ScrollAxes {
  x: AxisOverflow
  y: AxisOverflow
}

/**
 * Compose `scroll` and `clip` into a single overflow declaration.
 *
 * `scroll` opens an axis for scrolling and `clip` hides overflow. Emitting the
 * `overflow` shorthand and the `overflow-x`/`overflow-y` longhands into the same
 * rule lets the shorthand clobber a scrolling axis, so both properties resolve
 * here per axis. The shorthand is used only when both axes match.
 */
export function getOverflowStyles({ properties }: { properties: Properties }): CSSObject {
  const scrollAxes = getScrollAxes(properties)
  const clipHidden = isClipHidden(properties)

  const overflowX = scrollAxes?.x ?? (clipHidden ? "hidden" : undefined)
  const overflowY = scrollAxes?.y ?? (clipHidden ? "hidden" : undefined)

  if (!overflowX && !overflowY) {
    return {}
  }

  if (overflowX === overflowY) {
    return { overflow: overflowX }
  }

  return { overflowX, overflowY }
}

function getScrollAxes(properties: Properties): ScrollAxes | undefined {
  const scroll = resolveValue(properties.scroll)

  if (!scroll || scroll.type !== ValueType.OPTION) {
    return undefined
  }

  if (scroll.value === "none") {
    return { x: "hidden", y: "hidden" }
  }

  if (scroll.value === "horizontal") {
    return { x: "auto", y: "hidden" }
  }

  if (scroll.value === "vertical") {
    return { x: "hidden", y: "auto" }
  }

  return { x: "auto", y: "auto" }
}

function isClipHidden(properties: Properties): boolean {
  const clip = resolveValue(properties.clip)

  if (clip?.value === true || (typeof clip?.value === "number" && clip.value === 1)) {
    return true
  }

  if (typeof clip?.value === "string") {
    const lower = (clip.value as string).toLowerCase()

    return lower === "true" || lower === "on"
  }

  return false
}

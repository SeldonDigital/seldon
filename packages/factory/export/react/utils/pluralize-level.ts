import { ComponentLevel } from "@seldon/core/components/constants"

export function pluralizeLevel(level: ComponentLevel): string {
  if (level === ComponentLevel.ELEMENT) return "elements"
  if (level === ComponentLevel.FRAME) return "frames"
  if (level === ComponentLevel.MODULE) return "modules"
  if (level === ComponentLevel.PART) return "parts"
  if (level === ComponentLevel.PRIMITIVE) return "primitives"
  if (level === ComponentLevel.SCREEN) return "screens"
  throw new Error(`Unknown level: ${level}`)
}

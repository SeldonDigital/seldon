/**
 * Reserved token name lookup shared by validation and editor UI.
 *
 * A custom token may be renamed, but its new name must not collide with a
 * reserved (built-in) name for the same section. Reserved names come from the
 * built-in look ids, the dynamic swatch palette slots, and the ordinal scale
 * step orders.
 */
import type { ScaleStepSection } from "../constants/scale-sections"
import { RESERVED_LOOK_IDS } from "../looks/built-in-looks"
import { capitalize } from "./capitalize"
import {
  BORDER_WIDTH_ORDER,
  DIMENSION_ORDER,
  FONT_SIZE_ORDER,
  FONT_WEIGHT_ORDER,
  LINE_HEIGHT_ORDER,
  SIZE_ORDER,
  SPACING_ORDER,
} from "../schemas/data/theme-step-orders"
import {
  THEME_INTERFACE_SLOTS,
  THEME_PALETTE_SLOTS,
} from "../values/shared/palette/theme-swatch"

/** Reserved ordinal step / slot names per scale section. */
const SCALE_RESERVED_KEYS: Record<string, readonly string[]> = {
  size: SIZE_ORDER,
  dimension: DIMENSION_ORDER,
  margin: SPACING_ORDER,
  padding: SPACING_ORDER,
  gap: SPACING_ORDER,
  corners: SPACING_ORDER,
  fontSize: FONT_SIZE_ORDER,
  blur: SIZE_ORDER,
  spread: SIZE_ORDER,
  borderWidth: BORDER_WIDTH_ORDER,
  lineHeight: LINE_HEIGHT_ORDER,
  fontWeight: FONT_WEIGHT_ORDER,
} satisfies Record<ScaleStepSection | "fontWeight", readonly string[]>

/** Reserved swatch slot ids (dynamic palette roles plus the interface roles). */
const SWATCH_RESERVED_KEYS: readonly string[] = [
  ...THEME_PALETTE_SLOTS,
  ...THEME_INTERFACE_SLOTS,
]

/** Returns the reserved key ids for a custom-capable section, or an empty list. */
export function getReservedTokenKeys(section: string): readonly string[] {
  if (section in RESERVED_LOOK_IDS) {
    return RESERVED_LOOK_IDS[section as keyof typeof RESERVED_LOOK_IDS]
  }
  if (section === "swatch") {
    return SWATCH_RESERVED_KEYS
  }
  return SCALE_RESERVED_KEYS[section] ?? []
}

/**
 * Tells whether `name` matches a reserved token name for `section`. Compares
 * case-insensitively against the reserved key ids and their humanized labels.
 */
export function isReservedTokenName(section: string, name: string): boolean {
  const candidate = name.trim().toLowerCase()
  if (!candidate) return false
  for (const id of getReservedTokenKeys(section)) {
    if (id.toLowerCase() === candidate) return true
    if (capitalize(id).toLowerCase() === candidate) return true
  }
  return false
}

/**
 * Reserved token name lookup shared by validation and editor UI.
 *
 * A custom token may be renamed, but its new name must not collide with a
 * reserved (built-in) name for the same section. Reserved names come from the
 * built-in look ids, the dynamic swatch palette slots, and the ordinal scale
 * step orders.
 */
import { RESERVED_LOOK_IDS } from "../looks/built-in-looks"
import {
  BORDER_WIDTH_ORDER,
  DIMENSION_ORDER,
  FONT_SIZE_ORDER,
  FONT_WEIGHT_ORDER,
  LINE_HEIGHT_ORDER,
  SIZE_ORDER,
  SPACING_ORDER,
} from "../schemas/data/theme-step-orders"

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
}

/** Reserved swatch slot ids (dynamic palette roles plus the fixed `background`). */
const SWATCH_RESERVED_KEYS: readonly string[] = [
  "white",
  "gray",
  "black",
  "primary",
  "swatch1",
  "swatch2",
  "swatch3",
  "swatch4",
  "background",
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

function humanize(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1)
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
    if (humanize(id).toLowerCase() === candidate) return true
  }
  return false
}

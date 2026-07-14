/**
 * Identifier unions and runtime sets for `Properties` keys and sub-property keys.
 * Parallels `themes/types/theme-token-ids.ts` (slot ids on theme token tables).
 */
import { PROPERTY_COMPOUND_CATALOG } from "../constants/shared/compound-properties"
import { PROPERTY_SHORTHAND_KEYS } from "../constants/shared/shorthand-properties"
import {
  BackgroundLayer,
  BoardCompound,
  BorderCompound,
  CornersValue,
  FontCompound,
  GradientCompound,
  MarginValue,
  PaddingValue,
  PositionValue,
  ShadowCompound,
} from "../values"
import { Properties } from "./properties"

/** Any top-level key on Properties. */
export type PropertyKey = keyof Properties

/** Border compounds that repeat the full border facet set on each side. */
export type BorderSideCompoundKey =
  | "border"
  | "borderTop"
  | "borderRight"
  | "borderBottom"
  | "borderLeft"

/** Keys for margin, padding, and corner radius shorthands. */
export type ShorthandPropertyKey = "margin" | "padding" | "corners"

/**
 * Keys whose stored value is a single plain object of facets (merge/compute walk `Object.entries`).
 * Excludes layered paint stacks (`background`, `gradient`, `shadow`), which are arrays of layers.
 */
export type ObjectFacetPropertyKey =
  | BorderSideCompoundKey
  | "font"
  | "board"
  | "position"
  | ShorthandPropertyKey

const OBJECT_FACET_PROPERTY_KEYS_LIST = [
  ...PROPERTY_COMPOUND_CATALOG.filter(
    (entry) => entry.nodeStorage === "facets",
  ).map((entry) => entry.key),
  ...PROPERTY_SHORTHAND_KEYS,
] as readonly ObjectFacetPropertyKey[]

/** Set form of {@link ObjectFacetPropertyKey} for runtime checks shared with merge and compute. */
export const OBJECT_FACET_PROPERTY_KEYS = new Set<ObjectFacetPropertyKey>(
  OBJECT_FACET_PROPERTY_KEYS_LIST,
)

/** True when the key uses a flat facet map on the node (not a layered paint array). */
export function isObjectFacetMapProperty(
  key: PropertyKey,
): key is ObjectFacetPropertyKey {
  return OBJECT_FACET_PROPERTY_KEYS.has(key as ObjectFacetPropertyKey)
}

/** Field names allowed on each compound value or on each gradient or shadow layer object. */
export type CompoundSubPropertyKey =
  | keyof BackgroundLayer
  | keyof BorderCompound
  | keyof FontCompound
  | keyof BoardCompound
  | keyof GradientCompound
  | keyof PositionValue
  | keyof ShadowCompound

/** Field names allowed on margin, padding, and corners objects. */
export type ShorthandSubPropertyKey =
  | keyof MarginValue
  | keyof PaddingValue
  | keyof CornersValue

/** Union of every facet name that may sit under a compound or shorthand. */
export type SubPropertyKey = CompoundSubPropertyKey | ShorthandSubPropertyKey

/** Properties stored as ordered paint stacks. Index 0 is the bottom layer. */
export type LayeredPaintKey = "background" | "shadow"

/** Top-level keys whose node values are ordered paint-layer arrays. */
const LAYERED_PAINT_KEYS_LIST = PROPERTY_COMPOUND_CATALOG.filter(
  (entry) => entry.nodeStorage === "layered",
).map((entry) => entry.key) as readonly LayeredPaintKey[]

export const LAYERED_PAINT_KEYS = new Set<LayeredPaintKey>(
  LAYERED_PAINT_KEYS_LIST,
)

/** True for `background` / `shadow` paint stacks (array storage on the node). */
export function isLayeredPaintProperty(
  key: PropertyKey,
): key is LayeredPaintKey {
  return LAYERED_PAINT_KEYS.has(key as LayeredPaintKey)
}

/** Any top-level key whose value has sub-fields on the node (object map or paint stack). */
export type CompoundPropertyKey = ObjectFacetPropertyKey | LayeredPaintKey

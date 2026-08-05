import { findComponentSchema } from "@seldon/core/components/catalog"
import { getCatalogKeyForPropertyPath } from "@seldon/core/properties/schemas/helpers/property-path"
import { ValueType } from "@seldon/core/properties/constants/shared/value-types"
import { BackgroundKind } from "@seldon/core/properties/values/appearance/background/background-kind"
import type { Workspace } from "@seldon/core/workspace/types"

import { isSwatchColorProperty } from "./resolve-color-value"
import { settablePropertyKeys } from "./resolve-property-name"

/** The dotted settable keys whose values resolve through the color pipeline. */
export function colorSettableKeys(catalogId: string): string[] {
  return settablePropertyKeys(catalogId).filter((dottedKey) =>
    isSwatchColorProperty(getCatalogKeyForPropertyPath(dottedKey) ?? dottedKey),
  )
}

/** The key a text-carrying component paints its letters with. */
const LETTERS_COLOR_KEY = "color"
/** The key a surface-bearing component paints its fill with. */
const SURFACE_COLOR_KEY = "background.0.color"

/**
 * Where a component's bare color lands. The bucket doubles as the contract
 * test's snapshot label and the transcript's reason, so the convention has
 * exactly one spelling.
 */
export type BareColorResolution =
  | { bucket: "single"; key: string }
  | { bucket: "letters"; key: typeof LETTERS_COLOR_KEY }
  | { bucket: "surface"; key: typeof SURFACE_COLOR_KEY }
  | { bucket: "glyph"; key: typeof LETTERS_COLOR_KEY }
  | { bucket: "ask"; candidateKeys: string[] }
  | { bucket: "none" }

/**
 * The property a bare color command ("make the chip red") writes, decided
 * from the target's own schema and never from a component-name list. The
 * whole convention lives in this one function so revising it is one edit,
 * reported by the bucket snapshot in `bare-color.contract.test.ts`.
 *
 * The order encodes a product assumption, deliberately cheap to change:
 * - one color-capable key: use it, no convention needed (dividers just work)
 * - a component that carries its own `content` renders letters directly
 *   (text, listItem, legend...), so its bare color is the letter color --
 *   components whose letters live on CHILD nodes (button, chip, card) do
 *   not carry `content` themselves and fall through
 * - otherwise the surface fill, but only when the component actually SHIPS
 *   a rendering background layer -- writing `background.0.color` on a
 *   default of `kind: none` is legal but paints nothing (the exact
 *   "pipeline right, pixels wrong" failure this convention exists to kill)
 * - otherwise `color` when its default is the computed contrast function:
 *   that default is the schema saying the component paints its own pixels
 *   with `color` (an icon's glyph)
 * - otherwise (only border/shadow-like colors remain) an honest ask,
 *   listing the real candidates
 *
 * Gradient stops are excluded outright: "make it red" never means one stop
 * of a gradient, and offering the key would only pollute the ask.
 */
export function defaultColorKeyFor(catalogId: string): BareColorResolution {
  const candidateKeys = colorSettableKeys(catalogId).filter(
    (dottedKey) =>
      getCatalogKeyForPropertyPath(dottedKey) !== "gradientStopColor",
  )
  if (candidateKeys.length === 0) return { bucket: "none" }
  if (candidateKeys.length === 1)
    return { bucket: "single", key: candidateKeys[0]! }

  const schemaProperties = findComponentSchema(catalogId)?.properties as
    | Record<string, unknown>
    | undefined

  const componentCarriesItsOwnLetters =
    schemaProperties !== undefined && "content" in schemaProperties
  if (
    componentCarriesItsOwnLetters &&
    candidateKeys.includes(LETTERS_COLOR_KEY)
  ) {
    return { bucket: "letters", key: LETTERS_COLOR_KEY }
  }

  const defaultBackgroundLayer = Array.isArray(schemaProperties?.background)
    ? (schemaProperties.background[0] as
        | { kind?: { value?: unknown } }
        | undefined)
    : undefined
  const defaultBackgroundRenders =
    defaultBackgroundLayer?.kind?.value !== undefined &&
    defaultBackgroundLayer.kind.value !== BackgroundKind.NONE
  if (defaultBackgroundRenders && candidateKeys.includes(SURFACE_COLOR_KEY)) {
    return { bucket: "surface", key: SURFACE_COLOR_KEY }
  }

  const colorDefault = schemaProperties?.[LETTERS_COLOR_KEY] as
    | { type?: unknown }
    | undefined
  const componentPaintsItsPixelsWithColor =
    colorDefault?.type === ValueType.COMPUTED
  if (
    componentPaintsItsPixelsWithColor &&
    candidateKeys.includes(LETTERS_COLOR_KEY)
  ) {
    return { bucket: "glyph", key: LETTERS_COLOR_KEY }
  }

  return { bucket: "ask", candidateKeys }
}

/**
 * True when the node's own override bag holds a value at the dotted path. A
 * tagged value whose payload is null is an empty slot, not a carried color.
 */
function overrideCarriesValue(
  overridesBag: unknown,
  pathSegments: string[],
): boolean {
  let cursor: unknown = overridesBag
  for (const segment of pathSegments) {
    if (cursor === null || typeof cursor !== "object") return false
    cursor = Array.isArray(cursor)
      ? cursor[Number(segment)]
      : (cursor as Record<string, unknown>)[segment]
  }
  if (cursor === null || cursor === undefined) return false
  const taggedPayloadIsEmpty =
    typeof cursor === "object" &&
    "value" in (cursor as Record<string, unknown>) &&
    (cursor as Record<string, unknown>).value === null
  return !taggedPayloadIsEmpty
}

/**
 * The color keys this node actually overrides. "Reset the color" clears
 * these, skipping vocabulary entirely: whatever key the set pipeline chose,
 * reset finds it by inspection, so the pair agrees by construction. (The
 * live failure was the opposite: set wrote one color key, reset cleared a
 * different one, and the chips stayed dark.)
 */
export function overriddenColorKeys(
  workspace: Workspace,
  nodeId: string,
  catalogId: string,
): string[] {
  const node = workspace.nodes[nodeId]
  if (!node) return []
  return colorSettableKeys(catalogId).filter((dottedKey) =>
    overrideCarriesValue(node.overrides, dottedKey.split(".")),
  )
}

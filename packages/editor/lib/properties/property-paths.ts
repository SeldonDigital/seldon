import { type LayeredPaintKey } from "@seldon/core/properties/types/property-keys"

export const LAYERED_PAINT_LAYER_INDEX = "0"

const LAYERED_PAINT_ROOTS = new Set<string>(["background", "shadow"])

export function isLayeredPaintRoot(
  propertyKey: string,
): propertyKey is LayeredPaintKey {
  return LAYERED_PAINT_ROOTS.has(propertyKey)
}

export type ParsedPropertyPath =
  | { kind: "top-level"; key: string }
  | { kind: "facet"; root: string; facet: string }
  | { kind: "layered-facet"; root: LayeredPaintKey; facet: string; index: number }
  | { kind: "layered-parent"; root: LayeredPaintKey; index: number }

/** Matches a non-negative integer used as a paint-layer index segment. */
function parseLayerIndex(segment: string): number | null {
  if (!/^\d+$/.test(segment)) return null
  return Number(segment)
}

export function parsePropertyPath(path: string): ParsedPropertyPath {
  const segments = path.split(".").filter(Boolean)
  if (segments.length === 1) {
    return { kind: "top-level", key: segments[0]! }
  }
  if (segments.length === 3 && LAYERED_PAINT_ROOTS.has(segments[0]!)) {
    const index = parseLayerIndex(segments[1]!)
    if (index !== null) {
      return {
        kind: "layered-facet",
        root: segments[0] as LayeredPaintKey,
        facet: segments[2]!,
        index,
      }
    }
  }
  if (segments.length === 2 && LAYERED_PAINT_ROOTS.has(segments[0]!)) {
    const index = parseLayerIndex(segments[1]!)
    if (index !== null) {
      return {
        kind: "layered-parent",
        root: segments[0] as LayeredPaintKey,
        index,
      }
    }
  }
  if (segments.length === 2) {
    return { kind: "facet", root: segments[0]!, facet: segments[1]! }
  }
  return { kind: "top-level", key: path }
}

export function layeredFacetPath(
  root: LayeredPaintKey,
  facet: string,
  index: number = Number(LAYERED_PAINT_LAYER_INDEX),
): string {
  return `${root}.${index}.${facet}`
}

/** Parent row key for a paint layer: bare root for index 0, `root.index` above it. */
export function layeredParentPath(root: LayeredPaintKey, index: number): string {
  return index === 0 ? root : `${root}.${index}`
}

export function getCompoundLayerValue(
  value: unknown,
  index: number = Number(LAYERED_PAINT_LAYER_INDEX),
): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null
  if (Array.isArray(value)) {
    const layer = value[index]
    if (!layer || typeof layer !== "object" || Array.isArray(layer)) {
      return null
    }
    return layer as Record<string, unknown>
  }
  return value as Record<string, unknown>
}

/** Compound root key for core preset helpers (e.g. `background` from `background.0.preset`). */
export function getParentPathForPreset(presetPath: string): string {
  const parsed = parsePropertyPath(presetPath)
  if (parsed.kind === "layered-facet") {
    return parsed.root
  }
  if (parsed.kind === "facet") {
    return parsed.root
  }
  return presetPath.replace(/\.preset$/, "")
}

export function childPathsUnderCompoundParent(
  parentKey: string,
  childPath: string,
): boolean {
  const segments = childPath.split(".")
  if (isLayeredPaintRoot(parentKey)) {
    return (
      segments[0] === parentKey &&
      segments[1] === LAYERED_PAINT_LAYER_INDEX &&
      segments.length === 3
    )
  }
  // The child is the parent key plus exactly one more segment. Covers a
  // top-level compound (`margin` -> `margin.top`) and a look parent
  // (`font.callout` -> `font.callout.size`).
  if (!childPath.startsWith(`${parentKey}.`)) return false
  const remainder = childPath.slice(parentKey.length + 1)
  return remainder.length > 0 && !remainder.includes(".")
}

import { LAYERED_PAINT_KEYS } from "../types/property-keys"

/** `#parent.` or `#self.` prefix on a basedOn source path, or null for a bare path. */
export type BasedOnAnchor = "parent" | "self" | null

const ANCHOR_PREFIX = /^#(parent\.|self\.)?/

/**
 * Maps schema-style layered paint paths such as `background.color` to runtime
 * paths anchored at layer `0`, e.g. `background.0.color`. Paths that already
 * carry a layer index and non-paint paths pass through unchanged.
 */
export function normalizeLayerFacetPath(path: string): string {
  for (const root of LAYERED_PAINT_KEYS) {
    const prefix = `${root}.`
    if (!path.startsWith(prefix)) continue

    const rest = path.slice(prefix.length)
    if (/^\d+\./.test(rest)) continue

    return `${root}.0.${rest}`
  }

  return path
}

/**
 * Splits a basedOn source path such as `#parent.buttonSize` or
 * `#self.background.color` into its anchor and its layer-0-anchored lookup path.
 */
export function parseBasedOnPath(basedOn: string): {
  anchor: BasedOnAnchor
  lookupPath: string
} {
  const match = ANCHOR_PREFIX.exec(basedOn)
  const anchor =
    match?.[1] === "parent." ? "parent" : match?.[1] === "self." ? "self" : null

  return {
    anchor,
    lookupPath: normalizeLayerFacetPath(basedOn.replace(ANCHOR_PREFIX, "")),
  }
}

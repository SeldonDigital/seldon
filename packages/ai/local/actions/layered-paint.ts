import {
  BACKGROUND_KIND_SEEDS,
  BackgroundKind,
} from "@seldon/core/properties/values/appearance/background"
import {
  isLayeredPaintProperty,
  type PropertyKey,
} from "@seldon/core/properties/types/property-keys"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import type { Workspace } from "@seldon/core/workspace/types"

/**
 * Kinds to try when a facet write forces a layer retype, most specific intent
 * first: a color write means a color fill before it means a gradient stop.
 */
const KIND_PREFERENCE: readonly BackgroundKind[] = [
  BackgroundKind.COLOR,
  BackgroundKind.IMAGE,
  BackgroundKind.LINEAR_GRADIENT,
  BackgroundKind.RADIAL_GRADIENT,
  BackgroundKind.CONIC_GRADIENT,
]

/** The facet names a background kind's seed populates, `kind` included. */
function seedFacets(kind: BackgroundKind): Set<string> {
  return new Set(Object.keys(BACKGROUND_KIND_SEEDS[kind]))
}

/** The kind an effective layer resolves to, when it is a concrete option. */
function effectiveKind(layer: unknown): BackgroundKind | undefined {
  if (!layer || typeof layer !== "object") return undefined
  const kind = (layer as { kind?: { type?: string; value?: unknown } }).kind
  if (kind?.type !== "option" || typeof kind.value !== "string") {
    return undefined
  }
  return (Object.values(BackgroundKind) as string[]).includes(kind.value)
    ? (kind.value as BackgroundKind)
    : undefined
}

/** One dotted layered write, split into its slot and facet. */
interface LayeredEntry {
  index: number
  facet: string
  value: unknown
}

/**
 * Folds dotted layered-paint writes (`background.0.color`) into whole layer
 * arrays the reducer merges safely. Two rules, both consequences of how
 * `mergeProperties` treats paint stacks:
 *
 * - The patch is authoritative for layer count, so a one-layer patch on a
 *   two-layer background would silently delete the second layer. The patch is
 *   therefore padded with empty bags up to the node's effective layer count;
 *   an empty slot inherits its aligned layer untouched (the same idiom core's
 *   reset patch builder uses).
 *
 * - A background layer's `kind` decides which facets render. Writing a color
 *   into a `none` layer validates and then paints nothing. When the touched
 *   slot's effective kind does not support every written facet, the slot is
 *   rebuilt from the best-fitting kind's core seed (which carries `kind` and
 *   its companion defaults) with the written facets overlaid. When the kind
 *   already fits -- tinting an existing color fill, moving a gradient stop --
 *   the slot carries only the written facets and the merge keeps the rest.
 *
 * Shadow layers have no kind discriminator, so they only get the padding.
 * Non-layered keys pass through unchanged.
 */
export function assembleLayeredWrites(
  workspace: Workspace,
  nodeId: string,
  properties: Record<string, unknown>,
): Record<string, unknown> {
  const layered = new Map<string, LayeredEntry[]>()
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(properties)) {
    const [root, index, ...facetPath] = key.split(".")
    if (
      root !== undefined &&
      isLayeredPaintProperty(root as PropertyKey) &&
      index !== undefined &&
      /^\d+$/.test(index) &&
      facetPath.length > 0
    ) {
      const entries = layered.get(root) ?? []
      entries.push({
        index: Number(index),
        facet: facetPath.join("."),
        value,
      })
      layered.set(root, entries)
    } else {
      result[key] = value
    }
  }
  if (layered.size === 0) return properties

  const node = workspace.nodes[nodeId]
  const effective = node
    ? (getNodeProperties(node, workspace) as Record<string, unknown>)
    : {}

  for (const [root, entries] of layered) {
    const effectiveLayers = Array.isArray(effective[root])
      ? (effective[root] as unknown[])
      : []
    const maxIndex = Math.max(...entries.map((entry) => entry.index))
    const layerCount = Math.max(effectiveLayers.length, maxIndex + 1)

    const slots: Record<string, unknown>[] = Array.from(
      { length: layerCount },
      () => ({}),
    )
    for (const entry of entries) {
      slots[entry.index]![entry.facet] = entry.value
    }

    if (root === "background") {
      for (const [index, slot] of slots.entries()) {
        const facets = Object.keys(slot)
        if (facets.length === 0) continue

        const current = effectiveKind(effectiveLayers[index])
        if (current && facets.every((facet) => seedFacets(current).has(facet))) {
          continue
        }

        const retyped =
          KIND_PREFERENCE.find((kind) =>
            facets.every((facet) => seedFacets(kind).has(facet)),
          ) ??
          KIND_PREFERENCE.find((kind) =>
            facets.some((facet) => seedFacets(kind).has(facet)),
          )
        if (retyped) {
          slots[index] = { ...BACKGROUND_KIND_SEEDS[retyped], ...slot }
        }
      }
    }

    result[root] = slots
  }

  return result
}

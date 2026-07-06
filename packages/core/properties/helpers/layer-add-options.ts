import type { LayeredPaintKey } from "../types/property-keys"
import { BackgroundKind } from "../values/appearance/background/background-kind"
import { BACKGROUND_KIND_SEEDS } from "../values/appearance/background/background-seeds"

/** One "Add layer" menu choice for a layered paint property. */
export interface LayerAddOption {
  id: string
  label: string
  /** Initial facets for the new layer, or undefined for an empty layer. */
  seed?: Record<string, unknown>
}

const LAYERED_PAINT_LABELS: Record<LayeredPaintKey, string> = {
  background: "Background",
  shadow: "Shadow",
}

/**
 * The add-layer choices a layered paint property offers. Background splits into
 * typed Color, Image, and the three explicit gradient seeds; other stacks add a
 * single empty layer. The editor renders these without knowing any property
 * specifics.
 */
export function getLayerAddOptions(
  property: LayeredPaintKey,
): LayerAddOption[] {
  if (property === "background") {
    return [
      {
        id: "add-layer-background-color",
        label: "Add Color Background",
        seed: { ...BACKGROUND_KIND_SEEDS[BackgroundKind.COLOR] } as Record<
          string,
          unknown
        >,
      },
      {
        id: "add-layer-background-image",
        label: "Add Image Background",
        seed: { ...BACKGROUND_KIND_SEEDS[BackgroundKind.IMAGE] } as Record<
          string,
          unknown
        >,
      },
      {
        id: "add-layer-background-linear-gradient",
        label: "Add Linear Gradient",
        seed: {
          ...BACKGROUND_KIND_SEEDS[BackgroundKind.LINEAR_GRADIENT],
        } as Record<string, unknown>,
      },
      {
        id: "add-layer-background-radial-gradient",
        label: "Add Radial Gradient",
        seed: {
          ...BACKGROUND_KIND_SEEDS[BackgroundKind.RADIAL_GRADIENT],
        } as Record<string, unknown>,
      },
      {
        id: "add-layer-background-conic-gradient",
        label: "Add Conic Gradient",
        seed: {
          ...BACKGROUND_KIND_SEEDS[BackgroundKind.CONIC_GRADIENT],
        } as Record<string, unknown>,
      },
    ]
  }
  return [
    {
      id: `add-layer-${property}`,
      label: `Add ${LAYERED_PAINT_LABELS[property]}`,
    },
  ]
}

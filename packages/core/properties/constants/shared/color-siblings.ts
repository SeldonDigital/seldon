/**
 * Shared description of how a `color` facet relates to its sibling `brightness` and `opacity`.
 *
 * A color group can live in three kinds of container, all handled the same way:
 * the root properties object (top-level `color`), a single-color compound (`border*`), or one
 * layer of a layered paint stack (`background`, `shadow`, including gradient stops).
 *
 * The compute mirror, the workspace validation lock, and the editor display lock all read these
 * constants so Match Color behaves identically wherever a color carries brightness and opacity.
 * A container that does not expose a given facet simply has no entry for it, so every consumer
 * treats a missing facet as a no-op rather than a block or a crash.
 */
import { BORDER_SIDE_KEYS } from "../../helpers/border-side-options"
import { PROPERTY_COMPOUND_CATALOG } from "./compound-properties"

/** Color facet key -> its sibling brightness and opacity keys within the same container. */
export const COLOR_SIBLING_KEYS: Record<
  string,
  { brightness: string; opacity: string }
> = {
  color: { brightness: "brightness", opacity: "opacity" },
  startColor: { brightness: "startBrightness", opacity: "startOpacity" },
  endColor: { brightness: "endBrightness", opacity: "endOpacity" },
}

/** Single-color compounds whose `color` facet carries sibling brightness and opacity. */
export const COLOR_SIBLING_COMPOUND_KEYS = [
  "border",
  ...BORDER_SIDE_KEYS,
] as const

/** Layered-paint roots whose layers carry color and gradient-stop facets. */
export const COLOR_SIBLING_LAYER_KEYS: readonly ("background" | "shadow")[] =
  PROPERTY_COMPOUND_CATALOG.filter(
    (entry) => entry.nodeStorage === "layered",
  ).map((entry) => entry.key as "background" | "shadow")

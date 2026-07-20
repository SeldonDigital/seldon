/**
 * Match Color lock resolution for `brightness`/`opacity` facets. A facet is
 * locked when its sibling `color` resolves to Match Color and the node theme's
 * matching toggle is on. The lock supplies the mirrored source value so the row
 * shows the resolved value rather than the unset authored one.
 */
import { COLOR_SIBLING_KEYS } from "@seldon/core"
import type { Board, Instance, Theme, Variant, Workspace } from "@seldon/core"
import { findInObject, isMatchColorValue } from "@seldon/core/helpers"
import { EMPTY_VALUE } from "@seldon/core/properties"
import { computeNodeProperties } from "@seldon/core/workspace/compute"
import { getPropertiesSubjectId } from "./flat-property"

/**
 * Sibling brightness/opacity facet -> the color facet it mirrors, and which percentage it is.
 * Derived from the shared core `COLOR_SIBLING_KEYS` so the editor lock stays aligned with the
 * compute mirror and the workspace validation lock.
 */
const MATCH_SIBLING_FACETS: Record<
  string,
  { colorKey: string; kind: "brightness" | "opacity" }
> = Object.fromEntries(
  Object.entries(COLOR_SIBLING_KEYS).flatMap(([colorKey, siblingKeys]) => [
    [siblingKeys.brightness, { colorKey, kind: "brightness" as const }],
    [siblingKeys.opacity, { colorKey, kind: "opacity" as const }],
  ]),
)

/**
 * Decides whether a `brightness`/`opacity` facet is locked to a Match Color and what value to show.
 * A facet is locked when its sibling color in `layer` resolves to Match Color and the node theme's
 * matching toggle is on. The displayed value comes from the node's computed properties, so the row
 * shows the mirrored source value rather than the unset authored value.
 */
export function resolveMatchSiblingLock(
  subKey: string,
  subPropertyPath: string,
  layer: Record<string, unknown> | undefined | null,
  node: Variant | Instance | Board,
  workspace: Workspace,
  theme?: Theme,
): { displayValue: unknown } | null {
  const sibling = MATCH_SIBLING_FACETS[subKey]
  if (!sibling || !layer) return null
  if (!isMatchColorValue(layer[sibling.colorKey])) return null

  const params = theme?.matchColor?.parameters
  const enabled =
    sibling.kind === "brightness"
      ? !!params?.includeBrightness
      : !!params?.includeOpacity
  if (!enabled) return null

  let displayValue: unknown
  try {
    const computed = computeNodeProperties(
      getPropertiesSubjectId(node),
      workspace as never,
    )
    displayValue = findInObject(computed, subPropertyPath)
  } catch {
    displayValue = undefined
  }

  return { displayValue: displayValue ?? EMPTY_VALUE }
}

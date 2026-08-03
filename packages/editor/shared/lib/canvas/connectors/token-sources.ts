import { TOKEN_BADGE_GROUPS } from "./token-groups"

import type { NodeRect } from "../overlay/geometry"
import type { ConnectorSource } from "./connector-layout"
import type { TokenBadgeGroup } from "./token-groups"
import type { FlatProperty } from "../../properties/inspector/flat-property"

/**
 * One token badge to draw: a property of the selection, its name and value, and the
 * group it clusters with.
 *
 * Extends `ConnectorSource` so the shared column layout places it exactly like a
 * reference badge. The extra fields are what the badge and its card read.
 */
export interface TokenSource extends ConnectorSource {
  group: TokenBadgeGroup
  propertyKey: string
  name: string
  value: string
}

/** The badge key for a property, so a placement maps back to its source. */
function tokenSourceKey(propertyKey: string): string {
  return `token:${propertyKey}`
}

/**
 * The values core renders for an unset or inherited property. A badge showing one of
 * these reads faint, since the property carries no value of its own. This matches the
 * resolved display rather than the raw value type, which stays `EMPTY` on a shorthand
 * or compound like `padding` even when its facets resolve to a real value.
 */
const DEFAULT_VALUE_LABELS = new Set(["Default", "Inherit"])

/**
 * The token badges worth drawing for the selection, in group then key order.
 *
 * One badge per top-level inspector row in an enabled group. A row the schema does
 * not expose is absent from `flatProperties`, and a row that resolves to `not used`
 * is skipped, so a component only shows the tokens it actually has. Every badge
 * anchors to the one selected node, so its `order` decides where it sits in the
 * cluster since they share a height.
 */
export function buildTokenSources(
  rect: NodeRect | null,
  flatProperties: FlatProperty[],
  enabledGroups: Set<TokenBadgeGroup>,
): TokenSource[] {
  if (!rect) return []

  const byKey = new Map<string, FlatProperty>()

  for (const property of flatProperties) {
    if (property.isSubProperty) continue
    if (property.status === "not used") continue
    if (!byKey.has(property.key)) {
      byKey.set(property.key, property)
    }
  }

  const sources: TokenSource[] = []
  let order = 0

  for (const definition of TOKEN_BADGE_GROUPS) {
    if (!enabledGroups.has(definition.group)) continue

    for (const propertyKey of definition.keys) {
      const property = byKey.get(propertyKey)

      if (!property) continue

      // A default or inherited value is not set on this node, so its badge reads faint,
      // like a reference no code drives.
      const muted = DEFAULT_VALUE_LABELS.has(property.actualValue)

      sources.push({
        key: tokenSourceKey(propertyKey),
        label: property.label,
        rect,
        muted,
        order: order++,
        group: definition.group,
        propertyKey,
        name: property.label,
        value: property.actualValue,
      })
    }
  }

  return sources
}

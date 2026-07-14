import { z } from "zod"

import { ToolError } from "../errors"
import {
  type PropertySchemaView,
  buildPropertySchemaView,
  validTopLevelPropertyKeys,
} from "../property-schema-view"
import { redactValue } from "../redact"
import type { ToolContext } from "./context"

export const getPropertySchemaInputSchema = {
  propertyKey: z
    .string()
    .describe(
      'Top-level node property key ("opacity", "padding", "border", ' +
        '"background", "font", …). Flattened facet keys ("borderColor") also ' +
        "resolve, but only top-level keys satisfy the set_node_properties gate.",
    ),
}

export interface GetPropertySchemaResult {
  property: PropertySchemaView
  /** True: this key now passes the set_node_properties schema gate. */
  markedServed: boolean
}

/**
 * The get_property_schema tool: one property's schema — value types, facets,
 * allowed options, applicable theme token sections. Serving a schema marks
 * the key "seen" for the hard schema gate, so the canonical flow is
 * get_property_schema → set_node_properties. Works without an open workspace
 * (catalog data).
 */
export function getPropertySchema(
  ctx: ToolContext,
  input: { propertyKey: string },
): GetPropertySchemaResult {
  const view = buildPropertySchemaView(input.propertyKey)
  if (!view) {
    throw new ToolError({
      code: "unknown_property",
      message: `"${input.propertyKey}" is not a node property key.`,
      recovery:
        "Use one of the keys in detail.validKeys (top-level node property " +
        "keys accepted by set_node_properties).",
      detail: { validKeys: validTopLevelPropertyKeys() },
    })
  }

  ctx.session.servedPropertySchemas.add(view.key)
  return redactValue({ property: view, markedServed: true })
}

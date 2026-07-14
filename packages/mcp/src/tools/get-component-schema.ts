import { z } from "zod"

import {
  catalog,
  getComponentSchema,
} from "@seldon/core/components/catalog/index"
import {
  type ComponentLevel,
  isComponentId,
} from "@seldon/core/components/constants/index"
import type { SchemaChild } from "@seldon/core/components/types/index"
import { isComplexSchema } from "@seldon/core/components/types/index"
import type { Properties } from "@seldon/core/properties/types/properties"
import { rules } from "@seldon/core/rules/config/rules.config"

import { ToolError } from "../errors"
import { redactValue } from "../redact"
import type { ToolContext } from "./context"

export const getComponentSchemaInputSchema = {
  componentId: z
    .string()
    .describe('Catalog component id, e.g. "button" (see list_catalog).'),
}

/** Default composition structure — identity only, no override property bags. */
export interface ComponentTreeView {
  component: string
  variant?: string
  children?: ComponentTreeView[]
}

export interface GetComponentSchemaResult {
  id: string
  name: string
  level: string
  intent: string
  tags: string[]
  /** Levels this component may contain (Core's level rules). */
  allowedChildLevels: string[]
  /** Levels whose components may contain this one. */
  allowedParentLevels: string[]
  /** Named catalog variants (`insert_variant_instance` accepts these ids). */
  defaultVariants?: Array<{ id: string; label: string; intent: string }>
  /** The default child composition (complex components only). */
  defaultChildren?: ComponentTreeView[]
  /** The component's default property cells (what overrides layer onto). */
  properties: Properties
}

function toTreeView(child: SchemaChild): ComponentTreeView {
  return {
    component: child.component,
    ...(child.variant ? { variant: child.variant } : {}),
    ...(child.children?.length
      ? { children: child.children.map(toTreeView) }
      : {}),
  }
}

/**
 * The get_component_schema tool: one component's contract — properties, legal children/parents
 * derived from Core's level rules, default variants, intent, tags. Catalog
 * data; no workspace required.
 */
export function getComponentSchemaTool(
  ctx: ToolContext,
  input: { componentId: string },
): GetComponentSchemaResult {
  if (!isComponentId(input.componentId)) {
    throw new ToolError({
      code: "component_not_found",
      message: `"${input.componentId}" is not a catalog component id.`,
      recovery:
        "Use an id from detail.componentIds (also served by list_catalog), " +
        "or find one with search_catalog.",
      detail: {
        componentIds: Object.values(catalog).flatMap((bucket) =>
          bucket.map((schema) => schema.id),
        ),
      },
    })
  }

  const schema = getComponentSchema(input.componentId)
  const level = schema.level as ComponentLevel

  const allowedChildLevels = rules.componentLevels[level].mayContain
  const allowedParentLevels = (
    Object.keys(rules.componentLevels) as ComponentLevel[]
  ).filter((parent) => rules.componentLevels[parent].mayContain.includes(level))

  return redactValue({
    id: schema.id,
    name: schema.name,
    level: schema.level,
    intent: schema.intent,
    tags: schema.tags,
    allowedChildLevels: [...allowedChildLevels],
    allowedParentLevels,
    ...(schema.variants?.length
      ? {
          defaultVariants: schema.variants.map((variant) => ({
            id: variant.id,
            label: variant.label,
            intent: variant.intent,
          })),
        }
      : {}),
    ...(isComplexSchema(schema) && schema.default.children?.length
      ? { defaultChildren: schema.default.children.map(toTreeView) }
      : {}),
    properties: schema.properties,
  })
}

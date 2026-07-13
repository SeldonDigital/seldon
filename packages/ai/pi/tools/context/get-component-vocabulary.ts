import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { PropertyDisplayCategory } from "@seldon/core/properties/constants/property-display"

import { componentValuesSection } from "../../../prompt/context-sections/component-values"
import { propertyShapeSection } from "../../../prompt/context-sections/property-shape"
import { propertyVocabularySection } from "../../../prompt/context-sections/property-vocabulary"
import { themeTokensSection } from "../../../prompt/context-sections/theme-tokens"
import type { ResolvedContext } from "../../editor-context"
import { joinOrEmpty, textResult } from "./shared"

const PROPERTY_CATEGORY_VALUES = Object.values(PropertyDisplayCategory)

/** Coerces a free-text category into a known display category, or undefined. */
function toPropertyCategory(
  value: string | undefined,
): PropertyDisplayCategory | undefined {
  if (value === undefined) return undefined
  return PROPERTY_CATEGORY_VALUES.includes(value as PropertyDisplayCategory)
    ? (value as PropertyDisplayCategory)
    : undefined
}

/** Returns a component's settable keys, value shapes, and accepted choices. */
export function createGetComponentVocabularyTool(
  resolved: ResolvedContext,
): ToolDefinition {
  const { workspace } = resolved
  return defineTool({
    name: "get_component_vocabulary",
    label: "Get Component Vocabulary",
    description:
      "Return a component's settable keys, value shapes, and the choices each accepts (options, theme tokens, units). Only set keys it reports. Pass category to list one group.",
    parameters: Type.Object({
      catalogId: Type.String({
        description: "Catalog id, for example button or text.",
      }),
      category: Type.Optional(
        Type.String({
          description:
            "One group: attributes, layout, appearance, typography, effects, accessibility.",
        }),
      ),
    }),
    execute: async (_id, params) => {
      const ids = new Set([params.catalogId])
      const category = toPropertyCategory(params.category)
      const lines = [
        ...propertyVocabularySection(ids, category),
        ...propertyShapeSection(ids),
        ...themeTokensSection(workspace),
        ...componentValuesSection(ids, workspace),
      ]
      return textResult(
        joinOrEmpty(
          lines,
          `No component vocabulary found for "${params.catalogId}". Use list_catalog_ids for valid ids.`,
        ),
      )
    },
  })
}

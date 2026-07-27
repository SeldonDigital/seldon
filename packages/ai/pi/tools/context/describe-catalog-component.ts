import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { componentCompositionSection } from "../../../prompt/context-sections/component-composition"
import { resolveCatalogId } from "../mutations/catalog-ids"
import { joinOrEmpty, textResult } from "./shared"

import type { ToolDefinition } from "@earendil-works/pi-coding-agent"

/**
 * Returns a catalog component's composition: its default child tree, named
 * variants, and the overrides each child bakes in. Lets the model foresee what
 * inserting the component yields, so it trusts one insert_component instead of
 * rebuilding the tree child by child.
 */
export function createDescribeCatalogComponentTool(): ToolDefinition {
  return defineTool({
    name: "describe_catalog_component",
    label: "Describe Catalog Component",
    description:
      "Return a catalog component's composition: its default child tree, named variants, and the overrides each child bakes in. Preview it before insert_component; inserting the component yields this whole tree in one step.",
    parameters: Type.Object({
      catalogId: Type.String({
        description: "Catalog id, for example menu or button.",
      }),
    }),

    execute: async (_id, params) => {
      const resolved = resolveCatalogId(params.catalogId)

      if (!resolved.id) return textResult(resolved.message ?? "Unknown catalog id.")
      const lines = componentCompositionSection(resolved.id)
      const body = joinOrEmpty(
        lines,
        `No composition found for "${resolved.id}". Use list_catalog_ids for valid ids.`,
      )

      return textResult(resolved.note ? `${resolved.note}\n${body}` : body)
    },
  })
}

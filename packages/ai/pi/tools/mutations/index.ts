import type { ToolDefinition } from "@earendil-works/pi-coding-agent"

import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"
import { createAddComponentTool } from "./add-component"
import { createApplyActionsTool } from "./apply-actions"
import { createInsertVariantInstanceTool } from "./insert-variant-instance"
import { createRemoveInstanceTool } from "./remove-instance"
import { createSetBoardLabelTool } from "./set-board-label"
import { createSetFontCollectionFamilyPresetTool } from "./set-font-collection-family-preset"
import { createSetFontCollectionFamilyVariantTool } from "./set-font-collection-family-variant"
import { createSetIconSetOverrideTool } from "./set-icon-set-override"
import { createSetIconSetSubcategoryPresetTool } from "./set-icon-set-subcategory-preset"
import { createSetPropertiesTool } from "./set-properties"
import { createSetThemeOverrideTool } from "./set-theme-override"

/**
 * The Seldon mutation tools for one turn. Each tool proposes one or more
 * `WorkspaceAction`s validated against the shared working copy. Node and board
 * tools are always present; `apply_actions` batches many edits and is the escape
 * hatch for the long tail of action types. Resource tools (theme, font
 * collection, icon set) only make sense in their own scope, so they are gated
 * out of node and board turns to keep the tool schema small. Workspace scope
 * spans everything, and an unset scope keeps them for safety.
 */
export function createMutationTools(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition[] {
  const turnScope = resolved.scope
  const includeAll = turnScope === undefined || turnScope === "workspace"

  const tools: ToolDefinition[] = [
    createSetPropertiesTool(state, resolved),
    createAddComponentTool(state),
    createInsertVariantInstanceTool(state),
    createRemoveInstanceTool(state),
    createSetBoardLabelTool(state),
    createApplyActionsTool(state),
  ]
  if (includeAll || turnScope === "theme") {
    tools.push(createSetThemeOverrideTool(state))
  }
  if (includeAll || turnScope === "fontCollection") {
    tools.push(
      createSetFontCollectionFamilyPresetTool(state, resolved),
      createSetFontCollectionFamilyVariantTool(state, resolved),
    )
  }
  if (includeAll || turnScope === "iconSet") {
    tools.push(
      createSetIconSetSubcategoryPresetTool(state, resolved),
      createSetIconSetOverrideTool(state, resolved),
    )
  }
  return tools
}

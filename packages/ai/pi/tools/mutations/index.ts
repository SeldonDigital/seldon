import type { ToolDefinition } from "@earendil-works/pi-coding-agent"

import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"
import { createAddComponentTool } from "./add-component"
import { createAddVariantTool } from "./add-variant"
import { createApplyActionsTool } from "./apply-actions"
import { createCreateAuthoredComponentTool } from "./create-authored-component"
import { createDuplicateComponentTool } from "./duplicate-component"
import { createInsertComponentTool } from "./insert-component"
import { createInsertVariantInstanceTool } from "./insert-variant-instance"
import { createMoveComponentTool } from "./move-component"
import { createRemoveInstanceTool } from "./remove-instance"
import { createReorderComponentTool } from "./reorder-component"
import { createSetBoardLabelTool } from "./set-board-label"
import { createSetFontCollectionFamilyPresetTool } from "./set-font-collection-family-preset"
import { createSetFontCollectionFamilyVariantTool } from "./set-font-collection-family-variant"
import { createSetIconSetOverrideTool } from "./set-icon-set-override"
import { createSetIconSetSubcategoryPresetTool } from "./set-icon-set-subcategory-preset"
import { createSetPropertiesTool } from "./set-properties"
import { createSetThemeOverrideTool } from "./set-theme-override"

/**
 * The Seldon mutation tools for one turn. Each tool proposes one or more
 * `WorkspaceAction`s validated against the shared working copy. The dedicated
 * node and board tools are always present, and every common focused edit has one.
 *
 * `apply_actions` takes raw `{ type, payload }` actions, so it skips the
 * dedicated tools' required-field checks, target resolution, and scope guardrail.
 * In a focused turn that both bleeds edits and confuses the model between the
 * `set_properties` tool and the `set_node_properties` action, so it is gated to
 * workspace scope (and an unset scope), where broad, long-tail edits belong.
 * Resource tools (theme, font collection, icon set) only make sense in their own
 * scope, so they are gated out of node and board turns to keep the schema small.
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
    createCreateAuthoredComponentTool(state),
    createInsertComponentTool(state),
    createInsertVariantInstanceTool(state),
    createDuplicateComponentTool(state),
    createAddVariantTool(state),
    createMoveComponentTool(state),
    createReorderComponentTool(state),
    createRemoveInstanceTool(state),
    createSetBoardLabelTool(state),
  ]
  if (includeAll) {
    tools.push(createApplyActionsTool(state))
  }
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

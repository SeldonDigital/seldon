import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/** Turns a whole icon subcategory on or off in the selected icon set. */
export function createSetIconSetSubcategoryPresetTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "set_icon_set_subcategory_preset",
    label: "Set Icon Set Subcategory Preset",
    description:
      'Turn a whole subcategory on or off. preset "all" includes every icon, "none" excludes them.',
    parameters: Type.Object({
      iconSetId: Type.Optional(
        Type.String({
          description: "Icon set entry id. Defaults to the selection.",
        }),
      ),
      subcategory: Type.String({
        description: "Subcategory path, for example communication/email.",
      }),
      preset: Type.Union([Type.Literal("all"), Type.Literal("none")]),
    }),
    execute: async (_id, params) => {
      const iconSetId = params.iconSetId ?? resolved.resourceTargetId
      if (!iconSetId) {
        return textResult("No icon set is selected. Pass iconSetId.")
      }
      return textResult(
        commit(state, {
          type: "set_icon_set_subcategory_preset",
          payload: {
            iconSetId,
            subcategory: params.subcategory,
            preset: params.preset,
          },
        } as WorkspaceAction),
      )
    },
  })
}

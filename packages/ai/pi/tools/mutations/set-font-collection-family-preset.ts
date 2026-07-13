import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/** Turns a whole font family (slot) on or off in the selected font collection. */
export function createSetFontCollectionFamilyPresetTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "set_font_collection_family_preset",
    label: "Set Font Collection Family Preset",
    description:
      'Turn a whole family (slot) on or off. preset "all" enables every weight, "none" disables them.',
    parameters: Type.Object({
      fontCollectionId: Type.Optional(
        Type.String({
          description: "Font collection entry id. Defaults to the selection.",
        }),
      ),
      slot: Type.String({
        description: "Family slot, for example primary or secondary.",
      }),
      preset: Type.Union([Type.Literal("all"), Type.Literal("none")]),
    }),
    execute: async (_id, params) => {
      const fontCollectionId =
        params.fontCollectionId ?? resolved.resourceTargetId
      if (!fontCollectionId) {
        return textResult(
          "No font collection is selected. Pass fontCollectionId.",
        )
      }
      return textResult(
        commit(state, {
          type: "set_font_collection_family_preset",
          payload: {
            fontCollectionId,
            slot: params.slot,
            preset: params.preset,
          },
        } as WorkspaceAction),
      )
    },
  })
}

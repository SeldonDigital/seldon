import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/** Turns one weight (variant) of a font family on or off. */
export function createSetFontCollectionFamilyVariantTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "set_font_collection_family_variant",
    label: "Set Font Collection Family Variant",
    description: "Turn one weight (variant) of a family on or off.",
    parameters: Type.Object({
      fontCollectionId: Type.Optional(
        Type.String({
          description: "Font collection entry id. Defaults to the selection.",
        }),
      ),
      slot: Type.String({ description: "Family slot, for example primary." }),
      variant: Type.String({
        description: "Weight token, for example regular or bold.",
      }),
      enabled: Type.Boolean({
        description: "true to enable, false to disable.",
      }),
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
          type: "set_font_collection_family_variant",
          payload: {
            fontCollectionId,
            slot: params.slot,
            variant: params.variant,
            enabled: params.enabled,
          },
        } as WorkspaceAction),
      )
    },
  })
}

import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { ResolvedContext } from "../../editor-context"
import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/** Turns a single icon on or off in the selected icon set. */
export function createSetIconSetOverrideTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "set_icon_set_override",
    label: "Set Icon Set Override",
    description:
      "Turn a single icon on or off. path is includedIcons.<iconId>; value true includes, false excludes.",
    parameters: Type.Object({
      iconSetId: Type.Optional(
        Type.String({
          description: "Icon set entry id. Defaults to the selection.",
        }),
      ),
      path: Type.String({
        description: "Override path, for example includedIcons.arrow-right.",
      }),
      value: Type.Optional(Type.Unknown()),
    }),
    execute: async (_id, params) => {
      const iconSetId = params.iconSetId ?? resolved.resourceTargetId
      if (!iconSetId) {
        return textResult("No icon set is selected. Pass iconSetId.")
      }
      return textResult(
        commit(state, {
          type: "set_icon_set_override",
          payload: {
            iconSetId,
            path: params.path,
            value: params.value ?? null,
          },
        } as WorkspaceAction),
      )
    },
  })
}

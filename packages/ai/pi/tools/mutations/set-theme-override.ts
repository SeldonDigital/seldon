import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { WorkspaceAction } from "@seldon/core/workspace/types"

import type { PiTurnState } from "../turn-state"
import { commit, textResult } from "./commit"

/** Overrides or resets a single theme token by path on an existing theme. */
export function createSetThemeOverrideTool(state: PiTurnState): ToolDefinition {
  return defineTool({
    name: "set_theme_override",
    label: "Set Theme Override",
    description:
      "Override a single theme token by path on an existing theme. Pass null to reset the token.",
    parameters: Type.Object({
      themeId: Type.String({ description: "Theme id from the context." }),
      path: Type.String({
        description: "Token path, for example swatch.primary.",
      }),
      value: Type.Optional(Type.Unknown()),
    }),
    execute: async (_id, params) =>
      textResult(
        commit(state, {
          type: "set_theme_override",
          payload: {
            themeId: params.themeId,
            path: params.path,
            value: params.value ?? null,
          },
        } as WorkspaceAction),
      ),
  })
}

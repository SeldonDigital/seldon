import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import {
  listSpacingFeels,
  resolveSpacingFeel,
} from "@seldon/core/rules/config/design-semantics.resolve"

import { commit, textResult } from "./commit"

import type { ToolDefinition } from "@earendil-works/pi-coding-agent"
import type { WorkspaceAction } from "@seldon/core/workspace/types"
import type { PiTurnState } from "../turn-state"

/**
 * Intent verb: set the whole theme's spacing density. A holistic request like
 * "make it breathe" or "tighten the whole thing up" maps to one named density
 * that overrides the theme modulation baseSize, which scales the modulated
 * spacing and size tokens together. This changes every component the theme
 * drives, not one node. To loosen a single element instead, use nudge or
 * set_properties on that node with exact spacing values.
 */
export function createSetSpacingFeelTool(state: PiTurnState): ToolDefinition {
  const feels = listSpacingFeels()

  return defineTool({
    name: "set_spacing_feel",
    label: "Set Spacing Feel",
    description:
      'Set the whole theme\'s spacing density by name ("breathe", "spacious", "cozy", "compact", "tight"), for a holistic request like "make the design breathe". It scales the theme spacing and size tokens together, so it changes every component. For one element only, use nudge or set_properties instead.',
    parameters: Type.Object({
      themeId: Type.String({
        description: "Theme id from the context to change.",
      }),
      feel: Type.Union(
        feels.map((feel) => Type.Literal(feel.id)),
        { description: "The named spacing density to apply." },
      ),
    }),

    execute: async (_id, params) => {
      const feel = resolveSpacingFeel(params.feel)

      if (!feel) {
        return textResult(`Unknown spacing feel "${params.feel}".`)
      }

      return textResult(
        commit(state, {
          type: "set_theme_override",
          payload: {
            themeId: params.themeId,
            path: "modulation.parameters.baseSize",
            value: feel.baseSize,
          },
        } as WorkspaceAction),
      )
    },
  })
}

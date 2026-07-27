import {
  type ToolDefinition,
  defineTool,
} from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import type { ResolvedContext } from "../../editor-context"
import type { TargetSpec } from "../resolve-target"
import type { PiTurnState } from "../turn-state"
import { textResult } from "./commit"
import { applyPropertyEdit } from "./set-properties"

/** Weight names that map to the theme font weight scale ids. */
const WEIGHTS = [
  "thin",
  "xlight",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "xbold",
  "black",
] as const

/**
 * Intent verb: set a text node's weight. It writes the "font" look "weight"
 * facet as an @fontWeight.* token, so the model picks a named weight from a
 * closed set instead of recalling the facet path, the value shape, or the scale
 * ordering. The facet override flips the font look to custom, which is the
 * intended effect.
 */
export function createSetEmphasisTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "set_emphasis",
    label: "Set Emphasis",
    description:
      "Set a text node's weight (bold, light, and so on) as a theme weight token. Use this to make text bold or lighter instead of set_properties.",
    parameters: Type.Object({
      target: Type.Union(
        [Type.Literal("selection"), Type.Object({ nodeId: Type.String() })],
        {
          description:
            '"selection" for the selected node, or { "nodeId" } from the context.',
        },
      ),
      weight: Type.Union(
        WEIGHTS.map((weight) => Type.Literal(weight)),
        { description: "A named weight on the theme scale." },
      ),
    }),
    execute: async (_id, params) =>
      textResult(
        applyPropertyEdit(state, resolved, {
          target: params.target as TargetSpec,
          properties: {
            font: {
              weight: {
                type: "theme.ordinal",
                value: `@fontWeight.${params.weight}`,
              },
            },
          },
        }),
      ),
  })
}

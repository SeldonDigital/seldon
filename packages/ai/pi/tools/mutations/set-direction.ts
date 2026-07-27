import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { textResult } from "./commit"
import { applyPropertyEdit } from "./set-properties"

import type { ResolvedContext } from "../../editor-context"
import type { TargetSpec } from "../resolve-target"
import type { PiTurnState } from "../turn-state"
import type { ToolDefinition } from "@earendil-works/pi-coding-agent"

/**
 * Intent verb: set a node's reading and layout direction. It writes the
 * "direction" property so the model never fakes right-to-left with align,
 * margin, padding, float, or orientation, and never has to recall the property
 * name or value shape.
 */
export function createSetDirectionTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "set_direction",
    label: "Set Direction",
    description:
      "Set a node's reading and layout direction to ltr or rtl. Use this for right-to-left content (Hebrew, Arabic) instead of align, margin, or float.",
    parameters: Type.Object({
      target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
        description: '"selection" for the selected node, or { "nodeId" } from the context.',
      }),
      direction: Type.Union([Type.Literal("ltr"), Type.Literal("rtl")], {
        description: "Reading direction: ltr or rtl.",
      }),
    }),

    execute: async (_id, params) =>
      textResult(
        applyPropertyEdit(state, resolved, {
          target: params.target as TargetSpec,
          properties: {
            direction: { type: "option", value: params.direction },
          },
        }),
      ),
  })
}

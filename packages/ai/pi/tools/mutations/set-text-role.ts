import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { textResult } from "./commit"
import { applyPropertyEdit } from "./set-properties"

import type { ToolDefinition } from "@earendil-works/pi-coding-agent"
import type { ResolvedContext } from "../../editor-context"
import type { TargetSpec } from "../resolve-target"
import type { PiTurnState } from "../turn-state"

/** Typographic roles that map to the theme font look ids. */
const ROLES = [
  "display",
  "heading",
  "subheading",
  "title",
  "subtitle",
  "callout",
  "body",
  "label",
  "tagline",
  "code",
] as const

/**
 * Intent verb: apply a typographic role to a text node. It sets the "font" look
 * "preset" to an @font.* look, applying the whole recipe (family, size, weight,
 * line height) in one edit, so the model expresses a role like "title" or "body"
 * without composing individual facets or recalling token ids.
 */
export function createSetTextRoleTool(
  state: PiTurnState,
  resolved: ResolvedContext,
): ToolDefinition {
  return defineTool({
    name: "set_text_role",
    label: "Set Text Role",
    description:
      "Apply a typographic role (title, heading, body, label, and so on) to a text node by setting its font look. Prefer this over setting size and weight by hand.",
    parameters: Type.Object({
      target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
        description: '"selection" for the selected node, or { "nodeId" } from the context.',
      }),
      role: Type.Union(
        ROLES.map((role) => Type.Literal(role)),
        { description: "A typographic role on the theme font look scale." },
      ),
    }),

    execute: async (_id, params) =>
      textResult(
        applyPropertyEdit(state, resolved, {
          target: params.target as TargetSpec,
          properties: {
            font: {
              preset: {
                type: "theme.categorical",
                value: `@font.${params.role}`,
              },
            },
          },
        }),
      ),
  })
}

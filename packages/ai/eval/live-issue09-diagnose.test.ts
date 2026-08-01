/**
 * Pins the issue 09 fix: route used to answer its own "which one do you
 * mean?" clarifying question for these messages instead of forwarding to
 * processing, even though it has no board data to judge ambiguity with.
 * Each case here is a message that must reach processing regardless of how
 * vague its target sounds -- resolving the target is the job of
 * decompose/extract-target/resolve-target, not route. Env-gated on
 * SELDON_AI_LIVE since it calls a live model.
 */
import { describe, expect, it } from "vitest"
import { ComponentId } from "@seldon/core/components/constants"
import type { BoardKey } from "@seldon/core/workspace/types"

import { resolveContext } from "../local/editor-context"
import { route } from "../local/resolvers/route"
import type { TurnContext } from "../local/turn-context"
import { createTurnState } from "../local/turn-state"
import { seedButtonWorkspace, seedChipRowWorkspace, seedTextListWorkspace, CHIP_ROW_BOARD, TEXT_LIST_BOARD } from "./seed"

const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:8b"

const CASES = [
  { label: "remove-named", message: "get rid of the icon", seed: "button" as const },
  { label: "add-variant", message: "create a new variant of this button", seed: "button" as const },
  { label: "reorder-first", message: "move the icon to the front", seed: "button" as const },
  { label: "card-class-each", message: "hide each of the chips", seed: "chipRow" as const },
  { label: "ref-single-plain", message: "make the label bold", seed: "button" as const },
  {
    label: "fanout-reset-multi-semantic",
    message: "reset the color of the two texts about cars",
    seed: "textList" as const,
  },
  {
    label: "fanout-translate-single-spatial",
    message: "translate the last text into Dutch",
    seed: "textList" as const,
  },
]

function seedFor(kind: "button" | "chipRow" | "textList") {
  if (kind === "chipRow") {
    const { workspace } = seedChipRowWorkspace()
    return { workspace, boardKey: CHIP_ROW_BOARD as BoardKey }
  }
  if (kind === "textList") {
    const { workspace } = seedTextListWorkspace()
    return { workspace, boardKey: TEXT_LIST_BOARD as BoardKey }
  }
  return { workspace: seedButtonWorkspace(), boardKey: ComponentId.BUTTON as BoardKey }
}

describe.skipIf(!process.env.SELDON_AI_LIVE)("live route: forwards vague-sounding edits to processing", () => {
  it(
    "never answers its own clarifying question for a design-edit message",
    async () => {
      for (const testCase of CASES) {
        const { workspace, boardKey } = seedFor(testCase.seed)
        const context: TurnContext = {
          state: createTurnState(workspace),
          resolved: resolveContext({ workspace, activeBoardKey: boardKey }),
          message: testCase.message,
          model: MODEL,
          calls: [],
          steps: [],
        }
        const decision = await route(context)
        expect(decision.kind, `${testCase.label}: "${testCase.message}" -> ${JSON.stringify(decision)}`).toBe(
          "process",
        )
      }
    },
    10 * 60 * 1000,
  )
})

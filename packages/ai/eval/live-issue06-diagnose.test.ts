/**
 * Diagnostic battery for issue 06 (plural set-phrasing misrouting to
 * reset_node_property and silently clearing overrides). Threads decompose ->
 * classify-action for plural/singular pairs and prints BOTH the decompose
 * rewrite and the classifier's raw intent, separating the two suspects: a
 * classifier misread vs decompose stripping the value word before classify
 * sees it. 30/30 correct in isolation so far (both models, with and without
 * a selection) -- kept for the next live sighting, since the original repro
 * depended on conversation state that was never captured. Env-gated on
 * SELDON_AI_LIVE.
 */
import { describe, it } from "vitest"
import { ComponentId } from "@seldon/core/components/constants"
import type { BoardKey } from "@seldon/core/workspace/types"

import { resolveContext } from "../local/editor-context"
import { classifyAction } from "../local/resolvers/classify-action"
import { decompose } from "../local/resolvers/decompose"
import type { TurnContext } from "../local/turn-context"
import { createTurnState } from "../local/turn-state"
import { seedTextListWorkspace, TEXT_LIST_BOARD } from "./seed"

const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:8b"

const REPEAT = Number(process.env.SELDON_AI_TEST_REPEAT ?? "1")
const CASES = Array.from({ length: REPEAT }, (_, index) => [
  { label: `plural-red #${index + 1}`, message: "make all the texts red" },
  { label: `singular-red #${index + 1}`, message: "make the text red" },
  { label: `plural-bold #${index + 1}`, message: "make all the texts bold" },
]).flat()

describe.skipIf(!process.env.SELDON_AI_LIVE)("live issue-06 diagnosis", () => {
  it(
    "threads decompose -> classify for plural vs singular set-color phrasing",
    async () => {
      const { workspace } = seedTextListWorkspace()

      for (const testCase of CASES) {
        const context: TurnContext = {
          state: createTurnState(workspace),
          resolved: resolveContext({
            workspace,
            activeBoardKey: TEXT_LIST_BOARD as BoardKey,
          }),
          message: testCase.message,
          model: MODEL,
          calls: [],
          steps: [],
        }

        const steps = await decompose(context)
        console.log(`\n##### "${testCase.message}"`)
        console.log(`decompose -> ${JSON.stringify(steps)}`)

        for (const step of steps) {
          const classification = await classifyAction({
            message: step,
            model: MODEL,
            hasSelectedNode: true,
            scope: "instance",
          })
          if (classification.kind === "classified") {
            console.log(`  classify("${step}") -> intent: ${classification.intent.intent}`)
          } else {
            console.log(
              `  classify("${step}") -> message (rawIntent: ${classification.rawIntent})`,
            )
          }
        }
      }
    },
    10 * 60 * 1000,
  )
})

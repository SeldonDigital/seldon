/**
 * Permanent pin for the worst defect the 2026-08-01 live session found: a
 * compound turn ("In the second variant: change the first text to X and make
 * the second text about a Sedan") stopped at resolve_target and still replied
 * "The text in several elements was changed." It reported failure as success.
 *
 * The invariant pinned here is the one the reply assembly now guarantees by
 * construction: a turn that committed NOTHING is phrased by no model at all,
 * so its reply is the resolver's own words and cannot contain a past-tense
 * claim that something was edited. Asserted against the real pipeline because
 * the unit tests can only pin the assembly, not that a live turn reaches it.
 *
 * Env-gated on SELDON_AI_LIVE.
 */
import { describe, expect, it } from "vitest"

import type { BoardKey } from "@seldon/core/workspace/types"

import { chatToActions } from "../local/orchestrate"
import {
  CHIP_ROW_BOARD,
  TEXT_LIST_BOARD,
  seedChipRowWorkspace,
  seedTextListWorkspace,
} from "./seed"

const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:8b"
const LIVE_TIMEOUT_MS = 10 * 60 * 1000

/**
 * Past-tense claims of a completed edit. Only ever checked against a turn
 * that committed zero actions, where any of them is a lie by definition.
 */
const CLAIMS_AN_EDIT_HAPPENED =
  /\b(?:was|were|has been|have been|i|i've|successfully)\s+(?:just\s+)?(?:changed|updated|set|applied|edited|modified|renamed)\b/i

describe.skipIf(!process.env.SELDON_AI_LIVE)("live truthful replies", () => {
  it(
    "never claims an edit on a turn that committed nothing",
    async () => {
      const listSeed = seedTextListWorkspace()
      const chipSeed = seedChipRowWorkspace()

      const turns = [
        {
          label: "the original compound Sedan turn",
          workspace: listSeed.workspace,
          activeBoardKey: TEXT_LIST_BOARD as BoardKey,
          message:
            "In the second variant: change the first text to X and make the second text about a Sedan",
        },
        {
          // Six chips exist, so the second half cannot resolve and must stop
          // the plan -- the mixed done/stopped shape, where the phrasing call
          // runs on the completed half only.
          label: "one resolvable step, one impossible reference",
          workspace: chipSeed.workspace,
          activeBoardKey: CHIP_ROW_BOARD as BoardKey,
          message:
            'rename the first chip to "Alpha" and make the tenth chip red',
        },
      ]

      for (const turn of turns) {
        const turnResult = await chatToActions({
          workspace: turn.workspace,
          message: turn.message,
          activeBoardKey: turn.activeBoardKey,
          scope: "instance",
          model: MODEL,
        })

        const metrics = turnResult.debug?.metrics
        console.log(`\n##### ${turn.label}`)
        console.log(`message: ${turn.message}`)
        console.log(`actions: ${turnResult.actions.length}`)
        console.log(
          `timing:  ${metrics ? `${(metrics.totalMs / 1000).toFixed(2)}s over ${metrics.calls} model calls (${(metrics.loadMs / 1000).toFixed(2)}s load, ${metrics.promptTokens} in / ${metrics.outputTokens} out)` : "unmeasured"}`,
        )
        console.log(`reply:   ${turnResult.reply}`)
        const auditedSteps = (turnResult.debug?.toolCalls ?? []).filter(
          (step) => step.name === "commit-audit",
        )
        if (auditedSteps.length > 0)
          console.log(`audit:   ${JSON.stringify(auditedSteps)}`)

        expect(turnResult.reply.length).toBeGreaterThan(0)
        const turnCommittedNothing = turnResult.actions.length === 0
        if (turnCommittedNothing) {
          expect(turnResult.reply).not.toMatch(CLAIMS_AN_EDIT_HAPPENED)
        }
        // A handler claiming success without a write is the other half of the
        // same lie, and the orchestrator downgrades it. Seeing one here means
        // a family handler regressed.
        expect(auditedSteps).toHaveLength(0)
      }
    },
    LIVE_TIMEOUT_MS,
  )
})

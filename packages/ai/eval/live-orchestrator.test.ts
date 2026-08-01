/**
 * TEMPORARY: full-pipeline live check for build 1, through chatToActions --
 * the same entry the editor calls, INCLUDING route/decompose. The eval
 * harness bypasses decompose (it calls resolveTargetWithHint directly),
 * which is exactly how issue 03 stayed invisible. Env-gated; delete after
 * the cardinality work settles or fold into a permanent e2e.
 */
import { describe, it } from "vitest"

import { chatToActions } from "../local/orchestrate"
import { CHIP_ROW_BOARD, seedChipRowWorkspace } from "./seed"

const CASES = [
  "make all the chips bold",
  "set the width of all the chips to 100 pixels",
]

describe.skipIf(!process.env.SELDON_AI_LIVE)("live orchestrator", () => {
  it(
    "runs plural requests through the real pipeline",
    async () => {
      for (const message of CASES) {
        const { workspace, chipIds } = seedChipRowWorkspace()
        console.log(`\n########## "${message}" (fresh turn, ${chipIds.length} chips, no history, nothing selected)`)
        const result = await chatToActions({
          workspace,
          message,
          activeBoardKey: CHIP_ROW_BOARD,
          scope: "board",
          model: "qwen3:8b",
        })
        for (const call of result.debug?.toolCalls ?? []) {
          const out = (call.output ?? "").replace(/\n/g, " | ").slice(0, 400)
          console.log(`-- ${call.ok ? "ok " : "ERR"} ${call.name}: ${out}`)
        }
        console.log("ACTIONS:", JSON.stringify(result.actions).slice(0, 500))
        console.log("REPLY:", JSON.stringify(result.reply ?? result).slice(0, 300))
      }
    },
    10 * 60 * 1000,
  )
})

/**
 * Live check (SELDON_AI_LIVE=1): the clarification token round-trip. Turn 1
 * ends in an ask and carries {reason, candidateIds}; turn 2 echoes it back
 * with a node selected, which skips the router in code and resolves to the
 * selected node. This is the enforcement for issue 02 -- the router prompt
 * rule is judgment, this guard is the invariant.
 */
import { describe, expect, it } from "vitest"

import { chatToActions } from "../local/orchestrate"
import { CHIP_ROW_BOARD, seedChipRowWorkspace } from "./seed"

describe.skipIf(!process.env.SELDON_AI_LIVE)("clarification guard", () => {
  it(
    "turn 1 emits the token; turn 2 with selection skips the router",
    async () => {
      const { workspace, chipIds } = seedChipRowWorkspace()

      const turn1 = await chatToActions({
        workspace,
        message: "make the chip red",
        activeBoardKey: CHIP_ROW_BOARD,
        scope: "board",
        model: "qwen3:8b",
      })
      console.log("TURN1 clarification:", JSON.stringify(turn1.clarification))
      expect(turn1.clarification?.reason).toBe("several")
      expect(turn1.clarification?.candidateIds).toContain(chipIds[0])

      const turn2 = await chatToActions({
        workspace,
        message: "this one",
        history: [
          { role: "user", content: "make the chip red" },
          { role: "assistant", content: turn1.reply },
        ],
        activeBoardKey: CHIP_ROW_BOARD,
        selectedNodeId: chipIds[1],
        scope: "instance",
        pendingClarification: turn1.clarification,
        model: "qwen3:8b",
      })
      const routeStep = turn2.debug.toolCalls?.find((c) => c.name === "route")
      console.log("TURN2 route:", JSON.stringify(routeStep?.output))
      expect(routeStep?.output).toContain("Skipped the router")
      const resolveStep = turn2.debug.toolCalls?.find(
        (c) => c.name === "resolve_target",
      )
      console.log("TURN2 resolve:", JSON.stringify(resolveStep?.output).slice(0, 150))
      expect(resolveStep?.output).toContain(chipIds[1]!)
    },
    10 * 60 * 1000,
  )
})

/**
 * Live check (SELDON_AI_LIVE=1): the second half of issue 06. After an ask,
 * "which ones can I choose from?" is answered from the REAL candidate list
 * (workspace-grounded descriptions handed to the router), and the pending
 * clarification survives the aside so a selection still answers it next turn.
 */
import { describe, expect, it } from "vitest"

import { chatToActions } from "../local/orchestrate"
import { CHIP_ROW_BOARD, seedChipRowWorkspace } from "./seed"

describe.skipIf(!process.env.SELDON_AI_LIVE)("candidate-list follow-up", () => {
  it(
    "lists real candidates and keeps the ask pending",
    async () => {
      const { workspace } = seedChipRowWorkspace()

      const turn1 = await chatToActions({
        workspace,
        message: "make the chip red",
        activeBoardKey: CHIP_ROW_BOARD,
        scope: "board",
        model: "qwen3:8b",
      })
      expect(turn1.clarification?.reason).toBe("several")

      const turn2 = await chatToActions({
        workspace,
        message: "which ones can I choose from?",
        history: [
          { role: "user", content: "make the chip red" },
          { role: "assistant", content: turn1.reply },
        ],
        activeBoardKey: CHIP_ROW_BOARD,
        scope: "board",
        pendingClarification: turn1.clarification,
        model: "qwen3:8b",
      })
      console.log("TURN2 REPLY:", JSON.stringify(turn2.reply))
      console.log("TURN2 clarification kept:", JSON.stringify(turn2.clarification?.reason))
      // The reply names chips (plain words), not a generic non-answer.
      expect(turn2.reply.toLowerCase()).toContain("chip")
      // The ask survives the aside.
      expect(turn2.clarification?.reason).toBe("several")
    },
    10 * 60 * 1000,
  )
})

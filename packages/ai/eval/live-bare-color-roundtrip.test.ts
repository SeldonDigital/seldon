/**
 * Permanent pin for the bare-color convention (set + reset unified). The
 * 2026-08-03 live pair: "make all the chips blue" wrote whichever color key
 * the pipeline guessed, "reset the colour of all the chips" cleared a
 * different one, and the chips stayed dark. Pinned here: the bare set lands
 * on the key the convention picks (`background.0.color` -- a chip is
 * surface-bearing, so blue means the fill, not the invisible foreground),
 * and reset clears whatever color override the node actually carries, so
 * the pair round-trips to baseline. Asserted on the CHOSEN KEY, not on "an
 * edit applied" -- scoring by count is exactly how earlier wrong-key writes
 * read as passes.
 *
 * Env-gated on SELDON_AI_LIVE.
 */
import { describe, expect, it } from "vitest"

import type { BoardKey } from "@seldon/core/workspace/types"

import { chatToActions } from "../local/orchestrate"
import { overriddenColorKeys } from "../local/resolvers/bare-color"
import { CHIP_ROW_BOARD, seedChipRowWorkspace } from "./seed"

const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:8b"
const LIVE_TIMEOUT_MS = 10 * 60 * 1000

describe.skipIf(!process.env.SELDON_AI_LIVE)("live bare-color round trip", () => {
  it(
    "a bare blue paints the chips' surface, and resetting the color undoes it",
    async () => {
      const chipSeed = seedChipRowWorkspace()

      const setTurn = await chatToActions({
        workspace: chipSeed.workspace,
        message: "make all the chips blue",
        activeBoardKey: CHIP_ROW_BOARD as BoardKey,
        scope: "instance",
        model: MODEL,
      })
      console.log(`set reply:   ${setTurn.reply}`)
      expect(setTurn.actions.length).toBeGreaterThan(0)
      for (const chipId of chipSeed.chipIds) {
        expect(overriddenColorKeys(setTurn.workspace, chipId, "chip")).toEqual(
          ["background.0.color"],
        )
      }

      const resetTurn = await chatToActions({
        workspace: setTurn.workspace,
        message: "reset the color of all the chips",
        activeBoardKey: CHIP_ROW_BOARD as BoardKey,
        scope: "instance",
        model: MODEL,
      })
      console.log(`reset reply: ${resetTurn.reply}`)
      expect(resetTurn.actions.length).toBeGreaterThan(0)
      for (const chipId of chipSeed.chipIds) {
        expect(
          overriddenColorKeys(resetTurn.workspace, chipId, "chip"),
        ).toEqual([])
      }
    },
    LIVE_TIMEOUT_MS,
  )
})

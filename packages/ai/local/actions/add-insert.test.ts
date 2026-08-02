import { beforeEach, describe, expect, it, vi } from "vitest"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import type { BoardKey } from "@seldon/core/workspace/types"

import { resolveContext } from "../editor-context"
import { callOllamaFormat } from "../ollama-client"
import type { TurnContext } from "../turn-context"
import { createTurnState } from "../turn-state"
import {
  CHIP_ROW_BOARD,
  seedChipRowWorkspace,
} from "../../eval/seed"
import { executeAddComponent } from "./add-insert"

vi.mock("../ollama-client", () => ({
  callOllamaFormat: vi.fn(),
}))

/** A turn over the seeded chip row, with the user variant root selected. */
function contextWithSelection(message: string): TurnContext {
  const { workspace } = seedChipRowWorkspace()
  const chipRowBoard = workspace.boards[CHIP_ROW_BOARD]
  if (!chipRowBoard || !isComponentBoard(chipRowBoard))
    throw new Error("seed produced no chip row board")
  // The LAST variant is the seed's user variant -- the default catalog
  // variant rejects inserts, which is why the seed adds one.
  const userVariantRootId =
    chipRowBoard.variants[chipRowBoard.variants.length - 1]!.id
  return {
    state: createTurnState(workspace),
    resolved: resolveContext({
      workspace,
      activeBoardKey: CHIP_ROW_BOARD as BoardKey,
      selectedNodeId: userVariantRootId,
      scope: "variant",
    }),
    message,
    calls: [],
    steps: [],
  }
}

function modelAnswers(component: string, destination: string) {
  vi.mocked(callOllamaFormat).mockResolvedValue({
    value: { component, destination },
    metrics: {} as never,
  })
}

describe("executeAddComponent", () => {
  beforeEach(() => {
    vi.mocked(callOllamaFormat).mockReset()
  })

  it("discards an invented destination and falls back to the selection", async () => {
    // The live failure: "Add four chips" answered destination "container",
    // a word the message never says, and the turn died searching for it.
    modelAnswers("chip", "container")
    const context = contextWithSelection("Add four chips")
    const outcome = await executeAddComponent(context)

    expect(outcome.kind).toBe("applied")
    const guardStep = context.steps.find(
      (step) => step.name === "resolve_destination",
    )
    expect(guardStep?.output).toContain("discarded as invented")
  })

  it("inserts N instances for a counted request", async () => {
    modelAnswers("chip", "")
    const context = contextWithSelection("Add four chips")
    const outcome = await executeAddComponent(context)

    expect(outcome.kind).toBe("applied")
    expect(context.state.actions).toHaveLength(4)
    expect(
      context.state.actions.every(
        (action) => action.type === "insert_default_instance",
      ),
    ).toBe(true)
    if (outcome.kind === "applied") {
      expect(outcome.reply).toContain("4 chips")
    }
  })

  it("inserts once when no count is named", async () => {
    modelAnswers("chip", "")
    const context = contextWithSelection("add a chip")
    const outcome = await executeAddComponent(context)

    expect(outcome.kind).toBe("applied")
    expect(context.state.actions).toHaveLength(1)
  })

  it("refuses a count past the safety valve instead of clamping silently", async () => {
    modelAnswers("chip", "")
    const context = contextWithSelection("add 25 chips")
    const outcome = await executeAddComponent(context)

    expect(outcome.kind).toBe("message")
    if (outcome.kind === "message") {
      expect(outcome.text).toContain("up to 10")
    }
    expect(context.state.actions).toHaveLength(0)
  })

  it("asks for a destination when several are requested with nothing selected", async () => {
    modelAnswers("chip", "")
    const { workspace } = seedChipRowWorkspace()
    const context: TurnContext = {
      state: createTurnState(workspace),
      resolved: resolveContext({
        workspace,
        activeBoardKey: CHIP_ROW_BOARD as BoardKey,
        scope: "board",
      }),
      message: "add four chips",
      calls: [],
      steps: [],
    }
    const outcome = await executeAddComponent(context)

    expect(outcome.kind).toBe("message")
    if (outcome.kind === "message") {
      expect(outcome.text).toContain("place to put them")
    }
    expect(context.state.actions).toHaveLength(0)
  })

  it("keeps a destination the user actually spoke", async () => {
    modelAnswers("chip", "the list")
    const context = contextWithSelection("add a chip to the list")
    await executeAddComponent(context)

    const guardStep = context.steps.find(
      (step) =>
        step.name === "resolve_destination" &&
        step.output?.includes("discarded as invented"),
    )
    expect(guardStep).toBeUndefined()
  })
})

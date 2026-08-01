import { beforeEach, describe, expect, it, vi } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import { resolveContext } from "../../editor-context"
import type { TurnContext } from "../../turn-context"
import { createTurnState } from "../../turn-state"
import { rankBySimilarity } from "./embed-rank"
import { narrowClassTarget } from "./narrow-pool"

vi.mock("./embed-rank", () => ({
  rankBySimilarity: vi.fn(),
}))

/** The button board's "tools" variant holds three sibling buttons, in order. */
function toolbarSiblings(): { context: TurnContext; siblingIds: string[] } {
  const workspace = addComponent(
    { boardKey: ComponentId.BUTTON } as never,
    createEmptyWorkspace(),
  )
  const board = workspace.boards[ComponentId.BUTTON]
  if (!board || !isComponentBoard(board)) {
    throw new Error("expected the button board to be a component board")
  }
  const tools = board.variants.find((variant) => variant.id.includes("tools"))
  const siblingIds = (tools?.children ?? []).map((ref) => ref.id)
  if (siblingIds.length < 3) {
    throw new Error("expected the toolbar variant to hold 3 sibling buttons")
  }
  const context: TurnContext = {
    state: createTurnState(workspace),
    resolved: resolveContext({
      workspace,
      activeBoardKey: ComponentId.BUTTON,
      scope: "board",
    }),
    message: "",
    calls: [],
    steps: [],
  }
  return { context, siblingIds }
}

describe("narrowClassTarget", () => {
  beforeEach(() => {
    vi.mocked(rankBySimilarity).mockReset()
  })

  it("narrows to the first N by tree order for a leading spatial cue", async () => {
    const { context, siblingIds } = toolbarSiblings()
    const result = await narrowClassTarget(
      context,
      siblingIds,
      2,
      "the top two buttons",
    )
    expect(result).toEqual({
      kind: "resolved-many",
      nodeIds: [siblingIds[0], siblingIds[1]],
    })
    expect(rankBySimilarity).not.toHaveBeenCalled()
  })

  it("narrows to the last N by tree order for a trailing spatial cue", async () => {
    const { context, siblingIds } = toolbarSiblings()
    const result = await narrowClassTarget(
      context,
      siblingIds,
      2,
      "the last two buttons",
    )
    expect(result.kind).toBe("resolved-many")
    expect(new Set(result.nodeIds)).toEqual(
      new Set([siblingIds[1], siblingIds[2]]),
    )
    expect(rankBySimilarity).not.toHaveBeenCalled()
  })

  it("ranks by embedding similarity when the query names no spatial direction", async () => {
    const { context, siblingIds } = toolbarSiblings()
    vi.mocked(rankBySimilarity).mockResolvedValue([
      { id: siblingIds[2]!, score: 0.9 },
      { id: siblingIds[0]!, score: 0.5 },
      { id: siblingIds[1]!, score: 0.1 },
    ])
    const result = await narrowClassTarget(
      context,
      siblingIds,
      2,
      "the two buttons about checkout",
    )
    expect(result).toEqual({
      kind: "resolved-many",
      nodeIds: [siblingIds[2], siblingIds[0]],
    })
  })

  it("degrades to the full pool when there is no spatial cue and embeddings are unavailable", async () => {
    const { context, siblingIds } = toolbarSiblings()
    vi.mocked(rankBySimilarity).mockResolvedValue(null)
    const result = await narrowClassTarget(context, siblingIds, 2, "some buttons")
    expect(result).toEqual({ kind: "resolved-many", nodeIds: siblingIds })
    const narrowStep = context.steps.find((step) => step.name === "narrow_target")
    expect(narrowStep?.ok).toBe(false)
  })
})

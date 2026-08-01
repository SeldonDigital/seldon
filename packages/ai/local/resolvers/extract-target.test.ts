import { beforeEach, describe, expect, it, vi } from "vitest"

import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"

import { resolveContext } from "../editor-context"
import { callOllamaFormat } from "../ollama-client"
import type { TurnContext } from "../turn-context"
import { createTurnState } from "../turn-state"
import { extractTargetHint } from "./extract-target"

vi.mock("../ollama-client", () => ({
  callOllamaFormat: vi.fn(),
}))

function contextWithMessage(message: string): TurnContext {
  const workspace = createEmptyWorkspace()
  return {
    state: createTurnState(workspace),
    resolved: resolveContext({ workspace, scope: "board" }),
    message,
    calls: [],
    steps: [],
  }
}

describe("extractTargetHint", () => {
  beforeEach(() => {
    vi.mocked(callOllamaFormat).mockReset()
  })

  it("treats a count of 0 as no bounded count named", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: { pointsAtSelection: false, match: "chips", plural: true, count: 0 },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(contextWithMessage("all the chips"))
    expect(hint.count).toBeUndefined()
    expect(hint.plural).toBe(true)
  })

  it("carries a named count through and implies plural even if the model's own boolean is false", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: { pointsAtSelection: false, match: "texts", plural: false, count: 2 },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(contextWithMessage("the top 2 texts"))
    expect(hint.count).toBe(2)
    expect(hint.plural).toBe(true)
  })

  it("drops the count when there is no phrase to match against", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: { pointsAtSelection: true, match: "", plural: false, count: 2 },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(contextWithMessage("make these two red"))
    expect(hint.match).toBeUndefined()
    expect(hint.count).toBeUndefined()
    expect(hint.plural).toBe(false)
  })
})

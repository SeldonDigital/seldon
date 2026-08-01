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
      value: {
        pointsAtSelection: false,
        baseNode: "chips",
        descriptor: "",
        plural: true,
        count: 0,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(contextWithMessage("all the chips"))
    expect(hint.count).toBeUndefined()
    expect(hint.plural).toBe(true)
  })

  it("carries a named count through and implies plural even if the model's own boolean is false", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: {
        pointsAtSelection: false,
        baseNode: "texts",
        descriptor: "top",
        plural: false,
        count: 2,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(contextWithMessage("the top 2 texts"))
    expect(hint.count).toBe(2)
    expect(hint.plural).toBe(true)
  })

  it("drops the count when there is no phrase to match against", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: {
        pointsAtSelection: true,
        baseNode: "",
        descriptor: "",
        plural: false,
        count: 2,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(contextWithMessage("make these two red"))
    expect(hint.match).toBeUndefined()
    expect(hint.count).toBeUndefined()
    expect(hint.plural).toBe(false)
  })

  it("rejoins the descriptor and the noun into one search phrase", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: {
        pointsAtSelection: false,
        baseNode: "button",
        descriptor: "last",
        plural: false,
        count: 0,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(
      contextWithMessage("make the last button green"),
    )
    // spatialTieBreak matches position words out of this phrase, so the
    // descriptor has to survive the rejoin.
    expect(hint.match).toBe("last button")
  })

  it("reads a count the model dropped straight off the message", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: {
        pointsAtSelection: false,
        baseNode: "text",
        descriptor: "",
        plural: true,
        count: 0,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(
      contextWithMessage("make the two texts about cars bold"),
    )
    // The model answered 0 for a phrasing its own examples cover -- the
    // number is sitting in the message, so the fallback counts it in code.
    expect(hint.count).toBe(2)
    expect(hint.plural).toBe(true)
  })

  it("does not invent a count from an unrelated number in the message", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: {
        pointsAtSelection: false,
        baseNode: "chip",
        descriptor: "",
        plural: false,
        count: 0,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(
      contextWithMessage("set the width of the chip to 100 pixels"),
    )
    // "100 pixels" is a value, not a bounded reference -- it does not sit
    // before the noun, so no count may be read from it.
    expect(hint.count).toBeUndefined()
    expect(hint.plural).toBe(false)
  })

  it("keeps the bare noun beside the composed phrase for the class path", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: {
        pointsAtSelection: false,
        baseNode: "text",
        descriptor: "top two",
        plural: true,
        count: 2,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(
      contextWithMessage("make the top two texts bold"),
    )
    // The composed phrase serves search; the class predicate must see the
    // noun alone, or "top two text" matches no kind on any board.
    expect(hint.match).toBe("top two text")
    expect(hint.baseNode).toBe("text")
  })

  it("names no element when describing words arrive without a noun", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: {
        pointsAtSelection: true,
        baseNode: "",
        descriptor: "last",
        plural: false,
        count: 0,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(contextWithMessage("make the last one red"))
    expect(hint.match).toBeUndefined()
  })
})

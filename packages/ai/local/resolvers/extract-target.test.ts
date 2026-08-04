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
        count: 0,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(contextWithMessage("all the chips"))
    expect(hint.count).toBeUndefined()
    expect(hint.plural).toBe(true)
  })

  it("carries a named count through and implies plural even when the noun itself is singular", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: {
        pointsAtSelection: false,
        baseNode: "text",
        descriptor: "top",
        count: 2,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(contextWithMessage("the top 2 text"))
    expect(hint.count).toBe(2)
    expect(hint.plural).toBe(true)
  })

  it("drops the count when there is no phrase to match against", async () => {
    vi.mocked(callOllamaFormat).mockResolvedValue({
      value: {
        pointsAtSelection: true,
        baseNode: "",
        descriptor: "",
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
        count: 0,
      },
      metrics: {} as never,
    })
    const hint = await extractTargetHint(contextWithMessage("make the last one red"))
    expect(hint.match).toBeUndefined()
  })

  // Issue 10: `plural` used to be a model answer, and qwen3 deterministically
  // answered `plural: true` for a singular noun carrying a positional
  // descriptor ("the last chip", "the first list item"), fanning a
  // single-element edit over every match on the board. It is now derived in
  // code from the noun the model already extracted -- these cases pin the
  // exact phrasings that broke live.
  describe("code-derived plural (issue 10)", () => {
    it("reads a singular noun with a positional descriptor as one element", async () => {
      vi.mocked(callOllamaFormat).mockResolvedValue({
        value: {
          pointsAtSelection: false,
          baseNode: "chip",
          descriptor: "last",
          count: 0,
        },
        metrics: {} as never,
      })
      const hint = await extractTargetHint(
        contextWithMessage("increase the opacity of the last chip"),
      )
      expect(hint.plural).toBe(false)
    })

    it("reads a singular multi-word noun named by position as one element", async () => {
      vi.mocked(callOllamaFormat).mockResolvedValue({
        value: {
          pointsAtSelection: false,
          baseNode: "list item",
          descriptor: "first",
          count: 0,
        },
        metrics: {} as never,
      })
      const hint = await extractTargetHint(
        contextWithMessage("change the first list item to 'Buy now'"),
      )
      expect(hint.plural).toBe(false)
    })

    // Live regression measured while fixing issue 10: qwen3 answered
    // `baseNode: "chip"` (singular) for "make the chips red", silently
    // dropping the plural edit to a single-element one because the code-only
    // derivation trusted the model's spelling of the noun.
    it("overrides a singular-looking baseNode when the message itself spells the noun plural", async () => {
      vi.mocked(callOllamaFormat).mockResolvedValue({
        value: {
          pointsAtSelection: false,
          baseNode: "chip",
          descriptor: "",
          count: 0,
        },
        metrics: {} as never,
      })
      const hint = await extractTargetHint(contextWithMessage("make the chips red"))
      expect(hint.plural).toBe(true)
    })

    it("overrides a singular-looking multi-word baseNode when the message spells the head noun plural", async () => {
      vi.mocked(callOllamaFormat).mockResolvedValue({
        value: {
          pointsAtSelection: false,
          baseNode: "text",
          descriptor: "",
          count: 0,
        },
        metrics: {} as never,
      })
      const hint = await extractTargetHint(
        contextWithMessage("apply the dark theme to all the texts"),
      )
      expect(hint.plural).toBe(true)
    })

    it("reads a singular noun quantified by 'every' as a class", async () => {
      vi.mocked(callOllamaFormat).mockResolvedValue({
        value: {
          pointsAtSelection: false,
          baseNode: "chip",
          descriptor: "",
          count: 0,
        },
        metrics: {} as never,
      })
      const hint = await extractTargetHint(
        contextWithMessage("give every chip a bigger corner radius"),
      )
      expect(hint.plural).toBe(true)
    })

    it("reads a plural noun quantified by 'each' as a class", async () => {
      vi.mocked(callOllamaFormat).mockResolvedValue({
        value: {
          pointsAtSelection: false,
          baseNode: "chips",
          descriptor: "",
          count: 0,
        },
        metrics: {} as never,
      })
      const hint = await extractTargetHint(
        contextWithMessage("hide each of the chips"),
      )
      expect(hint.plural).toBe(true)
    })

    it("recovers the message's own inflection on the board-vocabulary fallback path", async () => {
      const { seedChipRowWorkspace, CHIP_ROW_BOARD } = await import("../../eval/seed")
      const { workspace } = seedChipRowWorkspace()
      vi.mocked(callOllamaFormat).mockResolvedValue({
        value: {
          pointsAtSelection: false,
          // The model drops the noun entirely -- the fallback in
          // `boardKindNamedInMessage` must recover it from the message.
          baseNode: "",
          descriptor: "",
          count: 0,
        },
        metrics: {} as never,
      })
      const context: TurnContext = {
        state: createTurnState(workspace),
        resolved: resolveContext({
          workspace,
          scope: "board",
          activeBoardKey: CHIP_ROW_BOARD as never,
        }),
        message: "hide all the chips",
        calls: [],
        steps: [],
      }
      const hint = await extractTargetHint(context)
      // The fallback must hand back "chips" -- the inflected word the
      // message actually used -- not the catalog's canonical singular
      // "chip", or the plural judgment above would wrongly read this as one
      // element (issue 10, step 2).
      expect(hint.baseNode).toBe("chips")
      expect(hint.plural).toBe(true)
    })
  })
})

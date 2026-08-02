import { beforeEach, describe, expect, it, vi } from "vitest"

import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"

import { resolveContext } from "../editor-context"
import { callOllamaFormat } from "../ollama-client"
import type { TurnContext } from "../turn-context"
import { createTurnState } from "../turn-state"
import { decompose } from "./decompose"

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

function modelAnswers(steps: string[]) {
  vi.mocked(callOllamaFormat).mockResolvedValue({
    value: { steps },
    metrics: {} as never,
  })
}

describe("decompose", () => {
  beforeEach(() => {
    vi.mocked(callOllamaFormat).mockReset()
  })

  it("collapses a counted group the model split into invented members", async () => {
    // The prompt forbids this split; the model does it anyway on some
    // frames, deterministically. The invented ordinals would make the
    // resolver look up members the user never named.
    modelAnswers([
      "reset the color of the first text about cars",
      "reset the color of the second text about cars",
    ])
    const steps = await decompose(
      contextWithMessage("reset the color of the two texts about cars"),
    )
    expect(steps).toEqual(["reset the color of the two texts about cars"])
  })

  it("keeps a genuine compound of two different edits", async () => {
    modelAnswers(["Add a card.", "Make the title of the new card red."])
    const steps = await decompose(
      contextWithMessage("add a card and make its title red"),
    )
    expect(steps).toHaveLength(2)
  })

  it("keeps a per-thing split for a creation request", async () => {
    // "add two cards" legitimately becomes one step per created thing: the
    // members do not exist yet, so there is nothing on a board to count.
    modelAnswers(["Add a card.", "Add a second card."])
    const steps = await decompose(contextWithMessage("add two cards"))
    expect(steps).toHaveLength(2)
  })

  it("keeps ordinals the user actually spoke", async () => {
    modelAnswers([
      "Make the first card red.",
      "Make the second card blue.",
    ])
    const steps = await decompose(
      contextWithMessage("make the first card red and the second card blue"),
    )
    expect(steps).toHaveLength(2)
  })

  it("degrades an empty answer to the message as one step", async () => {
    modelAnswers([])
    const steps = await decompose(contextWithMessage("make the title red"))
    expect(steps).toEqual(["make the title red"])
  })
})

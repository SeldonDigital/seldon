import { afterEach, describe, expect, it, vi } from "vitest"

import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"

import type { TurnContext } from "../turn-context"
import { createTurnState } from "../turn-state"
import {
  type StepOutcome,
  buildConversationalReply,
  buildTemplateReply,
  conversationalRepliesEnabled,
} from "./reply"

const { callOllamaFormatMock } = vi.hoisted(() => ({
  callOllamaFormatMock: vi.fn(),
}))
vi.mock("../ollama-client", () => ({
  callOllamaFormat: callOllamaFormatMock,
}))

const applied = (step: string, reply: string): StepOutcome => ({
  step,
  intent: "set_node_properties",
  outcome: { kind: "applied", reply },
})

const stopped = (step: string, text: string): StepOutcome => ({
  step,
  intent: "set_node_properties",
  outcome: { kind: "message", text },
})

function buildContext(): TurnContext {
  return {
    state: createTurnState(createEmptyWorkspace()),
    resolved: {} as TurnContext["resolved"],
    message: "",
    calls: [],
    steps: [],
  }
}

describe("buildTemplateReply", () => {
  it("returns the single outcome's text verbatim", () => {
    expect(buildTemplateReply([applied("a", "Set content on n1.")])).toBe(
      "Set content on n1.",
    )
    expect(buildTemplateReply([stopped("a", "Which node do you mean?")])).toBe(
      "Which node do you mean?",
    )
  })

  it("numbers multiple outcomes, including a stopping failure", () => {
    const reply = buildTemplateReply([
      applied("Add a card", "Added the card component."),
      stopped("Make the title red", "Several nodes match 'title'."),
    ])
    expect(reply).toContain("1. Added the card component.")
    expect(reply).toContain("2. Several nodes match 'title'.")
  })
})

describe("buildConversationalReply", () => {
  afterEach(() => callOllamaFormatMock.mockReset())

  it("forwards a stop verbatim and makes no model call", async () => {
    const context = buildContext()
    const reply = await buildConversationalReply(context, [
      stopped(
        "change the first text",
        "That matched 6 elements. Name the one you mean and ask again.",
      ),
    ])
    expect(reply).toBe(
      "That matched 6 elements. Name the one you mean and ask again.",
    )
    expect(callOllamaFormatMock).not.toHaveBeenCalled()
    expect(context.calls).toHaveLength(0)
  })

  // The reported defect: a compound turn stopped at resolve_target and came
  // back as "The text in several elements was changed." The phrasing call now
  // never sees the stop, so whatever it invents cannot delete the failure.
  it("keeps the failure in the reply even when the model claims everything worked", async () => {
    callOllamaFormatMock.mockResolvedValue({
      value: { message: "The text in several elements was changed." },
      metrics: {
        promptTokens: 1,
        outputTokens: 1,
        evalDurationMs: 1,
        loadMs: 0,
      },
    })
    const reply = await buildConversationalReply(buildContext(), [
      applied("change the first text to X", 'Set content to "X" on n1.'),
      stopped(
        "make the second text about a Sedan",
        "I couldn't find a second text in that variant.",
      ),
    ])
    expect(reply).toContain("I couldn't find a second text in that variant.")
  })

  it("tells the phrasing call the request is unfinished when a step stopped", async () => {
    callOllamaFormatMock.mockResolvedValue({
      value: { message: "Done." },
      metrics: {
        promptTokens: 1,
        outputTokens: 1,
        evalDurationMs: 1,
        loadMs: 0,
      },
    })
    await buildConversationalReply(buildContext(), [
      applied("change the first text to X", 'Set content to "X" on n1.'),
      stopped("make the second text about a Sedan", "No second text."),
    ])
    const [{ prompt }] = callOllamaFormatMock.mock.calls[0]!
    expect(prompt).toContain("did NOT complete")
    // The failing half must not reach the phrasing call at all.
    expect(prompt).not.toContain("No second text.")
  })

  // Issue 17: "rename the second variant to Compact" was classified as
  // add_variant, which added a variant and renamed nothing. The request must
  // not reach the phrasing call, or the model narrates the rename it asked for
  // alongside the add that actually happened.
  it("never shows the phrasing call what was requested, only what was written", async () => {
    callOllamaFormatMock.mockResolvedValue({
      value: { message: "Added a variant." },
      metrics: {
        promptTokens: 1,
        outputTokens: 1,
        evalDurationMs: 1,
        loadMs: 0,
      },
    })
    await buildConversationalReply(buildContext(), [
      {
        step: "rename the second variant to Compact",
        intent: "add_variant",
        outcome: { kind: "applied", reply: 'Added the variant "Variant 03".' },
      },
    ])
    const [{ prompt }] = callOllamaFormatMock.mock.calls[0]!
    expect(prompt).toContain('Added the variant "Variant 03".')
    expect(prompt).not.toContain("rename")
    expect(prompt).not.toContain("Compact")
  })

  it("reports an empty plan rather than an empty string", async () => {
    expect(await buildConversationalReply(buildContext(), [])).toBe(
      "Nothing to do.",
    )
  })

  it("falls back to the template when the phrasing call throws", async () => {
    callOllamaFormatMock.mockRejectedValue(new Error("ollama is down"))
    const reply = await buildConversationalReply(buildContext(), [
      applied("change the text", "Set content on n1."),
    ])
    expect(reply).toBe("Set content on n1.")
  })
})

describe("conversationalRepliesEnabled", () => {
  const original = process.env.SELDON_AI_REPLY_MODE
  afterEach(() => {
    if (original === undefined) delete process.env.SELDON_AI_REPLY_MODE
    else process.env.SELDON_AI_REPLY_MODE = original
  })

  it("defaults on, and opts out only for the explicit template mode", () => {
    delete process.env.SELDON_AI_REPLY_MODE
    expect(conversationalRepliesEnabled()).toBe(true)
    process.env.SELDON_AI_REPLY_MODE = "template"
    expect(conversationalRepliesEnabled()).toBe(false)
    // Anything else is not a recognized opt-out and stays on.
    process.env.SELDON_AI_REPLY_MODE = "conversational"
    expect(conversationalRepliesEnabled()).toBe(true)
  })
})

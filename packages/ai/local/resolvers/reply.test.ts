import { afterEach, describe, expect, it } from "vitest"

import {
  buildTemplateReply,
  conversationalRepliesEnabled,
  type StepOutcome,
} from "./reply"

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

describe("conversationalRepliesEnabled", () => {
  const original = process.env.SELDON_AI_REPLY_MODE
  afterEach(() => {
    if (original === undefined) delete process.env.SELDON_AI_REPLY_MODE
    else process.env.SELDON_AI_REPLY_MODE = original
  })

  it("defaults off and opts in via env", () => {
    delete process.env.SELDON_AI_REPLY_MODE
    expect(conversationalRepliesEnabled()).toBe(false)
    process.env.SELDON_AI_REPLY_MODE = "conversational"
    expect(conversationalRepliesEnabled()).toBe(true)
  })
})

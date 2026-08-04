import { describe, expect, it } from "vitest"

import { buildCompletedWorkReplyStage } from "./reply"

describe("buildCompletedWorkReplyStage", () => {
  it("numbers what the editor did", () => {
    const { prompt } = buildCompletedWorkReplyStage({
      completions: [
        { body: "Added a card." },
        { body: "Set color to red on n1." },
      ],
      requestHasUnfinishedSteps: false,
    })
    expect(prompt).toContain("1. Added a card.")
    expect(prompt).toContain("2. Set color to red on n1.")
  })

  it("says the request is unfinished only when the orchestrator says so", () => {
    const completions = [{ body: "Added a card." }]
    const finished = buildCompletedWorkReplyStage({
      completions,
      requestHasUnfinishedSteps: false,
    })
    expect(finished.prompt).not.toContain("did NOT complete")

    const unfinished = buildCompletedWorkReplyStage({
      completions,
      requestHasUnfinishedSteps: true,
    })
    expect(unfinished.prompt).toContain("did NOT complete")
    expect(unfinished.prompt).toContain("never say the request is finished")
  })

  it("clamps a body long enough to be leaked machine context", () => {
    const { prompt } = buildCompletedWorkReplyStage({
      completions: [{ body: "x".repeat(900) }],
      requestHasUnfinishedSteps: false,
    })
    expect(prompt).toContain("[...]")
    expect(prompt).not.toContain("x".repeat(700))
  })
})

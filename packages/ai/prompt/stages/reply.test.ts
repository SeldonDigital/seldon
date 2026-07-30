import { describe, expect, it } from "vitest"

import { buildConversationalReplyStage } from "./reply"

describe("buildConversationalReplyStage", () => {
  it("numbers the outcomes with their status, step, and body", () => {
    const { prompt } = buildConversationalReplyStage({
      outcomes: [
        { status: "DONE", step: "Add a card", body: "Added a card." },
        {
          status: "STOPPED",
          step: "Make its title red",
          body: "No title found.",
        },
      ],
    })
    expect(prompt).toContain("1. [DONE] Add a card -> Added a card.")
    expect(prompt).toContain(
      "2. [STOPPED] Make its title red -> No title found.",
    )
  })
})

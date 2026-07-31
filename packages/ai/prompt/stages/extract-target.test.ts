import { describe, expect, it } from "vitest"

import { buildExtractTargetStage } from "./extract-target"

describe("buildExtractTargetStage", () => {
  it("tells the model when an element is selected", () => {
    const { prompt } = buildExtractTargetStage({
      message: "make it red",
      hasSelection: true,
    })
    expect(prompt).toContain("HAS an element selected")
    expect(prompt).toContain('"make it red"')
  })

  it("tells the model when nothing is selected", () => {
    const { prompt } = buildExtractTargetStage({
      message: "make the title red",
      hasSelection: false,
    })
    expect(prompt).toContain("NOTHING selected")
  })

  it("requires both fields, so a phrase is never discarded", () => {
    const { schema } = buildExtractTargetStage({
      message: "make all the chips red",
      hasSelection: false,
    })
    // The either/or this replaced could answer "selection" and drop the
    // phrase, leaving nothing downstream to search with.
    expect(schema).not.toHaveProperty("oneOf")
    expect(schema.required).toEqual(["pointsAtSelection", "match"])
  })

  it("tells the model a plural phrase is still a name", () => {
    const { prompt } = buildExtractTargetStage({
      message: "make all the chips red",
      hasSelection: false,
    })
    expect(prompt).toContain("plural or quantified phrase is still a name")
  })
})

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
})

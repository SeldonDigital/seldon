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

  it("requires all fields, so a phrase is never discarded", () => {
    const { schema } = buildExtractTargetStage({
      message: "make all the chips red",
      hasSelection: false,
    })
    // The either/or this replaced could answer "selection" and drop the
    // phrase, leaving nothing downstream to search with.
    expect(schema).not.toHaveProperty("oneOf")
    expect(schema.required).toEqual([
      "pointsAtSelection",
      "baseNode",
      "descriptor",
      "plural",
      "count",
    ])
  })

  it("tells the model a property name is never the element", () => {
    const { prompt } = buildExtractTargetStage({
      message: "set the width of all the chips to 100 pixels",
      hasSelection: false,
    })
    // The single-slot version answered "" or "width" here often enough to
    // kill the turn (issue 07).
    expect(prompt).toContain("A property being changed is NEVER the baseNode")
    expect(prompt).toContain('-> baseNode "chips"')
  })

  it("tells the model a commanded value is not a descriptor", () => {
    const { prompt } = buildExtractTargetStage({
      message: "make the last button green",
      hasSelection: false,
    })
    expect(prompt).toContain("A value being commanded is NEVER a descriptor")
  })

  it("tells the model how to name a bounded count", () => {
    const { prompt } = buildExtractTargetStage({
      message: "make the top two texts bold",
      hasSelection: false,
    })
    expect(prompt).toContain("BOUNDED plural reference")
  })

  it("tells the model a plural phrase is still a name", () => {
    const { prompt } = buildExtractTargetStage({
      message: "make all the chips red",
      hasSelection: false,
    })
    expect(prompt).toContain("plural or quantified phrase is still a name")
  })
})

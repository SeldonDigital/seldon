import { describe, expect, it } from "vitest"

import { buildFindNodeEscalateStage, findNodeMissMessage } from "./find-node"

const POOL = [
  { id: "n1", text: "label, position: top left" },
  { id: "n2", text: "title, hero heading" },
]

describe("buildFindNodeEscalateStage", () => {
  it("constrains the id enum to the listed candidates plus none", () => {
    const { prompt, schema } = buildFindNodeEscalateStage({
      query: "the title",
      pool: POOL,
    })
    expect(prompt).toContain('"the title"')
    expect(prompt).toContain("- n1: label, position: top left")
    expect(prompt).toContain("- n2: title, hero heading")
    expect(schema).toMatchObject({
      properties: { id: { enum: ["n1", "n2", "none"] } },
    })
  })
})

describe("findNodeMissMessage", () => {
  it("bullets the descriptions it is given", () => {
    const message = findNodeMissMessage("the title", [
      'the text "Welcome" (row 1)',
      "the heading (row 2)",
    ])
    expect(message).toContain('- the text "Welcome" (row 1)')
    expect(message).toContain("- the heading (row 2)")
    expect(message).toContain("select it on the canvas")
  })

  // The pick prompt lists ids because the model answers with one. This message
  // is read by a person, so an id in it would be debug output.
  it("carries no internal node ids", () => {
    const message = findNodeMissMessage("the title", ["the chip (row 1)"])
    expect(message).not.toContain("component-")
    expect(message).not.toMatch(/\bn1\b/)
  })

  it("lists at most five near misses", () => {
    const manyNearMisses = Array.from(
      { length: 8 },
      (_, index) => `candidate ${index}`,
    )
    const message = findNodeMissMessage("x", manyNearMisses)
    expect(message).toContain("- candidate 4")
    expect(message).not.toContain("- candidate 5")
  })
})

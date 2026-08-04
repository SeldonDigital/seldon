import { describe, expect, it } from "vitest"

import { buildPickTargetStage, buildQuantifierStage } from "./pick-target"

describe("buildQuantifierStage", () => {
  it("constrains the answer to the three coverage words", () => {
    const { prompt, schema } = buildQuantifierStage({
      message: "make all the chips red",
    })
    expect(prompt).toContain('"make all the chips red"')
    expect(schema).toMatchObject({
      properties: { quantifier: { enum: ["only", "all", "all-except"] } },
    })
  })
})

describe("buildPickTargetStage", () => {
  const boardLines = [
    "Variant node-v1 \"Variant 01\":",
    "  - node-v1 [variant chip variant]",
    "    - node-a [element text instance] {content=Assist}   <- SELECTED",
  ]

  it("bounds the answerable ids to the ones the board listed", () => {
    const { schema } = buildPickTargetStage({
      message: "duplicate this",
      boardLines,
      nodeIds: ["node-v1", "node-a"],
      quantifier: "only",
    })
    expect(schema).toMatchObject({
      properties: {
        verdict: { enum: ["found", "ambiguous", "none"] },
        nodeIds: { items: { enum: ["node-v1", "node-a"] } },
      },
    })
  })

  it("renders the board and the selection rules", () => {
    const { prompt } = buildPickTargetStage({
      message: "duplicate this",
      boardLines,
      nodeIds: ["node-v1", "node-a"],
      quantifier: "only",
    })
    expect(prompt).toContain("<- SELECTED")
    expect(prompt).toContain("ignore the selection")
    expect(prompt).toContain("inside the selection")
  })

  it("states the coverage the quantifier decided", () => {
    const everyMatch = buildPickTargetStage({
      message: "make all the chips red",
      boardLines,
      nodeIds: ["node-v1", "node-a"],
      quantifier: "all",
    })
    expect(everyMatch.prompt).toContain("EVERY matching element")

    const namedExceptions = buildPickTargetStage({
      message: "make all the chips red except the first",
      boardLines,
      nodeIds: ["node-v1", "node-a"],
      quantifier: "all-except",
    })
    expect(namedExceptions.prompt).toContain("leave the exceptions out")

    const pointedAtOnly = buildPickTargetStage({
      message: "make the chip red",
      boardLines,
      nodeIds: ["node-v1", "node-a"],
      quantifier: "only",
    })
    expect(pointedAtOnly.prompt).toContain("only what the message points at")
  })
})

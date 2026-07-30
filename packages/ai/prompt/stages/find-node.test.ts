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
  it("renders the same candidate lines as the prompt", () => {
    const { prompt } = buildFindNodeEscalateStage({
      query: "the title",
      pool: POOL,
    })
    const message = findNodeMissMessage("the title", POOL)
    for (const candidate of POOL) {
      const line = `- ${candidate.id}: ${candidate.text}`
      expect(prompt).toContain(line)
      expect(message).toContain(line)
    }
  })

  it("lists at most five near misses", () => {
    const bigPool = Array.from({ length: 8 }, (_, index) => ({
      id: `n${index}`,
      text: `candidate ${index}`,
    }))
    const message = findNodeMissMessage("x", bigPool)
    expect(message).toContain("- n4:")
    expect(message).not.toContain("- n5:")
  })
})

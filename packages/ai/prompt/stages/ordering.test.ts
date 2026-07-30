import { describe, expect, it } from "vitest"

import { buildReorderStage } from "./ordering"

describe("buildReorderStage", () => {
  it("states the current 1-based position among the siblings", () => {
    const { prompt, schema } = buildReorderStage({
      message: "move it up",
      index: 2,
      count: 4,
    })
    expect(prompt).toContain("position 2 of 4")
    expect(prompt).toContain('"move it up"')
    expect(schema).toMatchObject({
      properties: { position: { enum: ["first", "last", "up", "down"] } },
    })
  })
})

import { describe, expect, it } from "vitest"

import { createNodeId } from "./create-node-id"

describe("createNodeId", () => {
  it("returns an 8-character alphanumeric id", () => {
    const id = createNodeId()
    expect(id).toHaveLength(8)
    expect(id).toMatch(/^[0-9a-zA-Z]{8}$/)
  })

  it("returns distinct ids across many calls", () => {
    const ids = new Set(Array.from({ length: 1000 }, () => createNodeId()))
    expect(ids.size).toBe(1000)
  })
})

import { describe, expect, it } from "bun:test"
import { createNodeId } from "./create-node-id"

describe("createNodeId", () => {
  it("should return a string that is 8 characters long", () => {
    const result = createNodeId()

    expect(typeof result).toBe("string")
    expect(result).toHaveLength(8)
  })
})

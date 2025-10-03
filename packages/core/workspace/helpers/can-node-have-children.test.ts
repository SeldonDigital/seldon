import { describe, expect, it } from "bun:test"
import {
  BUTTON_VARIANT,
  FRAME_VARIANT,
  LABEL_CHILD,
} from "../../helpers/fixtures/nodes"
import { canNodeHaveChildren } from "./can-node-have-children"

describe("canNodeHaveChildren", () => {
  it("should return true for a node with children", () => {
    expect(canNodeHaveChildren(BUTTON_VARIANT)).toBe(true)
  })

  it("should return false for a node without children", () => {
    expect(canNodeHaveChildren(LABEL_CHILD)).toBe(false)
  })

  it("should return true for a node with empty children array", () => {
    expect(canNodeHaveChildren(FRAME_VARIANT)).toBe(true)
  })

  it("should return false for null input", () => {
    expect(canNodeHaveChildren(null)).toBe(false)
  })
})

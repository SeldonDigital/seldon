import { describe, expect, it } from "bun:test"
import { isNodeV2 } from "./is-node-v2"

describe("isNodeV2", () => {
  it("should return true for node without fromSchema property", () => {
    const node = {
      id: "test-node",
      component: "button",
      level: "element",
    }

    expect(isNodeV2(node)).toBe(true)
  })

  it("should return false for node with fromSchema property", () => {
    const node = {
      id: "test-node",
      component: "button",
      level: "element",
      fromSchema: true,
    }

    expect(isNodeV2(node)).toBe(false)
  })

  it("should return false for node with fromSchema set to false", () => {
    const node = {
      id: "test-node",
      component: "button",
      level: "element",
      fromSchema: false,
    }

    expect(isNodeV2(node)).toBe(false)
  })

  it("should return true for null/undefined fromSchema", () => {
    const node1 = {
      id: "test-node",
      component: "button",
      level: "element",
      fromSchema: null,
    }

    const node2 = {
      id: "test-node",
      component: "button",
      level: "element",
      fromSchema: undefined,
    }

    expect(isNodeV2(node1)).toBe(false) // null is defined
    expect(isNodeV2(node2)).toBe(true) // undefined is not defined
  })
})

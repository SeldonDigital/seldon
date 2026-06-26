import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../components/constants"
import { Unit, ValueType } from "../../../properties"
import { formatNodeCatalog } from "../../model/template-ref"
import type { EntryNode } from "../../types"
import {
  buildSandboxNode,
  getNextSandboxTop,
  isExplicitSizeValue,
  isSandboxNode,
  resolveSandboxRect,
  sandboxesOverlap,
} from "./sandbox"

describe("buildSandboxNode", () => {
  it("builds a variant node templating from the Sandbox catalog", () => {
    const { id, node } = buildSandboxNode("pg", { top: 10, left: 20 })
    expect(node.type).toBe("variant")
    expect(isSandboxNode(node)).toBe(true)
    expect(id).toContain("playground-pg-")
    expect((node.overrides as any).position.top.value.value).toBe(10)
  })
})

describe("isSandboxNode", () => {
  it("is false for a non-sandbox template", () => {
    const node = {
      template: formatNodeCatalog(ComponentId.BUTTON),
    } as EntryNode
    expect(isSandboxNode(node)).toBe(false)
  })
})

describe("isExplicitSizeValue", () => {
  it("is true only for an exact value", () => {
    expect(isExplicitSizeValue({ type: ValueType.EXACT, value: 1 })).toBe(true)
    expect(isExplicitSizeValue({ type: ValueType.OPTION, value: "fill" })).toBe(
      false,
    )
    expect(isExplicitSizeValue(null)).toBe(false)
  })
})

describe("resolveSandboxRect", () => {
  it("resolves a rectangle from schema defaults and overrides", () => {
    const { node } = buildSandboxNode("pg", { top: 30, left: 40 })
    const rect = resolveSandboxRect(node)
    expect(rect).not.toBeNull()
    expect(rect!.top).toBe(30)
    expect(rect!.left).toBe(40)
    expect(rect!.width).toBeGreaterThan(0)
    expect(rect!.height).toBeGreaterThan(0)
  })
})

describe("getNextSandboxTop", () => {
  it("stacks the next sandbox below the existing one", () => {
    const { id, node } = buildSandboxNode("pg", { top: 0 })
    const rect = resolveSandboxRect(node)!
    const next = getNextSandboxTop([{ id }], { [id]: node })
    expect(next).toBe(rect.height + 40)
  })

  it("is zero with no resolvable sandboxes", () => {
    expect(getNextSandboxTop([], {})).toBe(0)
  })
})

describe("sandboxesOverlap", () => {
  const rect = (top: number, left: number) => ({
    top,
    left,
    width: 100,
    height: 100,
  })

  it("detects overlap and separation", () => {
    expect(sandboxesOverlap(rect(0, 0), rect(50, 50))).toBe(true)
    expect(sandboxesOverlap(rect(0, 0), rect(200, 200))).toBe(false)
    expect(sandboxesOverlap(null, rect(0, 0))).toBe(false)
  })
})

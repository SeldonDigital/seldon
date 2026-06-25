import { describe, expect, it } from "vitest"

import type { EntryNode } from "../../model/entry-node"
import { applyNodeRepeat, getNodeRepeat, isMeaningfulRepeat } from "./node-repeat"

const node = (editor?: Record<string, unknown>) =>
  ({ __editor: editor } as unknown as EntryNode)

describe("getNodeRepeat", () => {
  it("returns undefined when no meaningful repeat is stored", () => {
    expect(getNodeRepeat(node())).toBeUndefined()
    expect(getNodeRepeat(node({ repeat: {} }))).toBeUndefined()
  })

  it("returns a stored repeat", () => {
    expect(getNodeRepeat(node({ repeat: { count: 3 } }))).toEqual({ count: 3 })
  })
})

describe("isMeaningfulRepeat", () => {
  it("treats count > 1 as meaningful", () => {
    expect(isMeaningfulRepeat({ count: 3 })).toBe(true)
    expect(isMeaningfulRepeat({ count: 1 })).toBe(false)
    expect(isMeaningfulRepeat(undefined)).toBe(false)
  })

  it("treats non-empty data slots as meaningful", () => {
    expect(isMeaningfulRepeat({ data: { x: ["a"] } })).toBe(true)
    expect(isMeaningfulRepeat({ data: { x: [""] } })).toBe(false)
  })
})

describe("applyNodeRepeat", () => {
  it("writes a meaningful repeat and clears a non-meaningful one", () => {
    const n = node()
    applyNodeRepeat(n, { count: 3 })
    expect(n.__editor?.repeat).toEqual({ count: 3 })

    applyNodeRepeat(n, undefined)
    expect(n.__editor?.repeat).toBeUndefined()
  })

  it("preserves other editor keys when clearing", () => {
    const n = node({ other: 1, repeat: { count: 3 } })
    applyNodeRepeat(n, { count: 1 })
    expect(n.__editor?.repeat).toBeUndefined()
    expect(n.__editor?.other).toBe(1)
  })
})

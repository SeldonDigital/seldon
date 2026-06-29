import { describe, expect, it } from "vitest"

import {
  NORMAL_STATE,
  RESERVED_STATE_EXPRESSION,
  RESERVED_STATE_GROUPS,
  RESERVED_STATE_NAMES,
  isReservedStateName,
} from "./node-state"

describe("isReservedStateName", () => {
  it("accepts reserved names", () => {
    expect(isReservedStateName("hover")).toBe(true)
    expect(isReservedStateName("disabled")).toBe(true)
  })

  it("rejects normal and custom names", () => {
    expect(isReservedStateName(NORMAL_STATE)).toBe(false)
    expect(isReservedStateName("myCustomState")).toBe(false)
  })
})

describe("RESERVED_STATE_NAMES", () => {
  it("lists the nine reserved names", () => {
    expect(RESERVED_STATE_NAMES).toHaveLength(9)
    expect(RESERVED_STATE_NAMES).toContain("hover")
    expect(RESERVED_STATE_NAMES).toContain("checked")
    expect(RESERVED_STATE_NAMES).toContain("activated")
  })
})

describe("RESERVED_STATE_GROUPS", () => {
  it("clusters by expression kind in pseudo, aria, class order", () => {
    expect(RESERVED_STATE_GROUPS.map((group) => group.expression)).toEqual([
      "pseudo",
      "aria",
      "class",
    ])
  })

  it("alpha-sorts the class cluster with activated before dragged", () => {
    const classGroup = RESERVED_STATE_GROUPS.find(
      (group) => group.expression === "class",
    )
    expect(classGroup?.states).toEqual(["activated", "dragged"])
  })

  it("covers every reserved name exactly once", () => {
    const grouped = RESERVED_STATE_GROUPS.flatMap((group) => group.states)
    expect(grouped).toHaveLength(RESERVED_STATE_NAMES.length)
    expect(new Set(grouped).size).toBe(RESERVED_STATE_NAMES.length)
  })

  it("assigns every reserved name an expression kind", () => {
    for (const name of RESERVED_STATE_NAMES) {
      expect(RESERVED_STATE_EXPRESSION[name]).toBeDefined()
    }
  })
})

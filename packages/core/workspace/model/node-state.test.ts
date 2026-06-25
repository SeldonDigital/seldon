import { describe, expect, it } from "vitest"

import {
  NORMAL_STATE,
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
  it("lists the eight reserved names", () => {
    expect(RESERVED_STATE_NAMES).toHaveLength(8)
    expect(RESERVED_STATE_NAMES).toContain("hover")
    expect(RESERVED_STATE_NAMES).toContain("checked")
  })
})

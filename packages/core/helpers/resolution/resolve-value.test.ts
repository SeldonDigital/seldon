import { describe, expect, it } from "vitest"

import { ValueType } from "../../properties/constants"
import type { Value } from "../../properties/types/value"
import { resolveValue } from "./resolve-value"

const asValue = (value: unknown): Value => value as Value

describe("resolveValue", () => {
  it("returns undefined for missing or empty values", () => {
    expect(resolveValue(undefined)).toBeUndefined()
    expect(
      resolveValue(asValue({ type: ValueType.EMPTY, value: null })),
    ).toBeUndefined()
  })

  it("returns the value when it is not empty", () => {
    const value = asValue({ type: ValueType.EXACT, value: 5 })
    expect(resolveValue(value)).toBe(value)
  })
})

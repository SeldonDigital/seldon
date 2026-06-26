import { describe, expect, it } from "vitest"

import { ValueType } from "../../../properties/constants"
import type { Value } from "../../../properties/types/value"
import { isCompoundValue } from "./is-compound-value"

const asValue = (value: unknown): Value => value as Value

describe("isCompoundValue", () => {
  it("accepts objects without type or value keys", () => {
    expect(
      isCompoundValue(
        asValue({ color: { type: ValueType.EXACT, value: "#fff" } }),
      ),
    ).toBe(true)
  })

  it("rejects atomic values that carry type and value", () => {
    expect(
      isCompoundValue(asValue({ type: ValueType.EXACT, value: "#fff" })),
    ).toBe(false)
  })
})

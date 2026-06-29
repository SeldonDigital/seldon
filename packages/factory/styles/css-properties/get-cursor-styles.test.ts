import { Properties, ValueType } from "@seldon/core"
import { describe, expect, it } from "vitest"

import { getCursorStyles } from "./get-cursor-styles"

describe("getCursorStyles", () => {
  it("emits the cursor value for an option value", () => {
    expect(
      getCursorStyles({
        properties: {
          cursor: { type: ValueType.OPTION, value: "pointer" },
        } as unknown as Properties,
      }),
    ).toEqual({ cursor: "pointer" })
  })

  it("returns no styles when cursor is unset", () => {
    expect(
      getCursorStyles({ properties: {} as unknown as Properties }),
    ).toEqual({})
  })

  it("returns no styles when cursor is empty", () => {
    expect(
      getCursorStyles({
        properties: {
          cursor: { type: ValueType.EMPTY, value: null },
        } as unknown as Properties,
      }),
    ).toEqual({})
  })

  it("throws for an unsupported cursor value type", () => {
    expect(() =>
      getCursorStyles({
        properties: {
          cursor: { type: ValueType.EXACT, value: "pointer" },
        } as unknown as Properties,
      }),
    ).toThrow(/Unknown cursor type/)
  })
})

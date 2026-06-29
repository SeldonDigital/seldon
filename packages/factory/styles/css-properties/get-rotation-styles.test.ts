import { Properties, Unit, ValueType } from "@seldon/core"
import { describe, expect, it } from "vitest"

import { getRotationStyles } from "./get-rotation-styles"

describe("getRotationStyles", () => {
  it("emits a rotate transform for an exact degrees value", () => {
    expect(
      getRotationStyles({
        properties: {
          rotation: {
            type: ValueType.EXACT,
            value: { unit: Unit.DEGREES, value: 90 },
          },
        } as unknown as Properties,
      }),
    ).toEqual({ transform: "rotate(90deg)" })
  })

  it("returns no styles when rotation is not exact", () => {
    expect(
      getRotationStyles({
        properties: {
          rotation: { type: ValueType.EMPTY, value: null },
        } as unknown as Properties,
      }),
    ).toEqual({})
  })

  it("returns no styles when rotation is unset", () => {
    expect(
      getRotationStyles({ properties: {} as unknown as Properties }),
    ).toEqual({})
  })
})

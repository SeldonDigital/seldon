import { describe, expect, it } from "bun:test"
import { ValueType } from "@seldon/core"
import type { Properties } from "@seldon/core"
import { getLayeredPaintLayer } from "./get-layered-paint-layer"

describe("getLayeredPaintLayer", () => {
  it("reads layer 0 from a layered paint array", () => {
    const properties = {
      background: [
        {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.white",
          },
        },
      ],
    } as Properties

    expect(getLayeredPaintLayer(properties, "background")).toEqual(
      properties.background[0],
    )
  })

  it("reads a legacy single-object layered paint shape", () => {
    const layer = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
    }
    const properties = {
      background: layer,
    } as unknown as Properties

    expect(getLayeredPaintLayer(properties, "background")).toEqual(layer)
  })
})

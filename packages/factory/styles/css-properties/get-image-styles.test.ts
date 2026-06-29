import { describe, expect, it } from "vitest"

import { ImageFit, Properties, ValueType } from "@seldon/core"

import { getImageStyles } from "./get-image-styles"

const source = { type: ValueType.EXACT, value: "/image.jpg" }

describe("getImageStyles", () => {
  it("maps the image fit to object-fit when a source is set", () => {
    const properties = {
      source,
      imageFit: { type: ValueType.OPTION, value: ImageFit.CONTAIN },
    } as unknown as Properties
    expect(getImageStyles({ properties })).toEqual({ objectFit: "contain" })
  })

  it("defaults to cover when no image fit is set", () => {
    const properties = { source } as unknown as Properties
    expect(getImageStyles({ properties })).toEqual({ objectFit: "cover" })
  })

  it("returns no styles without a source", () => {
    const properties = {
      imageFit: { type: ValueType.OPTION, value: ImageFit.COVER },
    } as unknown as Properties
    expect(getImageStyles({ properties })).toEqual({})
  })
})

import { describe, expect, it } from "vitest"

import { RGBObjectToString } from "./rgb-object-to-string"

describe("RGBObjectToString", () => {
  it("omits opacity when full or null", () => {
    expect(RGBObjectToString({ red: 255, green: 0, blue: 0 })).toBe(
      "rgb(255 0 0)",
    )
    expect(RGBObjectToString({ red: 255, green: 0, blue: 0 }, null)).toBe(
      "rgb(255 0 0)",
    )
  })

  it("appends an opacity percentage when below full", () => {
    expect(RGBObjectToString({ red: 255, green: 0, blue: 0 }, 80)).toBe(
      "rgb(255 0 0 / 80%)",
    )
  })
})

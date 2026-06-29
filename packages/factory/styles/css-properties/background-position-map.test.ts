import { describe, expect, it } from "vitest"

import { BackgroundPosition } from "@seldon/core"

import { backgroundPositionMap } from "./background-position-map"

describe("backgroundPositionMap", () => {
  it("maps each background position to its CSS keyword", () => {
    expect(backgroundPositionMap).toEqual({
      [BackgroundPosition.DEFAULT]: "auto",
      [BackgroundPosition.TOP_LEFT]: "top left",
      [BackgroundPosition.TOP_CENTER]: "top center",
      [BackgroundPosition.TOP_RIGHT]: "top right",
      [BackgroundPosition.CENTER_LEFT]: "left center",
      [BackgroundPosition.CENTER]: "center",
      [BackgroundPosition.CENTER_RIGHT]: "right center",
      [BackgroundPosition.BOTTOM_LEFT]: "left bottom",
      [BackgroundPosition.BOTTOM_CENTER]: "center bottom",
      [BackgroundPosition.BOTTOM_RIGHT]: "right bottom",
    })
  })

  it("covers every BackgroundPosition enum member", () => {
    for (const value of Object.values(BackgroundPosition)) {
      expect(backgroundPositionMap[value]).toBeDefined()
    }
  })
})

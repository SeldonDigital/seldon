import { describe, expect, it } from "vitest"

import { ImageFit } from "@seldon/core"

import { backgroundSizeMap, objectFitMap } from "./image-fit-map"

describe("objectFitMap", () => {
  it("maps each image fit to its object-fit value", () => {
    expect(objectFitMap).toEqual({
      original: "none",
      contain: "contain",
      cover: "cover",
      stretch: "fill",
    })
  })

  it("covers every ImageFit enum member", () => {
    for (const value of Object.values(ImageFit)) {
      expect(objectFitMap[value]).toBeDefined()
    }
  })
})

describe("backgroundSizeMap", () => {
  it("maps each image fit to its background-size value", () => {
    expect(backgroundSizeMap).toEqual({
      original: "auto",
      contain: "contain",
      cover: "cover",
      stretch: "100% 100%",
    })
  })

  it("covers every ImageFit enum member", () => {
    for (const value of Object.values(ImageFit)) {
      expect(backgroundSizeMap[value]).toBeDefined()
    }
  })
})

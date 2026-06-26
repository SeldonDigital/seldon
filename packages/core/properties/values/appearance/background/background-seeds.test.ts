import { describe, expect, it } from "vitest"

import { ValueType } from "../../../constants"
import {
  BACKGROUND_KIND_SEEDS,
  backgroundLayerForKind,
} from "./background-seeds"
import { BackgroundKind } from "./background-kind"

describe("BACKGROUND_KIND_SEEDS", () => {
  it("seeds every background kind", () => {
    expect(Object.keys(BACKGROUND_KIND_SEEDS).sort()).toEqual(
      ["color", "gradient", "image", "none"].sort(),
    )
    expect(BACKGROUND_KIND_SEEDS[BackgroundKind.COLOR].color).toBeDefined()
    expect(BACKGROUND_KIND_SEEDS[BackgroundKind.GRADIENT].preset).toBeDefined()
    expect(BACKGROUND_KIND_SEEDS[BackgroundKind.IMAGE].image).toBeDefined()
  })
})

describe("backgroundLayerForKind", () => {
  it("returns the seed layer for each kind", () => {
    expect(backgroundLayerForKind("none").kind).toEqual({
      type: ValueType.OPTION,
      value: BackgroundKind.NONE,
    })
    expect(backgroundLayerForKind("color")?.color).toBeDefined()
  })

  it("returns an inherit layer for the inherit value", () => {
    expect(backgroundLayerForKind("inherit")).toEqual({
      kind: { type: ValueType.INHERIT, value: null },
    })
  })

  it("returns null for an unknown value", () => {
    expect(backgroundLayerForKind("default")).toBeNull()
    expect(backgroundLayerForKind("bogus")).toBeNull()
  })
})

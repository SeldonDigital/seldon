import { describe, expect, it } from "bun:test"
import { Unit, ValueType } from "@seldon/core"
import { Display } from "@seldon/core/properties/values/layout/display"
import { Orientation } from "@seldon/core/properties/values/layout/orientation"
import { Scroll } from "@seldon/core/properties/values/effects/scroll"
import { getComponentPropertyDefaults } from "./get-component-property-defaults"

describe("getComponentPropertyDefaults", () => {
  it("returns ipad chrome for component boards by default", () => {
    const defaults = getComponentPropertyDefaults({
      type: "component",
    })

    expect(defaults.background).toEqual([
      expect.objectContaining({
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
      }),
    ])
    expect(defaults.padding?.top).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@padding.comfortable",
    })
    expect(defaults.gap).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@gap.comfortable",
    })
    expect(defaults.orientation).toEqual({
      type: ValueType.OPTION,
      value: Orientation.VERTICAL,
    })
    expect(defaults.screenWidth).toEqual({
      type: ValueType.EXACT,
      value: { value: 820, unit: Unit.PX },
    })
    expect(defaults.width).toBeUndefined()
    expect(defaults.height).toBeUndefined()
    expect(defaults.scroll).toEqual({
      type: ValueType.OPTION,
      value: Scroll.VERTICAL,
    })
  })

  it("returns iphone chrome when boardChromeId is iphone", () => {
    const defaults = getComponentPropertyDefaults({
      type: "component",
      boardChromeId: "iphone",
    })

    expect(defaults.screenWidth).toEqual({
      type: ValueType.EXACT,
      value: { value: 390, unit: Unit.PX },
    })
    expect(defaults.screenHeight).toEqual({
      type: ValueType.EXACT,
      value: { value: 844, unit: Unit.PX },
    })
  })

  it("returns display exclude for playground boards", () => {
    const defaults = getComponentPropertyDefaults({ type: "playground" })

    expect(defaults.display).toEqual({
      type: ValueType.OPTION,
      value: Display.EXCLUDE,
    })
    expect(defaults.padding?.top).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@padding.comfortable",
    })
  })

  it("merges icon-set overrides with screen-like chrome", () => {
    const defaults = getComponentPropertyDefaults({ type: "icon-set" })

    expect(defaults.screenWidth).toEqual({
      type: ValueType.EXACT,
      value: { value: 820, unit: Unit.PX },
    })
    expect(defaults.orientation).toEqual({
      type: ValueType.OPTION,
      value: Orientation.VERTICAL,
    })
    expect(defaults.background).toEqual([
      expect.objectContaining({
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
      }),
    ])
  })

  it("returns screen-like chrome for theme boards", () => {
    const defaults = getComponentPropertyDefaults({ type: "theme" })

    expect(defaults.background).toEqual([
      expect.objectContaining({
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
      }),
    ])
  })
})

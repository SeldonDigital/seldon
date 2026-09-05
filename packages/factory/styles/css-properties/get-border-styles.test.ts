import { describe, expect, it } from "vitest"

import { Unit, ValueType } from "@seldon/core"
import { defaultTheme } from "@seldon/core/themes"

import { getBorderStyles } from "./get-border-styles"

import type { StyleGenerationContext } from "../types"
import type { Properties } from "@seldon/core"

const context = (properties: Properties): StyleGenerationContext => ({
  properties,
  parentContext: null,
  theme: defaultTheme,
})

describe("getBorderStyles", () => {
  it("emits width, style, and color for a single side compound", () => {
    const properties = {
      borderTop: {
        width: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 2 } },
        style: { type: ValueType.OPTION, value: "solid" },
        color: { type: ValueType.EXACT, value: "#123456" },
      },
    } as unknown as Properties

    expect(getBorderStyles(context(properties))).toEqual({
      borderTopWidth: "2px",
      borderTopStyle: "solid",
      borderTopColor: "#123456",
    })
  })

  it("applies the border shorthand to every side", () => {
    const properties = {
      border: {
        width: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 1 } },
        style: { type: ValueType.OPTION, value: "dashed" },
      },
    } as unknown as Properties

    expect(getBorderStyles(context(properties))).toEqual({
      borderTopWidth: "1px",
      borderTopStyle: "dashed",
      borderRightWidth: "1px",
      borderRightStyle: "dashed",
      borderBottomWidth: "1px",
      borderBottomStyle: "dashed",
      borderLeftWidth: "1px",
      borderLeftStyle: "dashed",
    })
  })

  it("returns no styles when no border is set", () => {
    expect(getBorderStyles(context({} as unknown as Properties))).toEqual({})
  })

  it("emits a side look when border is the cleared none look", () => {
    const properties = {
      border: {
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@border.none" },
      },
      borderLeft: {
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@border.hairline" },
      },
    } as unknown as Properties

    const styles = getBorderStyles(context(properties))

    expect(styles.borderLeftWidth).toBe("var(--hairline)")
    expect(styles.borderLeftStyle).toBe("solid")
    expect(styles.borderLeftColor).toBeDefined()
    expect(styles.borderTopWidth).toBeUndefined()
    expect(styles.borderRightWidth).toBeUndefined()
    expect(styles.borderBottomWidth).toBeUndefined()
  })
})

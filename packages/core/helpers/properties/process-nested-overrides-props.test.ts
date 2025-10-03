import { describe, expect, it } from "bun:test"
import { Properties, ValueType } from "../../index"
import { BorderStyle } from "../../properties/constants/border-styles"
import { Unit } from "../../properties/constants/units"
import { processNestedOverridesProps } from "./process-nested-overrides-props"

describe("processNestedOverridesProps", () => {
  it("should return properties unchanged when no nestedOverrides is provided", () => {
    const properties: Properties = {
      color: { type: ValueType.EXACT, value: "#ff0000" },
      buttonSize: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
    }

    const result = processNestedOverridesProps(properties)

    expect(result).toEqual(properties)
  })

  it("should return properties unchanged when no componentId is provided", () => {
    const properties: Properties = {
      color: { type: ValueType.EXACT, value: "#ff0000" },
      buttonSize: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
    }

    const nestedOverrides = {
      title: {
        color: "#0000ff",
      },
    }

    const result = processNestedOverridesProps(properties, nestedOverrides)

    expect(result).toEqual(properties)
  })

  it("should override properties using component-prefixed keys", () => {
    const properties: Properties = {
      content: { type: ValueType.EXACT, value: "Default Title" },
      font: {
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
      },
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
    }

    const nestedOverrides = {
      title: {
        content: "Custom Title",
        fontSize: "@fontSize.large",
        color: "@swatch.primary",
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.content?.value).toBe("Custom Title")
    expect(result.font?.size?.value).toBe("@fontSize.large")
    expect(result.color?.value).toBe("@swatch.primary")
    expect(result.font?.size?.type).toBe(ValueType.THEME_ORDINAL)
    expect(result.color?.type).toBe(ValueType.THEME_CATEGORICAL)
  })

  it("should not override properties when componentId doesn't match", () => {
    const properties: Properties = {
      content: { type: ValueType.EXACT, value: "Default Title" },
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
    }

    const nestedOverrides = {
      subtitle: {
        content: "Custom Subtitle",
        color: "@swatch.primary",
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.content?.value).toBe("Default Title")
    expect(result.color?.value).toBe("@swatch.black")
  })

  it("should handle nested properties correctly", () => {
    const properties: Properties = {
      font: {
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.bold" },
      },
    }

    const nestedOverrides = {
      title: {
        fontSize: "@fontSize.large",
        fontWeight: "@fontWeight.normal",
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.font?.size?.value).toBe("@fontSize.large")
    expect(result.font?.weight?.value).toBe("@fontWeight.normal")
  })

  it("should preserve non-string values", () => {
    const properties: Properties = {
      ariaHidden: { type: ValueType.EXACT, value: true },
    }

    const nestedOverrides = { title: { someKey: "value" } }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.ariaHidden?.value).toEqual(true)
  })

  it("should keep properties when nestedOverrides is empty", () => {
    const properties: Properties = {
      color: { type: ValueType.EXACT, value: "#000000" },
    }

    const nestedOverrides = {}

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.color).toEqual(properties.color)
  })

  it("should handle dot notation to camelCase conversion", () => {
    const properties: Properties = {
      font: {
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
      },
    }

    const nestedOverrides = {
      title: {
        fontSize: "@fontSize.large",
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.font?.size?.value).toBe("@fontSize.large")
  })

  it("should handle theme values with proper type detection", () => {
    const properties: Properties = {
      color: { type: ValueType.EXACT, value: "#000000" },
    }

    const nestedOverrides = {
      title: {
        color: "@swatch.primary",
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.color?.value).toBe("@swatch.primary")
    expect(result.color?.type).toBe(ValueType.THEME_CATEGORICAL)
  })

  it("should handle non-theme values with EXACT type", () => {
    const properties: Properties = {
      content: { type: ValueType.EXACT, value: "default" },
    }

    const nestedOverrides = {
      title: {
        content: "custom content",
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.content?.value).toBe("custom content")
    expect(result.content?.type).toBe(ValueType.EXACT)
  })

  it("should handle complex values with unit and value properties", () => {
    const properties: Properties = {
      border: {
        width: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 1 } },
        style: { type: ValueType.PRESET, value: BorderStyle.SOLID },
      },
    }

    const nestedOverrides = {
      title: {
        borderWidth: { unit: Unit.PX, value: 2 },
        borderStyle: BorderStyle.DASHED,
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.border?.width?.value).toEqual({ unit: Unit.PX, value: 2 })
    expect(result.border?.style?.value).toBe(BorderStyle.DASHED)
  })

  it("should handle deeply nested properties", () => {
    const properties: Properties = {
      content: { type: ValueType.EXACT, value: "Default Title" },
      font: {
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
        weight: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontWeight.normal",
        },
      },
    }

    const nestedOverrides = {
      title: {
        content: "Custom Title",
        fontSize: "@fontSize.large",
        fontWeight: "@fontWeight.bold",
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.content?.value).toBe("Custom Title")
    expect(result.font?.size?.value).toBe("@fontSize.large")
    expect(result.font?.weight?.value).toBe("@fontWeight.bold")
  })

  it("should handle boolean values", () => {
    const properties: Properties = {
      ariaHidden: { type: ValueType.EXACT, value: false },
    }

    const nestedOverrides = {
      title: {
        ariaHidden: true,
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.ariaHidden?.value).toBe(true)
    expect(result.ariaHidden?.type).toBe(ValueType.EXACT)
  })

  it("should handle number values", () => {
    const properties: Properties = {
      opacity: {
        type: ValueType.EXACT,
        value: { unit: Unit.PERCENT, value: 0 },
      },
    }

    const nestedOverrides = {
      title: {
        opacity: { unit: Unit.PERCENT, value: 50 },
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.opacity?.value).toEqual({ unit: Unit.PERCENT, value: 50 })
    expect(result.opacity?.type).toBe(ValueType.EXACT)
  })

  it("should handle null and undefined values", () => {
    const properties: Properties = {
      content: { type: ValueType.EXACT, value: "default" },
    }

    const nestedOverrides = {
      title: {
        content: null,
      },
    }

    const result = processNestedOverridesProps(
      properties,
      nestedOverrides,
      "title",
    )

    expect(result.content?.value).toBe(null)
    expect(result.content?.type).toBe(ValueType.EXACT)
  })
})

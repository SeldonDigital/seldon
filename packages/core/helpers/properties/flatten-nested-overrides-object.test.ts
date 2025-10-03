import { describe, expect, it } from "bun:test"
import { flattenNestedOverridesObject } from "./flatten-nested-overrides-object"

describe("flattenNestedOverridesObject", () => {
  it("should flatten simple nested objects", () => {
    const input = {
      icon: { symbol: "material-add" },
      label: { content: "Add" },
    }

    const result = flattenNestedOverridesObject(input)

    expect(result).toEqual({
      "icon.symbol": "material-add",
      "label.content": "Add",
    })
  })

  it("should flatten deeply nested objects", () => {
    const input = {
      title: {
        content: "Custom Title",
        font: {
          size: "@fontSize.large",
          weight: "@fontWeight.bold",
        },
        border: {
          width: "2px",
          style: "dashed",
        },
      },
    }

    const result = flattenNestedOverridesObject(input)

    expect(result).toEqual({
      "title.content": "Custom Title",
      "title.font.size": "@fontSize.large",
      "title.font.weight": "@fontWeight.bold",
      "title.border.width": "2px",
      "title.border.style": "dashed",
    })
  })

  it("should handle empty objects", () => {
    const input = {}

    const result = flattenNestedOverridesObject(input)

    expect(result).toEqual({})
  })

  it("should preserve complex values with unit and value properties", () => {
    const input = {
      size: { unit: "rem", value: 2 },
      config: {
        margin: { unit: "px", value: 16 },
      },
    }

    const result = flattenNestedOverridesObject(input)

    expect(result).toEqual({
      size: { unit: "rem", value: 2 },
      "config.margin": { unit: "px", value: 16 },
    })
  })

  it("should handle null and undefined values", () => {
    const input = {
      title: {
        content: "Custom Title",
        subtitle: null,
        description: undefined,
      },
    }

    const result = flattenNestedOverridesObject(input)

    expect(result).toEqual({
      "title.content": "Custom Title",
      "title.subtitle": null,
      "title.description": undefined,
    })
  })

  it("should handle primitive values", () => {
    const input = {
      title: {
        content: "Custom Title",
        count: 5,
        isVisible: true,
      },
    }

    const result = flattenNestedOverridesObject(input)

    expect(result).toEqual({
      "title.content": "Custom Title",
      "title.count": 5,
      "title.isVisible": true,
    })
  })

  it("should throw error for flat dot notation syntax", () => {
    const input = {
      "icon.symbol": "material-add",
      "label.content": "Add",
    }

    expect(() => flattenNestedOverridesObject(input)).toThrow(
      "Flat dot notation syntax is not supported. Use nested object syntax instead.\n" +
        '❌ Invalid: { "icon.symbol": "material-add" }\n' +
        '✅ Valid: { icon: { symbol: "material-add" } }',
    )
  })

  it("should throw error for mixed flat and nested syntax", () => {
    const input = {
      icon: { symbol: "material-add" },
      "label.content": "Add",
    }

    expect(() => flattenNestedOverridesObject(input)).toThrow(
      "Flat dot notation syntax is not supported. Use nested object syntax instead.\n" +
        '❌ Invalid: { "icon.symbol": "material-add" }\n' +
        '✅ Valid: { icon: { symbol: "material-add" } }',
    )
  })

  it("should not throw error for nested objects with dot notation in values", () => {
    const input = {
      title: {
        content: "Custom Title",
        className: "my-class.with-dots",
      },
    }

    const result = flattenNestedOverridesObject(input)

    expect(result).toEqual({
      "title.content": "Custom Title",
      "title.className": "my-class.with-dots",
    })
  })

  it("should handle objects with extra properties as nested objects", () => {
    const input = {
      config: {
        size: { unit: "rem", value: 2, extra: "property" },
      },
    }

    const result = flattenNestedOverridesObject(input)

    expect(result).toEqual({
      "config.size.unit": "rem",
      "config.size.value": 2,
      "config.size.extra": "property",
    })
  })

  it("should handle nested objects with only unit property", () => {
    const input = {
      config: {
        size: { unit: "rem" },
      },
    }

    const result = flattenNestedOverridesObject(input)

    expect(result).toEqual({
      "config.size.unit": "rem",
    })
  })

  it("should handle nested objects with only value property", () => {
    const input = {
      config: {
        size: { value: 2 },
      },
    }

    const result = flattenNestedOverridesObject(input)

    expect(result).toEqual({
      "config.size.value": 2,
    })
  })
})

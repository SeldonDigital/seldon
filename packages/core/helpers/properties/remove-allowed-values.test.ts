import { describe, expect, it } from "bun:test"
import { Properties, ValueType } from "../../index"
import { BorderStyle } from "../../properties/constants/border-styles"
import { removeAllowedValuesFromProperties } from "./remove-allowed-values"

describe("removeAllowedValuesFromProperties", () => {
  it("should remove allowedValues from simple properties", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
        restrictions: {
          allowedValues: ["@swatch.primary", "@swatch.swatch1"],
        },
      },
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
          restrictions: {
            allowedValues: [
              "@fontSize.small",
              "@fontSize.medium",
              "@fontSize.large",
            ],
          },
        },
      },
    }

    const result = removeAllowedValuesFromProperties(properties)

    expect(result.color).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    })
    expect(result.font.size).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    })
  })

  it("should remove allowedValues from compound properties", () => {
    const properties: Properties = {
      font: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.primary",
          restrictions: {
            allowedValues: ["@fontFamily.primary", "@fontFamily.secondary"],
          },
        },
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
          restrictions: {
            allowedValues: [
              "@fontSize.small",
              "@fontSize.medium",
              "@fontSize.large",
            ],
          },
        },
      },
    }

    const result = removeAllowedValuesFromProperties(properties)

    expect(result.font.family).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@fontFamily.primary",
    })
    expect(result.font.size).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    })
  })

  it("should handle properties without allowedValues", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
        },
      },
    }

    const result = removeAllowedValuesFromProperties(properties)

    expect(result).toEqual(properties)
  })

  it("should handle empty properties object", () => {
    const properties: Properties = {}

    const result = removeAllowedValuesFromProperties(properties)

    expect(result).toEqual({})
  })

  it("should handle deeply nested compound properties", () => {
    const properties: Properties = {
      background: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
          restrictions: {
            allowedValues: ["@swatch.white", "@swatch.gray"],
          },
        },
        image: {
          type: ValueType.EMPTY,
          value: null,
        },
      },
      border: {
        style: {
          type: ValueType.PRESET,
          value: BorderStyle.SOLID,
          restrictions: {
            allowedValues: [BorderStyle.SOLID, BorderStyle.DASHED],
          },
        },
      },
    }

    const result = removeAllowedValuesFromProperties(properties)

    expect(result.background.color).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.white",
    })
    expect(result.background.image).toEqual({
      type: ValueType.EMPTY,
      value: null,
    })
    expect(result.border.style).toEqual({
      type: ValueType.PRESET,
      value: BorderStyle.SOLID,
    })
  })

  it("should handle mixed properties with and without allowedValues", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
        restrictions: {
          allowedValues: ["@swatch.primary", "@swatch.swatch1"],
        },
      },
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
        },
      },
    }

    const result = removeAllowedValuesFromProperties(properties)

    expect(result.color).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    })
    expect(result.font.size).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    })
  })

  it("should handle allowedValues with theme values", () => {
    const properties: Properties = {
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.large",
          restrictions: {
            allowedValues: [
              "@fontSize.small",
              "@fontSize.medium",
              "@fontSize.large",
            ],
          },
        },
      },
    }

    const result = removeAllowedValuesFromProperties(properties)

    expect(result.font.size).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.large",
    })
  })

  it("should handle allowedValues with preset values", () => {
    const properties: Properties = {
      border: {
        style: {
          type: ValueType.PRESET,
          value: BorderStyle.DASHED,
          restrictions: {
            allowedValues: [
              BorderStyle.SOLID,
              BorderStyle.DASHED,
              BorderStyle.DOTTED,
            ],
          },
        },
      },
    }

    const result = removeAllowedValuesFromProperties(properties)

    expect(result.border.style).toEqual({
      type: ValueType.PRESET,
      value: BorderStyle.DASHED,
    })
  })

  it("should handle old structure with allowedValues as direct property", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
        allowedValues: ["@swatch.primary", "@swatch.swatch1"],
      } as unknown as Properties["color"],
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
          allowedValues: [
            "@fontSize.small",
            "@fontSize.medium",
            "@fontSize.large",
          ],
        } as unknown as Properties["font"]["size"],
      },
    }

    const result = removeAllowedValuesFromProperties(properties)

    expect(result.color).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    })
    expect(result.font.size).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    })
  })

  it("should handle mixed old and new structures", () => {
    const properties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
        allowedValues: ["@swatch.primary", "@swatch.swatch1"], // Old structure
      } as unknown as Properties["color"],
      font: {
        size: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontSize.medium",
          restrictions: {
            allowedValues: [
              "@fontSize.small",
              "@fontSize.medium",
              "@fontSize.large",
            ],
          }, // New structure
        },
      },
    }

    const result = removeAllowedValuesFromProperties(properties)

    expect(result.color).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@swatch.primary",
    })
    expect(result.font.size).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    })
  })
})

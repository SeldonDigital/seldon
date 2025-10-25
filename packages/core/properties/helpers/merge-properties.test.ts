import { describe, expect, it } from "bun:test"
import { Properties, ValueType } from "../../index"
import { mergeProperties } from "./merge-properties"

describe("mergeProperties", () => {
  it("should merge properties correctly", () => {
    const testCases = [
      {
        name: "basic property merging",
        props1: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          size: {
            type: ValueType.THEME_ORDINAL,
            value: "@size.large",
          },
        } as Properties,
        props2: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.black",
          },
        } as Properties,
        expected: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.black",
          },
          size: {
            type: ValueType.THEME_ORDINAL,
            value: "@size.large",
          },
        } as Properties,
      },
      {
        name: "compound property merging with mergeSubProperties true",
        props1: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          font: {
            preset: {
              type: ValueType.THEME_CATEGORICAL,
              value: "@font.label",
            },
            family: {
              type: ValueType.EMPTY,
              value: null,
            },
            size: {
              type: ValueType.THEME_ORDINAL,
              value: "@fontSize.medium",
            },
            weight: {
              type: ValueType.EMPTY,
              value: null,
            },
            lineHeight: {
              type: ValueType.EMPTY,
              value: null,
            },
          },
        } as Properties,
        props2: {
          font: {
            size: {
              type: ValueType.THEME_ORDINAL,
              value: "@fontSize.large",
            },
          },
        } as Properties,
        expected: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          font: {
            preset: {
              type: ValueType.THEME_CATEGORICAL,
              value: "@font.label",
            },
            family: {
              type: ValueType.EMPTY,
              value: null,
            },
            size: {
              type: ValueType.THEME_ORDINAL,
              value: "@fontSize.large",
            },
            weight: {
              type: ValueType.EMPTY,
              value: null,
            },
            lineHeight: {
              type: ValueType.EMPTY,
              value: null,
            },
          },
        } as Properties,
      },
      {
        name: "compound property merging with mergeSubProperties false",
        props1: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          font: {
            preset: {
              type: ValueType.THEME_CATEGORICAL,
              value: "@font.label",
            },
            family: {
              type: ValueType.EMPTY,
              value: null,
            },
            size: {
              type: ValueType.THEME_ORDINAL,
              value: "@fontSize.medium",
            },
            weight: {
              type: ValueType.EMPTY,
              value: null,
            },
            lineHeight: {
              type: ValueType.EMPTY,
              value: null,
            },
          },
        } as Properties,
        props2: {
          font: {
            size: {
              type: ValueType.THEME_ORDINAL,
              value: "@fontSize.large",
            },
          },
        } as Properties,
        options: {
          mergeSubProperties: false,
        },
        expected: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          font: {
            size: {
              type: ValueType.THEME_ORDINAL,
              value: "@fontSize.large",
            },
          },
        } as Properties,
      },
      {
        name: "shorthand property merging with mergeSubProperties true",
        props1: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          margin: {
            top: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 16 },
            },
            right: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 16 },
            },
            bottom: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 16 },
            },
            left: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 16 },
            },
          },
        } as Properties,
        props2: {
          margin: {
            top: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 24 },
            },
            left: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 24 },
            },
          },
        } as Properties,
        expected: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          margin: {
            top: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 24 },
            },
            right: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 16 },
            },
            bottom: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 16 },
            },
            left: {
              type: ValueType.EXACT,
              value: { unit: "px", value: 24 },
            },
          },
        } as Properties,
      },
    ]

    testCases.forEach(({ name, props1, props2, options, expected }) => {
      const result = mergeProperties(props1, props2, options)
      expect(result).toEqual(expected)
    })
  })
})

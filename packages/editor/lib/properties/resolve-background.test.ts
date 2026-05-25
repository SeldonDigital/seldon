import { expect, it } from "bun:test"
import { ValueType } from "@seldon/core"
import theme from "@seldon/core/themes/test/test-theme"
import { resolveBackground } from "./resolve-background"

it("1. Should return undefined when node does not have a background property", () => {
  expect(resolveBackground({}, theme)).toBeUndefined()
})

it("2. Should return undefined when background preset value is undefined", () => {
  expect(
    resolveBackground(
      {
        background: {
          preset: {
            type: ValueType.EMPTY,
            value: null,
          },
        },
      },
      theme,
    ),
  ).toBeUndefined()
})

it("3. Should return the correct background when background value is preset", () => {
  expect(
    resolveBackground(
      {
        background: {
          preset: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@background.primary",
          },
        },
      },
      theme,
    ),
  ).toEqual({
    color: {
      name: "Primary",
      intent: "The primary color",
      type: "hsl",
      value: {
        hue: 0,
        saturation: 0,
        lightness: 15,
      },
    },
    image: undefined,
    size: undefined,
    position: undefined,
    repeat: undefined,
    opacity: undefined,
  })
})

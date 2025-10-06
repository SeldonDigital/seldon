import { describe, expect, it } from "bun:test"
import { getSimplePropName } from "./get-simple-prop-name"

describe("getSimplePropName", () => {
  it.each([
    ["simple.path", undefined, "path"],
    ["nested.deep.path", undefined, "path"],
    ["root.child", undefined, "child"],
    ["single", undefined, "single"],
    ["camelCase", undefined, "camelCase"],
    ["UPPER_CASE", undefined, "UPPER_CASE"],
    ["mixed-case-123", undefined, "mixed-case-123"],
  ])(
    "converts '%s' to '%s' without parent component",
    (input, parentComponent, expected) => {
      expect(getSimplePropName(input, parentComponent)).toBe(expected)
    },
  )

  it.each([
    ["cardProduct.details.barButtons", "cardProduct", "barButtons"],
    ["buttonComponent.icon", "buttonComponent", "icon"],
    ["headerPanel.title", "headerPanel", "titleProps"],
    ["formField.input", "formField", "input"],
    ["navigation.menu", "navigation", "menu"],
  ])(
    "removes parent component '%s' from '%s' to get '%s'",
    (input, parentComponent, expected) => {
      expect(getSimplePropName(input, parentComponent)).toBe(expected)
    },
  )

  it.each([
    ["button1", undefined, "button1"],
    ["icon2", undefined, "icon2"],
    ["text3", undefined, "text3"],
    ["input4", undefined, "input4"],
    ["label5", undefined, "label5"],
  ])(
    "moves numbers from beginning to end for '%s' to get '%s'",
    (input, parentComponent, expected) => {
      expect(getSimplePropName(input, parentComponent)).toBe(expected)
    },
  )

  it.each([
    ["title", undefined, "titleProps"],
    ["lang", undefined, "langProps"],
    ["dir", undefined, "dirProps"],
    ["spellCheck", undefined, "spellCheckProps"],
  ])(
    "adds 'Props' suffix for HTML element property '%s' to get '%s'",
    (input, parentComponent, expected) => {
      expect(getSimplePropName(input, parentComponent)).toBe(expected)
    },
  )

  it.each([
    ["cardProduct.title", "cardProduct", "titleProps"],
    ["formField.lang", "formField", "langProps"],
    ["headerPanel.dir", "headerPanel", "dirProps"],
    ["navigation.spellCheck", "navigation", "spellCheckProps"],
  ])(
    "combines parent removal and HTML property handling for '%s' with parent '%s' to get '%s'",
    (input, parentComponent, expected) => {
      expect(getSimplePropName(input, parentComponent)).toBe(expected)
    },
  )

  it.each([
    ["cardProduct.button1", "cardProduct", "button1"],
    ["formField.input2", "formField", "input2"],
    ["headerPanel.icon3", "headerPanel", "icon3"],
    ["navigation.text4", "navigation", "text4"],
  ])(
    "combines parent removal and number handling for '%s' with parent '%s' to get '%s'",
    (input, parentComponent, expected) => {
      expect(getSimplePropName(input, parentComponent)).toBe(expected)
    },
  )

  it.each([
    ["cardProduct.title1", "cardProduct", "title1"],
    ["formField.lang2", "formField", "lang2"],
    ["headerPanel.dir3", "headerPanel", "dir3"],
    ["navigation.spellCheck4", "navigation", "spellCheck4"],
  ])(
    "handles numbered HTML properties correctly for '%s' with parent '%s' to get '%s'",
    (input, parentComponent, expected) => {
      expect(getSimplePropName(input, parentComponent)).toBe(expected)
    },
  )
})

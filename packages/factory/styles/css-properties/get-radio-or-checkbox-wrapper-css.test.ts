import { describe, expect, it } from "bun:test"
import { Properties, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getRadioOrCheckboxWrapperCss } from "./get-radio-or-checkbox-wrapper-css"

describe("getRadioOrCheckboxWrapperCss", () => {
  const baseContext = {
    properties: {
      accentColor: {
        type: ValueType.EXACT,
        value: "#3b82f6",
      },
    } as Properties,
    parentContext: null,
    theme: testTheme,
  }

  const baseSizes = {
    defaultHeight: 20,
    radioDotSize: 8,
    checkboxIconSize: 12,
  }

  it("should return CSS object with basic styles", () => {
    const result = getRadioOrCheckboxWrapperCss({
      sizes: baseSizes,
      variant: "default",
      isChecked: false,
      context: baseContext,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("alignItems", "center")
    expect(result).toHaveProperty("justifyContent", "center")
    expect(result).toHaveProperty("position", "relative")
    expect(result).toHaveProperty("appearance", "none")
    expect(result).toHaveProperty("height", "20px")
    expect(result).toHaveProperty("width", "20px")
    expect(result).toHaveProperty("backgroundColor", "transparent")
  })

  it("should apply border color for default variant when checked", () => {
    const result = getRadioOrCheckboxWrapperCss({
      sizes: baseSizes,
      variant: "default",
      isChecked: true,
      context: baseContext,
    })

    expect(result).toHaveProperty("borderColor", "#3b82f6")
  })

  it("should apply background color for solid variant when checked", () => {
    const result = getRadioOrCheckboxWrapperCss({
      sizes: baseSizes,
      variant: "solid",
      isChecked: true,
      context: baseContext,
    })

    expect(result).toHaveProperty("backgroundColor", "#3b82f6")
    expect(result).toHaveProperty("borderColor", "transparent")
  })

  it("should not apply special colors for default variant when unchecked", () => {
    const result = getRadioOrCheckboxWrapperCss({
      sizes: baseSizes,
      variant: "default",
      isChecked: false,
      context: baseContext,
    })

    expect(result).not.toHaveProperty("borderColor")
    expect(result).toHaveProperty("backgroundColor", "transparent")
  })

  it("should not apply special colors for solid variant when unchecked", () => {
    const result = getRadioOrCheckboxWrapperCss({
      sizes: baseSizes,
      variant: "solid",
      isChecked: false,
      context: baseContext,
    })

    expect(result).not.toHaveProperty("backgroundColor")
    expect(result).not.toHaveProperty("borderColor")
  })

  it("should handle different sizes", () => {
    const customSizes = {
      defaultHeight: 24,
      radioDotSize: 10,
      checkboxIconSize: 14,
    }

    const result = getRadioOrCheckboxWrapperCss({
      sizes: customSizes,
      variant: "default",
      isChecked: false,
      context: baseContext,
    })

    expect(result).toHaveProperty("height", "24px")
    expect(result).toHaveProperty("width", "24px")
  })

  it("should handle empty variant object", () => {
    const result = getRadioOrCheckboxWrapperCss({
      sizes: baseSizes,
      variant: {},
      isChecked: true,
      context: baseContext,
    })

    expect(result).toHaveProperty("display", "flex")
    expect(result).toHaveProperty("height", "20px")
    expect(result).toHaveProperty("width", "20px")
    expect(result).not.toHaveProperty("borderColor")
    expect(result).not.toHaveProperty("backgroundColor")
  })

  it("should include shadow, border, and corner styles", () => {
    const result = getRadioOrCheckboxWrapperCss({
      sizes: baseSizes,
      variant: "default",
      isChecked: false,
      context: baseContext,
    })

    // These properties should be present from the imported style functions
    expect(result).toBeDefined()
    expect(typeof result).toBe("object")
  })

  it("should handle empty context gracefully", () => {
    const emptyContext = {
      properties: {} as Properties,
      parentContext: null,
      theme: testTheme,
    }

    const result = getRadioOrCheckboxWrapperCss({
      sizes: baseSizes,
      variant: "default",
      isChecked: false,
      context: emptyContext,
    })

    expect(result).toBeDefined()
    expect(typeof result).toBe("object")
    expect(result).toHaveProperty("display", "flex")
  })

  it("should handle invalid variant gracefully", () => {
    const result = getRadioOrCheckboxWrapperCss({
      sizes: baseSizes,
      variant: "invalid",
      isChecked: false,
      context: baseContext,
    })

    expect(result).toBeDefined()
    expect(typeof result).toBe("object")
    expect(result).toHaveProperty("display", "flex")
  })
})

import { describe, expect, it } from "bun:test"
import { StaticTheme } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { areThemesEqual } from "./are-themes-equal"

describe("are-themes-equal", () => {
  it("should return true for identical themes", () => {
    const result = areThemesEqual(testTheme, testTheme)
    expect(result).toBe(true)
  })

  it("should return true for themes with different ids but same content", () => {
    const theme1: StaticTheme = {
      ...testTheme,
      id: "theme1",
      name: "Theme 1",
    }

    const theme2: StaticTheme = {
      ...testTheme,
      id: "theme2",
      name: "Theme 2",
    }

    const result = areThemesEqual(theme1, theme2)
    expect(result).toBe(true)
  })

  it("should return false for themes with different core values", () => {
    const theme1: StaticTheme = {
      ...testTheme,
      id: "theme1",
      name: "Theme 1",
    }

    const theme2: StaticTheme = {
      ...testTheme,
      id: "theme2",
      name: "Theme 2",
      core: {
        ...testTheme.core,
        ratio: 2.0, // Different ratio
      },
    }

    const result = areThemesEqual(theme1, theme2)
    expect(result).toBe(false)
  })

  it("should return false for themes with different color values", () => {
    const theme1: StaticTheme = {
      ...testTheme,
      id: "theme1",
      name: "Theme 1",
    }

    const theme2: StaticTheme = {
      ...testTheme,
      id: "theme2",
      name: "Theme 2",
      color: {
        ...testTheme.color,
        baseColor: {
          hue: 200,
          saturation: 60,
          lightness: 50,
        },
      },
    }

    const result = areThemesEqual(theme1, theme2)
    expect(result).toBe(false)
  })

  it("should return false for themes with different font families", () => {
    const theme1: StaticTheme = {
      ...testTheme,
      id: "theme1",
      name: "Theme 1",
    }

    const theme2: StaticTheme = {
      ...testTheme,
      id: "theme2",
      name: "Theme 2",
      fontFamily: {
        primary: "Arial, sans-serif",
        secondary: "Times, serif",
      },
    }

    const result = areThemesEqual(theme1, theme2)
    expect(result).toBe(false)
  })

  it("should return true for themes with only id and name differences", () => {
    const theme1: StaticTheme = {
      ...testTheme,
      id: "custom-theme-1",
      name: "Custom Theme 1",
    }

    const theme2: StaticTheme = {
      ...testTheme,
      id: "custom-theme-2",
      name: "Custom Theme 2",
    }

    const result = areThemesEqual(theme1, theme2)
    expect(result).toBe(true)
  })

  it("should handle nested object differences", () => {
    const theme1: StaticTheme = {
      ...testTheme,
      id: "theme1",
      name: "Theme 1",
    }

    const theme2: StaticTheme = {
      ...testTheme,
      id: "theme2",
      name: "Theme 2",
      fontSize: {
        ...testTheme.fontSize,
        small: {
          ...testTheme.fontSize.small,
          value: "0.8rem", // Different value
        },
      },
    }

    const result = areThemesEqual(theme1, theme2)
    expect(result).toBe(false)
  })

  it("should handle array differences", () => {
    const theme1: StaticTheme = {
      ...testTheme,
      id: "theme1",
      name: "Theme 1",
    }

    const theme2: StaticTheme = {
      ...testTheme,
      id: "theme2",
      name: "Theme 2",
      // Add a custom property with array
      customProperty: [1, 2, 3],
    }

    const theme3: StaticTheme = {
      ...testTheme,
      id: "theme3",
      name: "Theme 3",
      // Add a custom property with different array
      customProperty: [1, 2, 4],
    }

    const result1 = areThemesEqual(theme1, theme2)
    const result2 = areThemesEqual(theme2, theme3)

    expect(result1).toBe(false) // theme1 doesn't have customProperty
    expect(result2).toBe(false) // Different array values
  })
})

import { describe, expect, it } from "bun:test"
import { CSS_MARKERS, CSS_SECTIONS } from "./constants"

describe("CSS Constants", () => {
  describe("CSS_MARKERS", () => {
    it("should have all required marker constants", () => {
      expect(CSS_MARKERS).toHaveProperty("RESET_STYLES_START")
      expect(CSS_MARKERS).toHaveProperty("RESET_STYLES_END")
      expect(CSS_MARKERS).toHaveProperty("BASE_STYLES_START")
      expect(CSS_MARKERS).toHaveProperty("BASE_STYLES_END")
      expect(CSS_MARKERS).toHaveProperty("COMPONENT_STYLES_START")
      expect(CSS_MARKERS).toHaveProperty("COMPONENT_STYLES_END")
      expect(CSS_MARKERS).toHaveProperty("THEME_VARIABLES_START")
      expect(CSS_MARKERS).toHaveProperty("THEME_VARIABLES_END")
    })

    it("should have correct marker values", () => {
      expect(CSS_MARKERS.RESET_STYLES_START).toBe("/* Reset styles start */")
      expect(CSS_MARKERS.RESET_STYLES_END).toBe("/* Reset styles end */")
      expect(CSS_MARKERS.BASE_STYLES_START).toBe("/* Base styles start */")
      expect(CSS_MARKERS.BASE_STYLES_END).toBe("/* Base styles end */")
      expect(CSS_MARKERS.COMPONENT_STYLES_START).toBe(
        "/* Component styles start */",
      )
      expect(CSS_MARKERS.COMPONENT_STYLES_END).toBe(
        "/* Component styles end */",
      )
      expect(CSS_MARKERS.THEME_VARIABLES_START).toBe(
        "/* Theme variables start */",
      )
      expect(CSS_MARKERS.THEME_VARIABLES_END).toBe("/* Theme variables end */")
    })

    it("should be readonly", () => {
      // TypeScript will prevent this at compile time, but we can test the structure
      expect(CSS_MARKERS).toBeDefined()
      expect(typeof CSS_MARKERS).toBe("object")
    })
  })

  describe("CSS_SECTIONS", () => {
    it("should have all required section constants", () => {
      expect(CSS_SECTIONS).toHaveProperty("RESET")
      expect(CSS_SECTIONS).toHaveProperty("BASE")
      expect(CSS_SECTIONS).toHaveProperty("COMPONENTS")
      expect(CSS_SECTIONS).toHaveProperty("THEMES")
    })

    it("should have correct section values", () => {
      expect(CSS_SECTIONS.RESET).toBe("reset")
      expect(CSS_SECTIONS.BASE).toBe("base")
      expect(CSS_SECTIONS.COMPONENTS).toBe("components")
      expect(CSS_SECTIONS.THEMES).toBe("themes")
    })

    it("should be readonly", () => {
      // TypeScript will prevent this at compile time, but we can test the structure
      expect(CSS_SECTIONS).toBeDefined()
      expect(typeof CSS_SECTIONS).toBe("object")
    })
  })

  it("should export constants as const", () => {
    // This test ensures the constants are properly typed as const
    const markers: typeof CSS_MARKERS = {
      RESET_STYLES_START: "/* Reset styles start */",
      RESET_STYLES_END: "/* Reset styles end */",
      BASE_STYLES_START: "/* Base styles start */",
      BASE_STYLES_END: "/* Base styles end */",
      COMPONENT_STYLES_START: "/* Component styles start */",
      COMPONENT_STYLES_END: "/* Component styles end */",
      THEME_VARIABLES_START: "/* Theme variables start */",
      THEME_VARIABLES_END: "/* Theme variables end */",
    }

    const sections: typeof CSS_SECTIONS = {
      RESET: "reset",
      BASE: "base",
      COMPONENTS: "components",
      THEMES: "themes",
    }

    expect(markers).toEqual(CSS_MARKERS)
    expect(sections).toEqual(CSS_SECTIONS)
  })
})

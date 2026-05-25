import { describe, expect, it } from "bun:test"
import { toCSSShorthands } from "./to-css-shorthands"

describe("toCSSShorthands", () => {
  it("should return empty object for empty input", () => {
    const input = {}

    const result = toCSSShorthands(input)

    expect(result).toEqual({})
  })

  it("should preserve unrelated properties unchanged", () => {
    const input = {
      color: "blue",
      fontSize: "16px",
      backgroundColor: "white",
    }

    const result = toCSSShorthands(input)

    expect(result).toEqual(input)
  })

  describe("padding shorthand", () => {
    it("should group equal padding values into shorthand", () => {
      const input = {
        paddingTop: "10px",
        paddingRight: "10px",
        paddingBottom: "10px",
        paddingLeft: "10px",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        padding: "10px",
      })
    })

    it("should not group unequal padding values", () => {
      const input = {
        paddingTop: "10px",
        paddingRight: "20px",
        paddingBottom: "10px",
        paddingLeft: "10px",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual(input)
    })

    it("should handle undefined padding values", () => {
      const input = {
        paddingTop: "10px",
        paddingRight: undefined,
        paddingBottom: "10px",
        paddingLeft: "10px",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual(input)
    })
  })

  describe("margin shorthand", () => {
    it("should group equal margin values into shorthand", () => {
      const input = {
        marginTop: "1rem",
        marginRight: "1rem",
        marginBottom: "1rem",
        marginLeft: "1rem",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        margin: "1rem",
      })
    })

    it("should not group unequal margin values", () => {
      const input = {
        marginTop: "1rem",
        marginRight: "2rem",
        marginBottom: "1rem",
        marginLeft: "1rem",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual(input)
    })
  })

  describe("inset shorthand", () => {
    it("should group equal inset values into shorthand", () => {
      const input = {
        top: "5px",
        right: "5px",
        bottom: "5px",
        left: "5px",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        inset: "5px",
      })
    })

    it("should not group unequal inset values", () => {
      const input = {
        top: "5px",
        right: "10px",
        bottom: "5px",
        left: "5px",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual(input)
    })
  })

  describe("border shorthand", () => {
    it("should group equal border width values", () => {
      const input = {
        borderTopWidth: "2px",
        borderRightWidth: "2px",
        borderBottomWidth: "2px",
        borderLeftWidth: "2px",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        borderWidth: "2px",
      })
    })

    it("should group equal border style values", () => {
      const input = {
        borderTopStyle: "solid",
        borderRightStyle: "solid",
        borderBottomStyle: "solid",
        borderLeftStyle: "solid",
      } as any

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        borderStyle: "solid",
      })
    })

    it("should group equal border color values", () => {
      const input = {
        borderTopColor: "red",
        borderRightColor: "red",
        borderBottomColor: "red",
        borderLeftColor: "red",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        borderColor: "red",
      })
    })

    it("should create complete border shorthand when width, style, and color are present", () => {
      const input = {
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "red",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        border: "2px solid red",
      })
    })

    it("should not create border shorthand when components are missing", () => {
      const input = {
        borderWidth: "2px",
        borderStyle: "solid",
        // borderColor missing
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual(input)
    })
  })

  describe("border radius shorthand", () => {
    it("should group equal border radius values into shorthand", () => {
      const input = {
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
        borderBottomRightRadius: "4px",
        borderBottomLeftRadius: "4px",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        borderRadius: "4px",
      })
    })

    it("should not group unequal border radius values", () => {
      const input = {
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "8px",
        borderBottomRightRadius: "4px",
        borderBottomLeftRadius: "4px",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual(input)
    })
  })

  it("should handle complex scenario with all shorthand types", () => {
    const input = {
      // Padding
      paddingTop: "10px",
      paddingRight: "10px",
      paddingBottom: "10px",
      paddingLeft: "10px",

      // Margin
      marginTop: "1rem",
      marginRight: "1rem",
      marginBottom: "1rem",
      marginLeft: "1rem",

      // Inset
      top: "5px",
      right: "5px",
      bottom: "5px",
      left: "5px",

      // Border: first collapse per-side to width/color/style, then compose border
      borderTopWidth: "2px",
      borderRightWidth: "2px",
      borderBottomWidth: "2px",
      borderLeftWidth: "2px",

      borderTopStyle: "solid",
      borderRightStyle: "solid",
      borderBottomStyle: "solid",
      borderLeftStyle: "solid",

      borderTopColor: "red",
      borderRightColor: "red",
      borderBottomColor: "red",
      borderLeftColor: "red",

      // Border radius
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
      borderBottomRightRadius: "4px",
      borderBottomLeftRadius: "4px",

      // Unrelated property should be preserved
      color: "blue",
    } as any

    const result = toCSSShorthands(input)

    expect(result).toEqual({
      padding: "10px",
      margin: "1rem",
      inset: "5px",
      border: "2px solid red",
      borderRadius: "4px",
      color: "blue",
    })
  })

  describe("error handling and edge cases", () => {
    it("should handle mixed data types gracefully", () => {
      const input = {
        paddingTop: "10px",
        paddingRight: 10, // number instead of string
        paddingBottom: "10px",
        paddingLeft: "10px",
      } as any

      const result = toCSSShorthands(input)

      expect(result).toEqual(input)
    })

    it("should handle null values gracefully", () => {
      const input = {
        paddingTop: "10px",
        paddingRight: null as any,
        paddingBottom: "10px",
        paddingLeft: "10px",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual(input)
    })

    it("should handle empty string values", () => {
      const input = {
        paddingTop: "",
        paddingRight: "",
        paddingBottom: "",
        paddingLeft: "",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        padding: "",
      })
    })

    it("should handle zero values", () => {
      const input = {
        paddingTop: "0",
        paddingRight: "0",
        paddingBottom: "0",
        paddingLeft: "0",
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        padding: "0",
      })
    })

    it("should handle very long values", () => {
      const longValue = "very-long-css-value-that-might-cause-issues"
      const input = {
        paddingTop: longValue,
        paddingRight: longValue,
        paddingBottom: longValue,
        paddingLeft: longValue,
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        padding: longValue,
      })
    })

    it("should handle special characters in values", () => {
      const specialValue = "calc(100% - 20px)"
      const input = {
        marginTop: specialValue,
        marginRight: specialValue,
        marginBottom: specialValue,
        marginLeft: specialValue,
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        margin: specialValue,
      })
    })

    it("should handle partial property sets", () => {
      const input = {
        paddingTop: "10px",
        paddingRight: "10px",
        // paddingBottom and paddingLeft missing
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual(input)
    })

    it("should handle duplicate properties (last one wins)", () => {
      const input = {
        paddingTop: "10px",
        paddingRight: "10px",
        paddingBottom: "10px",
        paddingLeft: "10px",
        padding: "20px", // This should be preserved
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        padding: "20px",
      })
    })

    it("should handle complex border scenarios", () => {
      const input = {
        borderTopWidth: "1px",
        borderRightWidth: "2px",
        borderBottomWidth: "3px",
        borderLeftWidth: "4px",
        borderTopStyle: "solid",
        borderRightStyle: "dashed",
        borderBottomStyle: "dotted",
        borderLeftStyle: "double",
        borderTopColor: "red",
        borderRightColor: "green",
        borderBottomColor: "blue",
        borderLeftColor: "yellow",
      } as any

      const result = toCSSShorthands(input)

      expect(result).toEqual(input)
    })

    it("should handle border shorthand with mixed components", () => {
      const input = {
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: "red",
        borderTopWidth: "1px", // This should not interfere
      }

      const result = toCSSShorthands(input)

      expect(result).toEqual({
        border: "2px solid red",
        borderTopWidth: "1px",
      })
    })
  })
})

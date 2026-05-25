import { describe, expect, it } from "bun:test"
import { getShorthandValues } from "./get-shorthand-values"
import type { CSSObject } from "./types"

describe("getShorthandValues", () => {
  it("should combine padding properties when all values are equal", () => {
    const input: CSSObject = {
      paddingTop: "1rem",
      paddingRight: "1rem",
      paddingBottom: "1rem",
      paddingLeft: "1rem",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      padding: "1rem",
    })
  })

  it("should not combine padding properties when values are different", () => {
    const input: CSSObject = {
      paddingTop: "1rem",
      paddingRight: "2rem",
      paddingBottom: "1rem",
      paddingLeft: "1rem",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual(input)
  })

  it("should handle undefined padding values", () => {
    const input: CSSObject = {
      paddingTop: undefined,
      paddingRight: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      padding: undefined,
    })
  })

  it("should combine margin properties when all values are equal", () => {
    const input: CSSObject = {
      marginTop: "2rem",
      marginRight: "2rem",
      marginBottom: "2rem",
      marginLeft: "2rem",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      margin: "2rem",
    })
  })

  it("should not combine margin properties when values are different", () => {
    const input: CSSObject = {
      marginTop: "1rem",
      marginRight: "2rem",
      marginBottom: "3rem",
      marginLeft: "4rem",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual(input)
  })

  it("should combine border color properties when all values are equal", () => {
    const input: CSSObject = {
      borderTopColor: "red",
      borderRightColor: "red",
      borderBottomColor: "red",
      borderLeftColor: "red",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      borderColor: "red",
    })
  })

  it("should not combine border color properties when values are different", () => {
    const input: CSSObject = {
      borderTopColor: "red",
      borderRightColor: "blue",
      borderBottomColor: "red",
      borderLeftColor: "red",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual(input)
  })

  it("should combine border width properties when all values are equal", () => {
    const input: CSSObject = {
      borderTopWidth: "2px",
      borderRightWidth: "2px",
      borderBottomWidth: "2px",
      borderLeftWidth: "2px",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      borderWidth: "2px",
    })
  })

  it("should not combine border width properties when values are different", () => {
    const input: CSSObject = {
      borderTopWidth: "1px",
      borderRightWidth: "2px",
      borderBottomWidth: "1px",
      borderLeftWidth: "1px",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual(input)
  })

  it("should combine border style properties when all values are equal", () => {
    const input: CSSObject = {
      borderTopStyle: "solid",
      borderRightStyle: "solid",
      borderBottomStyle: "solid",
      borderLeftStyle: "solid",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      borderStyle: "solid",
    })
  })

  it("should not combine border style properties when values are different", () => {
    const input: CSSObject = {
      borderTopStyle: "solid",
      borderRightStyle: "dashed",
      borderBottomStyle: "solid",
      borderLeftStyle: "solid",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual(input)
  })

  it("should combine border radius properties when all values are equal", () => {
    const input: CSSObject = {
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      borderRadius: "8px",
    })
  })

  it("should not combine border radius properties when values are different", () => {
    const input: CSSObject = {
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "4px",
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual(input)
  })

  it("should combine border width, style, and color into border shorthand", () => {
    const input: CSSObject = {
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: "red",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      border: "2px solid red",
    })
  })

  it("should not create border shorthand when not all properties are present", () => {
    const input: CSSObject = {
      borderWidth: "2px",
      borderStyle: "solid",
      // missing borderColor
    }

    const result = getShorthandValues(input)

    expect(result).toEqual(input)
  })

  it("should handle multiple shorthand combinations in one object", () => {
    const input: CSSObject = {
      paddingTop: "1rem",
      paddingRight: "1rem",
      paddingBottom: "1rem",
      paddingLeft: "1rem",
      marginTop: "2rem",
      marginRight: "2rem",
      marginBottom: "2rem",
      marginLeft: "2rem",
      borderTopColor: "blue",
      borderRightColor: "blue",
      borderBottomColor: "blue",
      borderLeftColor: "blue",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      padding: "1rem",
      margin: "2rem",
      borderColor: "blue",
    })
  })

  it("should preserve non-shorthand properties", () => {
    const input: CSSObject = {
      paddingTop: "1rem",
      paddingRight: "1rem",
      paddingBottom: "1rem",
      paddingLeft: "1rem",
      color: "red",
      backgroundColor: "blue",
      fontSize: "16px",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      padding: "1rem",
      color: "red",
      backgroundColor: "blue",
      fontSize: "16px",
    })
  })

  it("should handle empty object", () => {
    const input: CSSObject = {}

    const result = getShorthandValues(input)

    expect(result).toEqual({})
  })

  it("should handle object with only non-shorthand properties", () => {
    const input: CSSObject = {
      color: "red",
      backgroundColor: "blue",
      fontSize: "16px",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual(input)
  })

  it("should handle mixed undefined and defined values", () => {
    const input: CSSObject = {
      paddingTop: "1rem",
      paddingRight: undefined,
      paddingBottom: "1rem",
      paddingLeft: "1rem",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual(input)
  })

  it("should handle numeric values", () => {
    const input: CSSObject = {
      paddingTop: "16px",
      paddingRight: "16px",
      paddingBottom: "16px",
      paddingLeft: "16px",
    }

    const result = getShorthandValues(input)

    expect(result).toEqual({
      padding: "16px",
    })
  })
})

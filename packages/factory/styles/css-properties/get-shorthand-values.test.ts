import { describe, expect, it } from "vitest"

import { getShorthandValues } from "./get-shorthand-values"

describe("getShorthandValues", () => {
  it("collapses equal padding sides into a padding shorthand", () => {
    expect(
      getShorthandValues({
        paddingTop: "4px",
        paddingRight: "4px",
        paddingBottom: "4px",
        paddingLeft: "4px",
      }),
    ).toEqual({ padding: "4px" })
  })

  it("collapses equal margin sides into a margin shorthand", () => {
    expect(
      getShorthandValues({
        marginTop: "8px",
        marginRight: "8px",
        marginBottom: "8px",
        marginLeft: "8px",
      }),
    ).toEqual({ margin: "8px" })
  })

  it("does not collapse when all sides are undefined", () => {
    const input = {
      paddingTop: undefined,
      paddingRight: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
    }
    expect(getShorthandValues(input)).toEqual(input)
    expect("padding" in getShorthandValues(input)).toBe(false)
  })

  it("overwrites an existing shorthand with the collapsed value", () => {
    expect(
      getShorthandValues({
        padding: "2px",
        paddingTop: "4px",
        paddingRight: "4px",
        paddingBottom: "4px",
        paddingLeft: "4px",
      }),
    ).toEqual({ padding: "4px" })
  })

  it("collapses border facets into a border shorthand", () => {
    expect(
      getShorthandValues({
        borderTopWidth: "2px",
        borderRightWidth: "2px",
        borderBottomWidth: "2px",
        borderLeftWidth: "2px",
        borderTopStyle: "dashed",
        borderRightStyle: "dashed",
        borderBottomStyle: "dashed",
        borderLeftStyle: "dashed",
        borderTopColor: "blue",
        borderRightColor: "blue",
        borderBottomColor: "blue",
        borderLeftColor: "blue",
      }),
    ).toEqual({ border: "2px dashed blue" })
  })

  it("does not mutate the input object", () => {
    const input = {
      marginTop: "8px",
      marginRight: "8px",
      marginBottom: "8px",
      marginLeft: "8px",
    }
    getShorthandValues(input)
    expect(input.marginTop).toBe("8px")
  })
})

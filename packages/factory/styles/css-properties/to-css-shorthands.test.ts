import { describe, expect, it } from "vitest"

import { toCSSShorthands } from "./to-css-shorthands"

describe("toCSSShorthands", () => {
  it("collapses equal padding sides into a padding shorthand", () => {
    expect(
      toCSSShorthands({
        paddingTop: "4px",
        paddingInlineEnd: "4px",
        paddingBottom: "4px",
        paddingInlineStart: "4px",
      }),
    ).toEqual({ padding: "4px" })
  })

  it("collapses equal margin sides into a margin shorthand", () => {
    expect(
      toCSSShorthands({
        marginTop: "8px",
        marginInlineEnd: "8px",
        marginBottom: "8px",
        marginInlineStart: "8px",
      }),
    ).toEqual({ margin: "8px" })
  })

  it("collapses equal inset sides into an inset shorthand", () => {
    expect(
      toCSSShorthands({ top: "0", right: "0", bottom: "0", left: "0" }),
    ).toEqual({ inset: "0" })
  })

  it("does not collapse when sides differ", () => {
    const input = {
      paddingTop: "4px",
      paddingInlineEnd: "8px",
      paddingBottom: "4px",
      paddingInlineStart: "8px",
    }
    expect(toCSSShorthands(input)).toEqual(input)
  })

  it("does not collapse when any side is undefined", () => {
    const input = {
      paddingTop: "4px",
      paddingInlineEnd: "4px",
      paddingBottom: "4px",
    }
    expect(toCSSShorthands(input)).toEqual(input)
  })

  it("keeps an existing shorthand and drops the longhand sides", () => {
    expect(
      toCSSShorthands({
        padding: "2px",
        paddingTop: "4px",
        paddingInlineEnd: "4px",
        paddingBottom: "4px",
        paddingInlineStart: "4px",
      }),
    ).toEqual({ padding: "2px" })
  })

  it("collapses border width, style, and color into a border shorthand", () => {
    expect(
      toCSSShorthands({
        borderTopWidth: "1px",
        borderRightWidth: "1px",
        borderBottomWidth: "1px",
        borderLeftWidth: "1px",
        borderTopStyle: "solid",
        borderRightStyle: "solid",
        borderBottomStyle: "solid",
        borderLeftStyle: "solid",
        borderTopColor: "red",
        borderRightColor: "red",
        borderBottomColor: "red",
        borderLeftColor: "red",
      }),
    ).toEqual({ border: "1px solid red" })
  })

  it("collapses equal radius corners into a borderRadius shorthand", () => {
    expect(
      toCSSShorthands({
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
      }),
    ).toEqual({ borderRadius: "4px" })
  })

  it("does not mutate the input object", () => {
    const input = {
      paddingTop: "4px",
      paddingInlineEnd: "4px",
      paddingBottom: "4px",
      paddingInlineStart: "4px",
    }
    toCSSShorthands(input)
    expect(input.paddingTop).toBe("4px")
  })
})

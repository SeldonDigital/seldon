import { describe, expect, it } from "bun:test"
import { insertResetStyles } from "./insert-reset-styles"

describe("insertResetStyles", () => {
  it("should insert reset styles into empty stylesheet", () => {
    const result = insertResetStyles("")

    expect(result).toContain("Reset styles")
    expect(result).toContain("*,")
    expect(result).toContain("::before,")
    expect(result).toContain("::after {")
    expect(result).toContain("box-sizing: border-box")
  })

  it("should append reset styles to existing stylesheet", () => {
    const existingStylesheet =
      "/* Existing styles */\n.existing { color: red; }"
    const result = insertResetStyles(existingStylesheet)

    expect(result).toContain("/* Existing styles */")
    expect(result).toContain(".existing { color: red; }")
    expect(result).toContain("Reset styles")
    expect(result).toContain("box-sizing: border-box")
  })

  it("should include comprehensive reset styles", () => {
    const result = insertResetStyles("")

    // Check for universal selector reset
    expect(result).toContain("*,")
    expect(result).toContain("::before,")
    expect(result).toContain("::after {")
    expect(result).toContain("box-sizing: border-box")
    expect(result).toContain("border-width: 0")
    expect(result).toContain("border-style: solid")

    // Check for HTML element resets
    expect(result).toContain("html,")
    expect(result).toContain(":host {")
    expect(result).toContain("line-height: 1.5")
    expect(result).toContain("-webkit-text-size-adjust: 100%")

    // Check for body reset
    expect(result).toContain("body {")
    expect(result).toContain("margin: 0")
    expect(result).toContain("line-height: inherit")

    // Check for form element resets
    expect(result).toContain("button,")
    expect(result).toContain("input,")
    expect(result).toContain("select,")
    expect(result).toContain("textarea {")
    expect(result).toContain("font-family: inherit")
    expect(result).toContain("font-size: 100%")
    expect(result).toContain("margin: 0")
    expect(result).toContain("padding: 0")
  })

  it("should include list resets", () => {
    const result = insertResetStyles("")

    expect(result).toContain("ol,")
    expect(result).toContain("ul,")
    expect(result).toContain("menu {")
    expect(result).toContain("list-style: none")
    expect(result).toContain("margin: 0")
    expect(result).toContain("padding: 0")
  })

  it("should include heading resets", () => {
    const result = insertResetStyles("")

    expect(result).toContain("h1,")
    expect(result).toContain("h2,")
    expect(result).toContain("h3,")
    expect(result).toContain("h4,")
    expect(result).toContain("h5,")
    expect(result).toContain("h6 {")
    expect(result).toContain("font-size: inherit")
    expect(result).toContain("font-weight: inherit")
  })

  it("should include media element resets", () => {
    const result = insertResetStyles("")

    expect(result).toContain("img,")
    expect(result).toContain("svg,")
    expect(result).toContain("video,")
    expect(result).toContain("canvas,")
    expect(result).toContain("audio,")
    expect(result).toContain("iframe,")
    expect(result).toContain("embed,")
    expect(result).toContain("object {")
    expect(result).toContain("display: block")
    expect(result).toContain("vertical-align: middle")
  })

  it("should include button and input resets", () => {
    const result = insertResetStyles("")

    expect(result).toContain("button,")
    expect(result).toContain('[role="button"] {')
    expect(result).toContain("cursor: pointer")

    expect(result).toContain(":disabled {")
    expect(result).toContain("cursor: default")
  })

  it("should include hidden attribute handling", () => {
    const result = insertResetStyles("")

    expect(result).toContain('[hidden]:where(:not([hidden="until-found"])) {')
    expect(result).toContain("display: none")
  })

  it("should include proper CSS structure", () => {
    const result = insertResetStyles("")

    expect(result).toContain("/********************************************")
    expect(result).toContain("*              Reset styles                *")
    expect(result).toContain("********************************************/")
  })

  it("should handle multiple calls correctly", () => {
    const firstCall = insertResetStyles("")
    const secondCall = insertResetStyles(firstCall)

    // Should not duplicate reset styles
    const resetStylesCount = (secondCall.match(/Reset styles/g) || []).length
    expect(resetStylesCount).toBe(1)
  })

  it("should include textarea resize reset", () => {
    const result = insertResetStyles("")

    expect(result).toContain("textarea {")
    expect(result).toContain("resize: vertical")
  })

  it("should include table resets", () => {
    const result = insertResetStyles("")

    expect(result).toContain("table {")
    expect(result).toContain("text-indent: 0")
    expect(result).toContain("border-color: inherit")
    expect(result).toContain("border-collapse: collapse")
  })
})

import { describe, expect, it } from "vitest"

import { dataSeldonRefAttr } from "./data-ref-attr"

describe("dataSeldonRefAttr", () => {
  it("emits a data-seldon-ref attribute for a ref name", () => {
    expect(dataSeldonRefAttr("primaryButton")).toBe(
      ' data-seldon-ref={"primaryButton"}',
    )
  })

  it("returns an empty string when the ref is undefined", () => {
    expect(dataSeldonRefAttr(undefined)).toBe("")
  })

  it("returns an empty string for an empty ref", () => {
    expect(dataSeldonRefAttr("")).toBe("")
  })

  it("escapes special characters via JSON.stringify", () => {
    expect(dataSeldonRefAttr('weird"ref')).toBe(
      ' data-seldon-ref={"weird\\"ref"}',
    )
  })
})

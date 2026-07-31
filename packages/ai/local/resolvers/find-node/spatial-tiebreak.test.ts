import { describe, expect, it } from "vitest"

import { spatialTieBreak } from "./index"

/** Candidates shaped like collectCandidates output: one row of three. */
const ROW = [
  { id: "a", text: "button, Button, position: top, first, top-most" },
  { id: "b", text: "button, Button, position: second" },
  { id: "c", text: "button, Button, position: bottom, last, bottom-most" },
]

describe("spatialTieBreak", () => {
  it('resolves "the last button" to the last sibling', () => {
    expect(spatialTieBreak("the last button", ROW)?.id).toBe("c")
  })

  it('resolves "the first button" to the first sibling', () => {
    expect(spatialTieBreak("the first button", ROW)?.id).toBe("a")
  })

  it("returns undefined when the query names no position", () => {
    expect(spatialTieBreak("the button", ROW)).toBeUndefined()
  })

  it("returns undefined when several candidates carry the named position", () => {
    // Two variants, each with a "last" child: genuinely ambiguous.
    const twoRows = [
      ...ROW,
      { id: "d", text: "button, Button, position: bottom, last, bottom-most" },
    ]
    expect(spatialTieBreak("the last button", twoRows)).toBeUndefined()
  })

  it('prefers the longer phrase: "second last" beats "last"', () => {
    const row = [
      { id: "x", text: "chip, position: second last" },
      { id: "y", text: "chip, position: bottom, last, bottom-most" },
    ]
    expect(spatialTieBreak("the second last chip", row)?.id).toBe("x")
  })

  it("ignores candidates with no position label", () => {
    const bare = [{ id: "n", text: "button, Button" }]
    expect(spatialTieBreak("the last button", bare)).toBeUndefined()
  })
})

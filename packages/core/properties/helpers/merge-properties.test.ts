import { describe, expect, it } from "vitest"

import { ValueType } from "../constants"
import type { Properties } from "../types/properties"
import { mergeProperties } from "./merge-properties"

const props = (value: Record<string, unknown>): Properties =>
  value as unknown as Properties

const exact = (value: unknown) => ({ type: ValueType.EXACT, value })
const empty = () => ({ type: ValueType.EMPTY, value: null })

describe("mergeProperties", () => {
  it("adds keys from the patch onto the base", () => {
    const result = mergeProperties(
      props({ opacity: exact(1) }),
      props({ color: exact("#fff") }),
    )
    expect(result).toEqual({ opacity: exact(1), color: exact("#fff") })
  })

  it("overrides an atomic value with the patch", () => {
    const result = mergeProperties(
      props({ opacity: exact(1) }),
      props({ opacity: exact(2) }),
    )
    expect(result.opacity).toEqual(exact(2))
  })

  it("skips an EMPTY patch over an existing value", () => {
    const result = mergeProperties(
      props({ color: exact("#fff") }),
      props({ color: empty() }),
    )
    expect(result.color).toEqual(exact("#fff"))
  })

  it("skips an EMPTY patch for a new key", () => {
    const result = mergeProperties(props({}), props({ color: empty() }))
    expect(result).toEqual({})
  })

  it("merges compound facet maps field by field", () => {
    const result = mergeProperties(
      props({ border: { color: exact("#000") } }),
      props({ border: { width: exact(2) } }),
    )
    expect(result.border).toEqual({ color: exact("#000"), width: exact(2) })
  })

  it("merges layered paint stacks by slot", () => {
    const result = mergeProperties(
      props({ background: [{ color: exact("A") }, { color: exact("B") }] }),
      props({ background: [{}, { color: exact("C") }] }),
    )
    expect(result.background).toEqual([
      { color: exact("A") },
      { color: exact("C") },
    ])
  })

  it("replaces wholesale when mergeSubProperties is false", () => {
    const result = mergeProperties(
      props({ background: [{ color: exact("A") }] }),
      props({ background: [{ color: exact("C") }] }),
      { mergeSubProperties: false },
    )
    expect(result.background).toEqual([{ color: exact("C") }])
  })
})

import { describe, expect, it } from "vitest"

import { ValueType } from "../constants"
import { getBasedOnValue, resolveBasedOnWithAnchor } from "./get-based-on-value"

const exact = (value: unknown) => ({ type: ValueType.EXACT, value })

type Ctx = Parameters<typeof getBasedOnValue>[1]

const ctx = (
  properties: Record<string, unknown>,
  parentContext: unknown = null,
): Ctx => ({ properties, parentContext }) as unknown as Ctx

describe("getBasedOnValue", () => {
  it("resolves a #self path on the node's own properties", () => {
    expect(
      getBasedOnValue("#self.buttonSize", ctx({ buttonSize: exact(16) })),
    ).toEqual(exact(16))
  })

  it("resolves a bare path with no anchor prefix", () => {
    expect(
      getBasedOnValue("buttonSize", ctx({ buttonSize: exact(16) })),
    ).toEqual(exact(16))
  })

  it("resolves a #parent path on the parent context", () => {
    const parent = ctx({ buttonSize: exact(20) })
    expect(getBasedOnValue("#parent.buttonSize", ctx({}, parent))).toEqual(
      exact(20),
    )
  })

  it("throws when the path resolves to nothing", () => {
    expect(() => getBasedOnValue("#self.missing", ctx({}))).toThrow()
  })

  it("throws when the path resolves to a grouped value", () => {
    expect(() =>
      getBasedOnValue(
        "#self.border",
        ctx({ border: { color: exact("#000") } }),
      ),
    ).toThrow()
  })
})

describe("resolveBasedOnWithAnchor", () => {
  it("normalizes a layered paint path to layer 0 and reports its source", () => {
    const parent = ctx({ background: [{ color: exact("#fff") }] })
    const result = resolveBasedOnWithAnchor(
      "#parent.background.color",
      ctx({}, parent),
    )
    expect(result.value).toEqual(exact("#fff"))
    expect(result.facetSource).toBe(parent)
  })
})

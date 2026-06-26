import { describe, expect, it } from "vitest"

import { Unit, ValueType } from "../../index"
import { defaultTheme } from "../../themes"
import type { ThemeOption } from "../../themes/types"
import {
  exactTokenToLength,
  resolveModulatedOrExactLength,
} from "./resolve-length-token"

describe("exactTokenToLength", () => {
  it("wraps a px token as an exact px length", () => {
    expect(exactTokenToLength({ unit: Unit.PX, value: 16 })).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.PX, value: 16 },
    })
  })

  it("wraps any non-px token as an exact rem length", () => {
    expect(exactTokenToLength({ unit: Unit.REM, value: 1.5 })).toEqual({
      type: ValueType.EXACT,
      value: { unit: Unit.REM, value: 1.5 },
    })
  })
})

describe("resolveModulatedOrExactLength", () => {
  it("returns undefined for a token that is neither modulated nor exact", () => {
    const optionToken = { type: "OPTION", name: "x" } as unknown as ThemeOption
    expect(
      resolveModulatedOrExactLength(optionToken, defaultTheme),
    ).toBeUndefined()
  })
})

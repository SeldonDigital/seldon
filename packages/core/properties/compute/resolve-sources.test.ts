import { describe, expect, it } from "vitest"

import { ValueType } from "../constants"
import type { Properties } from "../types/properties"
import { resolveAutoFitSource } from "./resolve-auto-fit-source"
import { resolveHighContrastSource } from "./resolve-high-contrast-source"
import { resolveMatchColorSource } from "./resolve-match-color-source"
import { resolveOpticalPaddingSource } from "./resolve-optical-padding-source"
import type { ComputeContext } from "./types"

const ctx = (
  properties: Properties,
  parent: ComputeContext | null = null,
): ComputeContext => ({
  properties,
  parentContext: parent,
  theme: {} as ComputeContext["theme"],
})

const ordinal = (value: string) => ({ type: ValueType.THEME_ORDINAL, value })

describe("resolveAutoFitSource", () => {
  it("falls back to @fontSize.medium without an ancestor size", () => {
    expect(resolveAutoFitSource(ctx({} as Properties))).toEqual({
      type: ValueType.THEME_ORDINAL,
      value: "@fontSize.medium",
    })
  })

  it("uses the first ancestor buttonSize", () => {
    const parent = ctx({
      buttonSize: ordinal("@fontSize.large"),
    } as unknown as Properties)
    expect(resolveAutoFitSource(ctx({} as Properties, parent))).toEqual(
      ordinal("@fontSize.large"),
    )
  })

  it("uses ancestor size when no buttonSize is present", () => {
    const parent = ctx({
      size: ordinal("@fontSize.small"),
    } as unknown as Properties)
    expect(resolveAutoFitSource(ctx({} as Properties, parent))).toEqual(
      ordinal("@fontSize.small"),
    )
  })

  it("skips empty values and walks further up", () => {
    const grandparent = ctx({
      size: ordinal("@fontSize.xlarge"),
    } as unknown as Properties)
    const parent = ctx(
      {
        buttonSize: { type: ValueType.EMPTY, value: null },
      } as unknown as Properties,
      grandparent,
    )
    expect(resolveAutoFitSource(ctx({} as Properties, parent))).toEqual(
      ordinal("@fontSize.xlarge"),
    )
  })
})

describe("resolveOpticalPaddingSource", () => {
  it("prefers self buttonSize", () => {
    expect(
      resolveOpticalPaddingSource(
        ctx({
          buttonSize: ordinal("@fontSize.medium"),
        } as unknown as Properties),
      ),
    ).toBe("#buttonSize")
  })

  it("uses self font.size next", () => {
    expect(
      resolveOpticalPaddingSource(
        ctx({
          font: { size: ordinal("@fontSize.medium") },
        } as unknown as Properties),
      ),
    ).toBe("#font.size")
  })

  it("falls back to parent fontSize", () => {
    expect(resolveOpticalPaddingSource(ctx({} as Properties))).toBe(
      "#parent.fontSize",
    )
  })
})

describe("constant source resolvers", () => {
  it("read self background color", () => {
    expect(resolveMatchColorSource()).toBe("#self.background.color")
    expect(resolveHighContrastSource()).toBe("#self.background.color")
  })
})

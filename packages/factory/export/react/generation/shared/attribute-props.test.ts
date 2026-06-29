import { describe, expect, it } from "vitest"

import { ComponentToExport } from "../../../types"
import {
  generateRootAttributePropsString,
  isAttributeKey,
} from "./attribute-props"

describe("isAttributeKey", () => {
  it("recognizes role", () => {
    expect(isAttributeKey("role")).toBe(true)
  })

  it("recognizes aria-* keys", () => {
    expect(isAttributeKey("aria-label")).toBe(true)
    expect(isAttributeKey("aria-hidden")).toBe(true)
  })

  it("rejects ordinary prop keys", () => {
    expect(isAttributeKey("className")).toBe(false)
    expect(isAttributeKey("ariaLabel")).toBe(false)
    expect(isAttributeKey("title")).toBe(false)
  })
})

const componentWithProps = (
  props: Record<string, unknown>,
): ComponentToExport =>
  ({ tree: { dataBinding: { props } } }) as unknown as ComponentToExport

describe("generateRootAttributePropsString", () => {
  it("returns an empty string when there are no attribute props", () => {
    expect(
      generateRootAttributePropsString(
        componentWithProps({ className: {}, title: {} }),
      ),
    ).toBe("")
  })

  it("emits sdn bracket access for each attribute prop", () => {
    expect(
      generateRootAttributePropsString(
        componentWithProps({ role: {}, "aria-label": {}, title: {} }),
      ),
    ).toBe(' role={sdn["role"]} aria-label={sdn["aria-label"]}')
  })
})

import { describe, expect, it } from "bun:test"
import {
  applyCompoundPreset,
  expandShorthand,
  formatCompoundDisplay,
  formatShorthandDisplay,
  getEffectiveProperties,
  getPropertyStatus,
  matchCompoundPreset,
} from "./properties-ui-bridge"
import testTheme from "../../themes/test/test-theme"
import { WORKSPACE_FIXTURE } from "../fixtures/workspace"

describe("properties-ui-bridge core helpers", () => {
  const workspace = WORKSPACE_FIXTURE
  const variantId = "variant-button-default"

  it("returns effective properties without throwing", () => {
    const props = getEffectiveProperties(variantId as any, workspace)
    expect(props).toBeDefined()
    expect(typeof props).toBe("object")
  })

  it("computes property status without throwing", () => {
    const status = getPropertyStatus(variantId as any, workspace)
    expect(status).toBeDefined()
  })

  it("formats compound display with safe defaults", () => {
    const label = formatCompoundDisplay(
      "border",
      variantId as any,
      workspace,
      testTheme,
    )
    expect(typeof label).toBe("string")
  })

  it("formats shorthand display with safe defaults", () => {
    const label = formatShorthandDisplay(
      "margin",
      variantId as any,
      workspace,
      testTheme,
    )
    expect(typeof label).toBe("string")
  })

  it("expands shorthand into compound structure", () => {
    const update = expandShorthand(
      "margin",
      { type: "exact", value: { value: 8, unit: "px" } } as any,
      variantId as any,
      workspace,
    )
    expect(update).toBeDefined()
    expect(update).toHaveProperty("margin")
  })

  it("applies compound preset safely (no-op when not present)", () => {
    const update = applyCompoundPreset(
      "border",
      "Default",
      variantId as any,
      workspace,
      testTheme,
    )
    expect(update).toBeDefined()
  })

  it("matches compound preset or returns null", () => {
    const name = matchCompoundPreset(
      "border",
      variantId as any,
      workspace,
      testTheme,
    )
    expect(name === null || typeof name === "string").toBe(true)
  })

  it("calculates shorthand property status based on sub-properties", () => {
    const status = getPropertyStatus(variantId as any, workspace)

    // Check that the status object is properly structured
    expect(typeof status).toBe("object")
    expect(status).not.toBeNull()

    // Check that if shorthand properties exist, they have proper status
    const shorthandProperties = ["margin", "padding", "corners", "position"]
    const validStatuses = ["set", "unset", "override", "not used"]

    for (const prop of shorthandProperties) {
      if (status.hasOwnProperty(prop)) {
        // Main shorthand property should have a valid status
        expect(validStatuses).toContain(status[prop])

        // Check that sub-properties also have status
        const subProps = ["top", "right", "bottom", "left"]
        for (const subProp of subProps) {
          const subPropKey = `${prop}.${subProp}`
          if (status.hasOwnProperty(subPropKey)) {
            expect(validStatuses).toContain(status[subPropKey])
          }
        }
      }
    }
  })
})

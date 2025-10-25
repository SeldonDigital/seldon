import { describe, expect, it } from "bun:test"
import { ValueType } from "@seldon/core"
import { WORKSPACE_FIXTURE } from "@seldon/core/helpers/fixtures/workspace"
import {
  formatCompoundDisplay,
  formatShorthandDisplay,
  formatValue,
} from "@seldon/core/helpers/properties/properties-ui-bridge"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getNodeById } from "@seldon/core/workspace/helpers/get-node-by-id"
import { flattenNodeProperties } from "./properties-data"

const VARIANT_ID = "variant-button-default"

describe("flattenNodeProperties (editor)", () => {
  it("returns a non-empty, consistently-shaped list", () => {
    const node = getNodeById("variant-button-default", WORKSPACE_FIXTURE)
    const flat = flattenNodeProperties(node, WORKSPACE_FIXTURE, testTheme)
    expect(Array.isArray(flat)).toBe(true)
    expect(flat.length).toBeGreaterThan(0)
    const first = flat[0]
    expect(first).toHaveProperty("key")
    expect(first).toHaveProperty("label")
    expect(first).toHaveProperty("value")
    expect(first).toHaveProperty("actualValue")
    expect(first).toHaveProperty("valueType")
    expect(first).toHaveProperty("controlType")
    expect(first).toHaveProperty("status")
  })

  it("samples allowedValues for a couple of keys", () => {
    const node = getNodeById(VARIANT_ID, WORKSPACE_FIXTURE)
    const rows = flattenNodeProperties(node, WORKSPACE_FIXTURE, testTheme)
    const fontSizeRow = rows.find((r) => r.key === "font.size")
    if (fontSizeRow && fontSizeRow.allowedValues) {
      expect(Array.isArray(fontSizeRow.allowedValues)).toBe(true)
    }
    const borderStyleRow = rows.find((r) => r.key === "border.style")
    if (borderStyleRow && borderStyleRow.allowedValues) {
      expect(Array.isArray(borderStyleRow.allowedValues)).toBe(true)
    }
  })

  it("produces rows with core-backed delegation", () => {
    const node = getNodeById(VARIANT_ID, WORKSPACE_FIXTURE)
    const rows = flattenNodeProperties(node, WORKSPACE_FIXTURE, testTheme)
    expect(Array.isArray(rows)).toBe(true)
    expect(rows.length).toBeGreaterThan(0)
  })

  it("displays compound label via core formatter", () => {
    const node = getNodeById(VARIANT_ID, WORKSPACE_FIXTURE)
    const labelBefore = formatCompoundDisplay(
      "border",
      node!.id,
      WORKSPACE_FIXTURE,
    )
    expect(typeof labelBefore).toBe("string")
  })

  it("displays shorthand label via core formatter", () => {
    const node = getNodeById(VARIANT_ID, WORKSPACE_FIXTURE)
    const label = formatShorthandDisplay("margin", node!.id, WORKSPACE_FIXTURE)
    expect(typeof label).toBe("string")
  })

  it("formats computed values consistently", () => {
    const node = getNodeById(VARIANT_ID, WORKSPACE_FIXTURE)
    const computed = {
      type: ValueType.COMPUTED,
      value: {
        function: "auto_fit",
        input: { basedOn: "#size", factor: 1.25 },
      },
    }
    const text = formatValue("size", computed, node!.id, WORKSPACE_FIXTURE)
    expect(typeof text).toBe("string")
  })
})

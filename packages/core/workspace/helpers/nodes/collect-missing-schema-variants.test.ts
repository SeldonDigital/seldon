import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../components/constants"
import {
  collectMissingSchemaVariants,
  getMissingSchemaVariantIssueForSlot,
  getMissingSchemaVariantMessage,
} from "./collect-missing-schema-variants"

describe("collectMissingSchemaVariants", () => {
  it("returns no issues when referenced variants exist on sidebar", () => {
    const issues = collectMissingSchemaVariants(ComponentId.SIDEBAR)

    expect(issues).toEqual([])
  })

  it("detects a missing variant for any component slot", () => {
    const issue = getMissingSchemaVariantIssueForSlot({
      component: ComponentId.BUTTON,
      variant: "missingVariant",
    })

    expect(issue).toEqual({
      componentId: ComponentId.BUTTON,
      componentName: "Button",
      variantId: "missingVariant",
      variantLabel: "Missing Variant",
      slotKey: "button:missingVariant",
    })
  })

  it("formats dialog copy from issue metadata", () => {
    const message = getMissingSchemaVariantMessage({
      componentId: ComponentId.BUTTON,
      componentName: "Button",
      variantId: "label",
      variantLabel: "Label",
      slotKey: "button:label",
    })

    expect(message).toBe("Button Label does not exist. Use Default Button?")
  })
})

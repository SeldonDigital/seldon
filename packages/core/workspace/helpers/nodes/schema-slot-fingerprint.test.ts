import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../../components/constants"
import { getComponentSchema } from "../../../components/catalog"
import { isComplexSchema } from "../../../components/types"
import { getSchemaSlotFingerprint } from "./schema-slot-fingerprint"

describe("getSchemaSlotFingerprint", () => {
  it("matches default and label variant label slots on Button", () => {
    const schema = getComponentSchema(ComponentId.BUTTON)
    if (!isComplexSchema(schema)) {
      throw new Error("Expected complex Button schema")
    }

    const defaultLabel = schema.default.children?.find(
      (slot) => slot.component === ComponentId.LABEL,
    )
    const labelVariant = schema.variants?.find((variant) => variant.id === "label")
    const variantLabel = labelVariant?.children?.find(
      (slot) => slot.component === ComponentId.LABEL,
    )

    expect(defaultLabel).toBeDefined()
    expect(variantLabel).toBeDefined()
    expect(getSchemaSlotFingerprint(defaultLabel!)).toBe(
      getSchemaSlotFingerprint(variantLabel!),
    )
  })

  it("does not match default and social variant label slots on Button", () => {
    const schema = getComponentSchema(ComponentId.BUTTON)
    if (!isComplexSchema(schema)) {
      throw new Error("Expected complex Button schema")
    }

    const defaultLabel = schema.default.children?.find(
      (slot) => slot.component === ComponentId.LABEL,
    )
    const socialVariant = schema.variants?.find(
      (variant) => variant.id === "social",
    )
    const socialLabel = socialVariant?.children?.find(
      (slot) => slot.component === ComponentId.LABEL,
    )

    expect(defaultLabel).toBeDefined()
    expect(socialLabel).toBeDefined()
    expect(getSchemaSlotFingerprint(defaultLabel!)).not.toBe(
      getSchemaSlotFingerprint(socialLabel!),
    )
  })
})

import { describe, expect, it } from "bun:test"
import { PropertyDisplayCategory } from "../../constants/property-display"
import { getPropertySchemasBySection } from "./get-property-schemas-by-section"

describe("getPropertySchemasBySection", () => {
  it("returns ordered PropertySchema catalog entries for a section", () => {
    const schemas = getPropertySchemasBySection(PropertyDisplayCategory.LAYOUT)
    expect(schemas.length).toBeGreaterThan(0)
    expect(schemas.every((s) => s.displayOrder !== undefined)).toBe(true)
    for (let i = 1; i < schemas.length; i++) {
      expect(schemas[i]!.displayOrder!).toBeGreaterThanOrEqual(
        schemas[i - 1]!.displayOrder!,
      )
    }
    expect(schemas.some((s) => s.name === "margin")).toBe(true)
  })
})

import { describe, expect, it } from "vitest"

import { ComponentId } from "../constants"
import { getComponentSchema } from "./index"

describe("getComponentSchema", () => {
  it("returns the schema for a known component id", () => {
    const schema = getComponentSchema(ComponentId.BUTTON)
    expect(schema.id).toBe(ComponentId.BUTTON)
    expect(schema.properties).toBeDefined()
  })

  it("throws for an unknown component id", () => {
    expect(() => getComponentSchema("not-a-component" as ComponentId)).toThrow()
  })
})

import { catalog } from "@seldon/core/components/catalog"
import type { ComponentId } from "@seldon/core/components/constants"
import { propertyValidators } from "@seldon/core/workspace/middleware/validation/validators/property"
import type { WorkspaceAction } from "@seldon/core/workspace/types"
import { describe, expect, it } from "vitest"

import { normalizeActions } from "../../repair/normalize-actions"
import { settablePropertyKeys } from "./resolve-property-name"

/**
 * The vocabulary contract: every property key offered to the model must, once
 * the repair pass has reshaped it, survive the same key validation the reducer
 * runs on a `set_node_properties` commit. The model picks from an enum built by
 * `settablePropertyKeys` and cannot answer outside it, so any offered key that
 * the validator rejects is a guaranteed dead end -- the failure the user sees
 * as "Property X is not valid for Y" no matter what they typed.
 */

/** Every catalog component that has settable properties. */
const componentsUnderTest = [
  ...catalog.frames,
  ...catalog.primitives,
  ...catalog.elements,
  ...catalog.parts,
  ...catalog.modules,
  ...catalog.screens,
].filter((schema) => Object.keys(schema.properties ?? {}).length > 0)

/** Runs one offered key through repair and the reducer's key validation. */
function validateOfferedKey(componentId: ComponentId, key: string): void {
  const action = {
    type: "set_node_properties",
    payload: { nodeId: "node-under-test", properties: { [key]: "dummy" } },
  } as unknown as WorkspaceAction

  const { actions } = normalizeActions([action])
  const properties = (
    actions[0] as unknown as {
      payload: { properties: Record<string, unknown> }
    }
  ).payload.properties

  propertyValidators.keys(properties, componentId, undefined, {
    rejectDottedKeys: true,
  })
}

describe("settablePropertyKeys vocabulary contract", () => {
  it("covers the whole catalog", () => {
    expect(componentsUnderTest.length).toBeGreaterThan(0)
  })

  for (const schema of componentsUnderTest) {
    it(`every key offered for ${schema.id} is writable`, () => {
      const keys = settablePropertyKeys(schema.id)
      expect(keys.length).toBeGreaterThan(0)

      const rejected: string[] = []
      for (const key of keys) {
        try {
          validateOfferedKey(schema.id, key)
        } catch (caught) {
          rejected.push(`${key}: ${(caught as Error).message}`)
        }
      }
      expect(rejected).toEqual([])
    })
  }
})

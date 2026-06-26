import { describe, expect, it } from "vitest"

import type { Board, EntryNode } from "../../types"
import { mapEntryNodeTypeToRulesEntity } from "./map-entry-node-type-to-rules-entity"
import { isEntryNodeForRules } from "./rules-node-subject"

describe("mapEntryNodeTypeToRulesEntity", () => {
  it("maps node types to rules entities", () => {
    expect(mapEntryNodeTypeToRulesEntity("default")).toBe("defaultVariant")
    expect(mapEntryNodeTypeToRulesEntity("variant")).toBe("userVariant")
    expect(mapEntryNodeTypeToRulesEntity("instance")).toBe("instance")
  })
})

describe("isEntryNodeForRules", () => {
  it("accepts node entries and rejects boards", () => {
    expect(isEntryNodeForRules({ id: "n", type: "variant" } as EntryNode)).toBe(
      true,
    )
    expect(
      isEntryNodeForRules({ id: "i", type: "instance" } as EntryNode),
    ).toBe(true)
    expect(isEntryNodeForRules({ variants: [] } as unknown as Board)).toBe(
      false,
    )
    expect(
      isEntryNodeForRules({ id: "x", type: "weird" } as unknown as EntryNode),
    ).toBe(false)
  })
})

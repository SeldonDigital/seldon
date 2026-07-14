import { describe, expect, it } from "vitest"

import actionSchema from "@seldon/core/workspace/reducers/workspace-action-schema.json"

import {
  ACTION_EXPOSURE,
  EXPOSED_ACTION_TYPES,
  isExposedActionType,
} from "./action-whitelist"

/** Action types found in the generated JSON schema (one anyOf branch per action). */
const schemaActionTypes = (
  actionSchema as {
    anyOf: Array<{
      properties?: { type?: { const?: string; enum?: string[] } }
    }>
  }
).anyOf
  .map(
    (branch) =>
      branch.properties?.type?.const ?? branch.properties?.type?.enum?.[0],
  )
  .filter((type): type is string => typeof type === "string")

describe("ACTION_EXPOSURE classification", () => {
  it("classifies exactly the action types the schema generator sees", () => {
    // The TypeScript `satisfies` clause already enforces this against Core's
    // union at compile time; this runtime cross-check catches a stale
    // workspace-action-schema.json instead.
    expect(new Set(schemaActionTypes)).toEqual(
      new Set(Object.keys(ACTION_EXPOSURE)),
    )
  })

  it("exposes the whitelist: 24 logical actions, 41 concrete types", () => {
    expect(EXPOSED_ACTION_TYPES).toHaveLength(41)

    const logical = new Set(
      EXPOSED_ACTION_TYPES.map((type) =>
        type.startsWith("add_theme_custom_") ? "add_theme_custom_token" : type,
      ),
    )
    expect(logical.size).toBe(24)
  })

  it("keeps every permanent exclusion excluded", () => {
    const permanentlyExcluded = Object.keys(ACTION_EXPOSURE).filter(
      (type) =>
        type.endsWith("_editor_data") ||
        type.startsWith("stubs_") ||
        type === "transcript_add_message" ||
        type === "set_board_credentials" ||
        type === "set_workspace_owner",
    )
    expect(permanentlyExcluded).not.toHaveLength(0)
    for (const type of permanentlyExcluded) {
      expect(ACTION_EXPOSURE[type as keyof typeof ACTION_EXPOSURE], type).toBe(
        "excluded",
      )
    }
  })

  it("never exposes the raw whole-workspace write path", () => {
    expect(ACTION_EXPOSURE.set_workspace).toBe("excluded")
    expect(isExposedActionType("set_workspace")).toBe(false)
  })
})

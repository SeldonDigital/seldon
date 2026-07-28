import { describe, expect, it } from "vitest"

import { ALL_ACTION_TYPES } from "./action-schema"
import {
  THEME_CUSTOM_TOKEN_ACTIONS,
  V1_EXPOSED_ACTION_TYPES,
  V1_INTENTS,
  V1_INTENT_BY_KEY,
  V1_INTENT_KEYS,
} from "./v1-vocabulary"

describe("v1 vocabulary", () => {
  it("names only action types that exist in the generated schema", () => {
    const known = new Set(ALL_ACTION_TYPES)
    for (const type of V1_EXPOSED_ACTION_TYPES) {
      expect(known.has(type), `unknown action type: ${type}`).toBe(true)
    }
  })

  it("has unique intent keys", () => {
    expect(new Set(V1_INTENT_KEYS).size).toBe(V1_INTENT_KEYS.length)
  })

  it("covers all 18 theme custom-token actions as one logical entry", () => {
    expect(THEME_CUSTOM_TOKEN_ACTIONS).toHaveLength(18)
    const entry = V1_INTENT_BY_KEY.get("add_theme_custom_token")
    expect(entry?.actionTypes).toHaveLength(18)
  })

  it("includes the none escape so constrained decoding is never forced to mislabel", () => {
    expect(V1_INTENT_KEYS).toContain("none")
    expect(V1_INTENT_BY_KEY.get("none")?.actionTypes).toHaveLength(0)
  })

  it("gives every intent a non-empty description for the classifier prompt", () => {
    for (const entry of V1_INTENTS) {
      expect(entry.description.length, entry.intent).toBeGreaterThan(10)
    }
  })
})

import { describe, expect, it } from "vitest"

import type { Workspace } from "../../index"
import { createEmptyWorkspace } from "../helpers/create-empty-workspace"
import {
  isEntryFontCollectionDefault,
  isEntryFontCollectionVariant,
} from "./entry-font-collection"
import { isEntryIconSetDefault } from "./entry-icon-set"
import { isEntryThemeDefault, isEntryThemeVariant } from "./entry-theme"

const ws: Workspace = createEmptyWorkspace()

describe("theme entry guards", () => {
  it("classifies every seeded theme entry by type", () => {
    const themes = Object.values(ws.themes)
    expect(themes.length).toBeGreaterThan(0)
    for (const theme of themes) {
      expect(isEntryThemeDefault(theme)).toBe(theme.type === "default")
      expect(isEntryThemeVariant(theme)).toBe(theme.type === "variant")
    }
  })
})

describe("font-collection entry guards", () => {
  it("classifies every seeded font-collection entry by type", () => {
    const collections = Object.values(ws["font-collections"])
    expect(collections.length).toBeGreaterThan(0)
    for (const collection of collections) {
      expect(isEntryFontCollectionDefault(collection)).toBe(
        collection.type === "default",
      )
      expect(isEntryFontCollectionVariant(collection)).toBe(
        collection.type === "variant",
      )
    }
  })
})

describe("icon-set entry guards", () => {
  it("classifies every seeded icon-set entry by type", () => {
    const iconSets = Object.values(ws["icon-sets"])
    expect(iconSets.length).toBeGreaterThan(0)
    for (const iconSet of iconSets) {
      expect(isEntryIconSetDefault(iconSet)).toBe(iconSet.type === "default")
    }
  })
})

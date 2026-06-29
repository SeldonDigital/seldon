import type { Workspace } from "@seldon/core/workspace/types"
import { describe, expect, it } from "vitest"

import { getThemeSlug } from "./get-theme-slug"

const workspaceWith = (themes: Record<string, unknown>): Workspace =>
  ({ themes }) as unknown as Workspace

describe("getThemeSlug", () => {
  it("kebab-cases the id when no theme entry exists", () => {
    expect(getThemeSlug("highContrast", workspaceWith({}))).toBe("high-contrast")
  })

  it("slugs a default entry from its catalog template id", () => {
    const ws = workspaceWith({
      t1: { id: "t1", type: "default", template: "catalog:highContrast" },
    })
    expect(getThemeSlug("t1", ws)).toBe("high-contrast")
  })

  it("falls back to a default entry's label when the template is not a catalog ref", () => {
    const ws = workspaceWith({
      t1: { id: "t1", type: "default", label: "My Theme" },
    })
    expect(getThemeSlug("t1", ws)).toBe("my-theme")
  })

  it("prepends the root default slug to a variant's label", () => {
    const ws = workspaceWith({
      root: { id: "root", type: "default", template: "catalog:seldon" },
      v: { id: "v", type: "variant", label: "Red", template: "theme:root" },
    })
    expect(getThemeSlug("v", ws)).toBe("seldon-red")
  })

  it("stops cleanly when a variant chain has a cycle", () => {
    const ws = workspaceWith({
      v: { id: "v", type: "variant", label: "Loop", template: "theme:v" },
    })
    expect(getThemeSlug("v", ws)).toBe("loop-loop")
  })
})

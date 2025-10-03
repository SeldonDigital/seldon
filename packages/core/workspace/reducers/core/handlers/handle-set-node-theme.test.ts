import { describe, expect, it } from "bun:test"
import { WORKSPACE_FIXTURE } from "../../../../helpers/fixtures/workspace"
import { ThemeId } from "../../../../themes/types"
import { VariantId } from "../../../types"
import { handleSetNodeTheme } from "./handle-set-node-theme"

describe("handleSetNodeTheme", () => {
  it("should set the theme of a node", () => {
    const result = handleSetNodeTheme(
      {
        nodeId: "variant-button-default",
        theme: "material",
      },
      WORKSPACE_FIXTURE,
    )

    expect(result.byId["variant-button-default"].theme).toBe("material")
  })

  it("should set the theme to null", () => {
    const result = handleSetNodeTheme(
      {
        nodeId: "variant-button-default",
        theme: null,
      },
      WORKSPACE_FIXTURE,
    )

    expect(result.byId["variant-button-default"].theme).toBeNull()
  })

  it("should set the theme of a child node", () => {
    const result = handleSetNodeTheme(
      {
        nodeId: "child-icon-K3GlMKHA",
        theme: "earth",
      },
      WORKSPACE_FIXTURE,
    )

    expect(result.byId["child-icon-K3GlMKHA"].theme).toBe("earth")
  })

  it("should handle setting theme on non-existent node", () => {
    expect(() => {
      handleSetNodeTheme(
        {
          nodeId: "variant-nonexistent-12345" as VariantId,
          theme: "material",
        },
        WORKSPACE_FIXTURE,
      )
    }).toThrow()
  })

  it("should set theme to different theme values", () => {
    const themes: ThemeId[] = [
      "default",
      "material",
      "earth",
      "industrial",
      "pop",
    ]

    themes.forEach((theme) => {
      const result = handleSetNodeTheme(
        {
          nodeId: "variant-button-default",
          theme,
        },
        WORKSPACE_FIXTURE,
      )

      expect(result.byId["variant-button-default"].theme).toBe(theme)
    })
  })
})

import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import customTheme from "../../themes/custom"
import testTheme from "../../themes/test/test-theme"
import { ThemeService } from "./theme.service"

describe("ThemeService", () => {
  const themeService = new ThemeService()

  describe("getObjectThemeId", () => {
    it("should return theme ID for board", () => {
      const board = WORKSPACE_FIXTURE.boards[ComponentId.BUTTON]
      const themeId = themeService.getObjectThemeId(board, WORKSPACE_FIXTURE)

      expect(themeId).toBe("default")
    })

    it("should return theme ID for variant", () => {
      const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const themeId = themeService.getObjectThemeId(variant, WORKSPACE_FIXTURE)

      expect(themeId).toBe("default")
    })

    it("should return theme ID for instance", () => {
      const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]
      const themeId = themeService.getObjectThemeId(instance, WORKSPACE_FIXTURE)

      expect(themeId).toBe("default")
    })
  })

  describe("getNodeThemeId", () => {
    it("should return theme ID for variant with theme", () => {
      const themeId = themeService.getNodeThemeId(
        "variant-button-default",
        WORKSPACE_FIXTURE,
      )
      expect(themeId).toBe("default")
    })

    it("should return default theme for variant without theme", () => {
      const themeId = themeService.getNodeThemeId(
        "variant-icon-default",
        WORKSPACE_FIXTURE,
      )
      expect(themeId).toBe("default")
    })

    it("should inherit theme from parent for instance", () => {
      const themeId = themeService.getNodeThemeId(
        "child-icon-K3GlMKHA",
        WORKSPACE_FIXTURE,
      )
      expect(themeId).toBe("default")
    })
  })

  describe("getObjectTheme", () => {
    it("should return theme for board", () => {
      const board = WORKSPACE_FIXTURE.boards[ComponentId.BUTTON]
      const theme = themeService.getObjectTheme(board, WORKSPACE_FIXTURE)

      expect(theme).toBeDefined()
      expect(theme.id).toBe("default")
    })

    it("should return theme for variant", () => {
      const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]
      const theme = themeService.getObjectTheme(variant, WORKSPACE_FIXTURE)

      expect(theme).toBeDefined()
      expect(theme.id).toBe("default")
    })
  })

  describe("getNodeTheme", () => {
    it("should return theme for node", () => {
      const theme = themeService.getNodeTheme(
        "variant-button-default",
        WORKSPACE_FIXTURE,
      )

      expect(theme).toBeDefined()
      expect(theme.id).toBe("default")
    })

    it("should return default theme for node without theme", () => {
      const theme = themeService.getNodeTheme(
        "variant-icon-default",
        WORKSPACE_FIXTURE,
      )

      expect(theme).toBeDefined()
      expect(theme.id).toBe("default")
    })
  })

  describe("getTheme", () => {
    it("should return theme for theme ID", () => {
      const theme = themeService.getTheme("default", WORKSPACE_FIXTURE)

      expect(theme).toBeDefined()
      expect(theme.id).toBe("default")
    })
  })

  describe("getThemes", () => {
    it("should return all themes from workspace", () => {
      const themes = themeService.getThemes(WORKSPACE_FIXTURE)

      expect(themes.length).toBeGreaterThan(0)
      expect(themes.every((theme) => theme.id)).toBe(true)
    })
  })

  describe("collectUsedThemes", () => {
    it("should collect all used theme IDs", () => {
      const usedThemes = themeService.collectUsedThemes(WORKSPACE_FIXTURE)

      expect(usedThemes.size).toBeGreaterThan(0)
      expect(usedThemes.has("default")).toBe(true)
    })
  })

  describe("getNextCustomSwatchId", () => {
    it("should return next available swatch ID", () => {
      const nextId = themeService.getNextCustomSwatchId(WORKSPACE_FIXTURE)

      expect(nextId).toBeDefined()
      expect(typeof nextId).toBe("string")
    })
  })
})

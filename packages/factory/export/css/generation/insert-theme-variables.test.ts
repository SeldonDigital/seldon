import { describe, expect, it } from "bun:test"
import { Workspace } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { insertThemeVariables } from "./insert-theme-variables"

// Using real implementations instead of mocks to avoid test interference

describe("insertThemeVariables", () => {
  it("should insert theme variables into empty stylesheet", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables("", mockWorkspace)

    expect(result).toContain("Theme variables")
    expect(result).toContain(":root {")
    expect(result).toContain("--sdn-ratio:")
    expect(result).toContain("--sdn-font-size:")
    expect(result).toContain("--sdn-size:")
  })

  it("should append theme variables to existing stylesheet", () => {
    const existingStylesheet =
      "/* Existing styles */\n.existing { color: red; }"
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables(existingStylesheet, mockWorkspace)

    expect(result).toContain("/* Existing styles */")
    expect(result).toContain(".existing { color: red; }")
    expect(result).toContain("Theme variables")
    expect(result).toContain(":root {")
  })

  it("should include core theme values", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables("", mockWorkspace)

    expect(result).toContain("/* Core */")
    expect(result).toContain("--sdn-ratio:")
    expect(result).toContain("--sdn-font-size:")
    expect(result).toContain("--sdn-size:")
  })

  it("should include font family variables", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables("", mockWorkspace)

    expect(result).toContain("/* Font Families */")
    expect(result).toContain("--sdn-font-family-primary:")
    expect(result).toContain("--sdn-font-family-secondary:")
  })

  it("should include color variables", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables("", mockWorkspace)

    expect(result).toContain("/* Colors */")
    expect(result).toContain("--sdn-color-base-hue:")
    expect(result).toContain("--sdn-color-base-saturation:")
    expect(result).toContain("--sdn-color-base-lightness:")
    expect(result).toContain("--sdn-color-harmony:")
    expect(result).toContain("--sdn-color-angle:")
    expect(result).toContain("--sdn-color-step:")
  })

  it("should include swatch variables", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables("", mockWorkspace)

    expect(result).toContain("/* Swatches */")
    expect(result).toContain("--sdn-swatch-")
  })

  it("should include size tokens", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables("", mockWorkspace)

    expect(result).toContain("/* Sizes */")
    expect(result).toContain("--sdn-size-")
  })

  it("should include spacing tokens", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables("", mockWorkspace)

    expect(result).toContain("/* Margins */")
    expect(result).toContain("/* Paddings */")
    expect(result).toContain("/* Gaps */")
    expect(result).toContain("--sdn-margin-")
    expect(result).toContain("--sdn-padding-")
    expect(result).toContain("--sdn-gap-")
  })

  it("should include typography tokens", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables("", mockWorkspace)

    expect(result).toContain("/* Font Sizes */")
    expect(result).toContain("/* Font Weights */")
    expect(result).toContain("/* Line Heights */")
    expect(result).toContain("--sdn-font-size-")
    expect(result).toContain("--sdn-font-weight-")
    expect(result).toContain("--sdn-line-height-")
  })

  it("should include border and corner tokens", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables("", mockWorkspace)

    expect(result).toContain("/* Corners */")
    expect(result).toContain("/* Border Widths */")
    expect(result).toContain("--sdn-corners-")
    expect(result).toContain("--sdn-border-width-")
  })

  // Note: Multiple themes test removed as it was using mocks that interfered with other tests

  it("should include proper CSS structure", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: [],
        },
      },
      byId: {},
    }

    const result = insertThemeVariables("", mockWorkspace)

    expect(result).toContain("/********************************************")
    expect(result).toContain("*           Theme variables                *")
    expect(result).toContain("********************************************/")
    expect(result).toContain("/* Theme Variables */")
    expect(result).toContain(":root {")
  })

  it("should handle empty workspace", () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const result = insertThemeVariables("", emptyWorkspace)

    expect(result).toContain("Theme variables")
    expect(result).toContain(":root {")
  })
})

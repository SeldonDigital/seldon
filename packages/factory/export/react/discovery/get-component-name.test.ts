import { describe, expect, it } from "bun:test"
import { Workspace } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { getComponentName } from "./get-component-name"

describe("getComponentName", () => {
  it("should extract component name from variant", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {
        "variant-button-primary": {
          id: "variant-button-primary",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Primary",
          theme: "default",
          properties: {},
          isChild: false,
          type: "userVariant",
          instanceOf: "variant-button-default",
          fromSchema: false,
        },
      },
    }

    const variant = mockWorkspace.byId["variant-button-primary"]
    const result = getComponentName(variant, mockWorkspace)

    expect(result).toBe("ButtonPrimary")
  })

  it("should handle variants with default suffix", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const variant = mockWorkspace.byId["variant-button-default"]
    const result = getComponentName(variant, mockWorkspace)

    expect(result).toBe("Button")
  })

  it("should handle complex variant names", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {
        "variant-cardProduct-featured": {
          id: "variant-cardProduct-featured",
          component: ComponentId.CARD_PRODUCT,
          level: ComponentLevel.ELEMENT,
          label: "Product Featured",
          theme: "default",
          properties: {},
          isChild: false,
          type: "userVariant",
          instanceOf: "variant-cardProduct-default",
          fromSchema: false,
        },
      },
    }

    const variant = mockWorkspace.byId["variant-cardProduct-featured"]
    const result = getComponentName(variant, mockWorkspace)

    expect(result).toBe("CardProductProductFeatured")
  })

  it("should handle single word variants", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {
        "variant-icon-default": {
          id: "variant-icon-default",
          component: ComponentId.ICON,
          level: ComponentLevel.ELEMENT,
          label: "Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const variant = mockWorkspace.byId["variant-icon-default"]
    const result = getComponentName(variant, mockWorkspace)

    expect(result).toBe("Icon")
  })

  it("should handle variants with numbers", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {
        "variant-button-2": {
          id: "variant-button-2",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "2",
          theme: "default",
          properties: {},
          isChild: false,
          type: "userVariant",
          instanceOf: "variant-button-default",
          fromSchema: false,
        },
      },
    }

    const variant = mockWorkspace.byId["variant-button-2"]
    const result = getComponentName(variant, mockWorkspace)

    expect(result).toBe("Button2")
  })
})

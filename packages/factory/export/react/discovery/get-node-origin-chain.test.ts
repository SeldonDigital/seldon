import { describe, expect, it } from "bun:test"
import { Workspace } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import { getNodeOriginChain } from "./get-node-origin-chain"

describe("getNodeOriginChain", () => {
  it("should return origin chain for instance node", () => {
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
          variants: ["variant-button-default"],
        },
        [ComponentId.ICON]: {
          id: ComponentId.ICON,
          label: "Icon",
          order: 1,
          theme: "default",
          properties: {},
          variants: ["variant-icon-default"],
        },
      },
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
        "child-button-1": {
          id: "child-button-1",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button 1",
          theme: "default",
          instanceOf: "variant-button-default",
          properties: {},
          isChild: true,
          variant: "variant-button-default",
          fromSchema: false,
        },
        "child-icon-1": {
          id: "child-icon-1",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Icon 1",
          theme: "default",
          instanceOf: "child-button-1",
          properties: {},
          isChild: true,
          variant: "variant-icon-default",
          fromSchema: false,
        },
        "variant-icon-default": {
          id: "variant-icon-default",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Default",
          theme: "default",
          properties: {},
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
        },
      },
    }

    const node = mockWorkspace.byId["child-icon-1"]
    const result = getNodeOriginChain(node, mockWorkspace)

    expect(result).toHaveLength(3)
    expect(result[0].id).toBe("child-icon-1")
    expect(result[1].id).toBe("child-button-1")
    expect(result[2].id).toBe("variant-button-default")
  })

  it("should return single node for variant", () => {
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
          variants: ["variant-button-default"],
        },
      },
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

    const node = mockWorkspace.byId["variant-button-default"]
    const result = getNodeOriginChain(node, mockWorkspace)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("variant-button-default")
  })

  it("should handle node with no parent", () => {
    const mockWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {
        "child-button-orphan": {
          id: "child-button-orphan",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Orphan",
          theme: "default",
          properties: {},
          isChild: true,
          variant: "variant-button-default",
          fromSchema: false,
        } as any,
      },
    }

    const node = mockWorkspace.byId["child-button-orphan"] as any
    const result = getNodeOriginChain(node, mockWorkspace)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("child-button-orphan")
  })

  it("should handle empty workspace", () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }

    const node = {
      id: "variant-button-test",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Test",
      theme: "default",
      properties: {},
      isChild: false,
      type: "defaultVariant",
      fromSchema: true,
    }

    const result = getNodeOriginChain(node as any, emptyWorkspace)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("variant-button-test")
  })

  it("should stop at variant in chain", () => {
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
          variants: ["variant-button-default"],
        },
      },
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
        "child-button-1": {
          id: "child-button-1",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Button 1",
          theme: "default",
          instanceOf: "variant-button-default",
          properties: {},
          isChild: true,
          variant: "variant-button-default",
          fromSchema: false,
        },
      },
    }

    const node = mockWorkspace.byId["child-button-1"]
    const result = getNodeOriginChain(node, mockWorkspace)

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe("child-button-1")
    expect(result[1].id).toBe("variant-button-default")
  })
})

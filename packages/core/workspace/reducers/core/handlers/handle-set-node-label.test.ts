import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { UserVariant, Workspace } from "../../../types"
import { handleSetNodeLabel } from "./handle-set-node-label"

describe("handleSetNodeLabel", () => {
  it("should set the label of a node", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {
        "variant-button-primary": {
          id: "variant-button-primary",
          component: ComponentId.BUTTON,
          children: [],
          label: "",
          instanceOf: "variant-button-default",
          isChild: false,
          fromSchema: false,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "userVariant",
          properties: {},
        },
      },
      customTheme,
    }

    const result = handleSetNodeLabel(
      {
        nodeId: "variant-button-primary",
        label: "Primary Button",
      },
      workspace,
    )

    const node = result.byId["variant-button-primary"] as UserVariant
    expect(node.label).toBe("Primary Button")
  })

  it("should not set the label of a default variant (not allowed by rules)", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {
        "variant-icon-default": {
          id: "variant-icon-default",
          component: ComponentId.ICON,
          children: [],
          label: "Icon",
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.PRIMITIVE,
          theme: null,
          type: "defaultVariant",
          properties: {},
        },
      },
      customTheme,
    }

    const result = handleSetNodeLabel(
      {
        nodeId: "variant-icon-default",
        label: "Custom Icon",
      },
      workspace,
    )

    const node = result.byId["variant-icon-default"]
    // Default variants cannot be renamed according to rules
    expect(node.label).toBe("Icon")
  })

  it("should handle setting label on non-existent node", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    expect(() => {
      handleSetNodeLabel(
        {
          nodeId: "variant-button-default",
          label: "New Label",
        },
        workspace,
      )
    }).toThrow()
  })

  it("should set label to empty string", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {
        "variant-button-primary": {
          id: "variant-button-primary",
          component: ComponentId.BUTTON,
          children: [],
          label: "Original Label",
          instanceOf: "variant-button-default",
          isChild: false,
          fromSchema: false,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "userVariant",
          properties: {},
        },
      },
      customTheme,
    }

    const result = handleSetNodeLabel(
      {
        nodeId: "variant-button-primary",
        label: "",
      },
      workspace,
    )

    const node = result.byId["variant-button-primary"] as UserVariant
    expect(node.label).toBe("")
  })

  it("should set label to long text", () => {
    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {
        "variant-button-primary": {
          id: "variant-button-primary",
          component: ComponentId.BUTTON,
          children: [],
          label: "Short",
          instanceOf: "variant-button-default",
          isChild: false,
          fromSchema: false,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "userVariant",
          properties: {},
        },
      },
      customTheme,
    }

    const longLabel =
      "This is a very long label that might be used for descriptive purposes"

    const result = handleSetNodeLabel(
      {
        nodeId: "variant-button-primary",
        label: longLabel,
      },
      workspace,
    )

    const node = result.byId["variant-button-primary"] as UserVariant
    expect(node.label).toBe(longLabel)
  })
})

import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { handleSetWorkspace } from "./handle-set-workspace"

describe("handleSetWorkspace", () => {
  it("should set a new workspace with boards and nodes", () => {
    const newWorkspace: Workspace = {
      version: 1,
      boards: {
        button: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {},
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          label: "Default",
          component: ComponentId.BUTTON,
          children: [],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "defaultVariant",
          properties: {},
        },
      },
      customTheme,
    }

    const result = handleSetWorkspace({
      workspace: newWorkspace,
    })

    expect(result).toEqual(newWorkspace)
  })

  it("should set an empty workspace", () => {
    const emptyWorkspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme,
    }

    const result = handleSetWorkspace({
      workspace: emptyWorkspace,
    })

    expect(result).toEqual(emptyWorkspace)
  })

  it("should set a workspace with multiple boards and variants", () => {
    const complexWorkspace: Workspace = {
      version: 1,
      boards: {
        button: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default", "variant-button-secondary"],
          properties: {},
        },
        icon: {
          id: ComponentId.ICON,
          label: "Icon",
          order: 1,
          theme: "material",
          variants: ["variant-icon-default"],
          properties: {},
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          label: "Default",
          component: ComponentId.BUTTON,
          children: [],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "defaultVariant",
          properties: {},
        },
        "variant-button-secondary": {
          id: "variant-button-secondary",
          label: "Secondary",
          component: ComponentId.BUTTON,
          children: [],
          isChild: false,
          fromSchema: false,
          level: ComponentLevel.ELEMENT,
          theme: "earth",
          type: "userVariant",
          instanceOf: "variant-button-default",
          properties: {},
        },
        "variant-icon-default": {
          id: "variant-icon-default",
          label: "Default",
          component: ComponentId.ICON,
          children: [],
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

    const result = handleSetWorkspace({
      workspace: complexWorkspace,
    })

    expect(result).toEqual(complexWorkspace)
  })

  it("should set a workspace with nested child nodes", () => {
    const nestedWorkspace: Workspace = {
      version: 1,
      boards: {
        button: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          variants: ["variant-button-default"],
          properties: {},
        },
      },
      byId: {
        "variant-button-default": {
          id: "variant-button-default",
          label: "Default",
          component: ComponentId.BUTTON,
          children: ["child-icon-1", "child-label-1"],
          isChild: false,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          theme: null,
          type: "defaultVariant",
          properties: {},
        },
        "child-icon-1": {
          id: "child-icon-1",
          label: "Icon",
          component: ComponentId.ICON,
          children: [],
          isChild: true,
          fromSchema: true,
          level: ComponentLevel.PRIMITIVE,
          theme: null,
          variant: "variant-icon-default",
          instanceOf: "variant-icon-default",
          properties: {},
        },
        "child-label-1": {
          id: "child-label-1",
          label: "Label",
          component: ComponentId.LABEL,
          children: [],
          isChild: true,
          fromSchema: true,
          level: ComponentLevel.PRIMITIVE,
          theme: null,
          variant: "variant-label-default",
          instanceOf: "variant-label-default",
          properties: {},
        },
      },
      customTheme,
    }

    const result = handleSetWorkspace({
      workspace: nestedWorkspace,
    })

    expect(result).toEqual(nestedWorkspace)
  })
})

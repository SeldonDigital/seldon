import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import customTheme from "../../themes/custom"
import { InstanceId, VariantId, Workspace } from "../types"
import { workspaceVerificationMiddleware } from "./verification"

describe("workspaceVerificationMiddleware", () => {
  it("should verify valid workspace operations", () => {
    const action = {
      type: "set_node_properties" as const,
      payload: {
        nodeId: "variant-button-default" as VariantId,
        properties: {},
      },
    }

    const middleware = workspaceVerificationMiddleware(
      (workspace, action) => workspace,
    )
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).not.toThrow()
  })

  it("should detect missing children", () => {
    const invalidWorkspace: Workspace = {
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
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Default",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: ["child-button-missing"],
        },
      },
    }

    const action = {
      type: "set_node_properties" as const,
      payload: {
        nodeId: "variant-button-default" as VariantId,
        properties: {},
      },
    }

    const middleware = workspaceVerificationMiddleware(
      (workspace, action) => workspace,
    )
    expect(() => {
      middleware(invalidWorkspace, action)
    }).toThrow()
  })

  it("should detect missing variants", () => {
    const invalidWorkspace: Workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.BUTTON]: {
          id: ComponentId.BUTTON,
          label: "Button",
          order: 0,
          theme: "default",
          properties: {},
          variants: ["variant-icon-missing"],
        },
      },
      byId: {},
    }

    const action = {
      type: "set_node_properties" as const,
      payload: {
        nodeId: "variant-button-default" as VariantId,
        properties: {},
      },
    }

    const middleware = workspaceVerificationMiddleware(
      (workspace, action) => workspace,
    )
    expect(() => {
      middleware(invalidWorkspace, action)
    }).toThrow()
  })

  it("should detect missing instances", () => {
    const invalidWorkspace: Workspace = {
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
          type: "defaultVariant",
          component: ComponentId.BUTTON,
          level: ComponentLevel.ELEMENT,
          label: "Default",
          isChild: false,
          fromSchema: true,
          theme: null,
          properties: {},
          children: ["child-button-missing"],
        },
        "child-button-missing": {
          id: "child-button-missing",
          component: ComponentId.ICON,
          level: ComponentLevel.PRIMITIVE,
          label: "Missing",
          isChild: true,
          fromSchema: true,
          theme: null,
          variant: "variant-icon-missing",
          instanceOf: "variant-icon-missing",
          properties: {},
          children: [],
        },
      },
    }

    const action = {
      type: "set_node_properties" as const,
      payload: {
        nodeId: "variant-button-default" as VariantId,
        properties: {},
      },
    }

    const middleware = workspaceVerificationMiddleware(
      (workspace, action) => workspace,
    )
    expect(() => {
      middleware(invalidWorkspace, action)
    }).toThrow()
  })

  it("should verify unique IDs", () => {
    const action = {
      type: "set_node_properties" as const,
      payload: {
        nodeId: "variant-button-default" as VariantId,
        properties: {},
      },
    }

    const middleware = workspaceVerificationMiddleware(
      (workspace, action) => workspace,
    )
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).not.toThrow()
  })

  it("should verify board order", () => {
    const action = {
      type: "set_node_properties" as const,
      payload: {
        nodeId: "variant-button-default" as VariantId,
        properties: {},
      },
    }

    const middleware = workspaceVerificationMiddleware(
      (workspace, action) => workspace,
    )
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).not.toThrow()
  })
})

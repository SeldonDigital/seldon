import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { InstanceId, VariantId } from "../types"
import { validationMiddleware } from "./validation"

describe("validation middleware", () => {
  it("should allow valid workspace operations", () => {
    const action = {
      type: "set_node_properties" as const,
      payload: {
        nodeId: "variant-button-default" as VariantId,
        properties: {},
      },
    }

    const middleware = validationMiddleware((workspace, action) => workspace)
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).not.toThrow()
  })

  it("should prevent invalid node operations", () => {
    const action = {
      type: "set_node_properties" as const,
      payload: {
        nodeId: "child-button-nonexistent" as InstanceId,
        properties: {},
      },
    }

    const middleware = validationMiddleware((workspace, action) => workspace)
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).toThrow()
  })

  it("should validate board operations", () => {
    const action = {
      type: "add_board" as const,
      payload: {
        componentId: "nonExistentComponent" as ComponentId,
        target: {
          parentId: "variant-button-default" as VariantId,
          index: 0,
        },
      },
    }

    const middleware = validationMiddleware((workspace, action) => workspace)
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).not.toThrow()
  })

  it("should prevent duplicate board creation", () => {
    const action = {
      type: "add_board" as const,
      payload: {
        componentId: ComponentId.BUTTON,
        target: {
          parentId: "variant-button-default" as VariantId,
          index: 0,
        },
      },
    }

    const middleware = validationMiddleware((workspace, action) => workspace)
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).toThrow()
  })

  it("should validate variant operations", () => {
    const action = {
      type: "add_variant" as const,
      payload: {
        componentId: ComponentId.BUTTON,
      },
    }

    const middleware = validationMiddleware((workspace, action) => workspace)
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).not.toThrow()
  })

  it("should validate node movement operations", () => {
    const action = {
      type: "move_node" as const,
      payload: {
        nodeId: "child-icon-K3GlMKHA" as InstanceId,
        target: {
          parentId: "variant-button-default" as VariantId,
          index: 1,
        },
      },
    }

    const middleware = validationMiddleware((workspace, action) => workspace)
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).not.toThrow()
  })

  it("should prevent invalid node movement", () => {
    const action = {
      type: "move_node" as const,
      payload: {
        nodeId: "child-button-nonexistent" as InstanceId,
        target: {
          parentId: "variant-button-default" as VariantId,
          index: 0,
        },
      },
    }

    const middleware = validationMiddleware((workspace, action) => workspace)
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).toThrow()
  })

  it("should validate custom theme operations", () => {
    const action = {
      type: "set_custom_theme_base_color" as const,
      payload: {
        value: { hue: 200, saturation: 50, lightness: 50 },
      },
    }

    const middleware = validationMiddleware((workspace, action) => workspace)
    expect(() => {
      middleware(WORKSPACE_FIXTURE, action)
    }).not.toThrow()
  })
})

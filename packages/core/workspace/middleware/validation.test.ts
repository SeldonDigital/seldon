import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { ValueType } from "../../properties"
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

  describe("property value validation", () => {
    it("should reject invalid RGB values (out of range)", () => {
      const action = {
        type: "set_node_properties" as const,
        payload: {
          nodeId: "variant-button-default" as VariantId,
          properties: {
            color: {
              type: ValueType.EXACT,
              value: "rgb(0 0 256)",
            },
          },
        },
      }
      const middleware = validationMiddleware((workspace, action) => workspace)
      expect(() => middleware(WORKSPACE_FIXTURE, action)).toThrow(
        "Invalid color value",
      )
    })

    it("should reject invalid HSL values (out of range)", () => {
      const action = {
        type: "set_node_properties" as const,
        payload: {
          nodeId: "variant-button-default" as VariantId,
          properties: {
            color: {
              type: ValueType.EXACT,
              value: "hsl(400, 50%, 50%)",
            },
          },
        },
      }
      const middleware = validationMiddleware((workspace, action) => workspace)
      expect(() => middleware(WORKSPACE_FIXTURE, action)).toThrow(
        "Invalid color value",
      )
    })

    it("should reject invalid LCH values (out of range)", () => {
      const action = {
        type: "set_node_properties" as const,
        payload: {
          nodeId: "variant-button-default" as VariantId,
          properties: {
            color: {
              type: ValueType.EXACT,
              value: "lch(150% 200 120deg)",
            },
          },
        },
      }
      const middleware = validationMiddleware((workspace, action) => workspace)
      expect(() => middleware(WORKSPACE_FIXTURE, action)).toThrow(
        "Invalid color value",
      )
    })

    it("should reject invalid hex values", () => {
      const action = {
        type: "set_node_properties" as const,
        payload: {
          nodeId: "variant-button-default" as VariantId,
          properties: {
            color: {
              type: ValueType.EXACT,
              value: "#gggggg",
            },
          },
        },
      }
      const middleware = validationMiddleware((workspace, action) => workspace)
      expect(() => middleware(WORKSPACE_FIXTURE, action)).toThrow(
        "Invalid color value",
      )
    })

    it("should accept valid RGB values", () => {
      const action = {
        type: "set_node_properties" as const,
        payload: {
          nodeId: "variant-button-default" as VariantId,
          properties: {
            color: {
              type: ValueType.EXACT,
              value: "rgb(0 0 255)",
            },
          },
        },
      }
      const middleware = validationMiddleware((workspace, action) => workspace)
      expect(() => middleware(WORKSPACE_FIXTURE, action)).not.toThrow()
    })

    it("should accept valid HSL values", () => {
      const action = {
        type: "set_node_properties" as const,
        payload: {
          nodeId: "variant-button-default" as VariantId,
          properties: {
            color: {
              type: ValueType.EXACT,
              value: "hsl(120, 50%, 50%)",
            },
          },
        },
      }
      const middleware = validationMiddleware((workspace, action) => workspace)
      expect(() => middleware(WORKSPACE_FIXTURE, action)).not.toThrow()
    })

    it("should accept valid LCH values", () => {
      const action = {
        type: "set_node_properties" as const,
        payload: {
          nodeId: "variant-button-default" as VariantId,
          properties: {
            color: {
              type: ValueType.EXACT,
              value: "lch(50% 100 120deg)",
            },
          },
        },
      }
      const middleware = validationMiddleware((workspace, action) => workspace)
      expect(() => middleware(WORKSPACE_FIXTURE, action)).not.toThrow()
    })

    it("should accept valid hex values", () => {
      const action = {
        type: "set_node_properties" as const,
        payload: {
          nodeId: "variant-button-default" as VariantId,
          properties: {
            color: {
              type: ValueType.EXACT,
              value: "#ff0000",
            },
          },
        },
      }
      const middleware = validationMiddleware((workspace, action) => workspace)
      expect(() => middleware(WORKSPACE_FIXTURE, action)).not.toThrow()
    })

    it("should validate board properties", () => {
      const action = {
        type: "set_board_properties" as const,
        payload: {
          componentId: ComponentId.BUTTON,
          properties: {
            color: {
              type: ValueType.EXACT,
              value: "rgb(0 0 256)",
            },
          },
        },
      }
      const middleware = validationMiddleware((workspace, action) => workspace)
      expect(() => middleware(WORKSPACE_FIXTURE, action)).toThrow(
        "Invalid color value",
      )
    })

    it("should validate AI actions", () => {
      const action = {
        type: "ai_set_node_properties" as const,
        payload: {
          nodeId: "variant-button-default" as VariantId,
          properties: {
            color: {
              type: ValueType.EXACT,
              value: "hsl(400, 50%, 50%)",
            },
          },
        },
      }
      const middleware = validationMiddleware((workspace, action) => workspace)
      expect(() => middleware(WORKSPACE_FIXTURE, action)).toThrow(
        "Invalid color value",
      )
    })
  })
})

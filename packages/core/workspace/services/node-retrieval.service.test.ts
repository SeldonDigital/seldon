import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { nodeRetrievalService } from "./node-retrieval.service"

describe("nodeRetrievalService", () => {
  describe("getBoard", () => {
    it("should return board for existing component", () => {
      const board = nodeRetrievalService.getBoard(
        ComponentId.BUTTON,
        WORKSPACE_FIXTURE,
      )

      expect(board.id).toBe(ComponentId.BUTTON)
      expect(board.label).toBe("Buttons")
      expect(board.variants).toContain("variant-button-default")
    })

    it("should throw error for non-existent component", () => {
      expect(() => {
        nodeRetrievalService.getBoard(
          "non-existent" as ComponentId,
          WORKSPACE_FIXTURE,
        )
      }).toThrow()
    })
  })

  describe("getNode", () => {
    it("should return node for existing node ID", () => {
      const node = nodeRetrievalService.getNode(
        "variant-button-default",
        WORKSPACE_FIXTURE,
      )

      expect(node.id).toBe("variant-button-default")
      expect(node.component).toBe(ComponentId.BUTTON)
      expect(node.level).toBe(ComponentLevel.ELEMENT)
    })

    it("should throw error for non-existent node", () => {
      expect(() => {
        nodeRetrievalService.getNode("non-existent-node", WORKSPACE_FIXTURE)
      }).toThrow()
    })
  })

  describe("getObject", () => {
    it("should return board for component ID", () => {
      const object = nodeRetrievalService.getObject(
        ComponentId.BUTTON,
        WORKSPACE_FIXTURE,
      )

      expect(object).toHaveProperty("id", ComponentId.BUTTON)
      expect(object).toHaveProperty("label", "Buttons")
    })

    it("should return node for node ID", () => {
      const object = nodeRetrievalService.getObject(
        "variant-button-default",
        WORKSPACE_FIXTURE,
      )

      expect(object).toHaveProperty("id", "variant-button-default")
      expect(object).toHaveProperty("component", ComponentId.BUTTON)
    })

    it("should throw error for non-existent ID", () => {
      expect(() => {
        nodeRetrievalService.getObject("non-existent" as any, WORKSPACE_FIXTURE)
      }).toThrow()
    })
  })

  describe("getNodes", () => {
    it("should return all nodes from workspace", () => {
      const nodes = nodeRetrievalService.getNodes(WORKSPACE_FIXTURE)

      expect(nodes.length).toBeGreaterThan(0)
      expect(nodes.every((node) => node.id && node.component)).toBe(true)
    })
  })

  describe("getVariant", () => {
    it("should return variant for existing variant ID", () => {
      const variant = nodeRetrievalService.getVariant(
        "variant-button-default",
        WORKSPACE_FIXTURE,
      )

      expect(variant.id).toBe("variant-button-default")
      expect(variant.component).toBe(ComponentId.BUTTON)
    })

    it("should throw error for non-existent variant", () => {
      expect(() => {
        nodeRetrievalService.getVariant(
          "non-existent-variant",
          WORKSPACE_FIXTURE,
        )
      }).toThrow()
    })
  })

  describe("getDefaultVariant", () => {
    it("should return default variant for component", () => {
      const variant = nodeRetrievalService.getDefaultVariant(
        ComponentId.BUTTON,
        WORKSPACE_FIXTURE,
      )

      expect(variant.id).toBe("variant-button-default")
      expect(variant.component).toBe(ComponentId.BUTTON)
      expect(variant.type).toBe("defaultVariant")
    })

    it("should throw error for non-existent component", () => {
      expect(() => {
        nodeRetrievalService.getDefaultVariant(
          "non-existent" as ComponentId,
          WORKSPACE_FIXTURE,
        )
      }).toThrow()
    })
  })

  describe("getInstance", () => {
    it("should return instance for existing instance ID", () => {
      const instance = nodeRetrievalService.getInstance(
        "child-icon-K3GlMKHA",
        WORKSPACE_FIXTURE,
      )

      expect(instance.id).toBe("child-icon-K3GlMKHA")
      expect(instance.component).toBe(ComponentId.ICON)
      expect(instance.isChild).toBe(true)
    })

    it("should throw error for non-existent instance", () => {
      expect(() => {
        nodeRetrievalService.getInstance(
          "non-existent-instance",
          WORKSPACE_FIXTURE,
        )
      }).toThrow()
    })

    it("should throw error for variant ID", () => {
      expect(() => {
        nodeRetrievalService.getInstance(
          "variant-button-default",
          WORKSPACE_FIXTURE,
        )
      }).toThrow()
    })
  })
})

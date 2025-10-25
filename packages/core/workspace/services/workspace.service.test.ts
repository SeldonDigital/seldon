import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { Unit, ValueType } from "../../properties"
import customTheme from "../../themes/custom"
import { workspaceService } from "./workspace.service"

describe("workspaceService", () => {
  describe("getBoard", () => {
    it("should return board for existing component", () => {
      const board = workspaceService.getBoard(
        ComponentId.BUTTON,
        WORKSPACE_FIXTURE,
      )

      expect(board.id).toBe(ComponentId.BUTTON)
      expect(board.label).toBe("Buttons")
      expect(board.variants).toContain("variant-button-default")
    })

    it("should throw error for non-existent component", () => {
      expect(() => {
        workspaceService.getBoard(
          "non-existent" as ComponentId,
          WORKSPACE_FIXTURE,
        )
      }).toThrow()
    })
  })

  describe("getNode", () => {
    it("should return node for existing node ID", () => {
      const node = workspaceService.getNode(
        "variant-button-default",
        WORKSPACE_FIXTURE,
      )

      expect(node.id).toBe("variant-button-default")
      expect(node.component).toBe(ComponentId.BUTTON)
      expect(node.level).toBe(ComponentLevel.ELEMENT)
    })

    it("should throw error for non-existent node", () => {
      expect(() => {
        workspaceService.getNode("non-existent-node", WORKSPACE_FIXTURE)
      }).toThrow()
    })
  })

  describe("getObject", () => {
    it("should return board for component ID", () => {
      const object = workspaceService.getObject(
        ComponentId.BUTTON,
        WORKSPACE_FIXTURE,
      )

      expect(object).toHaveProperty("id", ComponentId.BUTTON)
      expect(object).toHaveProperty("label", "Buttons")
    })

    it("should return node for node ID", () => {
      const object = workspaceService.getObject(
        "variant-button-default",
        WORKSPACE_FIXTURE,
      )

      expect(object).toHaveProperty("id", "variant-button-default")
      expect(object).toHaveProperty("component", ComponentId.BUTTON)
    })
  })

  describe("setNodeProperties", () => {
    it("should set properties on a node", () => {
      const properties = {
        screenWidth: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 600 },
        },
      }

      const result = workspaceService.setNodeProperties(
        "variant-button-default",
        properties,
        WORKSPACE_FIXTURE,
      )

      expect(result.byId["variant-button-default"].properties).toEqual(
        properties,
      )
    })

    it("should throw error for non-existent node", () => {
      expect(() => {
        workspaceService.setNodeProperties(
          "non-existent-node",
          {},
          WORKSPACE_FIXTURE,
        )
      }).toThrow()
    })
  })

  describe("moveNode", () => {
    it("should move a node to new parent", () => {
      const result = workspaceService.moveNode(
        "child-icon-K3GlMKHA",
        { parentId: "variant-button-default", index: 1 },
        WORKSPACE_FIXTURE,
      )

      expect(result.byId["variant-button-default"].children).toContain(
        "child-icon-K3GlMKHA",
      )
      expect(result.byId["variant-button-default"].children![1]).toBe(
        "child-icon-K3GlMKHA",
      )
    })
  })

  describe("isBoard", () => {
    it("should return true for board object", () => {
      const board = WORKSPACE_FIXTURE.boards[ComponentId.BUTTON]
      expect(workspaceService.isBoard(board)).toBe(true)
    })

    it("should return false for node object", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      expect(workspaceService.isBoard(node)).toBe(false)
    })
  })

  describe("isVariant", () => {
    it("should return true for variant node", () => {
      const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]
      expect(workspaceService.isVariant(variant)).toBe(true)
    })

    it("should return false for instance node", () => {
      const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]
      expect(workspaceService.isVariant(instance)).toBe(false)
    })
  })

  describe("isInstance", () => {
    it("should return true for instance node", () => {
      const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]
      expect(workspaceService.isInstance(instance)).toBe(true)
    })

    it("should return false for variant node", () => {
      const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]
      expect(workspaceService.isInstance(variant)).toBe(false)
    })
  })
})

import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { Unit, ValueType } from "../../properties"
import customTheme from "../../themes/custom"
import { workspaceMutationService } from "./workspace-mutation.service"

describe("workspaceMutationService", () => {
  describe("setNodeProperties", () => {
    it("should set properties on a node", () => {
      const properties = {
        screenWidth: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 600 },
        },
      }

      const result = workspaceMutationService.setNodeProperties(
        "variant-button-default",
        properties,
        WORKSPACE_FIXTURE,
      )

      expect(result.byId["variant-button-default"].properties).toEqual(
        properties,
      )
    })

    it("should merge properties with existing properties", () => {
      const newProperties = {
        screenHeight: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 400 },
        },
      }

      const result = workspaceMutationService.setNodeProperties(
        "variant-button-default",
        newProperties,
        WORKSPACE_FIXTURE,
      )

      expect(result.byId["variant-button-default"].properties).toHaveProperty(
        "screenHeight",
      )
    })
  })

  describe("setNodeLabel", () => {
    it("should set label on a node", () => {
      const result = workspaceMutationService.setNodeLabel(
        "variant-button-default",
        "New Label",
        WORKSPACE_FIXTURE,
      )

      expect(result.byId["variant-button-default"].label).toBe("New Label")
    })
  })

  describe("resetNodeProperty", () => {
    it("should reset a property to default", () => {
      const result = workspaceMutationService.resetNodeProperty(
        "variant-button-default",
        "screenWidth",
        WORKSPACE_FIXTURE,
      )

      expect(
        result.byId["variant-button-default"].properties,
      ).not.toHaveProperty("screenWidth")
    })
  })

  describe("setBoardProperties", () => {
    it("should set properties on a board", () => {
      const properties = {
        customProperty: {
          type: ValueType.EXACT,
          value: "test",
        },
      }

      const result = workspaceMutationService.setBoardProperties(
        ComponentId.BUTTON,
        properties,
        WORKSPACE_FIXTURE,
      )

      expect(result.boards[ComponentId.BUTTON].properties).toEqual(properties)
    })
  })

  describe("setBoardTheme", () => {
    it("should set theme on a board", () => {
      const result = workspaceMutationService.setBoardTheme(
        ComponentId.BUTTON,
        "material",
        WORKSPACE_FIXTURE,
      )

      expect(result.boards[ComponentId.BUTTON].theme).toBe("material")
    })
  })

  describe("setNodeTheme", () => {
    it("should set theme on a node", () => {
      const result = workspaceMutationService.setNodeTheme(
        "variant-button-default",
        "material",
        WORKSPACE_FIXTURE,
      )

      expect(result.byId["variant-button-default"].theme).toBe("material")
    })
  })

  describe("getInitialBoardLabel", () => {
    it("should return initial board label", () => {
      const label = workspaceMutationService.getInitialBoardLabel(
        ComponentId.BUTTON,
      )

      expect(label).toBe("Buttons")
    })
  })

  describe("getInitialVariantLabel", () => {
    it("should return initial variant label", () => {
      const label = workspaceMutationService.getInitialVariantLabel(
        ComponentId.BUTTON,
        WORKSPACE_FIXTURE.byId,
      )

      expect(label).toBe("Variant01")
    })
  })
})

import { describe, expect, it } from "bun:test"
import { ComponentId } from "../../components/constants"
import { WORKSPACE_FIXTURE } from "../../helpers/fixtures/workspace"
import { typeCheckingService } from "./type-checking.service"

describe("typeCheckingService", () => {
  describe("isBoard", () => {
    it("should return true for board object", () => {
      const board = WORKSPACE_FIXTURE.boards[ComponentId.BUTTON]
      expect(typeCheckingService.isBoard(board)).toBe(true)
    })

    it("should return false for node object", () => {
      const node = WORKSPACE_FIXTURE.byId["variant-button-default"]
      expect(typeCheckingService.isBoard(node)).toBe(false)
    })

    it("should handle null gracefully", () => {
      expect(() => typeCheckingService.isBoard(null as any)).toThrow()
    })

    it("should handle undefined gracefully", () => {
      expect(() => typeCheckingService.isBoard(undefined as any)).toThrow()
    })
  })

  describe("isVariant", () => {
    it("should return true for variant node", () => {
      const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]
      expect(typeCheckingService.isVariant(variant)).toBe(true)
    })

    it("should return true for user variant", () => {
      const userVariant = WORKSPACE_FIXTURE.byId["variant-button-user"]
      expect(typeCheckingService.isVariant(userVariant)).toBe(true)
    })

    it("should return false for instance node", () => {
      const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]
      expect(typeCheckingService.isVariant(instance)).toBe(false)
    })

    it("should handle null gracefully", () => {
      expect(() => typeCheckingService.isVariant(null as any)).toThrow()
    })
  })

  describe("isInstance", () => {
    it("should return true for instance node", () => {
      const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]
      expect(typeCheckingService.isInstance(instance)).toBe(true)
    })

    it("should return false for variant node", () => {
      const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]
      expect(typeCheckingService.isInstance(variant)).toBe(false)
    })

    it("should handle null gracefully", () => {
      expect(() => typeCheckingService.isInstance(null as any)).toThrow()
    })
  })

  describe("isDefaultVariant", () => {
    it("should return true for default variant", () => {
      const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]
      expect(typeCheckingService.isDefaultVariant(variant)).toBe(true)
    })

    it("should return false for user variant", () => {
      const userVariant = WORKSPACE_FIXTURE.byId["variant-button-user"]
      expect(typeCheckingService.isDefaultVariant(userVariant)).toBe(false)
    })

    it("should return false for instance", () => {
      const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]
      expect(typeCheckingService.isDefaultVariant(instance)).toBe(false)
    })
  })

  describe("isUserVariant", () => {
    it("should return true for user variant", () => {
      const userVariant = WORKSPACE_FIXTURE.byId["variant-button-user"]
      expect(typeCheckingService.isUserVariant(userVariant)).toBe(true)
    })

    it("should return false for default variant", () => {
      const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]
      expect(typeCheckingService.isUserVariant(variant)).toBe(false)
    })

    it("should return false for instance", () => {
      const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]
      expect(typeCheckingService.isUserVariant(instance)).toBe(false)
    })
  })

  describe("isNode", () => {
    it("should return true for variant node", () => {
      const variant = WORKSPACE_FIXTURE.byId["variant-button-default"]
      expect(typeCheckingService.isNode(variant)).toBe(true)
    })

    it("should return true for instance node", () => {
      const instance = WORKSPACE_FIXTURE.byId["child-icon-K3GlMKHA"]
      expect(typeCheckingService.isNode(instance)).toBe(true)
    })

    it("should return false for board", () => {
      const board = WORKSPACE_FIXTURE.boards[ComponentId.BUTTON]
      expect(typeCheckingService.isNode(board)).toBe(false)
    })
  })
})

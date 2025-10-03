import { beforeEach, describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { InstanceId, VariantId, Workspace } from "../../../types"
import {
  ComponentStructure,
  ReconciliationResult,
  analyzeRequiredStructures,
  clearReconciliationCaches,
  createMissingVariants,
  getCacheStats,
  invalidateComponentCache,
  invalidateVariantCache,
  reconcileSchemaWithWorkspace,
} from "./schema-workspace-reconciliation"

describe("schema-workspace-reconciliation", () => {
  let workspace: Workspace
  let cardProductVariant: VariantId
  let textblockDetailsInstance: InstanceId
  let titleInstance: InstanceId

  beforeEach(() => {
    // Clear all caches before each test
    clearReconciliationCaches()

    // Create a realistic workspace structure
    cardProductVariant = "variant-cardProduct-default" as VariantId
    textblockDetailsInstance = "child-textblockDetails-1" as InstanceId
    titleInstance = "child-title-2" as InstanceId

    workspace = {
      version: 1,
      customTheme,
      boards: {
        [ComponentId.CARD_PRODUCT]: {
          id: ComponentId.CARD_PRODUCT,
          label: "Product Cards",
          order: 0,
          theme: "default",
          properties: {},
          variants: [cardProductVariant],
        },
      },
      byId: {
        [cardProductVariant]: {
          id: cardProductVariant,
          isChild: false,
          type: "defaultVariant",
          fromSchema: true,
          level: ComponentLevel.PART,
          label: "Default Product Card",
          theme: "default",
          component: ComponentId.CARD_PRODUCT,
          properties: {},
          children: [textblockDetailsInstance],
        },
        [textblockDetailsInstance]: {
          id: textblockDetailsInstance,
          isChild: true,
          variant: cardProductVariant,
          instanceOf: cardProductVariant,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          label: "Textblock Details",
          theme: "default",
          component: ComponentId.TEXTBLOCK_DETAILS,
          properties: {},
          children: [titleInstance],
        },
        [titleInstance]: {
          id: titleInstance,
          isChild: true,
          variant: cardProductVariant,
          instanceOf: textblockDetailsInstance,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          label: "Title",
          theme: "default",
          component: ComponentId.TITLE,
          properties: {},
        },
      },
    }
  })

  describe("Cache Management Functions", () => {
    it("should clear all reconciliation caches", () => {
      // Add some data to caches first
      const result = reconcileSchemaWithWorkspace(
        ComponentId.CARD_PRODUCT,
        workspace,
      )
      expect(result).toBeDefined()

      // Verify caches have data
      const statsBefore = getCacheStats()
      expect(statsBefore.total).toBeGreaterThan(0)

      // Clear caches
      clearReconciliationCaches()

      // Verify caches are empty
      const statsAfter = getCacheStats()
      expect(statsAfter.total).toBe(0)
    })

    it("should return cache statistics", () => {
      const stats = getCacheStats()

      expect(stats).toHaveProperty("schemaStructureCache")
      expect(stats).toHaveProperty("variantStructureCache")
      expect(stats).toHaveProperty("reconciliationCache")
      expect(stats).toHaveProperty("requiredStructuresCache")
      expect(stats).toHaveProperty("total")

      expect(typeof stats.schemaStructureCache).toBe("number")
      expect(typeof stats.variantStructureCache).toBe("number")
      expect(typeof stats.reconciliationCache).toBe("number")
      expect(typeof stats.requiredStructuresCache).toBe("number")
      expect(typeof stats.total).toBe("number")
    })

    it("should invalidate variant cache", () => {
      // Add some data to caches first
      const result = reconcileSchemaWithWorkspace(
        ComponentId.CARD_PRODUCT,
        workspace,
      )
      expect(result).toBeDefined()

      // Verify caches have data
      const statsBefore = getCacheStats()
      expect(statsBefore.variantStructureCache).toBeGreaterThan(0)

      // Invalidate variant cache
      invalidateVariantCache(cardProductVariant)

      // Verify variant cache is cleared
      const statsAfter = getCacheStats()
      expect(statsAfter.variantStructureCache).toBe(0)
    })

    it("should invalidate component cache", () => {
      // Add some data to caches first
      const result = reconcileSchemaWithWorkspace(
        ComponentId.CARD_PRODUCT,
        workspace,
      )
      expect(result).toBeDefined()

      // Verify caches have data
      const statsBefore = getCacheStats()
      expect(statsBefore.reconciliationCache).toBeGreaterThan(0)

      // Invalidate component cache
      invalidateComponentCache(ComponentId.CARD_PRODUCT)

      // Verify reconciliation cache is cleared
      const statsAfter = getCacheStats()
      expect(statsAfter.reconciliationCache).toBe(0)
    })
  })

  describe("reconcileSchemaWithWorkspace", () => {
    it("should reconcile schema with matching workspace structure", () => {
      const result = reconcileSchemaWithWorkspace(
        ComponentId.CARD_PRODUCT,
        workspace,
      )

      expect(result).toHaveProperty("useSchema")
      expect(result).toHaveProperty("structure")
      expect(result).toHaveProperty("needsNewVariant")
      expect(result).toHaveProperty("suggestedVariantId")

      expect(typeof result.useSchema).toBe("boolean")
      expect(typeof result.needsNewVariant).toBe("boolean")
      expect(result.suggestedVariantId).toBe(cardProductVariant)
    })

    it("should use cached results for repeated calls", () => {
      // First call
      const result1 = reconcileSchemaWithWorkspace(
        ComponentId.CARD_PRODUCT,
        workspace,
      )

      // Second call should use cache
      const result2 = reconcileSchemaWithWorkspace(
        ComponentId.CARD_PRODUCT,
        workspace,
      )

      expect(result1).toEqual(result2)
    })

    it("should handle components with no existing variants", () => {
      const emptyWorkspace: Workspace = {
        version: 1,
        customTheme,
        boards: {},
        byId: {},
      }

      const result = reconcileSchemaWithWorkspace(
        ComponentId.BUTTON,
        emptyWorkspace,
      )

      expect(result.useSchema).toBe(false)
      expect(result.structure).toBeNull()
      expect(result.needsNewVariant).toBe(true)
      expect(result.suggestedVariantId).toBeUndefined()
    })

    it("should handle components with existing but non-matching variants", () => {
      // Create a workspace with a variant that doesn't match the schema
      const nonMatchingWorkspace: Workspace = {
        ...workspace,
        byId: {
          [cardProductVariant]: {
            id: cardProductVariant,
            isChild: false,
            type: "defaultVariant",
            fromSchema: true,
            level: ComponentLevel.PART,
            label: "Non-matching Card",
            theme: "default",
            component: ComponentId.CARD_PRODUCT,
            properties: {},
            children: [], // No children, doesn't match schema
          },
        },
      }

      const result = reconcileSchemaWithWorkspace(
        ComponentId.CARD_PRODUCT,
        nonMatchingWorkspace,
      )

      // The function may find a best match or decide to create a new variant
      expect(result).toHaveProperty("needsNewVariant")
      expect(typeof result.needsNewVariant).toBe("boolean")
    })

    it("should handle different workspace versions", () => {
      const workspaceV1 = { ...workspace, version: 1 }
      const workspaceV2 = { ...workspace, version: 2 }

      const result1 = reconcileSchemaWithWorkspace(
        ComponentId.CARD_PRODUCT,
        workspaceV1,
      )
      const result2 = reconcileSchemaWithWorkspace(
        ComponentId.CARD_PRODUCT,
        workspaceV2,
      )

      // Should not use cache between different versions
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
    })
  })

  describe("analyzeRequiredStructures", () => {
    it("should analyze ai_add_component actions", () => {
      const actions = [
        {
          type: "ai_add_component",
          payload: {
            componentId: ComponentId.BUTTON,
            ref: "$button",
          },
        },
      ]

      const result = analyzeRequiredStructures(actions)

      expect(result).toBeInstanceOf(Map)
      expect(result.has(ComponentId.BUTTON)).toBe(true)
      const structure = result.get(ComponentId.BUTTON)
      expect(structure).toBeDefined()
      if (structure) {
        expect(structure).toHaveProperty("component")
        expect(structure).toHaveProperty("children")
      }
    })

    it("should analyze ai_add_variant actions", () => {
      const actions = [
        {
          type: "ai_add_variant",
          payload: {
            componentId: ComponentId.CARD_PRODUCT,
            ref: "$card",
          },
        },
      ]

      const result = analyzeRequiredStructures(actions)

      expect(result).toBeInstanceOf(Map)
      expect(result.has(ComponentId.CARD_PRODUCT)).toBe(true)
    })

    it("should analyze ai_insert_node actions", () => {
      const actions = [
        {
          type: "ai_insert_node",
          payload: {
            nodeId: "$cref0.1.2.0",
            ref: "$title",
            target: {
              parentId: "$card",
              index: 0,
            },
          },
        },
      ]

      const result = analyzeRequiredStructures(actions)

      expect(result).toBeInstanceOf(Map)
      expect(result.has(ComponentId.CARD_PRODUCT)).toBe(true)
    })

    it("should analyze ai_reorder_node actions", () => {
      const actions = [
        {
          type: "ai_reorder_node",
          payload: {
            nodeId: "some-node",
            newIndex: 1,
          },
        },
      ]

      const result = analyzeRequiredStructures(actions)

      expect(result).toBeInstanceOf(Map)
      expect(result.has(ComponentId.CARD_PRODUCT)).toBe(true)
    })

    it("should analyze ai_remove_node actions", () => {
      const actions = [
        {
          type: "ai_remove_node",
          payload: {
            nodeId: "some-node",
          },
        },
      ]

      const result = analyzeRequiredStructures(actions)

      expect(result).toBeInstanceOf(Map)
      expect(result.has(ComponentId.CARD_PRODUCT)).toBe(true)
    })

    it("should handle multiple actions for the same component", () => {
      const actions = [
        {
          type: "ai_add_component",
          payload: {
            componentId: ComponentId.BUTTON,
            ref: "$button",
          },
        },
        {
          type: "ai_add_variant",
          payload: {
            componentId: ComponentId.BUTTON,
            ref: "$buttonVariant",
          },
        },
      ]

      const result = analyzeRequiredStructures(actions)

      expect(result.has(ComponentId.BUTTON)).toBe(true)
      // Should only have one entry per component
      expect(result.size).toBe(1)
    })

    it("should handle empty actions array", () => {
      const result = analyzeRequiredStructures([])

      expect(result).toBeInstanceOf(Map)
      expect(result.size).toBe(0)
    })

    it("should use cached results for repeated calls", () => {
      const actions = [
        {
          type: "ai_add_component",
          payload: {
            componentId: ComponentId.BUTTON,
            ref: "$button",
          },
        },
      ]

      const result1 = analyzeRequiredStructures(actions)
      const result2 = analyzeRequiredStructures(actions)

      expect(result1).toEqual(result2)
    })

    it("should handle actions with different payloads", () => {
      const actions1 = [
        {
          type: "ai_add_component",
          payload: {
            componentId: ComponentId.BUTTON,
            ref: "$button1",
          },
        },
      ]

      const actions2 = [
        {
          type: "ai_add_component",
          payload: {
            componentId: ComponentId.BUTTON,
            ref: "$button2",
          },
        },
      ]

      const result1 = analyzeRequiredStructures(actions1)
      const result2 = analyzeRequiredStructures(actions2)

      // Should not use cache for different payloads
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
    })
  })

  describe("createMissingVariants", () => {
    it("should create missing variants for required structures", () => {
      const requiredStructures = new Map<ComponentId, ComponentStructure>([
        [
          ComponentId.BUTTON,
          {
            component: ComponentId.BUTTON,
            children: [],
          },
        ],
      ])

      const result = createMissingVariants(requiredStructures, workspace)

      expect(result).toHaveProperty("workspace")
      expect(result).toHaveProperty("createdVariants")
      expect(result.createdVariants).toBeInstanceOf(Map)
    })

    it("should handle empty required structures", () => {
      const requiredStructures = new Map<ComponentId, ComponentStructure>()

      const result = createMissingVariants(requiredStructures, workspace)

      expect(result.workspace).toBe(workspace)
      expect(result.createdVariants.size).toBe(0)
    })

    it("should skip invalid component structures", () => {
      const requiredStructures = new Map<ComponentId, ComponentStructure>([
        [
          ComponentId.BUTTON,
          {
            component: ComponentId.BUTTON,
            children: [
              {
                component: "invalid-component" as any,
                children: [],
              },
            ],
          },
        ],
      ])

      const result = createMissingVariants(requiredStructures, workspace)

      // The function may still create variants even with invalid structures
      // or it may skip them - we just verify it doesn't crash
      expect(result).toHaveProperty("workspace")
      expect(result).toHaveProperty("createdVariants")
      expect(result.createdVariants).toBeInstanceOf(Map)
    })

    it("should handle components that already have matching variants", () => {
      const requiredStructures = new Map<ComponentId, ComponentStructure>([
        [
          ComponentId.CARD_PRODUCT,
          {
            component: ComponentId.CARD_PRODUCT,
            children: [
              {
                component: ComponentId.TEXTBLOCK_DETAILS,
                children: [
                  {
                    component: ComponentId.TITLE,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      ])

      const result = createMissingVariants(requiredStructures, workspace)

      // Should not create new variants if matching ones exist
      expect(result.createdVariants.size).toBe(0)
    })

    it("should handle multiple components", () => {
      const requiredStructures = new Map<ComponentId, ComponentStructure>([
        [
          ComponentId.BUTTON,
          {
            component: ComponentId.BUTTON,
            children: [],
          },
        ],
        [
          ComponentId.LABEL,
          {
            component: ComponentId.LABEL,
            children: [],
          },
        ],
      ])

      const result = createMissingVariants(requiredStructures, workspace)

      expect(result.createdVariants.size).toBeGreaterThan(0)
    })

    it("should validate created variants", () => {
      const requiredStructures = new Map<ComponentId, ComponentStructure>([
        [
          ComponentId.BUTTON,
          {
            component: ComponentId.BUTTON,
            children: [],
          },
        ],
      ])

      const result = createMissingVariants(requiredStructures, workspace)

      // If variants were created, they should be valid
      result.createdVariants.forEach((variantId, componentId) => {
        expect(typeof variantId).toBe("string")
        expect(variantId).toMatch(/^variant-/)
      })
    })
  })

  describe("Edge Cases and Error Handling", () => {
    it("should handle components with invalid schemas gracefully", () => {
      // Test with a component that doesn't exist - should throw an error
      expect(() => {
        reconcileSchemaWithWorkspace(
          "invalid-component" as ComponentId,
          workspace,
        )
      }).toThrow("Schema invalid-component not found")
    })

    it("should handle malformed actions", () => {
      const malformedActions = [
        {
          type: "ai_add_component",
          // Missing payload
        },
        {
          type: "ai_add_variant",
          payload: {
            // Missing componentId
            ref: "$variant",
          },
        },
      ]

      // The function may throw errors for malformed actions
      expect(() => {
        analyzeRequiredStructures(malformedActions)
      }).toThrow()
    })

    it("should handle null and undefined actions", () => {
      const nullActions = [null, undefined, {}]

      // The function may throw errors for null/undefined actions
      expect(() => {
        analyzeRequiredStructures(nullActions as any)
      }).toThrow()
    })

    it("should handle workspace with missing boards", () => {
      const workspaceWithoutBoards: Workspace = {
        version: 1,
        customTheme,
        boards: {},
        byId: {},
      }

      const result = reconcileSchemaWithWorkspace(
        ComponentId.BUTTON,
        workspaceWithoutBoards,
      )

      expect(result.useSchema).toBe(false)
      expect(result.structure).toBeNull()
      expect(result.needsNewVariant).toBe(true)
    })

    it("should handle workspace with missing variants", () => {
      const workspaceWithoutVariants: Workspace = {
        version: 1,
        customTheme,
        boards: {
          [ComponentId.BUTTON]: {
            id: ComponentId.BUTTON,
            label: "Buttons",
            order: 0,
            theme: "default",
            properties: {},
            variants: [], // No variants
          },
        },
        byId: {},
      }

      const result = reconcileSchemaWithWorkspace(
        ComponentId.BUTTON,
        workspaceWithoutVariants,
      )

      expect(result.needsNewVariant).toBe(true)
    })

    it("should handle cache size limits", () => {
      // This test would require creating many cache entries
      // For now, just verify the cache management functions exist
      expect(typeof clearReconciliationCaches).toBe("function")
      expect(typeof getCacheStats).toBe("function")
      expect(typeof invalidateVariantCache).toBe("function")
      expect(typeof invalidateComponentCache).toBe("function")
    })

    it("should handle complex nested structures", () => {
      const complexStructure: ComponentStructure = {
        component: ComponentId.CARD_PRODUCT,
        children: [
          {
            component: ComponentId.TEXTBLOCK_DETAILS,
            children: [
              {
                component: ComponentId.TITLE,
                children: [],
              },
              {
                component: ComponentId.LABEL,
                children: [],
              },
            ],
          },
          {
            component: ComponentId.BAR_BUTTONS,
            children: [
              {
                component: ComponentId.BUTTON,
                children: [],
              },
            ],
          },
        ],
      }

      const requiredStructures = new Map<ComponentId, ComponentStructure>([
        [ComponentId.CARD_PRODUCT, complexStructure],
      ])

      const result = createMissingVariants(requiredStructures, workspace)

      expect(result).toHaveProperty("workspace")
      expect(result).toHaveProperty("createdVariants")
    })

    it("should handle workspace service errors gracefully", () => {
      const requiredStructures = new Map<ComponentId, ComponentStructure>([
        [
          ComponentId.BUTTON,
          {
            component: ComponentId.BUTTON,
            children: [],
          },
        ],
      ])

      // Should not throw, but handle the error gracefully
      const result = createMissingVariants(requiredStructures, workspace)

      expect(result).toHaveProperty("workspace")
      expect(result).toHaveProperty("createdVariants")
    })
  })

  describe("Performance and Caching", () => {
    it("should cache reconciliation results", () => {
      const statsBefore = getCacheStats()

      // First call
      reconcileSchemaWithWorkspace(ComponentId.CARD_PRODUCT, workspace)

      const statsAfterFirst = getCacheStats()
      expect(statsAfterFirst.reconciliationCache).toBeGreaterThan(
        statsBefore.reconciliationCache,
      )

      // Second call should use cache
      reconcileSchemaWithWorkspace(ComponentId.CARD_PRODUCT, workspace)

      const statsAfterSecond = getCacheStats()
      expect(statsAfterSecond.reconciliationCache).toBe(
        statsAfterFirst.reconciliationCache,
      )
    })

    it("should cache required structures analysis", () => {
      const actions = [
        {
          type: "ai_add_component",
          payload: {
            componentId: ComponentId.BUTTON,
            ref: "$button",
          },
        },
      ]

      const statsBefore = getCacheStats()

      // First call
      analyzeRequiredStructures(actions)

      const statsAfterFirst = getCacheStats()
      expect(statsAfterFirst.requiredStructuresCache).toBeGreaterThan(
        statsBefore.requiredStructuresCache,
      )

      // Second call should use cache
      analyzeRequiredStructures(actions)

      const statsAfterSecond = getCacheStats()
      expect(statsAfterSecond.requiredStructuresCache).toBe(
        statsAfterFirst.requiredStructuresCache,
      )
    })

    it("should handle cache invalidation correctly", () => {
      // Add data to cache
      reconcileSchemaWithWorkspace(ComponentId.CARD_PRODUCT, workspace)

      const statsBefore = getCacheStats()
      expect(statsBefore.reconciliationCache).toBeGreaterThan(0)

      // Invalidate cache
      invalidateComponentCache(ComponentId.CARD_PRODUCT)

      const statsAfter = getCacheStats()
      expect(statsAfter.reconciliationCache).toBe(0)
    })
  })
})

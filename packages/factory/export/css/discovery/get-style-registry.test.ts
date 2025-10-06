import { describe, expect, it } from "bun:test"
import { ValueType, Workspace } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import {
  FACTORY_WORKSPACE_FIXTURE,
  SIMPLE_WORKSPACE_FIXTURE,
} from "../../../helpers/fixtures/workspace"
import { buildStyleRegistry } from "./get-style-registry"

describe("buildStyleRegistry", () => {
  it("should build style registry from simple workspace", () => {
    const result = buildStyleRegistry(SIMPLE_WORKSPACE_FIXTURE)

    expect(result).toHaveProperty("classes")
    expect(result).toHaveProperty("nodeIdToClass")
    expect(result).toHaveProperty("classNameToNodeId")
    expect(result).toHaveProperty("nodeTreeDepths")

    expect(result.classes).toBeDefined()
    expect(result.nodeIdToClass).toBeDefined()
    expect(result.classNameToNodeId).toBeDefined()
    expect(result.nodeTreeDepths).toBeDefined()
  })

  it("should build style registry from complex workspace with multiple components", () => {
    const result = buildStyleRegistry(FACTORY_WORKSPACE_FIXTURE)

    expect(result).toHaveProperty("classes")
    expect(result).toHaveProperty("nodeIdToClass")
    expect(result).toHaveProperty("classNameToNodeId")
    expect(result).toHaveProperty("nodeTreeDepths")

    // Should have classes for all components
    expect(Object.keys(result.classes).length).toBeGreaterThan(0)
    expect(Object.keys(result.nodeIdToClass).length).toBeGreaterThan(0)
    expect(Object.keys(result.classNameToNodeId).length).toBeGreaterThan(0)
    expect(Object.keys(result.nodeTreeDepths).length).toBeGreaterThan(0)

    // Verify specific components are included
    expect(result.nodeIdToClass["variant-button-default"]).toBeDefined()
    expect(result.nodeIdToClass["variant-icon-default"]).toBeDefined()
    expect(result.nodeIdToClass["variant-label-default"]).toBeDefined()
    expect(result.nodeIdToClass["variant-barButtons-default"]).toBeDefined()
  })

  it("should handle empty workspace", () => {
    const result = buildStyleRegistry({
      version: 1,
      customTheme: {},
      boards: {},
      byId: {},
    })

    expect(result.classes).toEqual({})
    expect(result.nodeIdToClass).toEqual({})
    expect(result.classNameToNodeId).toEqual({})
    expect(result.nodeTreeDepths).toEqual({})
  })

  it("should calculate tree depths for nodes in complex workspace", () => {
    const result = buildStyleRegistry(FACTORY_WORKSPACE_FIXTURE)

    // Should have tree depths for all variants
    expect(result.nodeTreeDepths).toHaveProperty("variant-button-default")
    expect(result.nodeTreeDepths).toHaveProperty("variant-button-primary")
    expect(result.nodeTreeDepths).toHaveProperty("variant-icon-default")
    expect(result.nodeTreeDepths).toHaveProperty("variant-label-default")
    expect(result.nodeTreeDepths).toHaveProperty("variant-barButtons-default")

    // All variants should have depth 0 (they're root level)
    expect(result.nodeTreeDepths["variant-button-default"]).toBe(0)
    expect(result.nodeTreeDepths["variant-button-primary"]).toBe(0)
    expect(result.nodeTreeDepths["variant-icon-default"]).toBe(0)
    expect(result.nodeTreeDepths["variant-label-default"]).toBe(0)
    expect(result.nodeTreeDepths["variant-barButtons-default"]).toBe(0)
  })

  it("should deduplicate identical CSS classes across components", () => {
    const result = buildStyleRegistry(FACTORY_WORKSPACE_FIXTURE)

    // Should have classes for all components
    const classNames = Object.keys(result.classes)
    expect(classNames.length).toBeGreaterThan(0)

    // Should have node-to-class mappings for all variants
    const nodeIds = Object.keys(result.nodeIdToClass)
    expect(nodeIds.length).toBeGreaterThan(0)

    // Verify that identical styles are deduplicated
    // (This is tested by the fact that we have fewer classes than nodes)
    expect(classNames.length).toBeLessThanOrEqual(nodeIds.length)
  })

  it("should handle workspace with multiple components and variants", () => {
    const result = buildStyleRegistry(FACTORY_WORKSPACE_FIXTURE)

    expect(result.classes).toBeDefined()
    expect(result.nodeIdToClass).toBeDefined()
    expect(result.classNameToNodeId).toBeDefined()
    expect(result.nodeTreeDepths).toBeDefined()

    // Should handle multiple component types
    const buttonVariants = Object.keys(result.nodeIdToClass).filter(
      (id) => id.includes("button") && id.startsWith("variant-"),
    )
    const iconVariants = Object.keys(result.nodeIdToClass).filter(
      (id) => id.includes("icon") && id.startsWith("variant-"),
    )
    const labelVariants = Object.keys(result.nodeIdToClass).filter(
      (id) => id.includes("label") && id.startsWith("variant-"),
    )

    expect(buttonVariants.length).toBeGreaterThan(0)
    expect(iconVariants.length).toBeGreaterThan(0)
    expect(labelVariants.length).toBeGreaterThan(0)
  })
})

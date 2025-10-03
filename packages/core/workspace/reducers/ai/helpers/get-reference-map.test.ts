import { beforeEach, describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { InstanceId, ReferenceId, VariantId, Workspace } from "../../../types"
import {
  ReferenceMap,
  buildExpectedReferenceMap,
  getReferenceMap,
  getSchemaAwareReferenceMap,
} from "./get-reference-map"

describe("getReferenceMap", () => {
  let workspace: Workspace
  let cardProductVariant: VariantId
  let textblockDetailsInstance: InstanceId
  let titleInstance: InstanceId
  let labelInstance: InstanceId
  let barButtonsInstance: InstanceId
  let buttonInstance: InstanceId

  beforeEach(() => {
    // Create a realistic workspace structure
    cardProductVariant = "variant-cardProduct-default" as VariantId
    textblockDetailsInstance = "child-textblockDetails-1" as InstanceId
    titleInstance = "child-title-2" as InstanceId
    labelInstance = "child-label-3" as InstanceId
    barButtonsInstance = "child-barButtons-4" as InstanceId
    buttonInstance = "child-button-5" as InstanceId

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
          children: [textblockDetailsInstance, barButtonsInstance],
        },
        [textblockDetailsInstance]: {
          id: textblockDetailsInstance,
          isChild: true,
          variant: cardProductVariant,
          instanceOf: cardProductVariant,
          fromSchema: true,
          level: ComponentLevel.PART,
          label: "Textblock Details",
          theme: "default",
          component: ComponentId.TEXTBLOCK_DETAILS,
          properties: {},
          children: [titleInstance, labelInstance],
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
        [labelInstance]: {
          id: labelInstance,
          isChild: true,
          variant: cardProductVariant,
          instanceOf: textblockDetailsInstance,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          label: "Label",
          theme: "default",
          component: ComponentId.LABEL,
          properties: {},
        },
        [barButtonsInstance]: {
          id: barButtonsInstance,
          isChild: true,
          variant: cardProductVariant,
          instanceOf: cardProductVariant,
          fromSchema: true,
          level: ComponentLevel.PART,
          label: "Button Bar",
          theme: "default",
          component: ComponentId.BAR_BUTTONS,
          properties: {},
          children: [buttonInstance],
        },
        [buttonInstance]: {
          id: buttonInstance,
          isChild: true,
          variant: cardProductVariant,
          instanceOf: barButtonsInstance,
          fromSchema: true,
          level: ComponentLevel.ELEMENT,
          label: "Button",
          theme: "default",
          component: ComponentId.BUTTON,
          properties: {},
        },
      },
    }
  })

  it("should create a basic reference map for a variant with children", () => {
    const ref: ReferenceId = "$ref"
    const result = getReferenceMap(ref, cardProductVariant, workspace)

    expect(result).toEqual({
      $ref: cardProductVariant,
      "$ref.0": textblockDetailsInstance,
      "$ref.0.0": titleInstance,
      "$ref.0.1": labelInstance,
      "$ref.1": barButtonsInstance,
      "$ref.1.0": buttonInstance,
    })
  })

  it("should create a reference map for a variant without children", () => {
    const simpleVariant = "variant-button-default" as VariantId
    workspace.byId[simpleVariant] = {
      id: simpleVariant,
      isChild: false,
      type: "defaultVariant",
      fromSchema: true,
      level: ComponentLevel.PART,
      label: "Default Button",
      theme: "default",
      component: ComponentId.BUTTON,
      properties: {},
    }

    const ref: ReferenceId = "$button"
    const result = getReferenceMap(ref, simpleVariant, workspace)

    expect(result).toEqual({
      $button: simpleVariant,
    })
  })

  it("should handle nested children correctly", () => {
    const ref: ReferenceId = "$card"
    const result = getReferenceMap(ref, cardProductVariant, workspace)

    // Verify the structure matches the expected hierarchy
    expect(result["$card"]).toBe(cardProductVariant)
    expect(result["$card.0"]).toBe(textblockDetailsInstance)
    expect(result["$card.0.0"]).toBe(titleInstance)
    expect(result["$card.0.1"]).toBe(labelInstance)
    expect(result["$card.1"]).toBe(barButtonsInstance)
    expect(result["$card.1.0"]).toBe(buttonInstance)
  })

  it("should handle instance nodes correctly", () => {
    const ref: ReferenceId = "$textblock"
    const result = getReferenceMap(ref, textblockDetailsInstance, workspace)

    expect(result).toEqual({
      $textblock: textblockDetailsInstance,
      "$textblock.0": titleInstance,
      "$textblock.1": labelInstance,
    })
  })

  it("should handle empty workspace", () => {
    const ref: ReferenceId = "$empty"
    const nonExistentNode = "variant-nonexistent-default" as VariantId

    // This should throw an error because the node doesn't exist
    expect(() => {
      getReferenceMap(ref, nonExistentNode, workspace)
    }).toThrow()
  })

  it("should handle workspace with missing children", () => {
    const variant = "variant-button-default" as VariantId
    workspace.byId[variant] = {
      id: variant,
      isChild: false,
      type: "defaultVariant",
      fromSchema: true,
      level: ComponentLevel.PART,
      label: "Button",
      theme: "default",
      component: ComponentId.BUTTON,
      properties: {},
      children: [
        "child-missing-1" as InstanceId,
        "child-missing-2" as InstanceId,
      ],
    }

    const ref: ReferenceId = "$missing"
    // This should throw an error because the children don't exist
    expect(() => {
      getReferenceMap(ref, variant, workspace)
    }).toThrow()
  })

  it("should handle very deep nesting", () => {
    // Create a simple 3-level deep structure
    const variant1 = "variant-deep-1" as VariantId
    const child1 = "child-deep-1" as InstanceId
    const child2 = "child-deep-2" as InstanceId
    const child3 = "child-deep-3" as InstanceId

    workspace.byId[variant1] = {
      id: variant1,
      isChild: false,
      type: "defaultVariant",
      fromSchema: true,
      level: ComponentLevel.PART,
      label: "Deep Variant 1",
      theme: "default",
      component: ComponentId.BUTTON,
      properties: {},
      children: [child1],
    }

    workspace.byId[child1] = {
      id: child1,
      isChild: true,
      variant: variant1,
      instanceOf: variant1,
      fromSchema: true,
      level: ComponentLevel.ELEMENT,
      label: "Deep Child 1",
      theme: "default",
      component: ComponentId.LABEL,
      properties: {},
      children: [child2],
    }

    workspace.byId[child2] = {
      id: child2,
      isChild: true,
      variant: variant1,
      instanceOf: child1,
      fromSchema: true,
      level: ComponentLevel.ELEMENT,
      label: "Deep Child 2",
      theme: "default",
      component: ComponentId.LABEL,
      properties: {},
      children: [child3],
    }

    workspace.byId[child3] = {
      id: child3,
      isChild: true,
      variant: variant1,
      instanceOf: child2,
      fromSchema: true,
      level: ComponentLevel.ELEMENT,
      label: "Deep Child 3",
      theme: "default",
      component: ComponentId.LABEL,
      properties: {},
    }

    const ref: ReferenceId = "$deep"
    const result = getReferenceMap(ref, variant1, workspace)

    // Should handle deep nesting correctly
    expect(result["$deep"]).toBe(variant1)
    expect(result["$deep.0"]).toBe(child1)
    expect(result["$deep.0.0"]).toBe(child2)
    expect(result["$deep.0.0.0"]).toBe(child3)
  })

  it("should create consistent reference IDs", () => {
    const variant = "variant-button-default" as VariantId
    const child1 = "child-label-1" as InstanceId
    const child2 = "child-icon-2" as InstanceId

    workspace.byId[variant] = {
      id: variant,
      isChild: false,
      type: "defaultVariant",
      fromSchema: true,
      level: ComponentLevel.PART,
      label: "Button",
      theme: "default",
      component: ComponentId.BUTTON,
      properties: {},
      children: [child1, child2],
    }

    workspace.byId[child1] = {
      id: child1,
      isChild: true,
      variant,
      instanceOf: variant,
      fromSchema: true,
      level: ComponentLevel.ELEMENT,
      label: "Label",
      theme: "default",
      component: ComponentId.LABEL,
      properties: {},
    }

    workspace.byId[child2] = {
      id: child2,
      isChild: true,
      variant,
      instanceOf: variant,
      fromSchema: true,
      level: ComponentLevel.ELEMENT,
      label: "Icon",
      theme: "default",
      component: ComponentId.ICON,
      properties: {},
    }

    const ref: ReferenceId = "$button"
    const result = getReferenceMap(ref, variant, workspace)

    // Verify reference ID format consistency
    const referenceIds = Object.keys(result)
    expect(referenceIds).toContain("$button")
    expect(referenceIds).toContain("$button.0")
    expect(referenceIds).toContain("$button.1")

    // Verify all reference IDs start with the base reference
    referenceIds.forEach((refId) => {
      expect(refId).toMatch(/^\$button(\.\d+)*$/)
    })
  })
})

describe("getSchemaAwareReferenceMap", () => {
  let workspace: Workspace
  let cardProductVariant: VariantId

  beforeEach(() => {
    cardProductVariant = "variant-cardProduct-default" as VariantId

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
          children: [],
        },
      },
    }
  })

  it("should create schema-aware reference map with valid schema", () => {
    const ref: ReferenceId = "$ref"
    const result = getSchemaAwareReferenceMap(
      ref,
      cardProductVariant,
      workspace,
    )

    expect(result).toEqual({
      $ref: cardProductVariant,
    })
  })

  it("should return minimal map when node not found in workspace", () => {
    const ref: ReferenceId = "$ref"
    const nonExistentNode = "variant-nonexistent-default" as VariantId
    const result = getSchemaAwareReferenceMap(ref, nonExistentNode, workspace)

    expect(result).toEqual({
      $ref: nonExistentNode,
    })
  })

  it("should return minimal map when component ID cannot be determined", () => {
    // Create a variant without proper component ID
    const invalidVariant = "variant-invalid-default" as VariantId
    workspace.byId[invalidVariant] = {
      id: invalidVariant,
      isChild: false,
      type: "defaultVariant",
      fromSchema: true,
      level: ComponentLevel.PART,
      label: "Invalid Variant",
      theme: "default",
      component: "invalidComponent" as ComponentId,
      properties: {},
    }

    const ref: ReferenceId = "$ref"
    const result = getSchemaAwareReferenceMap(ref, invalidVariant, workspace)

    expect(result).toEqual({
      $ref: invalidVariant,
    })
  })

  it("should handle custom variants correctly", () => {
    const customVariant = "variant-cardProduct-custom-123456" as VariantId
    workspace.byId[customVariant] = {
      id: customVariant,
      isChild: false,
      type: "userVariant",
      fromSchema: false,
      instanceOf: cardProductVariant,
      level: ComponentLevel.PART,
      label: "Custom Product Card",
      theme: "default",
      component: ComponentId.CARD_PRODUCT,
      properties: {},
    }

    const ref: ReferenceId = "$custom"
    const result = getSchemaAwareReferenceMap(ref, customVariant, workspace)

    // The function should try to extract component ID from custom variant
    // but since it can't find the board, it will return minimal map
    expect(result).toEqual({
      $custom: customVariant,
    })
  })
})

describe("buildExpectedReferenceMap", () => {
  let workspace: Workspace

  beforeEach(() => {
    workspace = {
      version: 1,
      customTheme,
      boards: {},
      byId: {},
    }
  })

  it("should build expected reference map with valid structure", () => {
    const ref: ReferenceId = "$expected"
    const expectedStructure = {
      component: ComponentId.CARD_PRODUCT,
      children: [
        {
          component: ComponentId.TEXTBLOCK_DETAILS,
          children: [
            { component: ComponentId.TITLE },
            { component: ComponentId.LABEL },
          ],
        },
        {
          component: ComponentId.BAR_BUTTONS,
          children: [{ component: ComponentId.BUTTON }],
        },
      ],
    }

    const result = buildExpectedReferenceMap(
      ref,
      ComponentId.CARD_PRODUCT,
      expectedStructure,
      workspace,
    )

    expect(result).toEqual({})
  })

  it("should return empty map when expected structure is invalid", () => {
    const ref: ReferenceId = "$expected"
    const invalidStructure = null

    const result = buildExpectedReferenceMap(
      ref,
      ComponentId.CARD_PRODUCT,
      invalidStructure,
      workspace,
    )

    expect(result).toEqual({})
  })

  it("should handle structure with no children", () => {
    const ref: ReferenceId = "$expected"
    const expectedStructure = {
      component: ComponentId.BUTTON,
      children: [],
    }

    const result = buildExpectedReferenceMap(
      ref,
      ComponentId.BUTTON,
      expectedStructure,
      workspace,
    )

    expect(result).toEqual({})
  })

  it("should handle deep nested structures", () => {
    const ref: ReferenceId = "$deep"
    const expectedStructure = {
      component: ComponentId.CARD_PRODUCT,
      children: [
        {
          component: ComponentId.TEXTBLOCK_DETAILS,
          children: [
            {
              component: ComponentId.TITLE,
              children: [
                {
                  component: ComponentId.LABEL,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    }

    const result = buildExpectedReferenceMap(
      ref,
      ComponentId.CARD_PRODUCT,
      expectedStructure,
      workspace,
    )

    expect(result).toEqual({})
  })
})

import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { createNodeId } from "@seldon/core/helpers/utils/create-node-id"
import { IconId } from "@seldon/core/icons"
import { ValueType } from "@seldon/core/properties/constants"
import { Properties } from "@seldon/core/properties/types/properties"
import { Resize } from "@seldon/core/properties/values/layout/resize"
import type { IconSheetVariant } from "../types/icon-sheet-variant"
import {
  Instance,
  InstanceId,
  VariantId,
  Workspace,
} from "@seldon/core/workspace/types"
import { IconCategoryPath, categoryPaths } from "../categories"
import { IconSetId } from "../types"
import { getIconCategoryFromId } from "./get-icon-category-from-id"
import { parseCategoryPath } from "./get-icon-category-from-path"
import { getIconSetDisplayName } from "./get-icon-set-display-name"

/**
 * Creates IconSheetVariant nodes for each category/subcategory in an icon set
 *
 * Structure: variant-icon-set-{iconSetId}-{category}-{subcategory}-{nodeId}
 * Each variant contains only icons from that subcategory that are included
 * Optimized for performance (no individual icon selection needed)
 */
export function createIconSheetVariants(
  iconSetId: IconSetId,
  includedIcons: IconId[],
  workspace: Workspace,
  parentVariantId: VariantId,
): { workspace: Workspace; variantIds: VariantId[] } {
  let updatedWorkspace = workspace
  const variantIds: VariantId[] = []

  // Group icons by category path
  const iconsByCategory = new Map<IconCategoryPath, IconId[]>()

  for (const iconId of includedIcons) {
    const categoryPath = getIconCategoryFromId(iconId)
    if (!iconsByCategory.has(categoryPath)) {
      iconsByCategory.set(categoryPath, [])
    }
    iconsByCategory.get(categoryPath)!.push(iconId)
  }

  // Create a for each category/subcategory that has icons
  for (const [categoryPath, iconIds] of iconsByCategory.entries()) {
    if (iconIds.length === 0) continue

    const { category, subcategory } = parseCategoryPath(categoryPath)
    const variantId =
      `variant-icon-set-${iconSetId}-${category}-${subcategory}-${createNodeId()}` as VariantId

    const variantProperties: Properties = {
      color: {
        type: ValueType.THEME_CATEGORICAL,
        value: "@swatch.black",
      },
      size: {
        type: ValueType.THEME_ORDINAL,
        value: "@size.medium",
      },
      opacity: { type: ValueType.EMPTY, value: null },
      brightness: { type: ValueType.EMPTY, value: null },
      width: {
        type: ValueType.OPTION,
        value: Resize.FIT,
      },
      height: {
        type: ValueType.OPTION,
        value: Resize.FIT,
      },
      rotation: { type: ValueType.EMPTY, value: null },
      margin: {
        top: { type: ValueType.EMPTY, value: null },
        right: { type: ValueType.EMPTY, value: null },
        bottom: { type: ValueType.EMPTY, value: null },
        left: { type: ValueType.EMPTY, value: null },
      },
      ariaHidden: { type: ValueType.EXACT, value: false },
    }

    // Create frame instance for the icon sheet
    const frameInstanceId = `child-frame-${createNodeId()}` as InstanceId
    const frameInstance: Instance = {
      id: frameInstanceId,
      component: ComponentId.FRAME,
      level: ComponentLevel.FRAME,
      isChild: true,
      fromSchema: false,
      label: "Frame",
      theme: null,
      variant: variantId,
      instanceOf: variantId,
      properties: {},
      children: [],
    }

    // Create icon instances for this category/subcategory
    const iconInstances: Instance[] = iconIds.map((iconSymbol: IconId) => {
      const iconInstanceId = `child-icon-${createNodeId()}` as InstanceId
      return {
        id: iconInstanceId,
        component: ComponentId.ICON,
        level: ComponentLevel.PRIMITIVE,
        isChild: true,
        fromSchema: false,
        label: "Icon",
        theme: null,
        variant: variantId,
        instanceOf: variantId,
        properties: {
          symbol: {
            type: ValueType.OPTION,
            value: iconSymbol,
          },
        },
        children: [],
      }
    })

    frameInstance.children = iconInstances.map((icon) => icon.id)

    // Create the icon sheet variant
    const iconSheetVariant: IconSheetVariant = {
      id: variantId,
      type: "iconSheet",
      component: ComponentId.FRAME,
      level: ComponentLevel.FRAME,
      theme: null,
      isChild: false,
      fromSchema: false,
      label: `${getIconSetDisplayName(iconSetId)} - ${category}/${subcategory}`,
      properties: variantProperties,
      __editor: {
        initialOverrides: variantProperties,
      },
      children: [frameInstanceId],
      includedIcons: iconIds,
    }

    // Add to workspace
    updatedWorkspace = {
      ...updatedWorkspace,
      byId: {
        ...updatedWorkspace.byId,
        [variantId]: iconSheetVariant,
        [frameInstanceId]: frameInstance,
        ...iconInstances.reduce(
          (acc, icon) => {
            acc[icon.id] = icon
            return acc
          },
          {} as Record<string, Instance>,
        ),
      },
    }

    variantIds.push(variantId)
  }

  return { workspace: updatedWorkspace, variantIds }
}

/**
 * Gets icons for a specific icon sheet (category/subcategory)
 * Filters by inclusion status
 */
export function getIconSheetIcons(
  iconSetId: IconSetId,
  categoryPath: IconCategoryPath,
  includedIcons: IconId[],
): IconId[] {
  return includedIcons.filter((iconId) => {
    // Verify icon belongs to this icon set
    if (!iconId.startsWith(`${iconSetId}-`)) return false
    // Verify icon belongs to this category
    return getIconCategoryFromId(iconId) === categoryPath
  })
}

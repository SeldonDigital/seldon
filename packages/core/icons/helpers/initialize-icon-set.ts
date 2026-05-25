import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { createNodeId } from "@seldon/core/helpers/utils/create-node-id"
import { IconId } from "@seldon/core/icons"
import { ValueType } from "@seldon/core/properties/constants"
import { Properties } from "@seldon/core/properties/types/properties"
import { Resize } from "@seldon/core/properties/values/layout/resize"
import {
  Board,
  Instance,
  InstanceId,
  Workspace,
} from "@seldon/core/workspace/types"
import type { VariantId } from "@seldon/core/workspace/helpers/rules/workspace-node-ids"
import type { IconSheetVariant } from "../types/icon-sheet-variant"
import { seldonIconIds } from "../sets/seldon"
import { ICON_SET_DEFAULT_ID } from "../constants"
import { carbonIconIds } from "../sets/carbon"
import { lucideIconIds } from "../sets/lucide"
import { materialIconIds } from "../sets/material"
import { IconSetId } from "../types"
import { createIconSetBoard } from "./create-icon-set-board"
import { getIconSetBoardProperties } from "./get-icon-set-board-properties"
import { getIconSetDisplayName } from "./get-icon-set-display-name"
import { isIconSetBoard } from "./is-icon-set-board"

export function initializeIconSet(
  iconSetId: IconSetId = ICON_SET_DEFAULT_ID,
  workspace: Workspace,
): { workspace: Workspace; defaultVariantId: VariantId } {
  const iconSetDisplayName = getIconSetDisplayName(iconSetId)
  const defaultVariantId =
    `variant-icon-set-${iconSetId}-${createNodeId()}` as VariantId

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

  const iconSymbols: IconId[] = (() => {
    switch (iconSetId) {
      case "google-material":
        return [...materialIconIds]
      case "carbon":
        return [...carbonIconIds]
      case "lucide":
        return [...lucideIconIds]
      case "seldon":
        return [...seldonIconIds]
      default:
        throw new Error(`Unknown icon set: ${iconSetId}`)
    }
  })()

  const frameInstanceId = `child-frame-${createNodeId()}` as InstanceId
  const frameInstance: Instance = {
    id: frameInstanceId,
    component: ComponentId.FRAME,
    level: ComponentLevel.FRAME,
    isChild: true,
    fromSchema: false,
    label: "Frame",
    theme: null,
    variant: defaultVariantId,
    instanceOf: defaultVariantId,
    properties: {},
    children: [],
  }

  const iconInstances: Instance[] = iconSymbols.map((iconSymbol: IconId) => {
    const iconInstanceId = `child-icon-${createNodeId()}` as InstanceId
    return {
      id: iconInstanceId,
      component: ComponentId.ICON,
      level: ComponentLevel.PRIMITIVE,
      isChild: true,
      fromSchema: false,
      label: "Icon",
      theme: null,
      variant: defaultVariantId,
      instanceOf: defaultVariantId,
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

  const iconSetDefaultVariant: IconSheetVariant = {
    id: defaultVariantId,
    type: "iconSheet",
    component: ComponentId.FRAME,
    level: ComponentLevel.FRAME,
    theme: null,
    isChild: false,
    fromSchema: false,
    label: iconSetDisplayName,
    properties: variantProperties,
    __editor: {
      initialOverrides: variantProperties,
    },
    children: [frameInstanceId],
    includedIcons: iconSymbols, // Default: include all icons
  }

  let updatedWorkspace: Workspace = {
    ...workspace,
    byId: {
      ...workspace.byId,
      [iconSetDefaultVariant.id]: iconSetDefaultVariant,
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

  const existingBoard = updatedWorkspace.boards[ComponentId.ICON_SET]

  let board: Board
  if (existingBoard && isIconSetBoard(existingBoard)) {
    board = {
      ...existingBoard,
      properties: getIconSetBoardProperties(),
      variants: [...existingBoard.variants, defaultVariantId],
    }
  } else {
    board = createIconSetBoard(defaultVariantId)
  }

  updatedWorkspace = {
    ...updatedWorkspace,
    boards: {
      ...updatedWorkspace.boards,
      [board.id]: board,
    },
  }

  return { workspace: updatedWorkspace, defaultVariantId }
}

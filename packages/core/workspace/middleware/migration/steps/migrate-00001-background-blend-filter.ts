import { ValueType } from "../../../../properties/constants"
import {
  BACKGROUND_BLEND_MODE_VALUES,
  BackgroundBlendMode,
} from "../../../../properties/values/appearance/background/background-blend-mode"
import { BACKGROUND_FILTER_PRESET_VALUES } from "../../../../properties/values/appearance/background/background-filter"
import { isComponentBoard, isPlaygroundBoard } from "../../../model"
import type { Board } from "../../../model/components"
import type { EntryNode } from "../../../model/entry-node"
import type { EntryTheme } from "../../../model/entry-theme"
import type { Workspace } from "../../../model/workspace"

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value)
}

function isKnownBlendMode(value: string): value is BackgroundBlendMode {
  return (BACKGROUND_BLEND_MODE_VALUES as readonly string[]).includes(value)
}

function isPresetFilterValue(value: string): boolean {
  return (BACKGROUND_FILTER_PRESET_VALUES as readonly string[]).includes(value)
}

function migrateBlendOrFilterValue(key: string, value: unknown): unknown {
  if (!isRecord(value) || typeof value.type !== "string") {
    return value
  }

  if (key === "blendMode" && value.type === ValueType.EXACT) {
    if (typeof value.value === "string" && isKnownBlendMode(value.value)) {
      return { type: ValueType.OPTION, value: value.value }
    }
    return { type: ValueType.EMPTY, value: null }
  }

  if (key === "filter" && value.type === ValueType.EXACT) {
    if (typeof value.value === "string" && isPresetFilterValue(value.value)) {
      return { type: ValueType.OPTION, value: value.value }
    }
  }

  return value
}

function walkValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(walkValue)
  }

  if (!isRecord(value)) {
    return value
  }

  const migrated: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value)) {
    if (key === "blendMode" || key === "filter") {
      migrated[key] = migrateBlendOrFilterValue(key, child)
      continue
    }
    migrated[key] = walkValue(child)
  }
  return migrated
}

function migratePropertyBag(
  bag: Record<string, unknown>,
): Record<string, unknown> {
  const walked = walkValue(bag)
  return isRecord(walked) ? walked : bag
}

/**
 * v1: normalizes legacy EXACT blendMode and filter values to OPTION where the
 * stored string matches the new catalog enums or filter presets.
 */
export function migrateV1BackgroundBlendFilter(
  workspace: Workspace,
): Workspace {
  const next: Workspace = {
    ...workspace,
    nodes: { ...workspace.nodes },
    themes: { ...workspace.themes },
    boards: { ...workspace.boards },
  }

  for (const [nodeId, node] of Object.entries(next.nodes) as Array<
    [string, EntryNode]
  >) {
    next.nodes[nodeId] = {
      ...node,
      overrides: migratePropertyBag(
        node.overrides as Record<string, unknown>,
      ) as typeof node.overrides,
    }
  }

  for (const [themeId, theme] of Object.entries(next.themes) as Array<
    [string, EntryTheme]
  >) {
    next.themes[themeId] = {
      ...theme,
      overrides: migratePropertyBag(
        theme.overrides as Record<string, unknown>,
      ) as typeof theme.overrides,
    }
  }

  for (const [boardKey, board] of Object.entries(next.boards) as Array<
    [string, Board]
  >) {
    if (!isComponentBoard(board) && !isPlaygroundBoard(board)) {
      continue
    }
    next.boards[boardKey] = {
      ...board,
      componentProperties: migratePropertyBag(
        board.componentProperties as Record<string, unknown>,
      ) as typeof board.componentProperties,
    }
  }

  return next
}

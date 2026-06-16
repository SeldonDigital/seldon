import { ValueType } from "../../../../properties/constants"
import { BackgroundKind } from "../../../../properties/values/appearance/background/background-kind"
import { BackgroundRepeat } from "../../../../properties/values/appearance/background/background-repeat"
import { isComponentBoard, isPlaygroundBoard } from "../../../model"
import type { Board } from "../../../model/components"
import type { EntryNode } from "../../../model/entry-node"
import type { EntryTheme } from "../../../model/entry-theme"
import type { Workspace } from "../../../model/workspace"

const COLOR_FACETS = ["color", "brightness", "opacity"] as const
const IMAGE_FACETS = [
  "image",
  "blendMode",
  "position",
  "size",
  "repeat",
  "filter",
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value)
}

/** A facet cell carries a value when present and not explicitly empty. */
function isSetCell(cell: unknown): boolean {
  return isRecord(cell) && cell.type !== ValueType.EMPTY
}

/** Returns a legacy `@background.*` preset token, or null when absent. */
function presetToken(layer: Record<string, unknown>): string | null {
  const preset = layer.preset
  if (
    isRecord(preset) &&
    typeof preset.value === "string" &&
    preset.value.startsWith("@background.")
  ) {
    return preset.value
  }
  return null
}

function deriveKind(layer: Record<string, unknown>): BackgroundKind {
  const token = presetToken(layer)
  const isImagePreset =
    token === "@background.background1" || token === "@background.background2"
  const isNonePreset = token === "@background.none"
  const isColorPreset = token !== null && !isImagePreset && !isNonePreset

  // Image wins when a layer carries both a picture and a color (documented).
  if (isSetCell(layer.image) || isImagePreset) return BackgroundKind.IMAGE
  if (isSetCell(layer.color) || isColorPreset) return BackgroundKind.COLOR
  return BackgroundKind.NONE
}

/** Rewrites one legacy background layer into the kind-typed shape. */
function migrateBackgroundLayer(layer: unknown): Record<string, unknown> {
  if (!isRecord(layer)) {
    return { kind: { type: ValueType.OPTION, value: BackgroundKind.NONE } }
  }

  const kind = deriveKind(layer)
  const next: Record<string, unknown> = {
    kind: { type: ValueType.OPTION, value: kind },
  }

  if (kind === BackgroundKind.COLOR) {
    for (const facet of COLOR_FACETS) {
      if (facet in layer) next[facet] = layer[facet]
    }
  }

  if (kind === BackgroundKind.IMAGE) {
    for (const facet of IMAGE_FACETS) {
      if (facet in layer) next[facet] = layer[facet]
    }
    // `@background.background2` historically meant a tiling picture.
    if (
      presetToken(layer) === "@background.background2" &&
      !isSetCell(next.repeat)
    ) {
      next.repeat = { type: ValueType.OPTION, value: BackgroundRepeat.REPEAT }
    }
  }

  return next
}

function migrateBackgroundValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(migrateBackgroundLayer)
  }
  if (isRecord(value)) {
    return [migrateBackgroundLayer(value)]
  }
  return value
}

function migratePropertyBag(
  bag: Record<string, unknown>,
): Record<string, unknown> {
  if (!("background" in bag)) return bag
  return { ...bag, background: migrateBackgroundValue(bag.background) }
}

/** Drops the removed `background` look section from a theme override bag. */
function stripThemeBackground(
  overrides: Record<string, unknown>,
): Record<string, unknown> {
  if (!("background" in overrides)) return overrides
  const next = { ...overrides }
  delete next.background
  return next
}

/**
 * v3: rewrites every background layer to the kind-typed model. It derives a
 * `kind` (none / color / image) from the legacy facets and preset, keeps only
 * that kind's facets, drops the `preset`, and removes the now-deleted theme
 * `background` look overrides.
 */
export function migrateV3BackgroundKind(workspace: Workspace): Workspace {
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
      overrides: stripThemeBackground(
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

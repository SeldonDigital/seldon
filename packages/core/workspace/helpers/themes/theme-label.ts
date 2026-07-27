import { isThemeBoard } from "../../model/components"

import type { Workspace } from "../../model/workspace"

/** Normalizes a theme label for comparison: trimmed and lowercased. */
function normalizeLabel(label: string): string {
  return label.trim().toLowerCase()
}

/**
 * Returns the labels of every theme board, optionally excluding one board key.
 * Used to keep authored theme names unique within a workspace.
 */
export function getThemeBoardLabels(workspace: Workspace, exceptBoardKey?: string): string[] {
  const labels: string[] = []

  for (const [key, board] of Object.entries(workspace.boards)) {
    if (!board || !isThemeBoard(board)) continue
    if (exceptBoardKey && key === exceptBoardKey) continue
    labels.push(board.label)
  }

  return labels
}

/**
 * True when another theme board already uses `label`, compared trimmed and
 * case-insensitively. Pass `exceptBoardKey` to ignore the board being renamed.
 */
export function isThemeBoardLabelTaken(
  workspace: Workspace,
  label: string,
  exceptBoardKey?: string,
): boolean {
  const target = normalizeLabel(label)

  return getThemeBoardLabels(workspace, exceptBoardKey).some(
    (existing) => normalizeLabel(existing) === target,
  )
}

/**
 * Builds a unique theme board label from `base`, appending an incrementing
 * suffix until it no longer collides with an existing theme board label.
 * For example `New Theme`, then `New Theme 2`, `New Theme 3`.
 */
export function getUniqueThemeBoardLabel(workspace: Workspace, base: string): string {
  if (!isThemeBoardLabelTaken(workspace, base)) return base
  let index = 2

  while (isThemeBoardLabelTaken(workspace, `${base} ${index}`)) {
    index += 1
  }

  return `${base} ${index}`
}

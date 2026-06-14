import type { Board, BoardKey, Workspace } from "../../types"

/**
 * Rows that own component composition trees: component boards in
 * `workspace.boards` plus playground containers in `workspace.playgrounds`.
 *
 * Playground containers share the board shape (a `variants` list of
 * `ComponentTreeRef`), so node tree helpers can treat them uniformly. Resource
 * boards (theme, font, icon, media) are still included from `workspace.boards`;
 * callers that only want composition trees filter by `type`.
 */
export function getCompositionContainers(workspace: Workspace): Board[] {
  return [
    ...Object.values(workspace.boards),
    ...Object.values(workspace.playgrounds ?? {}),
  ]
}

/** Same as {@link getCompositionContainers} but keyed by container key. */
export function getCompositionContainerEntries(
  workspace: Workspace,
): Array<[BoardKey, Board]> {
  return [
    ...Object.entries(workspace.boards),
    ...Object.entries(workspace.playgrounds ?? {}),
  ]
}

/** Looks up a board or playground container by key. */
export function getContainerByKey(
  workspace: Workspace,
  key: BoardKey,
): Board | undefined {
  return workspace.boards[key] ?? workspace.playgrounds?.[key]
}

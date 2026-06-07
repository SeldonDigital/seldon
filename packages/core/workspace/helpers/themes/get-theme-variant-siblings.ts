import { EntryThemeId, Workspace } from "../../types"
import { getBoardVariantRootIds } from "../components/get-board-variant-root-ids"

export function getThemeVariantSiblingIds(
  themeId: EntryThemeId,
  workspace: Workspace,
): EntryThemeId[] {
  const board = Object.values(workspace.components).find(
    (candidate) =>
      candidate.type === "theme" &&
      getBoardVariantRootIds(candidate).includes(themeId),
  )
  if (!board) return []
  return getBoardVariantRootIds(board).filter((id) => id !== themeId)
}

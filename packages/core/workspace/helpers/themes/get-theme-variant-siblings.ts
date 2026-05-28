import { EntryThemeId, Workspace } from "../../types"
import { getComponentVariantRootIds } from "../components/get-component-variant-root-ids"

export function getThemeVariantSiblingIds(
  themeId: EntryThemeId,
  workspace: Workspace,
): EntryThemeId[] {
  const board = Object.values(workspace.components).find(
    (candidate) =>
      candidate.type === "theme" &&
      getComponentVariantRootIds(candidate).includes(themeId),
  )
  if (!board) return []
  return getComponentVariantRootIds(board).filter((id) => id !== themeId)
}

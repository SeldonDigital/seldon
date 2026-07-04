import { IconId } from "../../icon-sets"
import { isIconSetBoard } from "../../workspace/model/components"
import { Workspace } from "../../workspace/types"
import { carbonIconIds } from "../catalog/carbon"
import { lucideIconIds } from "../catalog/lucide"
import { materialIconIds } from "../catalog/material"
import { seldonIconIds } from "../catalog/seldon"
import { IconSetId } from "../types"

const ICON_SET_CATALOG_TO_SET_ID: Record<string, IconSetId> = {
  seldonIcons: "seldon",
  googleSymbols: "google-material",
  ibmCarbon: "carbon",
  lucideIcons: "lucide",
}

function iconIdsForSet(setId: IconSetId): readonly IconId[] {
  switch (setId) {
    case "google-material":
      return materialIconIds
    case "carbon":
      return carbonIconIds
    case "lucide":
      return lucideIconIds
    case "seldon":
      return seldonIconIds
    default:
      return []
  }
}

function collectIconSetIdsFromBoards(workspace: Workspace): IconSetId[] {
  const setIds = new Set<IconSetId>()
  for (const entry of Object.values(workspace.boards)) {
    if (!entry || !isIconSetBoard(entry)) continue
    const setId = ICON_SET_CATALOG_TO_SET_ID[entry.catalogId]
    if (setId) setIds.add(setId)
  }
  return [...setIds]
}

/**
 * Returns icon ids available in the workspace from icon-set boards.
 * When no icon-set boards exist, includes icons from the default material and seldon sets.
 */
export function getAvailableIcons(workspace: Workspace): IconId[] {
  let setIds = collectIconSetIdsFromBoards(workspace)
  if (setIds.length === 0) {
    setIds = ["google-material", "seldon"]
  }

  const availableIcons = new Set<IconId>()
  for (const setId of setIds) {
    for (const iconId of iconIdsForSet(setId)) {
      availableIcons.add(iconId)
    }
  }

  return Array.from(availableIcons)
}

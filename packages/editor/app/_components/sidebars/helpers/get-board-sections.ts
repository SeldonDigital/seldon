import { Board as BoardType } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import {
  ComponentLevel,
  isComponentId,
  ORDERED_COMPONENT_LEVELS,
} from "@seldon/core/components/constants"
import { isResourceType } from "@seldon/core/workspace/helpers/components/is-resource-type"
import { isComponentBoard, isPlaygroundBoard } from "@seldon/core/workspace/model"
import { getComponentKey } from "@lib/workspace/workspace-accessors"

export const SECTION_LABELS: Record<ComponentLevel, string> = {
  [ComponentLevel.FRAME]: "Frames",
  [ComponentLevel.PRIMITIVE]: "Primitives",
  [ComponentLevel.ELEMENT]: "Elements",
  [ComponentLevel.PART]: "Parts",
  [ComponentLevel.MODULE]: "Modules",
  [ComponentLevel.SCREEN]: "Screens",
  [ComponentLevel.BOARD]: "Boards",
}

export interface BoardSection {
  label: string
  level: ComponentLevel | "CORE"
  boards: BoardType[]
}

/**
 * Groups boards into sections based on their component level.
 * IconSet and Theme boards are placed in a special "Assets" section at the end.
 * This is a helper function for organizing workspace boards for display.
 */
function getBoardComponentLevel(board: BoardType): ComponentLevel | null {
  if (isComponentBoard(board) && isComponentId(board.catalogId)) {
    return getComponentSchema(board.catalogId).level
  }
  if (isPlaygroundBoard(board)) {
    return ComponentLevel.SCREEN
  }
  return null
}

export function getBoardSections(boards: BoardType[]): BoardSection[] {
  const specialBoards = boards.filter((board) => isResourceType(board))

  const regularBoards = boards.filter((board) => !isResourceType(board))

  // Group regular boards by component level
  const sections = [...ORDERED_COMPONENT_LEVELS].reduce<BoardSection[]>(
    (acc, level) => {
      const boardsAtThisLevel = regularBoards.filter((board) => {
        const boardLevel = getBoardComponentLevel(board)
        if (boardLevel === null) {
          console.warn(
            `Skipping board ${getComponentKey(board)} with unknown component level`,
          )
          return false
        }
        return boardLevel === level
      })
      if (boardsAtThisLevel.length > 0) {
        acc.push({
          label: SECTION_LABELS[level],
          level,
          boards: boardsAtThisLevel,
        })
      }
      return acc
    },
    [],
  )

  // Add Assets section at the end
  if (specialBoards.length > 0) {
    const assetsSection: BoardSection = {
      label: "Assets",
      level: "CORE",
      boards: specialBoards,
    }
    sections.push(assetsSection)
  }

  return sections
}

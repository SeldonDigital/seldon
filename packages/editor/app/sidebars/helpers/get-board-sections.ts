import { Board as BoardType } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import {
  ComponentLevel,
  isComponentId,
  ORDERED_COMPONENT_LEVELS,
} from "@seldon/core/components/constants"
import { isResourceType } from "@seldon/core/workspace/helpers/components/is-resource-type"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model"
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
  level: ComponentLevel | "THEME" | "FONT_COLLECTION" | "CORE"
  boards: BoardType[]
}

/**
 * Groups boards into sections based on their component level.
 * Theme boards get their own "Themes" section directly below the Frames section.
 * IconSet and media boards are placed in a special "Assets" section at the end.
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
  const themeBoards = boards.filter((board) => isThemeBoard(board))

  const fontCollectionBoards = boards.filter((board) =>
    isFontCollectionBoard(board),
  )

  const assetBoards = boards.filter(
    (board) =>
      isResourceType(board) &&
      !isThemeBoard(board) &&
      !isFontCollectionBoard(board),
  )

  const regularBoards = boards.filter((board) => !isResourceType(board))

  // Always emit a section for every component level, even when empty, so the
  // user can add a component at that level.
  const sections = [...ORDERED_COMPONENT_LEVELS].map<BoardSection>((level) => {
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
    return {
      label: SECTION_LABELS[level],
      level,
      boards: boardsAtThisLevel,
    }
  })

  // Insert the Themes section directly below the Frames section. Always shown.
  const themesSection: BoardSection = {
    label: "Themes",
    level: "THEME",
    boards: themeBoards,
  }
  const framesIndex = sections.findIndex(
    (section) => section.level === ComponentLevel.FRAME,
  )
  const themesInsertIndex =
    framesIndex === -1 ? sections.length : framesIndex + 1
  sections.splice(themesInsertIndex, 0, themesSection)

  // Insert the Font Collections section directly below the Themes section.
  // Always shown.
  const fontCollectionsSection: BoardSection = {
    label: "Font Collections",
    level: "FONT_COLLECTION",
    boards: fontCollectionBoards,
  }
  const themesIndex = sections.findIndex(
    (section) => section.level === "THEME",
  )
  sections.splice(themesIndex + 1, 0, fontCollectionsSection)

  // Add Assets section at the end. It has no add flow, so it stays hidden when
  // empty.
  if (assetBoards.length > 0) {
    const assetsSection: BoardSection = {
      label: "Assets",
      level: "CORE",
      boards: assetBoards,
    }
    sections.push(assetsSection)
  }

  return sections
}

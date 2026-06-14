import { Board as BoardType } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import {
  ComponentLevel,
  ORDERED_COMPONENT_LEVELS,
  isComponentId,
} from "@seldon/core/components/constants"
import { isResourceType } from "@seldon/core/workspace/helpers/components/is-resource-type"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
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
  level:
    | ComponentLevel
    | "THEME"
    | "FONT_COLLECTION"
    | "ICON_SET"
    | "MEDIA"
    | "PLAYGROUND"
  boards: BoardType[]
}

/**
 * Groups boards into sections based on their component level.
 * Theme boards get their own "Themes" section directly below the Frames section.
 * Icon set boards get an "Icon Sets" section below Font Collections.
 * Media boards get a "Media" section at the end.
 * This is a helper function for organizing workspace boards for display.
 */
function getBoardComponentLevel(board: BoardType): ComponentLevel | null {
  if (isComponentBoard(board) && isComponentId(board.catalogId)) {
    return getComponentSchema(board.catalogId).level
  }
  return null
}

export function getBoardSections(
  boards: BoardType[],
  playgrounds: BoardType[] = [],
): BoardSection[] {
  const themeBoards = boards.filter((board) => isThemeBoard(board))

  const fontCollectionBoards = boards.filter((board) =>
    isFontCollectionBoard(board),
  )

  const iconSetBoards = boards.filter((board) => isIconSetBoard(board))

  const mediaBoards = boards.filter((board) => isMediaBoard(board))

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
  const themesIndex = sections.findIndex((section) => section.level === "THEME")
  sections.splice(themesIndex + 1, 0, fontCollectionsSection)

  // Insert the Icon Sets section directly below the Font Collections section.
  // Always shown, mirroring the seeded Font Collections resource.
  const iconSetsSection: BoardSection = {
    label: "Icon Sets",
    level: "ICON_SET",
    boards: iconSetBoards,
  }
  const fontCollectionsIndex = sections.findIndex(
    (section) => section.level === "FONT_COLLECTION",
  )
  sections.splice(fontCollectionsIndex + 1, 0, iconSetsSection)

  // Add the Media section at the end. It has no add flow, so it stays hidden
  // when empty.
  if (mediaBoards.length > 0) {
    const mediaSection: BoardSection = {
      label: "Media",
      level: "MEDIA",
      boards: mediaBoards,
    }
    sections.push(mediaSection)
  }

  // Insert the Playgrounds section directly above Screens. Always shown so the
  // user can create a playground even when none exist yet.
  const playgroundsSection: BoardSection = {
    label: "Playgrounds",
    level: "PLAYGROUND",
    boards: playgrounds,
  }
  const screensIndex = sections.findIndex(
    (section) => section.level === ComponentLevel.SCREEN,
  )
  sections.splice(
    screensIndex === -1 ? sections.length : screensIndex,
    0,
    playgroundsSection,
  )

  return sections
}

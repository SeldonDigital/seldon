"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { isFontCollectionBoard } from "@seldon/core/workspace/model/components"
import { themeService } from "@seldon/core/workspace/services/theme/theme.service"
import type { Workspace } from "@seldon/core/workspace/types"
import { getCalendarPreviewBase } from "@lib/font-collections/build-calendar-preview-workspace"
import { usePreview } from "@lib/hooks/use-preview"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { Frame } from "../../seldon/frames/Frame"
import { CssPortal } from "../CssPortal"
import { ThemePreviewNode } from "./ThemePreviewNode"

export type FontCollectionBoardProps = {
  board: Board
}

/**
 * Font collection board canvas: board chrome plus one Calendar preview per collection entry.
 *
 * Mirrors the theme board, swapping the Dialog preview for a Calendar preview.
 */
export function FontCollectionBoard({ board }: FontCollectionBoardProps) {
  const { workspace } = useWorkspace()
  const boardKey = getComponentKey(board)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(board, workspace)
  const { device, isInPreviewMode } = usePreview()

  const boardTheme = useMemo(
    () => themeService.getObjectTheme(board, workspace),
    [board, workspace],
  )

  const variantEntryIds = isFontCollectionBoard(board)
    ? board.variants.map((variant) => variant.id)
    : []

  const computedProperties: Properties = isInPreviewMode
    ? {
        ...properties,
        board: {
          ...(properties.board ?? {}),
          width: {
            type: ValueType.EXACT,
            value: { unit: Unit.PX, value: device.width },
          },
          height: {
            type: ValueType.EXACT,
            value: { unit: Unit.PX, value: device.height },
          },
        },
        scroll: {
          type: ValueType.OPTION,
          value: Scroll.VERTICAL,
        },
      }
    : properties

  const boardCss = getCssFromProperties(
    computedProperties,
    {
      theme: boardTheme ?? undefined,
      properties: computedProperties,
      parentContext: null,
    },
    className,
  )

  return (
    <>
      <CssPortal>
        <style>{boardCss}</style>
      </CssPortal>
      <Frame
        data-board-id={boardKey}
        className={className}
        style={{
          position: "static",
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          alignItems: "flex-start",
          justifyContent: "center",
          minHeight: "100%",
          padding: "2rem",
        }}
      >
        {variantEntryIds.map((variantEntryId) => (
          <FontCollectionCalendar
            key={variantEntryId}
            variantEntryId={variantEntryId}
            themes={workspace.themes}
            boardThemeId={board.componentTheme}
          />
        ))}
      </Frame>
    </>
  )
}

type FontCollectionCalendarProps = {
  variantEntryId: string
  themes: Workspace["themes"]
  boardThemeId: string
}

/** Renders a single Calendar preview for one font collection entry. */
function FontCollectionCalendar({
  variantEntryId,
  themes,
  boardThemeId,
}: FontCollectionCalendarProps) {
  const { workspace: calendarBase, rootId } = getCalendarPreviewBase()

  const previewWorkspace = useMemo(() => {
    if (!rootId) {
      return null
    }
    const root = calendarBase.nodes[rootId]
    return {
      ...calendarBase,
      themes,
      nodes: {
        ...calendarBase.nodes,
        [rootId]: { ...root, theme: boardThemeId },
      },
    } as Workspace
  }, [calendarBase, rootId, themes, boardThemeId])

  if (!previewWorkspace || !rootId) {
    return null
  }

  return (
    <ThemePreviewNode
      nodeId={rootId}
      workspace={previewWorkspace}
      scope={variantEntryId}
      isRoot
    />
  )
}

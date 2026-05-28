"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { getComputedTheme } from "@seldon/core/workspace/compute"
import { getComponentLevelThemeRef } from "@seldon/core/workspace/helpers/components/get-component-level-theme-ref"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { ThemeId } from "@seldon/core/themes/types"
import { resolveActiveThemeEntryId } from "@lib/themes/resolve-active-theme-entry-id"
import { usePreview } from "@lib/hooks/use-preview"
import { useSelection } from "@lib/workspace/use-selection"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { Frame } from "../../seldon/frames/Frame"
import { CssPortal } from "../CssPortal"

export type ThemeBoardProps = {
  board: Board
}

/**
 * Theme board canvas: board chrome and a placeholder until a v0 preview fixture exists.
 */
export function ThemeBoard({ board }: ThemeBoardProps) {
  const { workspace } = useWorkspace()
  const { selectedBoard, selectedThemeEntryId } = useSelection()
  const boardKey = getComponentKey(board)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(board, workspace)
  const { device, isInPreviewMode } = usePreview()

  const activeThemeEntryId = useMemo(
    () =>
      resolveActiveThemeEntryId({
        workspace,
        selectedThemeEntryId,
        selectedBoard: selectedBoard ?? board,
      }),
    [workspace, selectedThemeEntryId, selectedBoard, board],
  )

  const previewTheme = useMemo(() => {
    if (!activeThemeEntryId) {
      return null
    }
    return getComputedTheme(activeThemeEntryId, workspace)
  }, [activeThemeEntryId, workspace])

  const boardThemeId = (getComponentLevelThemeRef(board) ?? "default") as ThemeId

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
      theme: previewTheme ?? undefined,
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
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
        }}
      >
        <p
          style={{
            fontFamily: "IBM Plex Sans",
            fontSize: "0.875rem",
            color: "hsl(0deg 0% 100% / 0.6)",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          {activeThemeEntryId
            ? `Editing theme: ${workspace.themes[activeThemeEntryId]?.label ?? activeThemeEntryId}`
            : "Select a theme variant in the objects sidebar to edit tokens."}
          {previewTheme ? ` (preview uses ${boardThemeId} board chrome)` : null}
        </p>
      </Frame>
    </>
  )
}

"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { isFontCollectionBoard } from "@seldon/core/workspace/model/components"
import { themeService } from "@seldon/core/workspace/services/theme/theme.service"
import type { Workspace } from "@seldon/core/workspace/types"
import { getTypeSpecimenPreviewBase } from "@lib/font-collections/build-type-specimen-preview"
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
 * Font collection board canvas: board chrome plus one Type Specimen preview per collection entry.
 *
 * Mirrors the theme board, swapping the Dialog preview for a Type Specimen preview.
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
          <FontCollectionTypeSpecimen
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

type FontCollectionTypeSpecimenProps = {
  variantEntryId: string
  themes: Workspace["themes"]
  boardThemeId: string
}

/** Renders a single Type Specimen preview for one font collection entry. */
function FontCollectionTypeSpecimen({
  variantEntryId,
  themes,
  boardThemeId,
}: FontCollectionTypeSpecimenProps) {
  const { workspace: typeSpecimenBase, rootId } = getTypeSpecimenPreviewBase()

  const previewWorkspace = useMemo(() => {
    if (!rootId) {
      return null
    }
    const root = typeSpecimenBase.nodes[rootId]
    return {
      ...typeSpecimenBase,
      themes,
      nodes: {
        ...typeSpecimenBase.nodes,
        [rootId]: { ...root, theme: boardThemeId },
      },
    } as Workspace
  }, [typeSpecimenBase, rootId, themes, boardThemeId])

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

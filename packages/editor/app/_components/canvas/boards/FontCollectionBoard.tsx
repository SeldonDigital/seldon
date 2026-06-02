"use client"

import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useEffect, useMemo, useRef } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import type { FontFamilyEntry } from "@seldon/core/font-collections/types"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { themeService } from "@seldon/core/workspace/services/theme/theme.service"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import type { Workspace } from "@seldon/core/workspace/types"
import { getTypeSpecimenPreviewBase } from "@lib/font-collections/build-type-specimen-preview"
import { usePreview } from "@lib/hooks/use-preview"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import {
  formatResourceItemKey,
  useSelectedResourceItemKey,
} from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { Frame } from "../../seldon/frames/Frame"
import { CssPortal } from "../CssPortal"
import { BoardPreviewNode } from "./BoardPreviewNode"

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
  const selectedResourceItemKey = useSelectedResourceItemKey()

  const boardTheme = useMemo(
    () => themeService.getObjectTheme(board, workspace),
    [board, workspace],
  )

  const families = useMemo(() => {
    const collection = workspaceFontCollectionService.getBoardFontCollection(
      boardKey,
      workspace,
    )
    return collection ? Object.entries(collection.families) : []
  }, [boardKey, workspace])

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
        {families.map(([slot, family]) => {
          const selectionKey = formatResourceItemKey({
            resource: "font-collection",
            componentKey: boardKey,
            slot,
          })
          return (
            <FontCollectionTypeSpecimen
              key={slot}
              scope={`${boardKey}-${slot}`}
              family={family}
              themes={workspace.themes}
              boardThemeId={board.componentTheme}
              isSelected={selectedResourceItemKey === selectionKey}
            />
          )
        })}
      </Frame>
    </>
  )
}

type FontCollectionTypeSpecimenProps = {
  scope: string
  family: FontFamilyEntry
  themes: Workspace["themes"]
  boardThemeId: string
  isSelected: boolean
}

/**
 * Renders a single Type Specimen preview for one font family.
 *
 * The family's CSS stack is injected as a `font.family` override on every node
 * of the cloned preview workspace, so the whole specimen renders in that family.
 * This per-item wrapper is generic: icon sets and media will reuse it by swapping
 * the preview base and the injected property.
 */
function FontCollectionTypeSpecimen({
  scope,
  family,
  themes,
  boardThemeId,
  isSelected,
}: FontCollectionTypeSpecimenProps) {
  const { workspace: typeSpecimenBase, rootId } = getTypeSpecimenPreviewBase()
  const containerRef = useRef<HTMLDivElement>(null)

  const fontValue = family.stack ?? family.name

  const previewWorkspace = useMemo(() => {
    if (!rootId) {
      return null
    }
    const nodes = Object.fromEntries(
      Object.entries(typeSpecimenBase.nodes).map(([id, node]) => {
        // The subheading shows the specimen title. Swap its placeholder content
        // for the family name. This is an editor-only preview override.
        const isSubheading =
          getNodeCatalogComponentId(node, typeSpecimenBase) ===
          ComponentId.SUBHEADING
        return [
          id,
          {
            ...node,
            overrides: {
              ...node.overrides,
              font: {
                ...(node.overrides?.font ?? {}),
                family: { type: ValueType.OPTION, value: fontValue },
              },
              ...(isSubheading
                ? {
                    content: { type: ValueType.EXACT, value: family.name },
                  }
                : {}),
            },
            ...(id === rootId ? { theme: boardThemeId } : {}),
          },
        ]
      }),
    )
    return {
      ...typeSpecimenBase,
      themes,
      nodes,
    } as Workspace
  }, [typeSpecimenBase, rootId, themes, boardThemeId, fontValue, family.name])

  useEffect(() => {
    if (isSelected && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [isSelected])

  if (!previewWorkspace || !rootId) {
    return null
  }

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: "0.5rem",
        outline: isSelected ? "2px solid var(--seldon-accent, #3b82f6)" : "none",
        outlineOffset: "4px",
      }}
    >
      <BoardPreviewNode
        nodeId={rootId}
        workspace={previewWorkspace}
        scope={scope}
        isRoot
      />
    </div>
  )
}

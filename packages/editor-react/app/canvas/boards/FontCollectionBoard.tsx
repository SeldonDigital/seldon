"use client"

import { getTypeSpecimenPreviewBase } from "@seldon/editor/lib/font-collections/build-type-specimen-preview"
import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import type { FontFamilyEntry } from "@seldon/core/font-collections/types"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import type { Workspace } from "@seldon/core/workspace/types"
import { useNodeTheme } from "@app/themes/hooks/use-node-theme"
import { formatResourceItemKey } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { usePreview } from "@app/hooks/use-preview"
import { useFontCollectionBoardSpecimens } from "../hooks/use-font-collection-board-specimens"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { Frame } from "@seldon/components/frames/Frame"
import { CssPortal } from "../CssPortal"
import { StyleTag } from "../StyleTag.bespoke"
import { canvasSelectionId } from "../helpers/canvas-selection-target"
import { BoardPreviewNode } from "./BoardPreviewNode"
import { PreviewItemWrapper } from "./PreviewItemWrapper"
import { injectBoardBackground } from "./inject-board-background"

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

  const boardTheme = useNodeTheme(board)
  const specimens = useFontCollectionBoardSpecimens(board)

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
        <StyleTag css={boardCss} />
      </CssPortal>
      <Frame
        data-board-id={boardKey}
        className={className}
        style={{
          position: "static",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          gap: "2rem",
          alignItems: "stretch",
          minHeight: "100%",
          padding: "2rem",
        }}
      >
        {specimens.map(({ entryId, slot, family, weightsLabel }) => {
          const selectionKey = formatResourceItemKey({
            resource: "font-collection",
            boardKey: boardKey,
            entryId,
            slot,
          })
          return (
            <FontCollectionTypeSpecimen
              key={`${entryId}-${slot}`}
              scope={`${boardKey}-${entryId}-${slot}`}
              entryId={entryId}
              resourceItemKey={selectionKey}
              family={family}
              weightsLabel={weightsLabel}
              themes={workspace.themes}
              boardThemeId={board.componentTheme}
              boardBackground={properties.background}
            />
          )
        })}
      </Frame>
    </>
  )
}

type FontCollectionTypeSpecimenProps = {
  scope: string
  entryId: string
  resourceItemKey: string
  family: FontFamilyEntry
  /** Enabled weight labels for this family, such as `"400, 700, 400 Italic"`. */
  weightsLabel: string
  themes: Workspace["themes"]
  boardThemeId: string
  /**
   * Board background injected onto the preview workspace's board so the
   * specimen's Text nodes resolve `HIGH_CONTRAST_COLOR` against the board
   * surface instead of the preview component board's transparent default.
   */
  boardBackground: Properties["background"]
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
  entryId,
  resourceItemKey,
  family,
  weightsLabel,
  themes,
  boardThemeId,
  boardBackground,
}: FontCollectionTypeSpecimenProps) {
  const { workspace: typeSpecimenBase, rootId } = getTypeSpecimenPreviewBase()

  const fontValue = family.stack ?? family.name

  const previewWorkspace = useMemo(() => {
    if (!rootId) {
      return null
    }
    const nodes = Object.fromEntries(
      Object.entries(typeSpecimenBase.nodes).map(([id, node]) => {
        // The specimen title shows the family name. Swap its placeholder content
        // for the family name. This is an editor-only preview override.
        const isSubheading =
          (node.overrides?.content as { value?: unknown } | undefined)
            ?.value === "Font Name"
        // The "Font weights" text node lists the family's enabled weights. Swap
        // its placeholder content the same way the family name is swapped.
        const isFontWeights =
          (node.overrides?.content as { value?: unknown } | undefined)
            ?.value === "Font weights"
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
              ...(isFontWeights && weightsLabel
                ? {
                    content: { type: ValueType.EXACT, value: weightsLabel },
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
      boards: injectBoardBackground(typeSpecimenBase.boards, boardBackground),
    } as Workspace
  }, [
    typeSpecimenBase,
    rootId,
    themes,
    boardThemeId,
    fontValue,
    family.name,
    weightsLabel,
    boardBackground,
  ])

  if (!previewWorkspace || !rootId) {
    return null
  }

  return (
    <PreviewItemWrapper
      canvasSelectionId={canvasSelectionId(resourceItemKey, entryId)}
      selectionId={resourceItemKey}
      selectionKind="resourceItem"
    >
      <BoardPreviewNode
        nodeId={rootId}
        workspace={previewWorkspace}
        scope={scope}
        isRoot
      />
    </PreviewItemWrapper>
  )
}

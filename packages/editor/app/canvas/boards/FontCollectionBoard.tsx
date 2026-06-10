"use client"

import { getTypeSpecimenPreviewBase } from "@lib/font-collections/build-type-specimen-preview"
import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { getEnabledVariants } from "@seldon/core/font-collections"
import type { FontFamilyEntry } from "@seldon/core/font-collections/types"
import { fontVariantDisplayLabel } from "@seldon/core/helpers/utils/font-variant"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { isFontCollectionBoard } from "@seldon/core/workspace/model/components"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import type { Workspace } from "@seldon/core/workspace/types"
import { formatResourceItemKey } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { usePreview } from "@lib/hooks/use-preview"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { Frame } from "@seldon/components/chrome/frames/Frame"
import {
  PreviewItemWrapper,
  StyleTag,
} from "@seldon/components/custom-components"
import { CssPortal } from "../CssPortal"
import { canvasSelectionId } from "../helpers/canvas-selection-target"
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

  const boardTheme = useMemo(
    () => workspaceThemeService.getObjectTheme(board, workspace),
    [board, workspace],
  )

  const specimens = useMemo(() => {
    const entryIds = isFontCollectionBoard(board)
      ? board.variants.map((variant) => variant.id)
      : []
    return entryIds.flatMap((entryId) => {
      const collection = workspaceFontCollectionService.getFontCollection(
        entryId,
        workspace,
      )
      if (!collection) return []
      const selection = workspaceFontCollectionService.getVariantSelection(
        entryId,
        workspace,
      )
      return Object.entries(collection.families).flatMap(([slot, family]) => {
        const variants = family.variants ?? []
        // Families without weight variants (local/system) always show and have
        // no weights line.
        if (variants.length === 0) {
          return [{ entryId, slot, family, weightsLabel: "" }]
        }
        const enabled = getEnabledVariants(selection[slot], variants)
        // A family shows only when at least one weight is enabled.
        if (enabled.length === 0) return []
        const weightsLabel = enabled.map(fontVariantDisplayLabel).join(", ")
        return [{ entryId, slot, family, weightsLabel }]
      })
    })
  }, [board, workspace])

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
    } as Workspace
  }, [
    typeSpecimenBase,
    rootId,
    themes,
    boardThemeId,
    fontValue,
    family.name,
    weightsLabel,
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

"use client"

import { getThemeSpecPreviewBase } from "@lib/themes/build-theme-spec-preview"
import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import { useMemo } from "react"
import { Board, Properties, Scroll, Unit, ValueType } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { colorValueToDisplayStrings } from "@seldon/core/helpers/color"
import { resolveColor } from "@seldon/core/helpers/resolution/resolve-color"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { isSwatchToken } from "@seldon/core/themes/values"
import { getComputedTheme } from "@seldon/core/workspace/compute"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { isThemeBoard } from "@seldon/core/workspace/model/components"
import type { Workspace } from "@seldon/core/workspace/types"
import { useNodeTheme } from "@lib/themes/hooks/use-node-theme"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { usePreview } from "@lib/hooks/use-preview"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { Frame } from "@seldon/components/chrome/frames/Frame"
import {
  PreviewItemWrapper,
  StyleTag,
} from "@seldon/components/custom-components"
import { CssPortal } from "../CssPortal"
import { BoardPreviewNode } from "./BoardPreviewNode"

export type ThemeBoardProps = {
  board: Board
}

/**
 * Theme board canvas: board chrome and a placeholder until a v0 preview fixture exists.
 */
export function ThemeBoard({ board }: ThemeBoardProps) {
  const { workspace } = useWorkspace()
  const boardKey = getComponentKey(board)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(board, workspace)
  const { device, isInPreviewMode } = usePreview()

  // The board chrome renders with the board's own theme so its background and
  // border resolve, independent of which variant (if any) is selected. The
  // per-variant previews below are themed individually.
  const boardTheme = useNodeTheme(board)

  const variantEntryIds = isThemeBoard(board)
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
        {variantEntryIds.map((variantEntryId) => (
          <ThemeVariantPreview
            key={variantEntryId}
            variantEntryId={variantEntryId}
            themes={workspace.themes}
          />
        ))}
      </Frame>
    </>
  )
}

type ThemeVariantPreviewProps = {
  variantEntryId: string
  themes: Workspace["themes"]
}

/**
 * Resolves the swatch name and its HEX/HSL display strings for one Color Chip
 * against the previewed theme, mirroring the color the chip paints.
 */
function resolveChipSwatch(
  chip: Workspace["nodes"][string],
  workspace: Workspace,
  theme: ReturnType<typeof getComputedTheme>,
): { name?: string; hex?: string; hsl?: string } {
  const properties = getNodeProperties(chip, workspace)
  const color = properties.background?.[0]?.color
  if (!color) {
    return {}
  }

  let name: string | undefined
  if (color.type === ValueType.THEME_CATEGORICAL) {
    try {
      const token = getThemeOption(String(color.value), theme)
      if (isSwatchToken(token)) {
        name = token.name
      }
    } catch {
      name = undefined
    }
  }

  const strings = colorValueToDisplayStrings(resolveColor({ color, theme }))
  return { name, hex: strings?.hex, hsl: strings?.hsl }
}

/**
 * Fills every Color Chip's three text nodes with the previewed theme's swatch
 * name, HEX value, and HSL value. Returns a node-id keyed map of the content to
 * inject, so dynamic swatches show their harmony-derived name and color.
 */
function buildChipTextContent(
  previewBase: Workspace,
  theme: ReturnType<typeof getComputedTheme>,
): Record<string, string> {
  const content: Record<string, string> = {}

  for (const node of Object.values(previewBase.nodes)) {
    if (
      getNodeCatalogComponentId(node, previewBase) !== ComponentId.COLOR_CHIP
    ) {
      continue
    }

    const { name, hex, hsl } = resolveChipSwatch(node, previewBase, theme)
    const [nameId, hexId, hslId] = getNodeChildIds(node, previewBase)

    if (nameId && name) content[nameId] = name
    if (hexId && hex) content[hexId] = hex
    if (hslId && hsl) content[hslId] = hsl
  }

  return content
}

/**
 * Renders a single Theme Spec Sheet preview themed by one workspace theme entry.
 */
function ThemeVariantPreview({
  variantEntryId,
  themes,
}: ThemeVariantPreviewProps) {
  const { workspace: previewBase, rootId } = getThemeSpecPreviewBase()

  const previewWorkspace = useMemo(() => {
    if (!rootId) {
      return null
    }
    const theme = getComputedTheme(variantEntryId, { themes })
    const chipContent = buildChipTextContent(previewBase, theme)
    const nodes = Object.fromEntries(
      Object.entries(previewBase.nodes).map(([id, node]) => {
        const injected = chipContent[id]
        return [
          id,
          {
            ...node,
            overrides: {
              ...node.overrides,
              ...(injected !== undefined
                ? { content: { type: ValueType.EXACT, value: injected } }
                : {}),
            },
            ...(id === rootId ? { theme: variantEntryId } : {}),
          },
        ]
      }),
    )
    return {
      ...previewBase,
      themes,
      nodes,
    } as Workspace
  }, [previewBase, rootId, themes, variantEntryId])

  if (!previewWorkspace || !rootId) {
    return null
  }

  return (
    <PreviewItemWrapper
      canvasSelectionId={variantEntryId}
      selectionId={variantEntryId}
      selectionKind="theme"
    >
      <BoardPreviewNode
        nodeId={rootId}
        workspace={previewWorkspace}
        scope={variantEntryId}
        isRoot
      />
    </PreviewItemWrapper>
  )
}

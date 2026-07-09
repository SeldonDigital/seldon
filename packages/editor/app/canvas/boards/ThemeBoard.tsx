"use client"

import { type MenuEntry, VMMenu } from "@lib/menus"
import { getThemeSpecPreviewBase } from "@lib/themes/build-theme-spec-preview"
import {
  ORDINAL_SCALES,
  type OrdinalScale,
  getOrdinalPreviewLayout,
  ordinalStepName,
  ordinalStepRef,
  ordinalStepValueText,
} from "@lib/themes/ordinal-preview"
import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import {
  type CSSProperties,
  type MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
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
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { usePreview } from "@lib/hooks/use-preview"
import {
  useOrdinalPreviewStore,
  useOrdinalSelection,
} from "../hooks/use-ordinal-preview-store"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { Frame } from "@seldon/components/frames/Frame"
import { StyleTag } from "@seldon/components/custom-components"
import { PreviewItemWrapper } from "./PreviewItemWrapper.bespoke"
import { CssPortal } from "../CssPortal"
import { BoardPreviewNode } from "./BoardPreviewNode"

export type ThemeBoardProps = {
  board: Board
}

/** Transparent delegation layer over a preview; adds no box of its own. */
const previewClickLayerStyle: CSSProperties = { display: "contents" }

/**
 * Theme board canvas: board chrome and a placeholder until a v0 preview fixture exists.
 */
export function ThemeBoard({ board }: ThemeBoardProps) {
  const { workspace } = useWorkspace()
  const { selectedThemeEntryId } = useSelection()
  const boardKey = getComponentKey(board)
  const className = `board-${boardKey}`
  const properties = getNodeProperties(board, workspace)
  const { device, isInPreviewMode } = usePreview()

  // The board chrome renders with the board's own theme so its background and
  // border resolve, independent of which variant (if any) is selected. The
  // per-variant previews below are themed individually.
  const boardTheme = useNodeTheme(board)

  // Theme boards show one variant at a time: the one selected in the objects
  // sidebar, falling back to the default (first) variant when the selection is
  // empty or points at another board's variant.
  const boardVariantIds = isThemeBoard(board)
    ? board.variants.map((variant) => variant.id)
    : []
  const defaultVariantId = boardVariantIds[0] ?? null
  const activeVariantId =
    selectedThemeEntryId && boardVariantIds.includes(selectedThemeEntryId)
      ? selectedThemeEntryId
      : defaultVariantId
  const variantEntryIds = activeVariantId ? [activeVariantId] : []

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

/** A THEME_ORDINAL property value pointing at a scale step token. */
function themeOrdinalValue(ref: string) {
  return { type: ValueType.THEME_ORDINAL as const, value: ref }
}

/**
 * Builds the box-style overrides each Ordinal Chip takes from the selected
 * steps, so the rendered chip's spacing, border width, and corner radius follow
 * the previewed theme's tokens. Every chip shares the same overrides, keyed by
 * node id. Border only overrides `width`, so the schema's preset and color stay.
 */
function buildChipStyleOverrides(
  previewBase: Workspace,
  stepByScale: Record<OrdinalScale, string>,
): Record<string, Properties> {
  const marginValue = themeOrdinalValue(
    ordinalStepRef("margin", stepByScale.margin),
  )
  const paddingValue = themeOrdinalValue(
    ordinalStepRef("padding", stepByScale.padding),
  )
  const gapValue = themeOrdinalValue(ordinalStepRef("gap", stepByScale.gap))
  const borderValue = themeOrdinalValue(
    ordinalStepRef("border", stepByScale.border),
  )
  const cornersValue = themeOrdinalValue(
    ordinalStepRef("corners", stepByScale.corners),
  )

  // Token refs are resolved at runtime by the previewed theme, so the dynamic
  // string values cannot satisfy the per-scale literal unions. Cast once here.
  const overrides = {
    margin: {
      top: marginValue,
      right: marginValue,
      bottom: marginValue,
      left: marginValue,
    },
    padding: {
      top: paddingValue,
      right: paddingValue,
      bottom: paddingValue,
      left: paddingValue,
    },
    gap: gapValue,
    corners: {
      topLeft: cornersValue,
      topRight: cornersValue,
      bottomLeft: cornersValue,
      bottomRight: cornersValue,
    },
    border: { width: borderValue },
  } as unknown as Properties

  const styleById: Record<string, Properties> = {}
  for (const node of Object.values(previewBase.nodes)) {
    if (
      getNodeCatalogComponentId(node, previewBase) === ComponentId.ORDINAL_CHIP
    ) {
      styleById[node.id] = overrides
    }
  }
  return styleById
}

/**
 * Renders a single Theme Spec Sheet preview themed by one workspace theme entry.
 */
function ThemeVariantPreview({
  variantEntryId,
  themes,
}: ThemeVariantPreviewProps) {
  const { workspace: previewBase, rootId } = getThemeSpecPreviewBase()
  const layout = getOrdinalPreviewLayout()
  const setSelection = useOrdinalPreviewStore((store) => store.setSelection)

  const marginStep = useOrdinalSelection(variantEntryId, "margin")
  const paddingStep = useOrdinalSelection(variantEntryId, "padding")
  const gapStep = useOrdinalSelection(variantEntryId, "gap")
  const borderStep = useOrdinalSelection(variantEntryId, "border")
  const cornersStep = useOrdinalSelection(variantEntryId, "corners")

  const stepByScale = useMemo<Record<OrdinalScale, string>>(
    () => ({
      margin: marginStep,
      padding: paddingStep,
      gap: gapStep,
      border: borderStep,
      corners: cornersStep,
    }),
    [marginStep, paddingStep, gapStep, borderStep, cornersStep],
  )

  const theme = useMemo(
    () => getComputedTheme(variantEntryId, { themes }),
    [variantEntryId, themes],
  )

  // Text to inject per node id: color chip swatch strings, plus the selected
  // step name on each legend button label and the resolved step value on each
  // chip row.
  const contentById = useMemo(() => {
    const content: Record<string, string> = buildChipTextContent(
      previewBase,
      theme,
    )
    for (const button of layout.legendButtons) {
      content[button.labelNodeId] = ordinalStepName(
        button.scale,
        stepByScale[button.scale],
        theme,
      )
    }
    for (const row of layout.chipRows) {
      content[row.textNodeId] = ordinalStepValueText(
        row.scale,
        stepByScale[row.scale],
        theme,
      )
    }
    return content
  }, [previewBase, theme, layout, stepByScale])

  const chipStyleById = useMemo(
    () => buildChipStyleOverrides(previewBase, stepByScale),
    [previewBase, stepByScale],
  )

  const previewWorkspace = useMemo(() => {
    if (!rootId) {
      return null
    }
    const nodes = Object.fromEntries(
      Object.entries(previewBase.nodes).map(([id, node]) => {
        const injected = contentById[id]
        const chipStyle = chipStyleById[id]
        return [
          id,
          {
            ...node,
            overrides: {
              ...node.overrides,
              ...(chipStyle ?? {}),
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
  }, [previewBase, rootId, themes, variantEntryId, contentById, chipStyleById])

  const scaleByButtonId = useMemo(() => {
    const map = new Map<string, OrdinalScale>()
    for (const button of layout.legendButtons) {
      map.set(button.buttonNodeId, button.scale)
    }
    return map
  }, [layout])

  const anchorRef = useRef<HTMLElement | null>(null)
  const [openScale, setOpenScale] = useState<OrdinalScale | null>(null)

  // Delegated click: walk up from the click target to the nearest preview node
  // that is a legend button, anchor the menu to it, and toggle it open.
  const handlePreviewClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      let element = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-preview-node-id]",
      )
      while (element) {
        const id = element.getAttribute("data-preview-node-id")
        const scale = id ? scaleByButtonId.get(id) : undefined
        if (scale) {
          event.stopPropagation()
          anchorRef.current = element
          setOpenScale((current) => (current === scale ? null : scale))
          return
        }
        element =
          element.parentElement?.closest<HTMLElement>(
            "[data-preview-node-id]",
          ) ?? null
      }
    },
    [scaleByButtonId],
  )

  const closeMenu = useCallback(() => setOpenScale(null), [])

  const menuItems = useMemo<MenuEntry[]>(() => {
    if (!openScale) return []
    const scale = openScale
    const currentStep = stepByScale[scale]
    return ORDINAL_SCALES[scale].steps.map((step) => ({
      id: step,
      label: ordinalStepName(scale, step, theme),
      selected: step === currentStep,
      activeMarker: "bullet",
      onSelect: () => setSelection(variantEntryId, scale, step),
    }))
  }, [openScale, stepByScale, theme, variantEntryId, setSelection])

  const menuOpen = openScale !== null

  if (!previewWorkspace || !rootId) {
    return null
  }

  return (
    <PreviewItemWrapper
      canvasSelectionId={variantEntryId}
      selectionId={variantEntryId}
      selectionKind="theme"
    >
      <div style={previewClickLayerStyle} onClick={handlePreviewClick}>
        <BoardPreviewNode
          nodeId={rootId}
          workspace={previewWorkspace}
          scope={variantEntryId}
          isRoot
        />
      </div>
      <VMMenu
        open={menuOpen}
        anchorRef={anchorRef}
        onClose={closeMenu}
        items={menuItems}
      />
    </PreviewItemWrapper>
  )
}

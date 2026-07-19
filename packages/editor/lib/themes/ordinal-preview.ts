import { ValueType } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { resolveModulatedOrExactLength } from "@seldon/core/helpers/resolution/resolve-length-token"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { getThemeValueName } from "@seldon/core/helpers/theme/get-theme-value-name"
import {
  type Theme,
  isModulatedToken,
  isThemeExactToken,
} from "@seldon/core/themes/types"
import type { Workspace } from "@seldon/core/workspace/types"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "../workspace/node-tree"
import { getThemeSpecPreviewBase } from "./build-theme-spec-preview"

/** The five ordinal scales the specimen legend and chips expose. */
export type OrdinalScale = "margin" | "padding" | "gap" | "border" | "corners"

/** Legend buttons and chip rows are authored in this order. */
export const ORDINAL_SCALE_ORDER: OrdinalScale[] = [
  "margin",
  "padding",
  "gap",
  "border",
  "corners",
]

type ScaleDefinition = {
  /** Theme token namespace used in the `@token.step` reference. */
  token: string
  steps: string[]
  defaultStep: string
}

const SPACING_STEPS = ["tight", "compact", "cozy", "comfortable", "open"]

/**
 * Ordinal option sets per scale. Spacing scales share the same steps and default
 * to `cozy`; the border scale uses the `@borderWidth` steps and defaults to
 * `medium`.
 */
export const ORDINAL_SCALES: Record<OrdinalScale, ScaleDefinition> = {
  margin: { token: "margin", steps: SPACING_STEPS, defaultStep: "cozy" },
  padding: { token: "padding", steps: SPACING_STEPS, defaultStep: "cozy" },
  gap: { token: "gap", steps: SPACING_STEPS, defaultStep: "cozy" },
  border: {
    token: "borderWidth",
    steps: ["xsmall", "small", "medium", "large", "xlarge"],
    defaultStep: "medium",
  },
  corners: { token: "corners", steps: SPACING_STEPS, defaultStep: "cozy" },
}

/** Builds the `@token.step` reference for a scale step. */
export function ordinalStepRef(scale: OrdinalScale, step: string): string {
  return `@${ORDINAL_SCALES[scale].token}.${step}`
}

export type OrdinalLegendButton = {
  scale: OrdinalScale
  /** The button node the menu anchors to. */
  buttonNodeId: string
  /** The label text node whose content shows the selected step. */
  labelNodeId: string
}

export type OrdinalChipRow = {
  scale: OrdinalScale
  /** The row text node whose content shows the selected step value. */
  textNodeId: string
}

export type OrdinalPreviewLayout = {
  legendButtons: OrdinalLegendButton[]
  chipRows: OrdinalChipRow[]
}

let cachedLayout: OrdinalPreviewLayout | null = null

/** Finds the first descendant text node id under a parent node, breadth first. */
function findFirstTextNodeId(
  parentNodeId: string,
  workspace: Workspace,
): string | null {
  const parent = workspace.nodes[parentNodeId]
  if (!parent) return null

  const queue = [...getNodeChildIds(parent, workspace)]
  while (queue.length > 0) {
    const id = queue.shift() as string
    const node = workspace.nodes[id]
    if (!node) continue
    if (getNodeCatalogComponentId(node, workspace) === ComponentId.TEXT) {
      return id
    }
    queue.push(...getNodeChildIds(node, workspace))
  }
  return null
}

/**
 * Collects every descendant node id of the given component under a root, in
 * document (pre-order) order. Traverses the board tree, so it resolves nodes
 * embedded in this board rather than same-typed nodes on other boards in the
 * shared preview nodes map. Targeting the component directly keeps the layout
 * stable when the specimen adds wrapping frames or static text around the legend
 * buttons and chips.
 */
function collectDescendantsByComponent(
  rootNodeId: string,
  componentId: ComponentId,
  workspace: Workspace,
): string[] {
  const result: string[] = []
  const root = workspace.nodes[rootNodeId]
  if (!root) return result

  const visit = (id: string) => {
    const node = workspace.nodes[id]
    if (!node) return
    if (getNodeCatalogComponentId(node, workspace) === componentId) {
      result.push(id)
    }
    for (const childId of getNodeChildIds(node, workspace)) visit(childId)
  }
  for (const childId of getNodeChildIds(root, workspace)) visit(childId)
  return result
}

/**
 * Resolves the ordinal specimen's legend button nodes and chip row text nodes
 * from the cached Theme Spec preview base, mapping each to its scale by authored
 * order. Cached because the preview base is stable for the session.
 */
export function getOrdinalPreviewLayout(): OrdinalPreviewLayout {
  if (cachedLayout) return cachedLayout

  const { workspace, rootId } = getThemeSpecPreviewBase()
  const legendButtons: OrdinalLegendButton[] = []
  const chipRows: OrdinalChipRow[] = []

  const specimenId = rootId
    ? (collectDescendantsByComponent(
        rootId,
        ComponentId.ORDINAL_SPECIMEN,
        workspace,
      )[0] ?? null)
    : null
  const specimen = specimenId ? workspace.nodes[specimenId] : undefined

  if (specimenId && specimen) {
    // Legend labels live on the specimen's menu BUTTON nodes, in authored scale
    // order. Targeting BUTTON nodes skips any static text the specimen adds
    // around the legend (such as a standalone title).
    const buttonIds = collectDescendantsByComponent(
      specimenId,
      ComponentId.BUTTON,
      workspace,
    )
    buttonIds.forEach((buttonId, index) => {
      const scale = ORDINAL_SCALE_ORDER[index]
      const labelNodeId = findFirstTextNodeId(buttonId, workspace)
      if (scale && labelNodeId) {
        legendButtons.push({ scale, buttonNodeId: buttonId, labelNodeId })
      }
    })

    // Each ORDINAL_CHIP holds one row per scale in authored order.
    const chipIds = collectDescendantsByComponent(
      specimenId,
      ComponentId.ORDINAL_CHIP,
      workspace,
    )
    for (const chipId of chipIds) {
      const chip = workspace.nodes[chipId]
      if (!chip) continue
      getNodeChildIds(chip, workspace).forEach((rowId, index) => {
        const scale = ORDINAL_SCALE_ORDER[index]
        const textNodeId = findFirstTextNodeId(rowId, workspace)
        if (scale && textNodeId) {
          chipRows.push({ scale, textNodeId })
        }
      })
    }
  }

  cachedLayout = { legendButtons, chipRows }
  return cachedLayout
}

/** The friendly name of a scale step in the given theme, e.g. `Comfortable`. */
export function ordinalStepName(
  scale: OrdinalScale,
  step: string,
  theme: Theme,
): string {
  return getThemeValueName(ordinalStepRef(scale, step), theme)
}

/** Formats a number to at most two decimals with no trailing zeros. */
function formatNumber(value: number): string {
  return `${Math.round(value * 100) / 100}`
}

/** Formats a resolved length token, e.g. `1rem`. */
function formatLength(
  length: ReturnType<typeof resolveModulatedOrExactLength>,
): string {
  if (!length || length.type !== ValueType.EXACT) return ""
  return `${formatNumber(length.value.value)}${length.value.unit}`
}

/**
 * The chip row text for a scale step: the token's step value paired with its
 * resolved length in the given theme, e.g. `0 · 1rem`. Modulated tokens show
 * their modulation step; exact tokens show their raw numeric value.
 */
export function ordinalStepValueText(
  scale: OrdinalScale,
  step: string,
  theme: Theme,
): string {
  const ref = ordinalStepRef(scale, step)
  try {
    const option = getThemeOption(ref, theme)
    const lengthText = formatLength(
      resolveModulatedOrExactLength(option, theme),
    )
    let stepText = ""
    if (isModulatedToken(option)) {
      stepText = formatNumber(option.parameters.step)
    } else if (isThemeExactToken(option)) {
      stepText = formatNumber(option.parameters.value)
    }
    if (stepText && lengthText) return `${stepText} · ${lengthText}`
    return lengthText || stepText
  } catch {
    return ""
  }
}

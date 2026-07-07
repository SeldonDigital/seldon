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
} from "@lib/workspace/node-tree"
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
 * Resolves the ordinal specimen's legend button nodes and chip row text nodes
 * from the cached Theme Spec preview base, mapping each to its scale by authored
 * order. Cached because the preview base is stable for the session.
 */
export function getOrdinalPreviewLayout(): OrdinalPreviewLayout {
  if (cachedLayout) return cachedLayout

  const { workspace } = getThemeSpecPreviewBase()
  const legendButtons: OrdinalLegendButton[] = []
  const chipRows: OrdinalChipRow[] = []

  const specimen = Object.values(workspace.nodes).find(
    (node) =>
      getNodeCatalogComponentId(node, workspace) ===
      ComponentId.ORDINAL_SPECIMEN,
  )

  if (specimen) {
    const [legendFrameId, ...containerIds] = getNodeChildIds(
      specimen,
      workspace,
    )

    const legendFrame = legendFrameId
      ? workspace.nodes[legendFrameId]
      : undefined
    if (legendFrame) {
      getNodeChildIds(legendFrame, workspace).forEach((buttonId, index) => {
        const scale = ORDINAL_SCALE_ORDER[index]
        const labelNodeId = findFirstTextNodeId(buttonId, workspace)
        if (scale && labelNodeId) {
          legendButtons.push({ scale, buttonNodeId: buttonId, labelNodeId })
        }
      })
    }

    for (const containerId of containerIds) {
      const container = workspace.nodes[containerId]
      if (!container) continue
      for (const chipId of getNodeChildIds(container, workspace)) {
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
 * resolved length in the given theme, e.g. `0 | 1rem`. Modulated tokens show
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
    const lengthText = formatLength(resolveModulatedOrExactLength(option, theme))
    let stepText = ""
    if (isModulatedToken(option)) {
      stepText = formatNumber(option.parameters.step)
    } else if (isThemeExactToken(option)) {
      stepText = formatNumber(option.parameters.value)
    }
    if (stepText && lengthText) return `${stepText} | ${lengthText}`
    return lengthText || stepText
  } catch {
    return ""
  }
}

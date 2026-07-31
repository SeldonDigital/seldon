import { getComponentKey } from "../../workspace/workspace-accessors"
import {
  getCanvasElement,
  getHtmlElementByBoardId,
  getHtmlElementByNodeId,
} from "../dom/canvas-elements"

import type { ComponentId } from "@seldon/core/components/constants"
import type { Board } from "@seldon/core/workspace/types"

export interface OutlineColors {
  hover: string
  selection: string
}

/** Outline colors for a light surface: dark selection, muted dark hover. */
export const DEFAULT_OUTLINE_COLORS: OutlineColors = {
  hover: "color-mix(in srgb, var(--sdn-swatch-offBlack) 55%, var(--sdn-swatch-offWhite))",
  selection: "var(--sdn-swatch-offBlack)",
}

/** Outline colors for a dark surface: light selection, muted light hover. */
const DARK_SURFACE_OUTLINE_COLORS: OutlineColors = {
  hover: "color-mix(in srgb, var(--sdn-swatch-offWhite) 70%, var(--sdn-swatch-offBlack))",
  selection: "var(--sdn-swatch-offWhite)",
}

interface Rgb {
  r: number
  g: number
  b: number
}

/**
 * Parses a computed `background-color` string. Returns null for a transparent
 * or fully see-through color so the surface walk keeps climbing to the painted
 * ancestor.
 */
function parseOpaqueColor(value: string): Rgb | null {
  const match = value.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?/i)

  if (!match) {
    return null
  }

  const alpha = match[4] === undefined ? 1 : Number(match[4])

  if (alpha === 0) {
    return null
  }

  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) }
}

/**
 * Walks up from the element and returns the first opaque painted background
 * color. This reads what is actually rendered, so resolved CSS variables and
 * theme colors are already applied.
 */
function resolveSurfaceColor(start: HTMLElement | null, stop: HTMLElement | null): Rgb | null {
  let current = start

  while (current && current !== stop) {
    const color = parseOpaqueColor(getComputedStyle(current).backgroundColor)

    if (color) {
      return color
    }

    current = current.parentElement
  }

  return null
}

/** Perceived brightness (YIQ). Below the midpoint reads as a dark surface. */
function isDarkSurface(color: Rgb | null): boolean {
  if (!color) {
    return false
  }

  const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000

  return brightness < 128
}

function toOutlineColors(surface: Rgb | null): OutlineColors {
  return isDarkSurface(surface) ? DARK_SURFACE_OUTLINE_COLORS : DEFAULT_OUTLINE_COLORS
}

function resolveOutlineColors(start: HTMLElement | null): OutlineColors {
  return toOutlineColors(resolveSurfaceColor(start, getCanvasElement()))
}

/**
 * Resolves outline colors for a node from its own painted surface. Use this for a
 * mark drawn on the node, such as the drop feedback boundary.
 */
export function resolveOutlineColorsForNode(nodeId: string): OutlineColors {
  return resolveOutlineColors(getHtmlElementByNodeId(nodeId))
}

/**
 * Resolves the hover and selection outline colors for a node from the surface the
 * dashes land on. 
 */
export function resolveOutlineColorsAroundNode(nodeId: string): OutlineColors {
  const element = getHtmlElementByNodeId(nodeId)

  return toOutlineColors(resolveSurfaceColor(element?.parentElement ?? null, null))
}

/** Resolves outline colors from the painted surface of the board root element. */
export function resolveOutlineColorsForBoard(board: Board): OutlineColors {
  const element = getHtmlElementByBoardId(getComponentKey(board) as ComponentId)

  return resolveOutlineColors(element)
}

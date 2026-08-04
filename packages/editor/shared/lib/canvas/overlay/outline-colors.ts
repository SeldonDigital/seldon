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

interface Rgba extends Rgb {
  alpha: number
}

/** The page base translucent layers composite over when no opaque surface is found. */
const WHITE_SURFACE: Rgb = { r: 255, g: 255, b: 255 }

/**
 * Parses a computed `background-color` string. Returns null for a fully
 * transparent color so the surface walk keeps climbing, and keeps the alpha of
 * anything else so a translucent tint composites rather than reading as opaque.
 */
function parseColor(value: string): Rgba | null {
  const match = value.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?/i)

  if (!match) {
    return null
  }

  const alpha = match[4] === undefined ? 1 : Number(match[4])

  if (alpha === 0) {
    return null
  }

  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), alpha }
}

/** Alpha-composites overlays (topmost first) over an opaque base color. */
function compositeOver(overlays: Rgba[], base: Rgb): Rgb {
  let result = base

  for (let index = overlays.length - 1; index >= 0; index--) {
    const { r, g, b, alpha } = overlays[index]

    result = {
      r: r * alpha + result.r * (1 - alpha),
      g: g * alpha + result.g * (1 - alpha),
      b: b * alpha + result.b * (1 - alpha),
    }
  }

  return result
}

/**
 * Walks up from the element and returns the surface color the dashes perceive.
 * Translucent tints are gathered as overlays and composited over the first
 * opaque background, so a light tint over white reads as light rather than as
 * its own near-black source color. Reads what is rendered, so resolved CSS
 * variables and theme colors are already applied.
 */
function resolveSurfaceColor(start: HTMLElement | null, stop: HTMLElement | null): Rgb | null {
  let current = start
  const overlays: Rgba[] = []

  while (current && current !== stop) {
    const color = parseColor(getComputedStyle(current).backgroundColor)

    if (color) {
      if (color.alpha >= 1) {
        return compositeOver(overlays, color)
      }

      overlays.push(color)
    }

    current = current.parentElement
  }

  if (overlays.length === 0) {
    return null
  }

  return compositeOver(overlays, WHITE_SURFACE)
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

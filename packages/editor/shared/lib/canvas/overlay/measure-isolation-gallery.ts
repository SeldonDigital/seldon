import { getCanvasElement } from "../dom/canvas-elements"

import type { NodeRect } from "./geometry"

/** One level row of the isolation gallery and the board cells it holds. */
export interface GalleryRow {
  rect: NodeRect
  cells: NodeRect[]
}

/**
 * The isolation gallery as obstacles to route around. Rows run top to bottom and
 * cells run left to right, so the free space between them is the gutter lattice
 * a connector travels through.
 *
 * Rects are measured rather than derived from the layout constants, so canvas
 * zoom is already accounted for.
 */
export interface GalleryObstacles {
  /** The sheet the rows sit on. Its padding forms the outer corridors. */
  sheet: NodeRect
  rows: GalleryRow[]
}

export function measureIsolationGallery(): GalleryObstacles | null {
  const canvas = getCanvasElement()
  const gallery = document.querySelector<HTMLElement>("[data-isolation-gallery]")

  if (!canvas || !gallery) return null

  const origin = canvas.getBoundingClientRect()
  const rowElements = gallery.querySelectorAll<HTMLElement>("[data-isolation-level]")

  const rows = Array.from(rowElements).map((row) => ({
    rect: toCanvasRect(row, origin),
    cells: Array.from(row.children)
      .filter((cell): cell is HTMLElement => cell instanceof HTMLElement)
      .map((cell) => toCanvasRect(cell, origin)),
  }))

  return { sheet: toCanvasRect(gallery, origin), rows }
}

function toCanvasRect(element: HTMLElement, origin: DOMRect): NodeRect {
  const rect = element.getBoundingClientRect()

  return {
    top: rect.top - origin.top,
    left: rect.left - origin.left,
    width: rect.width,
    height: rect.height,
  }
}

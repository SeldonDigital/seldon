/**
 * The board a capture renders off the viewport.
 *
 * The canvas shows one board at a time, so rasterizing another board used to
 * mean selecting it. That switched what the user was looking at and reset the
 * canvas pan and zoom, which nothing saves. Instead the editor keeps a surface
 * outside the canvas transform, mounts the requested board into it, captures it
 * there, and clears it. The user's selection, active board, pan, and zoom are
 * never touched.
 *
 * Both editors bind this store: React through `useSharedStore`, Vue through its
 * shared-store composable.
 */
import { createStore } from "../store/observable"

/** Marks the surface a capture mounts its board into. */
export const CAPTURE_BOARD_ATTR = "data-capture-board"

/** The board key mounted for a capture, or `null` when the surface is empty. */
export interface CaptureBoardState {
  boardKey: string | null
}

export const captureBoardStore = createStore<CaptureBoardState>({
  boardKey: null,
})

/** Mounts a board on the capture surface so a capture can rasterize it. */
export function startCaptureBoard(boardKey: string): void {
  captureBoardStore.setState({ boardKey })
}

/** Empties the capture surface once the capture has read its JPEG. */
export function clearCaptureBoard(): void {
  captureBoardStore.setState({ boardKey: null })
}

/** The capture surface, which the editor shell mounts once. */
export function getCaptureBoardElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[${CAPTURE_BOARD_ATTR}]`)
}

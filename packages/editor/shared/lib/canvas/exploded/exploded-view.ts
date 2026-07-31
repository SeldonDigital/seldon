import { buildExplodedSurfaces } from "./build-exploded-surfaces"
import {
  EXPLODE_DEGREES_PER_PX,
  EXPLODE_INITIAL_ROTATION_X_DEG,
  EXPLODE_INITIAL_ROTATION_Y_DEG,
  EXPLODE_INITIAL_ROTATION_Z_DEG,
  EXPLODE_ROTATION_LIMIT_DEG,
  EXPLODE_ROTATION_X_PROPERTY,
  EXPLODE_ROTATION_Y_PROPERTY,
  EXPLODE_ROTATION_Z_PROPERTY,
  EXPLODE_STAGE_ATTRIBUTE,
} from "./exploded-constants"

export interface ExplodedView {
  destroy: () => void
}

/**
 * What the view needs. `source` is the rendered variant to copy, taken from the
 * anchored board. `stage` holds the scene and handles the drag. `world` sits inside the
 * stage, holds the copy, and turns as the viewer drags.
 */
export interface CreateExplodedViewParams {
  source: HTMLElement
  stage: HTMLElement
  world: HTMLElement
}

/**
 * Shows a copy of the anchored variant as separated surfaces the viewer can turn.
 *
 * The copy is built once. Turning it writes nothing but custom properties on the element
 * that holds it. A drag therefore repaints the scene without touching the copy, the
 * canvas, or the workspace.
 *
 * A drag tilts the scene and swings it sideways. Holding shift rolls it instead of
 * swinging it. A double click returns it to its resting angles. Every axis stops at the
 * same limit, so the stack cannot turn away from the viewer.
 *
 * `destroy` removes the copy and every listener. Leaving isolation therefore releases
 * the whole view.
 */
export function createExplodedView({
  source,
  stage,
  world,
}: CreateExplodedViewParams): ExplodedView {
  const surfaces = buildExplodedSurfaces(source)

  let rotationX = EXPLODE_INITIAL_ROTATION_X_DEG
  let rotationY = EXPLODE_INITIAL_ROTATION_Y_DEG
  let rotationZ = EXPLODE_INITIAL_ROTATION_Z_DEG
  let activePointerId: number | null = null
  let lastClientX = 0
  let lastClientY = 0
  let scheduledFrame = 0

  const apply = (): void => {
    scheduledFrame = 0
    world.style.setProperty(EXPLODE_ROTATION_X_PROPERTY, `${rotationX}deg`)
    world.style.setProperty(EXPLODE_ROTATION_Y_PROPERTY, `${rotationY}deg`)
    world.style.setProperty(EXPLODE_ROTATION_Z_PROPERTY, `${rotationZ}deg`)
  }

  // A drag reports far more moves than there are frames. This collapses a burst of
  // moves into one write.
  const schedule = (): void => {
    if (scheduledFrame) return

    scheduledFrame = requestAnimationFrame(apply)
  }

  const releasePointer = (): void => {
    if (activePointerId != null && stage.hasPointerCapture(activePointerId)) {
      stage.releasePointerCapture(activePointerId)
    }

    activePointerId = null
    stage.style.cursor = "grab"
  }

  const handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || !event.isPrimary) return

    // The canvas starts a node drag from `pointerdown` on `#canvas`. A click on the tree
    // changes the selection. Turning the scene is neither of those, so the event stops
    // here.
    event.stopPropagation()
    event.preventDefault()

    activePointerId = event.pointerId
    lastClientX = event.clientX
    lastClientY = event.clientY
    stage.setPointerCapture(event.pointerId)
    stage.style.cursor = "grabbing"
  }

  const handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== activePointerId) return

    const degreesX = (event.clientX - lastClientX) * EXPLODE_DEGREES_PER_PX
    const degreesY = (event.clientY - lastClientY) * EXPLODE_DEGREES_PER_PX

    lastClientX = event.clientX
    lastClientY = event.clientY

    // Dragging down tilts the top of the scene toward the viewer. Dragging sideways
    // swings the scene the way the cursor moves. Holding shift makes a sideways drag
    // roll the scene in the screen plane instead.
    //
    // Each axis keeps its own angle. Releasing shift part way through a drag therefore
    // never makes the scene jump. Each axis stops at the same limit.
    rotationX = clampRotation(rotationX - degreesY)

    if (event.shiftKey) {
      rotationZ = clampRotation(rotationZ + degreesX)
    } else {
      rotationY = clampRotation(rotationY + degreesX)
    }

    schedule()
  }

  const handlePointerEnd = (event: PointerEvent): void => {
    if (event.pointerId !== activePointerId) return

    releasePointer()
  }

  const handleClick = (event: MouseEvent): void => {
    event.stopPropagation()
  }

  const handleDoubleClick = (event: MouseEvent): void => {
    event.stopPropagation()

    rotationX = EXPLODE_INITIAL_ROTATION_X_DEG
    rotationY = EXPLODE_INITIAL_ROTATION_Y_DEG
    rotationZ = EXPLODE_INITIAL_ROTATION_Z_DEG
    schedule()
  }

  world.appendChild(surfaces)
  // Every rule in the stylesheet is scoped to this attribute. The stage carries it for
  // as long as the view is up.
  stage.setAttribute(EXPLODE_STAGE_ATTRIBUTE, "")
  stage.style.cursor = "grab"
  apply()

  stage.addEventListener("pointerdown", handlePointerDown)
  stage.addEventListener("pointermove", handlePointerMove)
  stage.addEventListener("pointerup", handlePointerEnd)
  stage.addEventListener("pointercancel", handlePointerEnd)
  stage.addEventListener("click", handleClick)
  stage.addEventListener("dblclick", handleDoubleClick)

  const destroy = (): void => {
    cancelAnimationFrame(scheduledFrame)
    releasePointer()

    stage.removeEventListener("pointerdown", handlePointerDown)
    stage.removeEventListener("pointermove", handlePointerMove)
    stage.removeEventListener("pointerup", handlePointerEnd)
    stage.removeEventListener("pointercancel", handlePointerEnd)
    stage.removeEventListener("click", handleClick)
    stage.removeEventListener("dblclick", handleDoubleClick)

    stage.removeAttribute(EXPLODE_STAGE_ATTRIBUTE)
    stage.style.cursor = ""
    surfaces.remove()
  }

  return { destroy }
}

function clampRotation(degrees: number): number {
  return Math.min(EXPLODE_ROTATION_LIMIT_DEG, Math.max(-EXPLODE_ROTATION_LIMIT_DEG, degrees))
}

import { buildExplodedLayers } from "./build-exploded-layers"
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

export interface CreateExplodedViewParams {
  /** The rendered variant to copy, taken from the anchored board. */
  source: HTMLElement
  /** Element that holds the scene and reads the drag. */
  stage: HTMLElement
  /** Element inside the stage that the copy hangs from and the drag turns. */
  world: HTMLElement
}

/**
 * Shows a copy of the anchored variant as separated layers the viewer can turn.
 *
 * The copy is built once and turned with custom properties on the element that
 * holds it, so a drag repaints the scene without touching the copy, the canvas,
 * or the workspace. Dragging pitches and swings the scene, holding shift trades
 * the swing for a roll, and a double click puts it back at rest. Every axis stops
 * at the same limit, so the stack cannot turn away from the viewer.
 *
 * `destroy` drops the copy and every listener, so leaving isolation releases the
 * whole view.
 */
export function createExplodedView({
  source,
  stage,
  world,
}: CreateExplodedViewParams): ExplodedView {
  const layers = buildExplodedLayers(source)

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

  // A drag reports far more moves than there are frames, so collapse a burst into
  // one write.
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

    // The canvas starts a node drag from `pointerdown` on `#canvas` and changes
    // selection from a click on the tree. Turning the scene is neither, so the
    // gesture stops here.
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

    // The face under the cursor follows the drag: down brings the top toward the
    // viewer, sideways swings the front the same way. Shift trades that swing for
    // a roll in the screen plane. Each axis keeps its own angle, so letting go of
    // shift part way through a drag never jumps, and each stops at the same limit.
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

  world.appendChild(layers)
  // The stylesheet keys every rule off the stage, so the scope is set here and
  // the attribute name stays in one place.
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
    layers.remove()
  }

  return { destroy }
}

function clampRotation(degrees: number): number {
  return Math.min(EXPLODE_ROTATION_LIMIT_DEG, Math.max(-EXPLODE_ROTATION_LIMIT_DEG, degrees))
}
